// © Microsoft Corporation. All rights reserved.

jQuery(function() {
    const input = Array.from(document.getElementsByClassName("msn_id_input"));
    const article_list = input.map(s => s.value).join(',');

    if(article_list) {

    const fetch_options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'X-WP-Nonce': wpApiSettings.nonce
        },
        body: JSON.stringify({articles: article_list})
    }

    const data = fetch('/?rest_route=/microsoft/v1/msn-article-retrieval', fetch_options)
        .then((response)=> response.json())
        .then((data)=>{
            if(data) {
                for(const article of data) {

                    const node = document.getElementById(article.id);
                    while (node.firstChild) {
                        node.removeChild(node.firstChild);
                    }

                    const status = document.createElement("span");
                    status.innerText = article.status + " ";
                    node.appendChild(status);

                    if(article.validation.length) {
                        var container = document.createElement('div');
                        container.className = "dashicons dashicons-warning parent";

                        var list = document.createElement('ul');


                        var item = document.createElement('li');
                        item.innerHTML = `${wp.i18n.__("Your post does not meet Microsoft Content Guidelines.")}<br/>${wp.i18n.__("Reason(s):")}`;
                        list.appendChild(item);

                        container.appendChild(list);

                        for (var i = 0; i < article.validation.length; i++) {
                            var item = document.createElement('li');

                            item.appendChild(document.createTextNode(wp.i18n.__(article.validation[i])));
                            list.appendChild(item);
                        }

                        node.appendChild(container);
                    }
                }
            }
        });
    }
});