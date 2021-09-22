// © Microsoft Corporation. All rights reserved.

import React, { useEffect, useState } from 'react';

export function MSNDashboard() {
    var [token, setToken] = useState(null);

    useEffect(() => {
        let fetchOptions = {
            headers: {
                "Content-Type": "application/json",
                'X-WP-Nonce': wpApiSettings.nonce
            }
        };

        fetch("/?rest_route=/microsoft/v1/token", fetchOptions)
            .then(response => response.json())
            .then((data) => {
                setToken(data.token);
            });
    }, []);

    useEffect(() => {
        if(token) {
            const script = document.createElement('script');
            script.src = "https://assets.msn.com/staticsb/statics/latest/ugc/js/renderComponent.js";
            script.async = true;
            document.body.appendChild(script);

            return () => {
              document.body.removeChild(script);
            }
        }

    }, [token]);

    return (
        <div className="mscreator-iframe-container bg-white border border-gray-300 rounded border-solid" data-env="prod" data-component="dashboard" data-token={token}>

        </div>
    );

}