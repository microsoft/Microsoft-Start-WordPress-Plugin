<?php
// © Microsoft Corporation. All rights reserved.

namespace microsoft_core;

abstract class Options  {
    abstract protected static function getPrefix();

    protected static function Option($args, $default = null)
    {
        //name of calling function
        $property = debug_backtrace()[1]['function'];
        $prefix = static::getPrefix();

        $name = "{$prefix}_$property";

        if (count($args)) {
            update_option($name, $args[0]);
        }

        $value = get_option($name);

        if (!$value) {
            if (is_array($default)) {
                $env = getenv('DEBUG') ? 'dev' : 'prod';

                //TODO env forced to 'dev' for now...
                $env = 'dev';

                return $default[$env];
            }

            return $default;
        }

        return $value;
    }
}