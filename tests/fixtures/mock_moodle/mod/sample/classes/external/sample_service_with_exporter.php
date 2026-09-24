<?php
declare(strict_types=1);

namespace mod_sample\external;

use external_function_parameters;
use external_value;
use external_multiple_structure;
use external_single_structure;
use external_warnings;

/**
 * Exporter implementation for mock service fixture.
 */
class mock_item_exporter extends \core\external\exporter {
    protected static function define_properties() {
        return [
            'id'    => ['type' => PARAM_INT],
            'title' => ['type' => PARAM_TEXT]
        ];
    }
}

/**
 * Sample Web Service in mock Moodle environment.
 */
class sample_service_with_exporter extends \core_external\external_api {

    public static function get_items_parameters(): external_function_parameters {
        return new external_function_parameters([
            'courseid' => new external_value(PARAM_INT, 'Course ID to filter'),
            'filter'   => new external_value(PARAM_TEXT, 'Optional text filter', VALUE_DEFAULT, '')
        ]);
    }

    public static function get_items_returns(): external_single_structure {
        return new external_single_structure([
            'items'    => new external_multiple_structure(mock_item_exporter::get_read_structure()),
            'warnings' => new external_warnings()
        ]);
    }
}
