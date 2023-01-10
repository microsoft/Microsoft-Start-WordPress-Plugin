<?php
// © Microsoft Corporation. All rights reserved.

namespace microsoft_news\dashboard\tour;

use microsoft_core\infrastructure\ApiController;

class tourApi extends ApiController
{
    function register_routes()
    {
        register_rest_route('wp/v1', '/register_pointer', [
            'methods' => 'POST',
            'permission_callback' => function () {
                return current_user_can('activate_plugins');
            },
            'callback' => function ($data) {
               add_user_meta(get_current_user_id(),'wp-dismissed-pointers',sanitize_text_field( $_POST['id'] ),false);
            }
        ]);

        register_rest_route('wp/v1', '/register_pointer', [
            'methods' => 'GET',
            'permission_callback' => function () {
                return current_user_can('activate_plugins');
            },
            'callback' => function ($data) {
                $metaData = get_user_meta(get_current_user_id(), "wp-dismissed-pointers", false);
                return $metaData;
            }
        ]);
    }
}
