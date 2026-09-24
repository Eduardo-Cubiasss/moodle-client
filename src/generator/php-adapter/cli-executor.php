<?php
declare(strict_types=1);

error_reporting(0);
/**
 * Emits a structured JSON error payload to STDERR and terminates the process.
 *
 * @param int $code Exit error code.
 * @param string $message Descriptive error message.
 * @param Throwable|null $e Optional exception instance.
 * @param string $file Optional source file path.
 * @param int $line Optional source line number.
 * @return void
 */
function emit_cli_error(int $code, string $message, ?Throwable $e = null, string $file = '', int $line = 0): void {
    if (ob_get_level() > 0) {
        ob_end_clean();
    }

    $payload = [
        'success'   => false,
        'code'      => $code,
        'error'     => $message,
        'exception' => $e ? get_class($e) : 'Error',
        'file'      => $e ? $e->getFile() : $file,
        'line'      => $e ? $e->getLine() : $line,
        'trace'     => $e ? explode("\n", $e->getTraceAsString()) : []
    ];

    fwrite(STDERR, json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
    exit($code);
}

register_shutdown_function(function () {
    $error = error_get_last();
    if ($error !== null && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR])) {
        emit_cli_error(3, "Fatal PHP Error: " . $error['message'], null, $error['file'], $error['line']);
    }
});

set_exception_handler(function (\Throwable $e) {
    emit_cli_error(3, "Uncaught Exception " . get_class($e) . ": " . $e->getMessage(), $e, $e->getFile(), $e->getLine());
});

/**
 * Parses options from CLI argument list.
 *
 * @param array $argv CLI arguments.
 * @return array Parsed key-value options.
 */
function parse_cli_arguments(array $argv): array {
    $options = [];
    $count = count($argv);

    for ($i = 1; $i < $count; $i++) {
        $arg = $argv[$i];
        if ($arg === '--moodle-root' && isset($argv[$i + 1])) {
            $options['moodle-root'] = $argv[++$i];
        } elseif ($arg === '--file' && isset($argv[$i + 1])) {
            $options['file'] = $argv[++$i];
        } elseif ($arg === '--class' && isset($argv[$i + 1])) {
            $options['class'] = $argv[++$i];
        } elseif ($arg === '--method' && isset($argv[$i + 1])) {
            $options['method'] = $argv[++$i];
        }
    }

    return $options;
}

/**
 * Resolves the callable static signature method name for parameters or returns.
 *
 * @param string $className Class name with leading namespace.
 * @param string $methodName Primary method name (e.g. execute or get_users).
 * @param string $type Signature type ('parameters' or 'returns').
 * @return string|null Resolved callable method name or null.
 */
function resolve_signature_method(string $className, string $methodName, string $type): ?string {
    $primaryCandidate = "{$methodName}_{$type}";
    if (is_callable([$className, $primaryCandidate])) {
        return $primaryCandidate;
    }

    $fallbackCandidate = "execute_{$type}";
    if (is_callable([$className, $fallbackCandidate])) {
        return $fallbackCandidate;
    }

    if (class_exists($className)) {
        $methods = get_class_methods($className);
        if (is_array($methods)) {
            foreach ($methods as $m) {
                if (str_ends_with(strtolower($m), "_{$type}")) {
                    return $m;
                }
            }
        }
    }

    return null;
}

// 1. Parse and validate arguments
$options = parse_cli_arguments($argv);

if (empty($options['moodle-root']) || empty($options['file']) || empty($options['class']) || empty($options['method'])) {
    emit_cli_error(1, 'Missing required CLI parameters (--moodle-root, --file, --class, --method).');
}

$rawMoodleRoot = $options['moodle-root'];
$moodleRoot    = realpath($rawMoodleRoot) ?: $rawMoodleRoot;
$file          = $options['file'];
$class         = $options['class'];
$method        = $options['method'];

require_once __DIR__ . '/bootstrap/syntax-normalizer.php';
require_once __DIR__ . '/bootstrap/headless-bootstrap.php';

