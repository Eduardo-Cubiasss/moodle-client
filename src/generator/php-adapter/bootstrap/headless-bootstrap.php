<?php
declare(strict_types=1);

namespace Didactika\MoodleClientSchemas\Bootstrap;

/**
 * Headless Moodle database mock to intercept all queries safely.
 */
if (!class_exists('headless_moodle_database', false)) {
    class headless_moodle_database {
        public function __call($name, $args) { return false; }
        public function get_records($table, array $conditions = null, $sort = '', $fields = '*', $limitfrom = 0, $limitnum = 0) { return []; }
        public function get_records_menu($table, array $conditions = null, $sort = '', $fields = '*', $limitfrom = 0, $limitnum = 0) { return []; }
        public function get_records_select_menu($table, $select = '', array $params = null, $sort = '', $fields = '*', $limitfrom = 0, $limitnum = 0) { return []; }
        public function get_records_sql_menu($sql, array $params = null, $limitfrom = 0, $limitnum = 0) { return []; }
        public function get_record($table, array $conditions = null, $fields = '*', $strictness = 0) { return false; }
        public function get_field($table, $return, array $conditions = null, $strictness = 0) { return false; }
        public function get_config($plugin = 'core', $name = null) { return false; }
        public function get_tables($usecache = true) { return []; }
    }
}

/**
 * Legacy exception classes for Moodle 2.0-2.5.
 */
if (!class_exists('moodle_exception', false)) {
    class moodle_exception extends \Exception {}
}
if (!class_exists('coding_exception', false)) {
    class coding_exception extends moodle_exception {}
}
if (!class_exists('dml_exception', false)) {
    class dml_exception extends moodle_exception {}
}
if (!class_exists('invalid_parameter_exception', false)) {
    class invalid_parameter_exception extends moodle_exception {}
}
if (!class_exists('invalid_response_exception', false)) {
    class invalid_response_exception extends moodle_exception {}
}

/**
 * Headless environment bootstrap engine for Moodle web services introspection.
 */
class HeadlessBootstrap {
    /**
     * Initializes the complete headless Moodle execution environment.
     *
     * @param string $moodleRoot Absolute path to Moodle root directory.
     * @return void
     */
    public static function initialize(string $moodleRoot): void {
        self::defineCoreConstants();
        self::defineMbstringFallbacks();
        self::initializeConfig($moodleRoot);
        self::configureIncludePath();
        self::initializeSuperglobals();
        self::registerAutoloader();
    }

