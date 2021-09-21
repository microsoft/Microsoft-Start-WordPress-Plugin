<?php
// © Microsoft Corporation. All rights reserved.

namespace microsoft_news\dashboard\settings;

use microsoft_core\infrastructure\ApiController;
use microsoft_news\MSNOptions;

use WP_REST_Response;

class settingsApi extends ApiController
{
    function register_routes()
    {
        register_rest_route('microsoft/v1', '/publish-settings', [
            'methods' => 'POST',
            'permission_callback' => function () {
                return current_user_can('activate_plugins');
            },
            'callback' => function ($data) {
                $parameters = $data->get_json_params();
                MSNOptions::Enabled($parameters['option']);
                MSNOptions::Language($parameters['language']);
                MSNOptions::Market($parameters['market']);
                MSNOptions::Category($parameters['category']);

                return new WP_REST_Response([''], 201);
            }
        ]);

        register_rest_route('microsoft/v1', '/publish-settings', [
            'methods' => 'GET',
            'permission_callback' => function () {
                return current_user_can('activate_plugins');
            },
            'callback' => function ($data) {

                return [
                    "option" => MSNOptions::Enabled(),
                    "language" => MSNOptions::Language(),
                    "market" => MSNOptions::Market(),
                    "category" => MSNOptions::Category()
                ];
            }
        ]);
    }
}
