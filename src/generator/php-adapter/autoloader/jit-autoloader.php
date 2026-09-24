<?php
declare(strict_types=1);

namespace Didactika\MoodleClientSchemas\Autoloader;

/**
 * Secondary JIT Autoloader and Bidirectional Namespace Shimming Engine.
 */
class JitAutoloader {
    /**
     * Registers the secondary fallback autoloader and synthetic type generator.
     *
     * @return void
     */
    public static function register(): void {
        spl_autoload_register([self::class, 'handleAutoload']);
    }

    /**
     * Handles dynamic class and interface synthesis when a type is unresolved.
     *
     * @param string $fallbackClass Unresolved class or interface name.
     * @return bool True if synthetic type was generated.
     */
    public static function handleAutoload(string $fallbackClass): bool {
        $cleanClass = ltrim($fallbackClass, '\\');
        $parts      = explode('\\', $cleanClass);
        $shortName  = end($parts);
        $namespace  = count($parts) > 1 ? implode('\\', array_slice($parts, 0, -1)) : '';

        if (in_array($shortName, ['renderable', 'templatable', 'named_templatable', 'cacheable_object', 'cachable_object', 'cacheable_object_array']) || str_ends_with($shortName, '_interface')) {
            if (interface_exists($fallbackClass, false) || interface_exists($shortName, false)) {
                return true;
            }
            if (isset($GLOBALS['CFG']) && !empty($GLOBALS['CFG']->libdir)) {
                $outputComp = $GLOBALS['CFG']->libdir . '/outputcomponents.php';
                if (file_exists($outputComp)) {
                    @require_once $outputComp;
                    if (interface_exists($fallbackClass, false) || interface_exists($shortName, false)) {
                        return true;
                    }
                }
            }
            $code = ($namespace !== '' ? "namespace $namespace;\n" : '') . "interface $shortName {}";
            @eval($code);
            return true;
        }

        if ($shortName === 'theme_config') {
            $code = ($namespace !== '' ? "namespace $namespace;\n" : '') . 'class theme_config {
                const DEFAULT_THEME = "boost";
                public static function find_all_themes() { return []; }
                public static function load($theme) { return new self(); }
                public function __get($name) { return null; }
            }';
            @eval($code);
            return true;
        }

