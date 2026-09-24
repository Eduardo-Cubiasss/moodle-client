<?php
declare(strict_types=1);

namespace Didactika\MoodleClientSchemas\Bootstrap;

/**
 * Normalizes legacy Moodle PHP 5/7 syntax for compatibility with modern PHP 8+ runtimes.
 */
class SyntaxNormalizer {
    /**
     * Adapts legacy PHP files in target Moodle directory if Moodle version < 4.0.
     *
     * @param string $moodleRoot Absolute path to Moodle root directory.
     * @return void
     */
    public static function normalize(string $moodleRoot): void {
        if (PHP_VERSION_ID < 80000 || !is_dir($moodleRoot)) {
            return;
        }

        $marker = $moodleRoot . '/.php8_normalized';
        if (file_exists($marker)) {
            return;
        }

        if (!self::isLegacyMoodle($moodleRoot)) {
            @file_put_contents($marker, '1');
            return;
        }

        self::scanAndNormalizeDirectory($moodleRoot);
        @file_put_contents($marker, '1');
    }

    /**
     * Determines whether the target Moodle codebase is a legacy version (Moodle < 4.0).
     *
     * @param string $moodleRoot Moodle root path.
     * @return bool True if Moodle is version < 4.0.
     */
    public static function isLegacyMoodle(string $moodleRoot): bool {
        $candidates = [
            $moodleRoot . '/version.php',
            $moodleRoot . '/public/version.php'
        ];
        foreach ($candidates as $candidate) {
            if (file_exists($candidate)) {
                $content = @file_get_contents($candidate);
                if ($content && preg_match('/\$version\s*=\s*([0-9]+)/', $content, $matches)) {
                    $versionNumber = (int)$matches[1];
                    // 2022041900 corresponds to Moodle 4.0 release
                    if ($versionNumber >= 2022041900) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    /**
     * Recursively scans and normalizes PHP files.
     *
     * @param string $dir Directory path to scan.
     * @return void
     */
    private static function scanAndNormalizeDirectory(string $dir): void {
        $items = @scandir($dir);
        if ($items === false) {
            return;
        }

        foreach ($items as $item) {
            if ($item === '.' || $item === '..' || $item === '.git') {
                continue;
            }

            $path = $dir . '/' . $item;
            if (is_dir($path)) {
                self::scanAndNormalizeDirectory($path);
            } elseif (str_ends_with($item, '.php')) {
                self::normalizePhpFile($path);
            }
        }
    }

    /**
     * Normalizes a single PHP file content using token-level precision.
     *
     * @param string $filePath Absolute path to the PHP file.
     * @return void
     */
    public static function normalizePhpFile(string $filePath): void {
        $content = @file_get_contents($filePath);
        if ($content === false) {
            return;
        }

        $modified = false;

        // 1. Remove legacy class object extends stdClass (renamed to avoid reserved keyword and preserve balanced braces)
        if (str_contains($content, 'class object extends stdClass')) {
            $content = preg_replace('/class\s+object\s+extends\s+stdClass/i', 'class moodle_deprecated_object extends stdClass', $content);
            $modified = true;
        }

        // 2. Normalize method signatures for LSP compatibility in PHP 8
        if (str_contains($content, 'function get_level_name(')) {
            $content = preg_replace('/(function\s+get_level_name)\s*\([^)]*\)/i', '$1($contextlevel = null)', $content);
            $modified = true;
        }

        if (str_contains($content, 'function get_context_name(')) {
            $content = preg_replace('/(function\s+get_context_name)\s*\([^)]*\)/i', '$1($withprefix = true, $short = false)', $content);
            $modified = true;
        }

        // 3. Safe tokenizer-based $var{0} to $var[0] conversion (avoids breaking string interpolation)
        if (str_contains($content, '{') && preg_match('/\$[a-zA-Z0-9_]+\s*\{/', $content)) {
            try {
                $tokens = token_get_all($content);
                $normalizedContent = '';
                $count = count($tokens);
                $tokensChanged = false;

                for ($i = 0; $i < $count; $i++) {
                    $t = $tokens[$i];

                    if (is_array($t) && $t[0] === T_VARIABLE) {
                        $next = $i + 1;
                        while ($next < $count && is_array($tokens[$next]) && $tokens[$next][0] === T_WHITESPACE) {
                            $next++;
                        }
                        if ($next < $count && $tokens[$next] === '{') {
                            $depth = 1;
                            $closing = $next + 1;
                            while ($closing < $count && $depth > 0) {
                                if ($tokens[$closing] === '{') {
                                    $depth++;
                                } elseif ($tokens[$closing] === '}') {
                                    $depth--;
                                }
                                if ($depth === 0) {
                                    break;
                                }
                                $closing++;
                            }
                            if ($closing < $count && $tokens[$closing] === '}') {
                                $tokens[$next] = '[';
                                $tokens[$closing] = ']';
                                $tokensChanged = true;
                            }
                        }
                    }

                    if (is_array($t)) {
                        $normalizedContent .= $t[1];
                    } else {
                        $normalizedContent .= $t;
                    }
                }

                if ($tokensChanged) {
                    $content = $normalizedContent;
                    $modified = true;
                }
            } catch (\Throwable $e) {
                // Keep original content on tokenization error
            }
        }

        if ($modified) {
            @file_put_contents($filePath, $content);
        }
    }
}
