<?php
defined('MOODLE_INTERNAL') || die();

$functions = [
    'mod_sample_get_items' => [
        'classname'   => 'mod_sample\external\sample_service_with_exporter',
        'methodname'  => 'get_items',
        'description' => 'Get sample items from fixture',
        'type'        => 'read',
        'ajax'        => true
    ]
];
