<?php
// © Microsoft Corporation. All rights reserved.

namespace microsoft_news\dashboard\tour;

class Tour
{
    function __construct()
    {
        add_action('admin_enqueue_scripts', array($this, 'my_admin_enqueue_scripts'));

    }

    function my_admin_enqueue_scripts()
    {
        wp_enqueue_style('wp-pointer');
        wp_enqueue_script('wp-pointer');
    }
}

new Tour();
