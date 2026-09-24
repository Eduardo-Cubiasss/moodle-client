<?php
declare(strict_types=1);

error_reporting(0);

$executionState = [
    'activeService' => null,
    'completed'     => false
];

register_shutdown_function(function () use (&$executionState) {
    if (!$executionState['completed']) {
        $buf = '';
        while (ob_get_level() > 0) {
            $buf .= ob_get_clean();
        }
        $errorMsg = 'Premature termination or die()';
        $trimmedBuf = trim($buf);
        if ($trimmedBuf !== '') {
            $errorMsg .= ': ' . $trimmedBuf;
        }

        $lastErr = error_get_last();
        if ($lastErr !== null && in_array($lastErr['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR])) {
            $errorMsg = 'Fatal PHP Error: ' . $lastErr['message'];
        }

        $payload = [
            'success'     => false,
            'serviceName' => $executionState['activeService'],
            'error'       => $errorMsg
        ];

        fwrite(STDERR, json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
        exit(3);
    }
});

/**
 * Parses CLI arguments into an associative map.
 *
 * @param array $argv Arguments list.
 * @return array Parsed options.
 */
function parse_batch_cli_arguments(array $argv): array {
    $options = [];
    $count = count($argv);
    for ($i = 1; $i < $count; $i++) {
        if ($argv[$i] === '--moodle-root' && isset($argv[$i + 1])) {
            $options['moodle-root'] = $argv[++$i];
        }
    }
    return $options;
}

/**
 * Emits a single NDJSON line to STDOUT.
 *
 * @param string $serviceName Target service identifier.
 * @param bool $success Whether extraction succeeded.
 * @param array|null $signature Extracted signature map.
 * @param string|null $error Descriptive error string if failed.
 * @return void
 */
function emit_batch_stream_item(string $serviceName, bool $success, ?array $signature, ?string $error = null): void {
    $payload = [
        'serviceName' => $serviceName,
        'success'     => $success
    ];
    if ($success) {
        $payload['signature'] = $signature;
    } else {
        $payload['error'] = $error ?? 'Unknown extraction error';
    }
    fwrite(STDOUT, json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n");
    fflush(STDOUT);
}

/**
 * Resolves static method for signature extraction.
 *
 * @param string $className Full class name.
 * @param string $methodName Method name.
 * @param string $type Signature type ('parameters' or 'returns').
 * @return string|null Method name if callable.
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

/**
 * Resolves full path on disk for a class file across known candidate patterns.
 *
 * @param object $cfg Moodle $CFG mock.
 * @param string $moodleRoot Root path.
 * @param string $cleanFile Relative class file.
 * @return string|null Resolved path or null.
 */
function resolve_service_filepath(object $cfg, string $moodleRoot, string $cleanFile): ?string {
    $candidatePaths = [
        $cfg->dirroot . '/' . $cleanFile,
        $moodleRoot . '/' . $cleanFile
    ];

    if (str_starts_with($cleanFile, 'public/')) {
        $withoutPublic = substr($cleanFile, 7);
        $candidatePaths[] = $cfg->dirroot . '/' . $withoutPublic;
        $candidatePaths[] = $moodleRoot . '/' . $withoutPublic;
    }

    $dirrootName = basename($cfg->dirroot);
    if (strpos($cleanFile, $dirrootName . '/') === 0) {
        $stripped = substr($cleanFile, strlen($dirrootName) + 1);
        $candidatePaths[] = $cfg->dirroot . '/' . $stripped;
    }

    foreach ($candidatePaths as $candidate) {
        if (file_exists($candidate)) {
            return $candidate;
        }
    }

    return null;
}

// 1. Validate CLI options
$options = parse_batch_cli_arguments($argv);
if (empty($options['moodle-root'])) {
    $executionState['completed'] = true;
    fwrite(STDERR, json_encode(['success' => false, 'error' => 'Missing required parameter: --moodle-root']));
    exit(1);
}

$rawMoodleRoot = $options['moodle-root'];
$moodleRoot    = realpath($rawMoodleRoot) ?: $rawMoodleRoot;

// 2. Headless Bootstrap
require_once __DIR__ . '/bootstrap/syntax-normalizer.php';
require_once __DIR__ . '/bootstrap/headless-bootstrap.php';

\Didactika\MoodleClientSchemas\Bootstrap\SyntaxNormalizer::normalize($moodleRoot);
\Didactika\MoodleClientSchemas\Bootstrap\HeadlessBootstrap::initialize($moodleRoot);

require_once __DIR__ . '/autoloader/jit-autoloader.php';
\Didactika\MoodleClientSchemas\Autoloader\JitAutoloader::register();
\Didactika\MoodleClientSchemas\Autoloader\JitAutoloader::registerShims();

// 3. Load core safe libraries
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
            // Ignore optional core library warnings
        }
    }
}

// 4. Read STDIN
$stdinContent = file_get_contents('php://stdin');
if ($stdinContent === false || trim($stdinContent) === '') {
    $executionState['completed'] = true;
    exit(0);
}

$items = json_decode($stdinContent, true);
if (!is_array($items)) {
    $executionState['completed'] = true;
    fwrite(STDERR, json_encode(['success' => false, 'error' => 'Invalid JSON input in STDIN']));
    exit(1);
}

// 5. Stream extraction loop
foreach ($items as $item) {
    $serviceName = $item['serviceName'] ?? 'unknown';
    $executionState['activeService'] = $serviceName;

    $file = $item['classFile'] ?? '';
    $class = $item['classname'] ?? '';
    $method = $item['methodname'] ?? 'execute';

    $cleanFile = ltrim($file, '/');
    $fullPath = resolve_service_filepath($CFG, $moodleRoot, $cleanFile);

    if ($fullPath === null) {
        emit_batch_stream_item($serviceName, false, null, "Class file not found on disk: {$cleanFile}");
        continue;
    }

    ob_start();
    try {
        require_once $fullPath;

        $cleanClass = '\\' . ltrim($class, '\\');

        $parameters = null;
        $paramMethod = resolve_signature_method($cleanClass, $method, 'parameters');
        if ($paramMethod !== null) {
            try {
                $parameters = $cleanClass::$paramMethod();
            } catch (\Throwable $paramErr) {
                $parameters = null;
            }
        }

        $returns = null;
        $returnMethod = resolve_signature_method($cleanClass, $method, 'returns');
        if ($returnMethod !== null) {
            try {
                $returns = $cleanClass::$returnMethod();
            } catch (\Throwable $returnErr) {
                $returns = null;
            }
        }

        if (ob_get_level() > 0) {
            ob_end_clean();
        }

        emit_batch_stream_item($serviceName, true, [
            'parameters' => $parameters,
            'returns'    => $returns
        ]);
    } catch (\Throwable $e) {
        if (ob_get_level() > 0) {
            ob_end_clean();
        }
        emit_batch_stream_item($serviceName, false, null, $e->getMessage());
    }
}

$executionState['completed'] = true;
exit(0);
