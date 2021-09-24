<?php
// © Microsoft Corporation. All rights reserved.

namespace microsoft_news\posts;

use microsoft_news\services\IngestionService;
use microsoft_news\services\TokenService;
use microsoft_news\posts\postApi;
use microsoft_news\MSNOptions;
use microsoft_news\services\MSNClient;
use WP_Post;

class Posts
{

    function __construct()
    {
        postApi::register();

        add_filter('manage_posts_columns', array($this, 'manage_posts_columns'));
        add_action('manage_posts_custom_column', array($this, 'manage_msn_post_status'), 10, 2);
        add_action('wp_after_insert_post',  array($this, 'wp_after_insert_post'), 10, 4);

        add_action('admin_enqueue_scripts', function () {
            $current_screen = get_current_screen();
            if ($current_screen->id !== "edit-post") {
                return;
            }

            wp_enqueue_script(
                "post-status",
                plugins_url("/posts/status.js", dirname(__FILE__)),
                array('wp-plugins', 'wp-edit-post', 'wp-api', 'wp-i18n', 'wp-components', 'wp-element'),
                false,
                true
            );
            wp_set_script_translations("post-status", 'default', plugin_dir_path(__DIR__) . 'languages/post-status/');

            wp_register_style('warnings', false);
            wp_enqueue_style('warnings');
            wp_add_inline_style("warnings", "
            .parent {
               position: relative;
           }
    
           .parent ul {
               visibility: hidden;
               position: absolute;
               background: white;
               border: 1px solid white;
               width: 207px;
               text-align: left;
               padding: 12px;
               z-index: 999;

               border-radius: 4px;

               box-shadow: 0px 12.8px 28.8px rgba(0, 0, 0, 0.13), 0px 0px 9.2px rgba(0, 0, 0, 0.11);
               font-size: 13px;
               font-family: Segoe UI;
           }
    
           .parent:hover ul {
               visibility: visible;
           } 
       ");
        });
    }

    function manage_posts_columns($defaults)
    {
        $scr = get_current_screen();
        if ($scr->post_type == "post") {
            $defaults = array_merge(array_slice($defaults, 0, 2), ['status' => "Microsoft Publisher Status"], array_slice($defaults, 2));
        }
        return $defaults;
    }

    function manage_msn_post_status($column, $post_ids)
    {
        switch ($column) {
            case 'status':
                $post_metadata = get_post_meta($post_ids);
                if (!array_key_exists('msn_id', $post_metadata) or $post_metadata['msn_id'][0] == "") {
                    return;
                }
?>
                <input type="hidden" class="msn_id_input" value=<?= get_post_meta($post_ids, "msn_id", true) ?>>
                <div id=<?= get_post_meta($post_ids, "msn_id", true) ?>>
                    <p>Loading Data...</p>
                </div>
<?php
        }
    }

    function wp_after_insert_post(int $post_ID, WP_Post $post, bool $update, ?WP_Post $post_before)
    {
        if ($post->post_type != "post") {
            return;
        }

        if ($post_before == null) {
            update_post_meta($post_ID, "MSN_Publish_Option", MSNOptions::Enabled());
            update_post_meta($post_ID, "MSN_Categories", MSNOptions::Category());
            update_post_meta($post_ID, "MSN_Location", MSNOptions::Location());
        }

        if ($post->post_status !== 'publish') {
            return;
        }
        if ($post->post_password) {
            return;
        }
        if (!get_post_meta($post->ID, 'MSN_Publish_Option', true)) {
            return;
        }
        if (TokenService::get_token()) {
            try {
                $this->push_to_msn($post);
            } catch (\Exception $e) {
                header("HTTP/1.1 500 Internal Server Error");
                die(json_encode(["message" => $e]));
            }        
        }
    }

    function push_to_msn(WP_Post $post)
    {
        $renderedBlocks = iterator_to_array(IngestionService::process_post($post));

        $content = array_reduce($renderedBlocks, function ($carry, $block) {
            return $carry . $block['content'];
        }, "");

        $featureImage = get_the_post_thumbnail_url($post) ?: null;

        if($featureImage) {
            if (substr($featureImage, 0, 4) != "http"){
                $featureImage = site_url() . $featureImage;
            }
        }

        $msnPost = [
            "id" => get_post_meta($post->ID, 'msn_id', true) ?: uniqid(),
            "link" => $post->guid,
            "type" => 1,
            "title" => $post->post_title,
            "body" => $content,
            "abstract" => get_the_excerpt($post->ID),
            "coverImage" => $featureImage,
            "categories" => [get_post_meta($post->ID, 'MSN_Categories', true)],
            "tags" => array_map(function ($post_tag) {
                return $post_tag->name;
            }, wp_get_post_tags($post->ID)),
            "locale" => "en-us",
            "location" => json_decode(get_post_meta($post->ID, 'MSN_Location', true))
        ];

        $response = MSNClient::update_post($msnPost);

        if ($response) {
            update_post_meta($post->ID, 'msn_id', $response->id);
        }
    }
}

new Posts();