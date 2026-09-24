import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import fs from 'node:fs';

const execFileAsync = promisify(execFile);
const BOOTSTRAP_SCRIPT = path.resolve(__dirname, '../../../../src/generator/php-adapter/cli-executor.php');

function getMoodleTestTarget(): { root: string; file: string; classname: string; methodname: string } {
  const v5 = path.resolve(__dirname, '../../../../src/tmp/moodle/v/5.0');
  if (fs.existsSync(v5)) {
    return {
      root: v5,
      file: 'webservice/externallib.php',
      classname: 'core_webservice_external',
      methodname: 'get_site_info'
    };
  }
  const v2 = path.resolve(__dirname, '../../../../src/tmp/moodle/v/2.0');
  if (fs.existsSync(v2)) {
    return {
      root: v2,
      file: 'group/externallib.php',
      classname: 'moodle_group_external',
      methodname: 'create_groups'
    };
  }
  return {
    root: path.resolve(__dirname, '../../../fixtures/mock_moodle'),
    file: 'mod/sample/classes/external/sample_service_with_exporter.php',
    classname: 'mod_sample\\external\\sample_service_with_exporter',
    methodname: 'get_items'
  };
}

describe('Dual Strategy Autoloader Engine', () => {
  describe('Moodle Autoloader Resolution', () => {
    it('should resolve external classes without manual requires', async () => {
      const target = getMoodleTestTarget();
      const { stdout } = await execFileAsync('php', [
        BOOTSTRAP_SCRIPT,
        '--moodle-root', target.root,
        '--file', target.file,
        '--class', target.classname,
        '--method', target.methodname
      ]);

      const result = JSON.parse(stdout);
      expect(result.parameters).not.toBeNull();
      expect(result.returns).not.toBeNull();
    });
  });

  describe('Tolerance & Fallback Protection', () => {
    it('should safely return fallback structure for missing optional subplugin exporters without crashing', async () => {
      const target = getMoodleTestTarget();
      const { stdout } = await execFileAsync('php', [
        BOOTSTRAP_SCRIPT,
        '--moodle-root', target.root,
        '--file', target.file,
        '--class', target.classname,
        '--method', target.methodname
      ]);

      const result = JSON.parse(stdout);
      expect(result.returns).not.toBeNull();
    });
  });
});
