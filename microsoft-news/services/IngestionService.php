<?php
// © Microsoft Corporation. All rights reserved.

namespace microsoft_news\services;

use WP_Post;

class IngestionService
{
    private static $allowedTags = [
        'b', 'i', 'em', 'strong', 'sub', 'sup', 'small', 'h1', 'h2', 'h3', 'a', 'img',
        'table', 'th', 'tr', 'td', 'thead', 'tbody', 'tfoot', 'col', 'caption', 'colgroup',
        'ol', 'ul', 'li',
        'span', 'div', 'p', 'br',
        'blockquote', 'iframe'
    ];

    public static function process_post(WP_Post $post)
    {
        $blocks = parse_blocks($post->post_content);
        yield from static::process_blocks($blocks);
    }

    private static function process_blocks($blocks)
    {
        foreach ($blocks as $block) {
            $attrs = $block['attrs'];

            if (array_key_exists('pushToMsn', $attrs)) {
                continue;
            }

            switch ($block['blockName']) {

                case "core/columns":
                case "core/column":
                case "core/group":
                    yield from static::process_blocks($block['innerBlocks']);
                    break;

                case "core/embed":
                    $url = trim(strip_tags($block['innerHTML']));
                    yield [
                        'type' => 'content',
                        'content' => "<iframe src='$url' />",
                    ];
                    break;

                case "core/media-text":
                    yield [
                        'type' => 'content',
                        'content' => static::get_image_content($attrs['mediaId']),
                    ];
                    yield from static::process_blocks($block['innerBlocks']);
                    break;
                case "core/cover":
                case "core/image":
                    $id = null;
                    if (array_key_exists('id', $attrs)) {
                        $id = $attrs['id'];
                    } else {
                        $matches = [];
                        if (preg_match('/src="([^"]+)?"/', $block['innerHTML'], $matches)) {
                            $url = $matches[1];
                            $id = attachment_url_to_postid($url);
                        }
                    }

                    yield [
                        'type' => 'content',
                        'content' => static::get_image_content($id),
                    ];
                    yield from static::process_blocks($block['innerBlocks']);
                    break;
                
                case "core/gallery":
                    $content = "<ul>";
                    foreach ($attrs["ids"] as $id) {
                        $image_html = static::get_image_content($id);
                        $content .= "<li>$image_html</li>";
                    }
                    $content .= "</ul>";
                    
                    yield [
                        'type' => 'content',
                        'content' => $content,
                    ];
                    yield from static::process_blocks($block['innerBlocks']);
                    break;

                case "core/separator":
                case "core/table":
                case "core/heading":
                case "core/paragraph":
                case "core/list":
                case "core/preformatted":
                case "core/verse":
                case "core/code":
                case "core/quote":
                case "core/pullquote":
                case null:
                default: 
                    $allowedTags = "<b><i><em><strong><sub><sup><small><h1><h2><h3><a><img><table><th><tr><td><thead><tbody><tfoot><col><caption><colgroup><ol><ul><li><span><div><p><br><blockquote><iframe>";
                    $html = strip_tags($block['innerHTML'], $allowedTags);

                    yield [
                        'type' => 'content',
                        'content' => $html,
                    ];
                    break;
            }
        }
    }

    public static function get_image_content($attachment_id)
    {
        $url = wp_get_attachment_url($attachment_id);
        if (substr($url, 0, 4) != "http"){
            $url = site_url() . $url;
        }
        return "<img src=$url />";
    }
}