// Auto-adapt legacy Moodle PHP 5/7 syntax ($var{...} and class object) for PHP 8+ runtime
\Didactika\MoodleClientSchemas\Bootstrap\SyntaxNormalizer::normalize($moodleRoot);

// Initialize headless environment ($CFG, $DB, superglobals, include_path, constants, autoloader)
\Didactika\MoodleClientSchemas\Bootstrap\HeadlessBootstrap::initialize($moodleRoot);

require_once __DIR__ . '/autoloader/jit-autoloader.php';

// Register JIT secondary autoloader for dynamic synthetic interfaces and missing structures
\Didactika\MoodleClientSchemas\Autoloader\JitAutoloader::register();

// Register neutral helpers and bidirectional namespace shims
\Didactika\MoodleClientSchemas\Autoloader\JitAutoloader::registerShims();

// 8. Load Foundation Web Services and Core Libraries directly from Moodle source
$safeCoreLibraries = [
    $CFG->dirroot . '/cache/classes/interfaces.php',
    $CFG->libdir . '/setuplib.php',
    $CFG->libdir . '/outputcomponents.php',
    $CFG->libdir . '/outputrenderers.php',
    $CFG->libdir . '/accesslib.php',
    $CFG->libdir . '/modinfolib.php',
    $CFG->libdir . '/externallib.php'
];
foreach ($safeCoreLibraries as $coreLibPath) {
    if (file_exists($coreLibPath)) {
        try {
            @require_once $coreLibPath;
        } catch (\Throwable $e) {
            // Silently bypass deprecated or incompatible optional library files
        }
    }
}

$cleanFile = ltrim($file, '/');
$candidatePaths = [
    $CFG->dirroot . '/' . $cleanFile,
    $moodleRoot . '/' . $cleanFile
];

if (str_starts_with($cleanFile, 'public/')) {
    $withoutPublic = substr($cleanFile, 7);
    $candidatePaths[] = $CFG->dirroot . '/' . $withoutPublic;
    $candidatePaths[] = $moodleRoot . '/' . $withoutPublic;
}

$dirrootName = basename($CFG->dirroot);
if (strpos($cleanFile, $dirrootName . '/') === 0) {
    $stripped = substr($cleanFile, strlen($dirrootName) + 1);
    $candidatePaths[] = $CFG->dirroot . '/' . $stripped;
}

$fullPath = null;
foreach ($candidatePaths as $candidate) {
    if (file_exists($candidate)) {
        $fullPath = $candidate;
        break;
    }
}

if ($fullPath === null) {
    emit_cli_error(2, "Class file not found on disk: {$CFG->dirroot}/" . $cleanFile);
}

// 9. Load class file with output suppression
ob_start();

try {
    require_once $fullPath;
} catch (\Throwable $e) {
    emit_cli_error(3, "Failed to load class file {$fullPath}: " . $e->getMessage(), $e);
}

// 10. Execute signature introspection
try {
    $cleanClass = '\\' . ltrim($class, '\\');

    $parameters = null;
    $paramMethod = resolve_signature_method($cleanClass, $method, 'parameters');
    if ($paramMethod !== null) {
        try {
            $parameters = $cleanClass::$paramMethod();
        } catch (\Throwable $paramErr) {
            // Silently fallback if specific method threw internal error
            $parameters = null;
        }
    }

    $returns = null;
    $returnMethod = resolve_signature_method($cleanClass, $method, 'returns');
    if ($returnMethod !== null) {
        try {
            $returns = $cleanClass::$returnMethod();
        } catch (\Throwable $returnErr) {
            // Silently fallback if specific method threw internal error
            $returns = null;
        }
    }

    if (ob_get_level() > 0) {
        ob_end_clean();
    }

    $outputJson = json_encode([
        'parameters' => $parameters,
        'returns'    => $returns
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);

    fwrite(STDOUT, $outputJson);
    exit(0);
} catch (\Throwable $e) {
    emit_cli_error(4, "Exception during signature execution for {$class}::{$method}: " . $e->getMessage(), $e);
}

