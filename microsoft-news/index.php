<?php
// © Microsoft Corporation. All rights reserved.

/**
 * Plugin Name:       Microsoft Start
 * Plugin URI:        https://www.msn.com/
 * Description:       Microsoft Start WordPress plugin to help WordPress content creators to share content to Microsoft Start News feed.
 * Version:           1.2
 * Requires at least: 5.4
 * Requires PHP:      7.3
 * Author:            Microsoft
 * Author URI:        https://www.microsoft.com/
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 */

namespace microsoft_news;

//define('WP_DEBUG', true);
//define('WP_DEBUG_DISPLAY', true);
//define( 'WP_DEBUG_LOG', '/tmp/wp-errors.log' );

require __DIR__ . '/vendor/autoload.php';

//Modules

require_once('posts/index.php');
require_once('postEditor/index.php');

dashboard\Dashboard::register();
authentication\Callback::register();
cron\BackgroundTasks::register();

// function redefine_locale($locale) {
//     return "test";
// }
// add_filter('locale','microsoft_news\redefine_locale',10);