    /**
     * Defines mandatory Moodle core, parameter, feature, and debug constants.
     *
     * @return void
     */
    public static function defineCoreConstants(): void {
        $constants = [
            'CLI_SCRIPT'             => true,
            'MOODLE_INTERNAL'        => true,
            'PHPUNIT_TEST'           => false,
            'CACHE_DISABLE_ALL'      => true,
            'CACHE_DISABLE_STORES'   => true,
            'NO_OUTPUT_BUFFERING'    => true,
            'NO_DEBUG_DISPLAY'       => true,
            'IGNORE_MISSING'         => 1,
            'MUST_EXIST'             => 2,
            'IGNORE_MULTIPLE'        => 3,
            'SITEID'                 => 1,
            'SYSCONTEXTID'           => 1,
            'PARAM_RAW'              => 'raw',
            'PARAM_RAW_TRIMMED'      => 'raw_trimmed',
            'PARAM_CLEAN'            => 'clean',
            'PARAM_CLEANHTML'        => 'cleanhtml',
            'PARAM_INT'              => 'int',
            'PARAM_INTEGER'          => 'int',
            'PARAM_NUMBER'           => 'float',
            'PARAM_FLOAT'            => 'float',
            'PARAM_TEXT'             => 'text',
            'PARAM_BOOL'             => 'bool',
            'PARAM_BOOLEAN'          => 'bool',
            'PARAM_NOTAGS'           => 'notags',
            'PARAM_ALPHANUM'         => 'alphanum',
            'PARAM_ALPHANUMEXT'      => 'alphanumext',
            'PARAM_ALPHA'            => 'alpha',
            'PARAM_ALPHAEXT'         => 'alphaext',
            'PARAM_AUTH'             => 'auth',
            'PARAM_BASE64'           => 'base64',
            'PARAM_EMAIL'            => 'email',
            'PARAM_URL'              => 'url',
            'PARAM_LOCALURL'         => 'localurl',
            'PARAM_SAFEDIR'          => 'safedir',
            'PARAM_SAFEPATH'         => 'safepath',
            'PARAM_FILE'             => 'file',
            'PARAM_CLEANFILE'        => 'file',
            'PARAM_PATH'             => 'path',
            'PARAM_HOST'             => 'host',
            'PARAM_PEM'              => 'pem',
            'PARAM_PERMISSION'       => 'permission',
            'PARAM_SEQUENCE'         => 'sequence',
            'PARAM_TAG'              => 'tag',
            'PARAM_TAGLIST'          => 'taglist',
            'PARAM_COMPONENT'        => 'component',
            'PARAM_AREA'             => 'area',
            'PARAM_PLUGIN'           => 'plugin',
            'PARAM_USERNAME'         => 'username',
            'PARAM_STRINGID'         => 'stringid',
            'PARAM_ACTION'           => 'alphanumext',
            'PARAM_FORMAT'           => 'alphanumext',
            'PARAM_MULTILANG'        => 'text',
            'PARAM_LANG'             => 'lang',
            'PARAM_THEME'            => 'theme',
            'PARAM_TIMEZONE'         => 'timezone',
            'PARAM_CAPABILITY'       => 'capability',
            'FORMAT_MOODLE'          => '0',
            'FORMAT_HTML'            => '1',
            'FORMAT_PLAIN'           => '2',
            'FORMAT_WIKI'            => '3',
            'FORMAT_MARKDOWN'        => '4',
            'MINSECS'                => 60,
            'HOURSECS'               => 3600,
            'DAYSECS'                => 86400,
            'WEEKSECS'               => 604800,
            'YEARSECS'               => 31536000,
            'FEATURE_GRADE_HAS_GRADE'         => 'grade_has_grade',
            'FEATURE_GRADE_OUTCOMES'          => 'outcomes',
            'FEATURE_ADVANCED_GRADING'        => 'grade_advanced_grading',
            'FEATURE_CONTROLS_GRADE_VISIBILITY'=> 'controlsgradevisbility',
            'FEATURE_PLAGIARISM'              => 'plagiarism',
            'FEATURE_COMPLETION_TRACKS_VIEWS' => 'completion_tracks_views',
            'FEATURE_COMPLETION_HAS_RULES'    => 'completion_has_rules',
            'FEATURE_NO_VIEW_LINK'            => 'viewlink',
            'FEATURE_IDNUMBER'                => 'idnumber',
            'FEATURE_GROUPS'                  => 'groups',
            'FEATURE_GROUPINGS'               => 'groupings',
            'FEATURE_GROUPMEMBERSONLY'        => 'groupmembersonly',
            'FEATURE_MOD_ARCHETYPE'           => 'mod_archetype',
            'FEATURE_MOD_INTRO'               => 'mod_intro',
            'FEATURE_MODEDIT_DEFAULT_COMPLETION' => 'modedit_default_completion',
            'FEATURE_COMMENT'                 => 'comment',
            'FEATURE_RATE'                    => 'rate',
            'FEATURE_BACKUP_MOODLE2'          => 'backup_moodle2',
            'FEATURE_SHOW_DESCRIPTION'        => 'showdescription',
            'FEATURE_USES_QUESTIONS'          => 'usesquestions',
            'FEATURE_MOD_PURPOSE'             => 'mod_purpose',
            'VALUE_DEFAULT'          => 0,
            'VALUE_REQUIRED'         => 1,
            'VALUE_OPTIONAL'         => 2,
            'NULL_NOT_ALLOWED'       => false,
            'NULL_ALLOWED'           => true,
            'DEBUG_NONE'             => 0,
            'DEBUG_MINIMAL'          => 5,
            'DEBUG_NORMAL'           => 15,
            'DEBUG_ALL'              => 6143,
            'DEBUG_DEVELOPER'        => 32767,
            'BEHAT_TEST'             => false,
            'BEHAT_PARALLEL'         => false,
            'CONTEXT_SYSTEM'         => 10,
            'CONTEXT_USER'           => 30,
            'CONTEXT_COURSECAT'      => 40,
            'CONTEXT_COURSE'         => 50,
            'CONTEXT_MODULE'         => 70,
            'CONTEXT_BLOCK'          => 80
        ];

        foreach ($constants as $name => $value) {
            if (!defined($name)) {
                define($name, $value);
            }
        }

        if (!defined('core\DEBUG_DEVELOPER')) {
            eval('namespace core {
                if (!defined("core\DEBUG_NONE")) {
                    define("core\DEBUG_NONE", 0);
                    define("core\DEBUG_MINIMAL", 5);
                    define("core\DEBUG_NORMAL", 15);
                    define("core\DEBUG_ALL", 6143);
                    define("core\DEBUG_DEVELOPER", 32767);
                    define("core\BEHAT_TEST", false);
                    define("core\BEHAT_PARALLEL", false);
                }
            }');
        }
    }

