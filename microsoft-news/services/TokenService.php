<?php
// © Microsoft Corporation. All rights reserved.

namespace microsoft_news\services;

use microsoft_news\MSNOptions;

class TokenService
{
    public static function set_client($appId, $appSecret) {
        MSNOptions::AppId($appId);
        MSNOptions::AppSecret($appSecret);
        MSNOptions::Status('pending');
        MSNOptions::AuthToken(null);
        MSNOptions::CID(null);
    }

    public static function get_token() {
        $token = MSNOptions::AuthToken();
        if($token) {
            $jwtParts = explode('.', $token);
            $payload = json_decode(base64_decode($jwtParts[1]));

            //token has expired
            if(time() > $payload->exp)
            {
                $token = null;
            }
        }

        if(!$token) {
            $appId = MSNOptions::AppId();
            $appSecret = MSNOptions::AppSecret();
            if($appId && $appSecret) {
                $msnAccountUrl = MSNOptions::msnAccountUrl();

                $response = wp_remote_post(
                    "$msnAccountUrl/account/accesstoken?appId=$appId&appSecret=$appSecret&wrapodata=false",
                    [
                        'method'      => 'GET',
                        'data_format' => 'body'
                    ]
                );

                if($response['response']['code'] == 200)
                {
                    $payload = json_decode($response['body']);
                    $token = $payload->token;
                    TokenService::set_token($token);
                }
            }
        }


        return $token;
    }

    public static function set_token($token) {
        MSNOptions::AuthToken($token);
        MSNOptions::Status('pending');
    }

    public static function delete_token() {
        $token = TokenService::get_token();

        $appId = MSNOptions::AppId();
        $msnAccountUrl = MSNOptions::msnAccountUrl();

        wp_remote_post(
            "$msnAccountUrl/account/application/$appId",
            [
                'Authorisation' => "Bearer $token",
                'method'      => 'DELETE',
                'data_format' => 'body'
            ]
        );

        MSNOptions::AppId(null);
        MSNOptions::AppSecret(null);
        MSNOptions::AuthToken(null);
        MSNOptions::CID(null);
        MSNOptions::Status("disconnected");
    }
}