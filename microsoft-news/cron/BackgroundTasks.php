<?php
// © Microsoft Corporation. All rights reserved.

namespace microsoft_news\cron;

use microsoft_news\MSNOptions;
use microsoft_core\infrastructure\Registration;

class BackgroundTasks extends Registration
{
    function register_dependencies()
    {
        add_action('wp', function () {
            if (MSNOptions::SharePastPostsStartDate()) {
                if (!wp_next_scheduled('msnPublishTask')) {
                    wp_schedule_event(time(), 'hourly', 'msnPublishTask');
                }
            }
        });

        register_deactivation_hook(__FILE__, function () {
            $timestamp = wp_next_scheduled('msnPublishTask');
            wp_unschedule_event($timestamp, 'msnPublishTask');
        });

        add_action('msnPublishTask', [$this, 'publish_posts']);
    }

    function publish_posts()
    {
        if (!MSNOptions::SharePastPostsStartDate()) {
            return;
        }

        $now = gmdate('Y-m-d H:i:00');
        $after =  date_parse(MSNOptions::SharePastPostsStartDate());

        $posts = get_posts([
            'post_type' => 'post',
            'post_status' => ['publish', 'future'],
            'meta_query' => [
                [
                    'key' => 'msn_id',
                    'compare' => 'NOT EXISTS'
                ]
            ],
            'date_query' => array(
                array(
                    'after'     => $after,
                    'before'    => $now,
                    'inclusive' => true,
                ),
            ),
        ]);

        foreach ($posts as $post) {
            switch ($post->post_status) {
                case 'future':
                    wp_publish_post($post->ID);
                    break;
                case 'publish':
                    do_action( 'wp_after_insert_post', $post->ID, $post, true, null );
                    break;
            }
        }
    }
}
