import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

const execFileAsync = promisify(execFile);
const JIT_AUTOLOADER_SCRIPT = path.resolve(__dirname, '../../../../src/generator/php-adapter/autoloader/jit-autoloader.php');

describe('JIT Autoloader and Bidirectional Shimming Unit Tests', () => {
  it('should dynamically inject missing interfaces (renderable, templatable, custom_interface)', async () => {
    const phpCode = `
      require_once '${JIT_AUTOLOADER_SCRIPT}';
      \\Didactika\\MoodleClientSchemas\\Autoloader\\JitAutoloader::register();

      class TestClass implements \\renderable, \\templatable, \\custom_dummy_interface {}
      $obj = new TestClass();
      echo $obj instanceof \\renderable ? "OK" : "FAIL";
    `;

    const { stdout } = await execFileAsync('php', ['-r', phpCode]);
    expect(stdout.trim()).toBe('OK');
  });

  it('should dynamically generate external structure classes and exporter base classes', async () => {
    const phpCode = `
      require_once '${JIT_AUTOLOADER_SCRIPT}';
      \\Didactika\\MoodleClientSchemas\\Autoloader\\JitAutoloader::register();

      class SampleUserExporter extends \\core\\external\\exporter {
          protected static function define_properties() {
              return ['id' => ['type' => 'int'], 'name' => ['type' => 'text']];
          }
      }

      $structure = SampleUserExporter::get_read_structure();
      echo isset($structure->keys['id']) && isset($structure->keys['name']) ? "OK" : "FAIL";
    `;

    const { stdout } = await execFileAsync('php', ['-r', phpCode]);
    expect(stdout.trim()).toBe('OK');
  });

  it('should provide invariant neutral contracts for helper functions and namespace shims', async () => {
    const phpCode = `
      require_once '${JIT_AUTOLOADER_SCRIPT}';
      \\Didactika\\MoodleClientSchemas\\Autoloader\\JitAutoloader::register();
      \\Didactika\\MoodleClientSchemas\\Autoloader\\JitAutoloader::registerShims();

      $manager = \\get_string_manager();
      $countries = array_merge(['' => ''], $manager->get_list_of_countries());
      $languages = array_merge(['' => ''], $manager->get_list_of_languages());

      $themes = \\core\\get_list_of_themes();
      $config = \\core\\get_config('core', 'theme');

      $valid = is_array($countries) && is_array($languages) && is_array($themes);
      echo $valid ? "OK" : "FAIL";
    `;

    const { stdout } = await execFileAsync('php', ['-r', phpCode]);
    expect(stdout.trim()).toBe('OK');
  });
});
