<?php
// © Microsoft Corporation. All rights reserved.

namespace microsoft_core\infrastructure;

abstract class Registration
{
    abstract protected function register_dependencies();

    public static function register()
    {
        $className = get_called_class();
        global $microsoft_registry;

        if (!isset($microsoft_registry)) {
            $_GLOBALS['microsoft_registry'] = [];
        }

        if (!isset($microsoft_registry[$className])) {
            $instance = new $className;
            $microsoft_registry[$className] = $instance;
            $instance->register_dependencies();
        }
    }
}
