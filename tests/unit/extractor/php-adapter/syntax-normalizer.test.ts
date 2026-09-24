import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

const execFileAsync = promisify(execFile);
const NORMALIZER_SCRIPT = path.resolve(__dirname, '../../../../src/generator/php-adapter/bootstrap/syntax-normalizer.php');

describe('SyntaxNormalizer Unit Tests', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'moodle_syntax_test_'));
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should normalize legacy $var{0} syntax to $var[0]', async () => {
    const filePath = path.join(tempDir, 'legacy_syntax.php');
    const content = '<?php\n$email = "test@example.com";\nif ($email{0} === "t") { echo "ok"; }\n';
    fs.writeFileSync(filePath, content, 'utf8');

    const phpCode = `
      require_once '${NORMALIZER_SCRIPT}';
      \\Didactika\\MoodleClientSchemas\\Bootstrap\\SyntaxNormalizer::normalize('${tempDir}');
    `;

    await execFileAsync('php', ['-r', phpCode]);

    const updatedContent = fs.readFileSync(filePath, 'utf8');
    expect(updatedContent).toContain('$email[0]');
    expect(updatedContent).not.toContain('$email{0}');
  });

  it('should remove legacy class object extends stdClass declarations', async () => {
    const filePath = path.join(tempDir, 'setup_legacy.php');
    const content = '<?php\nclass object extends stdClass {}\n$obj = new stdClass();\n';
    fs.writeFileSync(filePath, content, 'utf8');

    const phpCode = `
      require_once '${NORMALIZER_SCRIPT}';
      \\Didactika\\MoodleClientSchemas\\Bootstrap\\SyntaxNormalizer::normalize('${tempDir}');
    `;

    await execFileAsync('php', ['-r', phpCode]);

    const updatedContent = fs.readFileSync(filePath, 'utf8');
    expect(updatedContent).not.toContain('class object extends stdClass');
  });

  it('should create .php8_normalized marker and be idempotent on subsequent calls', async () => {
    const filePath = path.join(tempDir, 'sample.php');
    fs.writeFileSync(filePath, '<?php\n$val = 1;\n', 'utf8');

    const markerPath = path.join(tempDir, '.php8_normalized');
    expect(fs.existsSync(markerPath)).toBe(false);

    const phpCode = `
      require_once '${NORMALIZER_SCRIPT}';
      \\Didactika\\MoodleClientSchemas\\Bootstrap\\SyntaxNormalizer::normalize('${tempDir}');
    `;

    await execFileAsync('php', ['-r', phpCode]);

    expect(fs.existsSync(markerPath)).toBe(true);

    // Subsequent call should execute cleanly without error
    await execFileAsync('php', ['-r', phpCode]);
    expect(fs.existsSync(markerPath)).toBe(true);
  });

  it('should normalize get_level_name and get_context_name method signatures for PHP 8 compatibility', async () => {
    const filePath = path.join(tempDir, 'accesslib.php');
    const content = `<?php
abstract class context {
    public static function get_level_name() { return 'base'; }
    public function get_context_name() { return 'base'; }
}
class context_helper extends context {
    public static function get_level_name($contextlevel) { return 'level ' . $contextlevel; }
}
`;
    fs.writeFileSync(filePath, content, 'utf8');

    const phpCode = `
      require_once '${NORMALIZER_SCRIPT}';
      \\Didactika\\MoodleClientSchemas\\Bootstrap\\SyntaxNormalizer::normalize('${tempDir}');
    `;

    await execFileAsync('php', ['-r', phpCode]);

    const updatedContent = fs.readFileSync(filePath, 'utf8');
    expect(updatedContent).toContain('function get_level_name($contextlevel = null)');
    expect(updatedContent).toContain('function get_context_name($withprefix = true, $short = false)');

    // Verify it compiles and executes without Fatal PHP Error in PHP 8
    const testExecution = `
      require_once '${filePath}';
      echo context_helper::get_level_name(50);
    `;
    const { stdout } = await execFileAsync('php', ['-r', testExecution]);
    expect(stdout).toContain('level 50');
  });

  it('should never corrupt modern PHP string interpolation like "prefix_{$name}" or "gradingform_{$method}"', async () => {
    const filePath = path.join(tempDir, 'lib.php');
    const content = `<?php
$method = 'guide';
$name = 'test';
$prefix_ = 'moodle_';
$str1 = "gradingform_{$method}";
$str2 = "$prefix_{$name}";
$email = "test@example.com";
$first = $email{0};
`;
    fs.writeFileSync(filePath, content, 'utf8');

    const phpCode = `
      require_once '${NORMALIZER_SCRIPT}';
      \\Didactika\\MoodleClientSchemas\\Bootstrap\\SyntaxNormalizer::normalize('${tempDir}');
    `;

    await execFileAsync('php', ['-r', phpCode]);

    const updatedContent = fs.readFileSync(filePath, 'utf8');
    expect(updatedContent).toContain('"gradingform_{$method}"');
    expect(updatedContent).toContain('"$prefix_{$name}"');
    expect(updatedContent).toContain('$email[0]');

    // Verify it passes PHP syntax lint without parse error
    const { stdout } = await execFileAsync('php', ['-l', filePath]);
    expect(stdout).toContain('No syntax errors detected');
  });

  it('should skip normalization entirely on modern Moodle 4.x/5.x codebases', async () => {
    const versionFile = path.join(tempDir, 'version.php');
    fs.writeFileSync(versionFile, "<?php\n$version = 2024042200;\n$release = '4.4';\n", 'utf8');

    const sampleFile = path.join(tempDir, 'sample.php');
    const content = "<?php\nclass object extends stdClass {}\n";
    fs.writeFileSync(sampleFile, content, 'utf8');

    const phpCode = `
      require_once '${NORMALIZER_SCRIPT}';
      \\Didactika\\MoodleClientSchemas\\Bootstrap\\SyntaxNormalizer::normalize('${tempDir}');
    `;

    await execFileAsync('php', ['-r', phpCode]);

    // On modern Moodle, files are not modified
    const updatedContent = fs.readFileSync(sampleFile, 'utf8');
    expect(updatedContent).toBe(content);
  });
});
