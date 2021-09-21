<?php
// © Microsoft Corporation. All rights reserved.

namespace microsoft_core\infrastructure;

abstract class Page extends Registration
{
    function __construct()
    {
        add_action('admin_menu', function () {
            if (empty($GLOBALS['admin_page_hooks']['microsoft'])) {

                //https://wordpress.stackexchange.com/questions/311412/how-can-i-make-my-admin-icon-svg-color-correctly
                $image = base64_encode("<svg width='20' height='20' viewBox='0 2 36 36' shape-rendering='crispEdges' xmlns='http://www.w3.org/2000/svg'>
                    <path fill=\"black\" fill-rule='evenodd' clip-rule='evenodd'  d='M6 6 H17 V17 H6 V6 Z'/>
                    <path fill=\"black\" fill-rule='evenodd' clip-rule='evenodd' d='M6 19.5H16.5V30H6V19.5Z' />
                    <path fill=\"black\" fill-rule='evenodd' clip-rule='evenodd' d='M19.5 6H30V16.5H19.5V6Z' />
                    <path fill=\"black\" fill-rule='evenodd' clip-rule='evenodd' d='M19.5 19.5H30V30H19.5V19.5Z' />
                </svg>");

                add_menu_page(__('General'), __('Microsoft'), 'manage_options', 'microsoft', '', 'data:image/svg+xml;base64,' . $image, 0);
            }
            remove_submenu_page('microsoft', 'microsoft');

            $this->admin_menu();
        });
    }

    abstract protected function admin_menu();
    abstract protected function render();

    function add_submenu_page(string $id, string $title, callable $enqueueScripts) {
        Util::add_submenu_page($id, $title, [$this, 'render'], $enqueueScripts);
    }
}


