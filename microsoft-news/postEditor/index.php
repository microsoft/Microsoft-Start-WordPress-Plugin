<?php
// © Microsoft Corporation. All rights reserved.

namespace microsoft_news\posts;

use microsoft_news\MSNOptions;

class PostEditor
{

    function __construct()
    {
        add_action('init', array($this, 'initialise_sidebar_metadata'));
        add_action("enqueue_block_editor_assets", array($this, "enqueue_sidebar"));
    }

    function enqueue_sidebar()
    {
        $screen = get_current_screen();
        if($screen->post_type === "post") {
            wp_enqueue_script(
                'msn-sidebar',
                plugins_url("/assets/js/editorSidebar.js", dirname(__FILE__)),
                array('wp-plugins', 'wp-edit-post', 'wp-api', 'wp-i18n', 'wp-components', 'wp-element')
            );
            wp_localize_script( 'msn-sidebar', 'msn_sidebar_settings',
                [
                'enabled' => MSNOptions::Status() == 'active' || MSNOptions::Status() == 'pending' ? 'true' : 'false'
                ]
            );

            wp_set_script_translations('msn-sidebar', 'default', plugin_dir_path(__DIR__) . 'languages/');

            wp_enqueue_style(
                uniqid('msn-sidebar-styles'),
                plugins_url("../assets/js/editorSidebar.css", __FILE__)
            );
        }
    }

    function initialise_sidebar_metadata()
    {
        /**
         * metadata to store the value of the selected category in the gutenburg sidebar
         */
        register_meta('post', 'MSN_Categories', array(
            'show_in_rest' => true,
            'type' => 'string',
            'single' => true,
        ));

        /**
         * metadata to store the value of the selected publishing option in the gutenburg sidebar
         */
        register_meta('post', 'MSN_Publish_Option', array(
            'show_in_rest' => true,
            'type' => 'boolean',
            'single' => true,
            'auth_callback' => true
        ));
        
        register_meta('post', 'MSN_Location', array(
            'show_in_rest' => true,
            'type' => 'string',
            'single' => true,
            'auth_callback' => true
        ));

        register_meta( 'post', 'MSN_Language', array(
            'show_in_rest' => true,
            'type' => 'string',
            'single' => true,
            'auth_callback' => true
        ));
        register_meta( 'post', 'MSN_Markets', array(
            'show_in_rest' => true,
            'type' => 'string',
            'single' => true,
            'auth_callback' => true
        ));
        register_meta('post', 'msn_id', array(
            'show_in_rest' => true,
            'type' => 'string',
            'single' => true,
        ));
    }
}
new PostEditor();