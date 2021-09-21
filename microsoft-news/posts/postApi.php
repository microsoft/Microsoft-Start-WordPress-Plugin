<?php
// © Microsoft Corporation. All rights reserved.

namespace microsoft_news\posts;

use microsoft_core\infrastructure\ApiController;
use microsoft_news\services\MSNClient;

class postApi extends ApiController{
    function register_routes(){
        register_rest_route("microsoft/v1", "/msn-article-retrieval",[
            "methods" => "POST",
            'permission_callback' => function () {
                return current_user_can('edit_posts');
            },
            'callback' => function ($data){
                $parameters = $data->get_json_params();
                $article_id_list = $parameters['articles'];

                $publishStatus = array_map(function($item) {
                    return [
                        'id' => $item->id,
                        'status' => $item->status,
                        'validation' => array_map(function ($failure) {
                            return __($failure->failureReason);
                        }, $item->failedTargets ?? [])
                    ];
                }, MSNClient::get_article_publish_status($article_id_list));



                return $publishStatus;
            }
        ]);
    }
}