<?php
// © Microsoft Corporation. All rights reserved.

namespace microsoft_news\authentication;

use microsoft_core\infrastructure\Page;

class Callback extends Page
{
    function register_dependencies()
    {
        authenticationApi::register();
    }

    function admin_menu()
    {
        $this->add_submenu_page(
            'msn-callback',
            '',
            function($page) {
                wp_enqueue_script(
                    $page,
                    plugins_url("/assets/js/callback.js", dirname(__FILE__)),
                    array('wp-plugins', 'wp-edit-post', 'wp-api', 'wp-i18n', 'wp-components', 'wp-element'),
                    false,
                    true
                );

                wp_enqueue_style($page, plugins_url('../assets/js/callback.css', __FILE__) , ['wp-components']);
                wp_set_script_translations($page, 'default', plugin_dir_path(__DIR__) . 'languages/');
            }
        );
    }

    function render()
    {
?>
        
        <div id="msn-callback"></div>
<?php
    }
}