    /**
     * Declares fallbacks for mbstring functions if the PHP extension is not installed.
     *
     * @return void
     */
    public static function defineMbstringFallbacks(): void {
        if (!function_exists('mb_list_encodings')) {
            function mb_list_encodings() { return ['UTF-8', 'ISO-8859-1', 'ASCII']; }
        }
        if (!function_exists('mb_strtolower')) {
            function mb_strtolower($string, $encoding = 'UTF-8') { return strtolower($string); }
        }
        if (!function_exists('mb_strtoupper')) {
            function mb_strtoupper($string, $encoding = 'UTF-8') { return strtoupper($string); }
        }
        if (!function_exists('mb_substr')) {
            function mb_substr($string, $start, $length = null, $encoding = 'UTF-8') { return substr($string, $start, $length); }
        }
        if (!function_exists('mb_strlen')) {
            function mb_strlen($string, $encoding = 'UTF-8') { return strlen($string); }
        }
    }

    /**
     * Dynamically locates Moodle base directory based on version.php presence.
     *
     * @param string $moodleRoot Base folder path.
     * @return string Discovered Moodle root path.
     */
    public static function resolveMoodleDirroot(string $moodleRoot): string {
        if (file_exists($moodleRoot . '/version.php')) {
            return $moodleRoot;
        }
        if (file_exists($moodleRoot . '/public/version.php')) {
            return $moodleRoot . '/public';
        }
        $matched = glob($moodleRoot . '/*/version.php');
        if (!empty($matched)) {
            return dirname($matched[0]);
        }
        return $moodleRoot;
    }