        if ($shortName === 'external_value') {
            $code = ($namespace !== '' ? "namespace $namespace;\n" : '') . 'class external_value {
                public $desc; public $required; public $default; public $allownull; public $type;
                public function __construct($type, $desc = "", $required = 1, $default = null, $allownull = true) {
                    $this->type = $type; $this->desc = $desc; $this->required = $required; $this->default = $default; $this->allownull = $allownull;
                }
            }';
            @eval($code);
            return true;
        }

        if ($shortName === 'external_single_structure' || $shortName === 'external_function_parameters') {
            $code = ($namespace !== '' ? "namespace $namespace;\n" : '') . 'class ' . $shortName . ' {
                public $desc; public $required; public $default; public $allownull; public $keys;
                public function __construct(array $keys = [], $desc = "", $required = 1, $default = null, $allownull = false) {
                    $this->keys = $keys; $this->desc = $desc; $this->required = $required; $this->default = $default; $this->allownull = $allownull;
                }
            }';
            @eval($code);
            return true;
        }

        if ($shortName === 'external_multiple_structure' || $shortName === 'external_warnings' || $shortName === 'external_files') {
            $code = ($namespace !== '' ? "namespace $namespace;\n" : '') . 'class ' . $shortName . ' {
                public $desc; public $required; public $default; public $allownull; public $content;
                public function __construct($content = null, $desc = "", $required = 1, $default = null, $allownull = false) {
                    $this->content = $content; $this->desc = $desc; $this->required = $required; $this->default = $default; $this->allownull = $allownull;
                }
            }';
            @eval($code);
            return true;
        }

        if ($shortName === 'external_api') {
            $code = ($namespace !== '' ? "namespace $namespace;\n" : '') . 'abstract class external_api {
                public static function validate_parameters($schema, $params) { return $params; }
                public static function validate_context($context) {}
                public static function clean_returnvalue($schema, $data) { return $data; }
            }';
            @eval($code);
            return true;
        }

        if ($shortName === 'moodleform') {
            $code = ($namespace !== '' ? "namespace $namespace;\n" : '') . 'abstract class moodleform {
                public $_form;
                public function __construct($action = null, $customdata = null, $method = "post", $target = "", $attributes = null, $editable = true, $ajaxformdata = null) {
                    $this->_form = new class {
                        public function addElement($type, $name = "", $label = "", $attributes = null) { return new \stdClass(); }
                        public function addRule($element, $message, $type, $format = "server", $validation = "client", $reset = false, $force = false) {}
                        public function addGroup($elements, $name = "", $label = "", $separator = null, $appendName = true) { return new \stdClass(); }
                        public function setType($element, $type) {}
                        public function setDefault($element, $default) {}
                        public function addHelpButton($element, $identifier, $component = "moodle", $linktext = "", $suppresscheck = false) {}
                        public function hideIf($element, $dependentOn, $condition = "notchecked", $value = "1") {}
                        public function disabledIf($element, $dependentOn, $condition = "notchecked", $value = "1") {}
                        public function closeHeaderBefore($element) {}
                        public function setExpanded($header, $expanded = true) {}
                        public function __call($name, $args) { return null; }
                    };
                    try {
                        $this->definition();
                    } catch (\Throwable $e) {}
                }
                protected abstract function definition();
                public function definition_after_data() {}
                public function validation($data, $files) { return []; }
                public function get_data() { return null; }
                public function is_cancelled() { return false; }
            }';
            @eval($code);
            return true;
        }

        if ($shortName === 'core_plugin_manager') {
            $code = ($namespace !== '' ? "namespace $namespace;\n" : '') . 'class core_plugin_manager {
                private static $instance = null;
                public static function instance() {
                    if (self::$instance === null) {
                        self::$instance = new self();
                    }
                    return self::$instance;
                }
                public static function reset_caches() {}
                public function get_plugin_types() { return []; }
                public function get_installed_plugins($type = null) { return []; }
                public function get_plugins_of_type($type) { return []; }
                public function get_plugins() { return []; }
                public function get_subplugins($component) { return []; }
                public function get_plugin_info($component) { return null; }
                public function is_plugin_enabled($component) { return true; }
                public function __call($name, $args) { return []; }
            }';
            @eval($code);
            return true;
        }

        if (str_starts_with($shortName, 'behat_') || $shortName === 'behat_data_generators' || $shortName === 'behat_util' || $shortName === 'behat_base') {
            $code = ($namespace !== '' ? "namespace $namespace;\n" : '') . "class $shortName {
                public function __construct(...\$args) {}
                public static function get_entity_generators() { return []; }
                public function __call(\$name, \$args) { return []; }
                public static function __callStatic(\$name, \$args) { return []; }
            }";
            @eval($code);
            return true;
        }

        if ($shortName === 'exporter') {
            $code = ($namespace !== '' ? "namespace $namespace;\n" : '') . 'abstract class exporter {
                public static function get_read_structure() {
                    $props = static::define_properties();
                    $keys = [];
                    foreach ($props as $name => $spec) {
                        $type = isset($spec[\'type\']) ? $spec[\'type\'] : "text";
                        $req = !empty($spec[\'optional\']) ? 2 : 1;
                        $keys[$name] = class_exists("\\\\core_external\\\\external_value", false)
                            ? new \\core_external\\external_value($type, "", $req)
                            : new \\external_value($type, "", $req);
                    }
                    return class_exists("\\\\core_external\\\\external_single_structure", false)
                        ? new \\core_external\\external_single_structure($keys, "Read structure")
                        : new \\external_single_structure($keys, "Read structure");
                }
                protected static function define_properties() { return []; }
            }';
            @eval($code);
            return true;
        }

        $code = '';
        if ($namespace !== '') {
            $code .= "namespace $namespace;\n";
        }
        $code .= "class $shortName {
            public function __construct(...\$args) {}
            public function __call(\$method, \$args) { return null; }
            public static function __callStatic(\$method, \$args) {
                if (\$method === 'get_read_structure' || \$method === 'get_create_structure' || \$method === 'get_update_structure' || str_ends_with(\$method, '_structure') || str_ends_with(\$method, '_returns') || \$method === 'execute_returns') {
                    return (object)['keys' => [], 'desc' => 'Fallback', 'required' => 1];
                }
                if (\$method === 'define_properties' || \$method === 'define_other_properties' || \$method === 'define_related' || \$method === 'read_properties_definition') {
                    return [];
                }
                return null;
            }
        }";
        @eval($code);
        return true;
    }

    /**
     * Injects neutral helpers and bidirectional shims into global and core namespaces.
     *
     * @return void
     */
    public static function registerShims(): void {
        eval('
            if (!function_exists("get_config")) {
                function get_config($plugin = "core", $name = null) {
                    global $CFG;
                    if (!empty($name) && isset($CFG->$name)) {
                        return $CFG->$name;
                    }
                    if (!empty($plugin) && !empty($name) && isset($CFG->forced_plugin_settings[$plugin][$name])) {
                        return $CFG->forced_plugin_settings[$plugin][$name];
                    }
                    return false;
                }
            }

            if (!function_exists("get_string")) {
                function get_string($identifier, $component = "", $a = null) {
                    return $identifier;
                }
            }

            if (!function_exists("get_string_manager")) {
                function get_string_manager() {
                    static $manager = null;
                    if ($manager === null) {
                        $manager = new class {
                            public function string_exists($identifier, $component = "") { return true; }
                            public function get_string($identifier, $component = "", $a = null, $lang = null) { return $identifier; }
                            public function load_component_strings($component, $lang = null) { return []; }
                            public function get_list_of_countries($sort = true, $capitalize = true) { return []; }
                            public function get_list_of_translations($sort = true) { return []; }
                            public function get_list_of_languages() { return []; }
                            public function __call($name, $args) { return []; }
                        };
                    }
                    return $manager;
                }
            }

            if (!function_exists("clean_param")) {
                function clean_param($param, $type) { return $param; }
            }

            if (!function_exists("plugin_supports")) {
                function plugin_supports($type, $name, $feature, $default = null) {
                    return $default !== null ? $default : true;
                }
            }

            if (!function_exists("component_callback")) {
                function component_callback($component, $function, array $params = [], $default = null) {
                    return $default;
                }
            }

            if (!function_exists("get_plugin_list")) {
                function get_plugin_list($plugintype) { return []; }
            }

            if (!function_exists("get_list_of_countries")) {
                function get_list_of_countries() { return []; }
            }

            if (!function_exists("get_list_of_themes")) {
                function get_list_of_themes() { return []; }
            }
        ');

        // Bidirectional namespace shims for modern Moodle (4.x / 5.x)
        if (!function_exists('core\debugging')) {
            eval('namespace core { function debugging($message = "", $level = 0, $backtrace = null) {} }');
        }
        if (!function_exists('core\get_string_manager')) {
            eval('namespace core { function get_string_manager() { return \get_string_manager(); } }');
        }
        if (!function_exists('core\get_string')) {
            eval('namespace core { function get_string($identifier, $component = "", $a = null) { return \get_string($identifier, $component, $a); } }');
        }
        if (!function_exists('core\get_config')) {
            eval('namespace core { function get_config($plugin = "core", $name = null) { return \get_config($plugin, $name); } }');
        }
        if (!function_exists('core\get_list_of_themes')) {
            eval('namespace core { function get_list_of_themes() { return []; } }');
        }
        if (!class_exists('core\di', false)) {
            eval('namespace core {
                class di {
                    public static function get($name) {
                        if (class_exists($name)) {
                            return new $name();
                        }
                        return null;
                    }
                    public static function set($name, $value) {}
                }
            }');
        }
    }
}
