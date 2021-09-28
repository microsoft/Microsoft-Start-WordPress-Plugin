<?php
// © Microsoft Corporation. All rights reserved.

namespace microsoft_news;

use microsoft_core\Options;

class MSNOptions extends Options
{
    protected static function getPrefix() {
        return "msn";
    }

    public static function msnAccountUrl()
    {
        return self::Option(func_get_args(), [
            'dev' => 'https://api.msn.com/ugc/',
            'prod' => 'https://api.msn.com/ugc/'
        ]);
    }

    public static function SharePastPostsStartDate() {
        return self::Option(func_get_args(), null);
    }

    public static function creatorCenterUrl()
    {
        return static::Option(func_get_args(), [
            'dev' => 'https://www.msn.com/en-us/creator/',
            'prod' => 'https://www.msn.com/en-us/creator/'
        ]);
    }

    public static function AppId()
    {
        return static::Option(func_get_args());
    }

    public static function AppSecret()
    {
        return static::Option(func_get_args());
    }

    public static function AuthToken()
    {
        return static::Option(func_get_args());
    }

    public static function CID()
    {
        return static::Option(func_get_args());
    }

    public static function Status()
    {
        return static::Option(func_get_args(), 'default');
    }

    public static function Enabled()
    {
        return static::Option(func_get_args());
    }

    public static function Category()
    {
        return static::Option(func_get_args(), "uncatagorised");
    }

    public static function Location()
    {
        return static::Option(func_get_args());
    }
}