    /**
     * Initializes global $CFG with all expected directory roots and user preferences.
     *
     * @param string $moodleRoot Moodle root path.
     * @return void
     */
    public static function initializeConfig(string $moodleRoot): void {
        global $CFG;
        $CFG = new \stdClass();
        $CFG->dirroot              = self::resolveMoodleDirroot($moodleRoot);
        $CFG->libdir               = $CFG->dirroot . '/lib';

        $dataroot                  = sys_get_temp_dir() . '/moodle_headless_' . md5($moodleRoot);
        if (!is_dir($dataroot)) {
            @mkdir($dataroot, 0777, true);
        }
        $CFG->dataroot             = $dataroot;
        $CFG->cachedir             = $dataroot . '/cache';
        if (!is_dir($CFG->cachedir)) { @mkdir($CFG->cachedir, 0777, true); }
        $CFG->localcachedir        = $dataroot . '/localcache';
        if (!is_dir($CFG->localcachedir)) { @mkdir($CFG->localcachedir, 0777, true); }
        $CFG->tempdir              = $dataroot . '/temp';
        if (!is_dir($CFG->tempdir)) { @mkdir($CFG->tempdir, 0777, true); }

        $CFG->admin                = 'admin';
        $CFG->prefix               = '';
        $CFG->wwwroot              = 'http://localhost';
        $CFG->themedir             = $CFG->dirroot . '/theme';
        $CFG->theme                = 'boost';
        $CFG->country              = 'AU';
        $CFG->lang                 = 'en';
        $CFG->langotherroot        = '';
        $CFG->langlocalroot        = '';
        $CFG->calendartype         = 'gregorian';
        $CFG->defaultcity          = '';
        $CFG->forced_plugin_settings = [];
        $CFG->config_php_settings  = [];
        $CFG->siteidentifier       = 'moodle_headless_site';
        $CFG->directorypermissions = 02777;
        $CFG->filepermissions      = 0666;
        $CFG->umaskpermissions     = 0000;
        $CFG->debug                = 0;
        $CFG->debugdeveloper       = false;

        $CFG->defaultpreference_mailformat    = 1;
        $CFG->defaultpreference_maildigest    = 0;
        $CFG->defaultpreference_maildisplay   = 2;
        $CFG->defaultpreference_autosubscribe = 1;
        $CFG->defaultpreference_trackforums   = 0;
    }

    /**
     * Sets PHP include_path for PEAR and core lib dependencies.
     *
     * @return void
     */
    public static function configureIncludePath(): void {
        global $CFG;
        set_include_path(
            $CFG->libdir . '/pear' . PATH_SEPARATOR .
            $CFG->libdir . PATH_SEPARATOR .
            $CFG->dirroot . PATH_SEPARATOR .
            get_include_path()
        );
    }

    /**
     * Injects non-throwing headless $DB mock and superglobals.
     *
     * @return void
     */
    public static function initializeSuperglobals(): void {
        global $DB, $USER, $SITE, $PAGE, $OUTPUT, $SESSION;

        $DB      = new \Didactika\MoodleClientSchemas\Bootstrap\headless_moodle_database();
        $USER    = (object)['id' => 2, 'username' => 'admin'];
        $SITE    = (object)['id' => 1];
        $PAGE    = new \stdClass();
        $OUTPUT  = new \stdClass();
        $SESSION = new \stdClass();
    }

    /**
     * Registers native Moodle component autoloader or legacy Frankenstyle autoloader.
     *
     * @return void
     */
    public static function registerAutoloader(): void {
        global $CFG;

        if (file_exists($CFG->libdir . '/classes/component.php')) {
            require_once $CFG->libdir . '/classes/component.php';
            if (is_callable(['\\core\\component', 'register_autoloader'])) {
                \core\component::register_autoloader();
            } elseif (is_callable(['\\core_component', 'register_autoloader'])) {
                \core_component::register_autoloader();
            } elseif (is_callable(['\\core_component', 'classloader'])) {
                spl_autoload_register(['\\core_component', 'classloader']);
            }
        } else {
            // Legacy Moodle 2.0-2.5 autoloader
            spl_autoload_register(function (string $legacyClass) use ($CFG) {
                $clean = ltrim($legacyClass, '\\');
                $parts = explode('_', $clean);
                $candidates = [
                    $CFG->dirroot . '/' . implode('/', $parts) . '/externallib.php',
                    $CFG->dirroot . '/' . $parts[0] . '/' . ($parts[1] ?? '') . '/externallib.php',
                    $CFG->dirroot . '/' . $clean . '/externallib.php',
                    $CFG->libdir . '/' . $clean . '.php'
                ];
                foreach ($candidates as $candidateFile) {
                    if (file_exists($candidateFile)) {
                        require_once $candidateFile;
                        return true;
                    }
                }
                return false;
            });
        }
    }
}
