<?php
// © Microsoft Corporation. All rights reserved.

namespace microsoft_news\authentication;

use microsoft_news\services\MSNClient;
use microsoft_news\services\TokenService;

use microsoft_news\MSNOptions;
use microsoft_core\infrastructure\ApiController;
use TheSeer\Tokenizer\Token;

class authenticationApi extends ApiController
{
    function register_routes()
    {
        register_rest_route('microsoft/v1', '/connect', [
            'methods' => 'GET',
            'callback' => function () {
                $callbackUrl = urlencode(admin_url("admin.php?page=msn-callback"));
                $creatorCenterUrl = MSNOptions::creatorCenterUrl();
                wp_redirect("{$creatorCenterUrl}dialog/connect#callback_url=$callbackUrl");
                exit;
            }
        ]);

        register_rest_route('microsoft/v1', '/redeemCode', [
            'methods' => 'POST',
            'callback' => function ($data) {
                $parameters = $data->get_json_params();
                $msnAccountUrl = MSNOptions::msnAccountUrl();

                $response = wp_remote_post(
                    "{$msnAccountUrl}account/RedeemCode/{$parameters['redeemCode']}?wrapodata=false",
                    [
                        'timeout'       => 60,
                        'headers' => [
                            "accept" => "*/*",
                        ],
                        'method'      => 'GET'
                    ]
                );

                switch ($response['response']['code']) {
                    case 200:
                        $result = json_decode($response['body']);
                        TokenService::set_client($result->appId, $result->appSecret);
                        if (array_key_exists('sharePastPostsStartDate', $parameters)) {
                            MSNOptions::SharePastPostsStartDate($parameters['sharePastPostsStartDate']);
                        }

                        break;
                    default:
                        header("HTTP/1.1 500 Internal Server Error");
                        die($response['body']);
                }
            }
        ]);

        register_rest_route('microsoft/v1', '/token', [
            'methods' => 'POST',
            'permission_callback' => function () {
                return current_user_can('activate_plugins');
            },
            'callback' => function ($data) {
                $parameters = $data->get_json_params();
                $token = $parameters['token'];

                TokenService::set_token($token);

                $status = MSNClient::account_settings();
            }
        ]);

        register_rest_route('microsoft/v1', '/token', [
            'methods' => 'GET',
            'permission_callback' => function () {
                return current_user_can('activate_plugins');
            },
            'callback' => function () {
                return ['token' => TokenService::get_token()];
            }
        ]);

        register_rest_route('microsoft/v1', '/delete-token', [
            'methods' => 'POST',
            'permission_callback' => function () {
                return current_user_can('activate_plugins');
            },
            'callback' => function () {
                TokenService::delete_token();
            }
        ]);
    }
}
