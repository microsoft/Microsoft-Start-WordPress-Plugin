<?php
// © Microsoft Corporation. All rights reserved.

namespace microsoft_news\services;

use Exception;
use Requests;
use microsoft_news\MSNOptions;

class MSNClient
{
    static function update_post($body)
    {
        return static::PerformRequest(MSNOptions::msnAccountUrl() . "thirdparty/contents/article/{$body['id']}?scn=3rdPartyAuth&status=3&wrapodata=false", $body);
    }

    static function account_settings()
    {
        $status =  static::PerformRequest(function ($cid) {
            return MSNOptions::msnAccountUrl() . "account/settings?scn=3rdPartyAuth&wrapodata=false";
        });
        if ($status) {
            $lifeCycleStatus = $status->lifeCycleStatus;
            if ($lifeCycleStatus == 0) {
                MSNOptions::Status('active');
            }
        }
        return $status;
    }

    static function get_article_publish_status($article_id_list)
    {
        $idListArray = explode(",", $article_id_list);
        $results = array();
        $limitation = 15;       // due to limitation from Http.sys registry settings for Windows.

        while (!empty($idListArray)) {
            $selectedIdListArray = array_slice($idListArray, 0, $limitation);
            $selectedIdList = implode(",", $selectedIdListArray);
            $encodedSelectedIdList = urlencode($selectedIdList);
            $url = MSNOptions::msnAccountUrl() . "thirdparty/contents/article/?ids={$encodedSelectedIdList}&res=publish&scn=3rdPartyAuth&wrapodata=false";
            $result = static::PerformRequest($url, []);
            array_push($results, $result);
            array_splice($idListArray, 0, $limitation);
        }

        $totalResult = call_user_func_array('array_merge', $results);
        return $totalResult == null ? [] : $totalResult;
    }

    static function get_article_pending_status($article_id_list)
    {
        $article_id_list = urlencode($article_id_list);
        $url = MSNOptions::msnAccountUrl() . "thirdparty/contents/article/?ids={$article_id_list}&res=pending&scn=3rdPartyAuth&wrapodata=false";

        return static::PerformRequest($url, []);
    }

    private static function get_cid($token)
    {
        $jwtParts = explode('.', $token);
        $payload = json_decode(base64_decode($jwtParts[1]));
        if (isset($payload->cid)) {
            return $payload->cid;
        }

        $cid = MSNOptions::CID();

        if (!$cid) {
            $response = wp_remote_post(
                MSNOptions::msnAccountUrl() . "account?scn=3rdPartyAuth&wrapodata=false",
                [
                    'headers' => [
                        'Authorization' => "Bearer $token",
                        "accept" => "*/*",
                        "accept-language" => "en-NZ,en;q=0.9",
                        "content-type" => "application/json",
                    ],
                    'method'      => 'GET',
                ]
            );

            if ($response['response']['code'] == 200) {
                $cid = json_decode($response['body'])->accountId;
                MSNOptions::CID($cid);
            } else {
                TokenService::delete_token();
            }
        }
        return $cid;
    }

    private static function PerformRequest($request_url, $request_body = null)
    {
        $responses = static::PerformRequests($request_url, [$request_body]);
        if (!$responses) {
            return null;
        }
        return $responses[0];
    }

    private static function PerformRequests($request_url, $request_bodies = [null])
    {
        $token = TokenService::get_token();
        if (!$token) {
            return null;
        }

        if (is_callable($request_url)) {
            $cid = static::get_cid($token);
            $request_url = $request_url($cid);
        }

        $requests = array_map(function ($body) use ($request_url, $token) {
            $req_body_json = $body !== null ? json_encode($body) : null;

            return [
                'url' => $request_url,
                'headers' => [
                    'Authorization' => 'Bearer ' . $token,
                    "accept" => "*/*",
                    "accept-language" => "en-NZ,en;q=0.9",
                    "content-type" => "application/json",
                ],
                'type' => $body != null ? 'POST' : 'GET',
                'data' => $req_body_json,
            ];
        }, $request_bodies);

        $options = [
            'data_format' => 'body',
            'timeout'       => 60,
        ];

        //returns array(Requests_Response), not dictionary
        $responses = Requests::request_multiple($requests, $options);
        $results = array_map(function ($response) {
            if($response->success)
            {
                return json_decode($response->body);
            }

            if($response->status_code == 401)
            {
                TokenService::delete_token();
            }
        }, $responses);

        return $results;
    }
}