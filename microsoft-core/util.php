<?php
// © Microsoft Corporation. All rights reserved.

namespace microsoft_core\util;

function console_log($output, $with_script_tags = true)
{
    $js_code = 'console.log(' . json_encode($output, JSON_HEX_TAG) .  ');';
    if ($with_script_tags) {
        $js_code = '<script>' . $js_code . '</script>';
    }
    esc_html_e( $js_code );
}

function alert($message)
{
    esc_html_e( "<script>alert('$message');</script>" );
}
