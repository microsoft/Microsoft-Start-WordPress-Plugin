// © Microsoft Corporation. All rights reserved.

import React from 'react';
import jQuery from "jquery";
import { useLocation } from "react-router-dom";

let ListOfPointers = [
    {
        image: "<img src =>",
        title: "<div style = \"padding: 20px\"><h1 style = \"color:black; font-size: 20px; padding: 0px\">Lorem ipsum<\/h1>",
        content: "<p style = \"padding:0px; padding-bottom: 10px;margin-bottom:15px; border-bottom-style: solid; border-color:grey;\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam velit metus, euismod eget porttitor eu, consequat a velit. Mauris varius ligula ultrices condimentum volutpat<\/p>",
        btn_next: "<button style = \"float: right; margin-right:10px; min-width: 100px; padding: 0px;\" class = \"button button-primary\">  Next <\/button>",
        btn_back: "<button style = \"float: right; margin-right:10px; min-width: 100px; padding: 0px;\" class = \"button button-secondary\">  Back <\/button><\/div>",
        target: "#tour-nav-02",
        where: "?page=microsoft-news/",
        edge: "top",
        align: "top",
        redirect: null
    },
    {
        image: "<img src =>",
        title: "<div style = \"padding: 20px\"><h1 style = \"color:black; font-size: 20px; padding: 0px\">Lorem ipsum<\/h1>",
        content: "<p style = \"padding:0px; padding-bottom: 10px;margin-bottom:15px; border-bottom-style: solid; border-color:grey;\">L2orem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam velit metus, euismod eget porttitor eu, consequat a velit. Mauris varius ligula ultrices condimentum volutpat<\/p>",
        btn_next: "<button style = \"float: right; margin-right:10px; min-width: 100px; padding: 0px;\" class = \"button button-primary\">  Next <\/button>",
        btn_back: "<button style = \"float: right; margin-right:10px; min-width: 100px; padding: 0px;\" class = \"button button-secondary\">  Back <\/button><\/div>",
        target: "#wpadminbar",
        where: "?page=microsoft-news/",
        edge: "top",
        align: "top",
        redirect: null
    },
    {
        image: "<img src =https:\/\/via.placeholder.com\/500x200?text=Placeholder+500x200>",
        title: "<div style = \"padding: 20px\"><h1 style = \"color:black; font-size: 20px; padding: 0px\">Lorem ipsum<\/h1>",
        content: "<p style = \"padding:0px; padding-bottom: 10px;margin-bottom:15px; border-bottom-style: solid; border-color:grey;\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam velit metus, euismod eget porttitor eu, consequat a velit. Mauris varius ligula ultrices condimentum volutpat<\/p>",
        btn_next: "<button style = \"float: right; margin-right:10px; min-width: 100px; padding: 0px;\" class = \"button button-primary\">  Next <\/button>",
        btn_back: "<button style = \"float: right; margin-right:10px; min-width: 100px; padding: 0px;\" class = \"button button-secondary\">  Back <\/button><\/div>",
        target: "#tour-nav-01",
        where: "?page=microsoft-news/settings",
        edge: "top",
        align: "top",
        redirect: "http:\/\/localhost:8000\/wp-admin\/admin.php?page=microsoft-news#\/"
    }
];

export const TourInterface = function () {
    const location = useLocation();
    React.useEffect(() => {

        var key = window.location.search + location.pathname;
        var pointers = ListOfPointers.filter(x => x.where == key);

        let targetIDs = LoadPointers(pointers);
        return () => {
            if (targetIDs) {
                for (var pointer of targetIDs) {
                    pointer.pointer('destroy');
                }
            }
        }

    }, [location]);

    return (<div></div>);
}

function LoadPointers(pointers) {
    if (pointers.length < 1)
        return;

    var ret = [];
    $ = jQuery;

    for (let index = 0; index < pointers.length; index++) {
        let pointer = pointers[index];
        var targetID = $(pointer.target).pointer({
            content: pointer.image +
                "<div> </div>" +
                pointer.title +
                pointer.content +
                pointer.btn_next +
                pointer.btn_back,
            position: {
                edge: pointer.edge,
                align: pointer.align
            },
            pointerWidth: 500,
            open: function (event, args) {
                let buttons = args.pointer[0]

                if (index == pointers.length - 1) {
                    $(buttons).find('.button').eq(0).text('Finish');
                }

                if (index == 0) {
                    $(buttons).find('.button').eq(1).remove();
                }

                $(buttons).find('.button').eq(0).on('click', function () {
                    if (index != pointers.length - 1) {

                        $(pointer.target).pointer('close');
                        $(pointers[index + 1].target).pointer('open');

                    } else {
                        $(pointer.target).pointer('close');

                        $.ajax({
                            type: "POST",
                            url: "/?rest_route=/wp/v1/register_pointer",
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader('X-WP-Nonce', wpApiSettings.nonce);
                            },
                            data: {
                                id: pointer.where
                            }
                        });
                    }
                });

                $(buttons).find('.button').eq(1).on('click', function () {
                    if (index > 0) {
                        $(pointers[index - 1].target).pointer('open');
                        $(pointer.target).pointer('close');
                    }
                });

                $(buttons).find('a').remove();
            }
        });
        ret.push(targetID);
    }

    fetch("/?rest_route=/wp/v1/register_pointer", {
        method: "GET",
        headers: {
            'Content-Type': "application/json",
            'X-WP-Nonce': wpApiSettings.nonce
        }
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            let isOpen = true;
            for (const wp_pointer of data) {
                if (wp_pointer == pointers[0].where) {
                    isOpen = false;
                    break;
                }
            }
            if (isOpen) {
                jQuery(pointers[0].target).pointer('open');
            }

        })

    return ret;
}