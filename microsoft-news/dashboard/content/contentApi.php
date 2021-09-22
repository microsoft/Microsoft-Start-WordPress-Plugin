<?php
// © Microsoft Corporation. All rights reserved.

namespace microsoft_news\dashboard\content;

use microsoft_news\services\TokenService;
use microsoft_news\MSNOptions;
use microsoft_core\infrastructure\ApiController;

class contentApi extends ApiController
{
    function register_routes()
    {
        //can we auth this?
        register_rest_route('microsoft/v1', '/stats', [
            'methods' => 'GET',
            'callback' => function () {
                $token = TokenService::get_token();
                $creatorCenterUrl = MSNOptions::creatorCenterUrl();
                wp_redirect("{$creatorCenterUrl}embed/dashboard#third_party_token=$token");
                exit;
            }
        ]);

        register_rest_route('microsoft/v1', '/bounce(?:/(?P<path>.+))?', [
            'methods' => 'GET',
            'args' => [
                'path' => [
                    'required' => false,
                    'type' => 'string'
                ]
            ],
            'callback' => function ($request) {
                $path = $request->get_param( 'path' );

                $token = TokenService::get_token();
                $creatorCenterUrl = MSNOptions::creatorCenterUrl();
                wp_redirect("{$creatorCenterUrl}{$path}?third_party_token=$token");
                exit;
            }
        ]);
    }
}
