<?php
// © Microsoft Corporation. All rights reserved.

namespace microsoft_core\infrastructure;

Class Util {
    static public function add_redirect_page($id, $title, $url) {

        $page = Util::add_submenu_page(
            $id,
            $title,
            function() { }
        );

        add_action( "load-$page",
            function() use($url) {
                wp_redirect($url);
                exit;
            }
        );
    }

    static public function add_submenu_page(string $id, ?string $title, callable $render, callable $enqueueScripts = null) {
        $page = \add_submenu_page(
            $title ? 'microsoft' : null,
            $title,
            $title,
            'manage_options',
            $id,
            $render
        );

        if($enqueueScripts) {
            add_action('admin_enqueue_scripts', function ($hook) use ($page, $enqueueScripts){
                if($hook !== $page) {
                return;
                }
                $enqueueScripts($page);

                wp_register_script('microsoft-clarity', false);
                wp_enqueue_script("microsoft-clarity");
                wp_add_inline_script("microsoft-clarity", "
                    (function(c,l,a,r,i,t,y){
                        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                        t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;
                        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                    })(window, document, 'clarity', 'script', '6ksp67g0l0');
                ");
            });
        }
        return $page;
    }
}