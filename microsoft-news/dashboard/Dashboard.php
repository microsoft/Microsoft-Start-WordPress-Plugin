<?php
// © Microsoft Corporation. All rights reserved.

namespace microsoft_news\dashboard;

use microsoft_core\infrastructure\Util;
use microsoft_core\infrastructure\Page;

use  microsoft_news\dashboard\content\contentApi;
use  microsoft_news\dashboard\settings\settingsApi;
use  microsoft_news\dashboard\tour\tourApi;
use microsoft_news\MSNOptions;
use microsoft_news\services\MSNClient;

class Dashboard extends Page
{
    function register_dependencies()
    {
        contentApi::register();
        settingsApi::register();
    }

    function admin_menu()
    {
        $this->add_submenu_page(
            'microsoft-news',
            __('Publisher Dashboard'),
            function ($page) {
                wp_enqueue_script(
                    $page,
                    plugins_url("/assets/js/dashboard.js", dirname(__FILE__)),
                    array('wp-plugins', 'wp-edit-post', 'wp-api', 'wp-i18n', 'wp-components', 'wp-element'),
                    false,
                    true
                );

                wp_set_script_translations($page, 'default', plugin_dir_path(__DIR__) . 'languages/');

                wp_enqueue_style(
                    $page,
                    plugins_url("/assets/js/dashboard.css", dirname(__FILE__)),
                    ['wp-components'],
                );

                $accountSettings = MSNClient::account_settings();
                wp_localize_script(
                    $page,
                    'msn_dashboard_render_status',
                    [
                        'enabled' => MSNOptions::Status() == 'active' || MSNOptions::Status() == 'pending',
                        'default' => MSNOptions::Status() == 'default',
                        'pending' => MSNOptions::Status() == 'pending',
                        'active' => MSNOptions::Status() == 'active',
                        'disconnected' => MSNOptions::Status() == 'disconnected',
                        'profile' => $accountSettings
                    ]
                );
            }
        );

    }

    function render()
    {
?>
        <div id="msn-dashboard"></div>
<?php
    }
}
