<?php
// © Microsoft Corporation. All rights reserved.

namespace microsoft_core\infrastructure;

abstract class ApiController extends Registration
{
    function __construct()
    {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    abstract protected function register_routes();
    function register_dependencies() {}
}
