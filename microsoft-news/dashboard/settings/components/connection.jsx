// © Microsoft Corporation. All rights reserved.

import { Button } from "@wordpress/components"
import CreatorCentreImage from "./creator-centre.png"
import InsightsImage from "./insights.png"
import { MicrosoftLogo } from 'microsoft_core/icons.jsx'
import PopupMonitor from '@automattic/popup-monitor';
import { __ } from "@wordpress/i18n";
import { useHistory } from "react-router-dom";
import { useState } from 'react';

function login(setStatus) {

    const popupMonitor = new PopupMonitor();

    if(setStatus) {
        setStatus(true);
        popupMonitor.on( 'close', () => setStatus(false));
    }

    const w = 910;
    const h = 720;
    const y = window.top.outerHeight / 2 + window.top.screenY - (h / 2);
    const x = window.top.outerWidth / 2 + window.top.screenX - (w / 2);

    popupMonitor.open('/?rest_route=/microsoft/v1/connect', "my-popup", `width=${w},height=${h},top=${y},left=${x},toolbar=0,location=0,status=0,menubar=0`)
}

export function Connection() {
    const history = useHistory();
    var [connecting, setConnecting] = useState(false);

    function clear_token() {
        fetch("/?rest_route=/microsoft/v1/delete-token", { method: "POST", headers: { 'X-WP-Nonce': wpApiSettings.nonce } })
            .then(() => {
                history.push("/")
                location.reload();
            });
    }

    return (
        <div>
            <div className="p-7 border-b border-0 border-solid border-gray-300">
                <h2 className="m-0 mb-1">{__("Connection")}</h2>
                <p className="m-0 text-gray-600">{__("Share your content to the Microsoft Creator Centre automatically when publishing. Connect with your Microsoft Account to start sharing.")}</p>
            </div>
            <div className="flex items-center p-7">
                {!msn_dashboard_render_status.profile && (
                    <>
                        {MicrosoftLogo(40,40)}
                        <div className="flex-grow ml-3">
                            <h2 className="m-0">{__("Microsoft")}</h2>
                            {__("Share posts to your Microsoft News feed")}
                        </div>
                        <Button className="px-8" isSecondary onClick={() => login(setConnecting)}>{!connecting ? __("Connect") : __("Connecting")}</Button>
                    </>
                )}
                {msn_dashboard_render_status.profile && (
                    <>
                        <img className="w-20 rounded-full" src={msn_dashboard_render_status.profile.avatar}  width={80} height={80} />
                        <div className="flex-grow ml-3">
                            <h2 className="m-0">{msn_dashboard_render_status.profile.name}</h2>
                            <a
                                href={'/?rest_route=/microsoft/v1/bounce/setting/account-profile'}
                                target="_blank"
                            >
                                {__("Edit Profile")}
                            </a>
                        </div>
                        <Button className="px-8" isSecondary onClick={clear_token}>{__("Disconnect")}</Button>
                    </>
                )}
            </div>
            
            {!msn_dashboard_render_status.profile && (
                <div className="md:flex overflow-hidden border-t border-0 border-solid border-gray-300">
                    <div className="md:w-1/2 m-6">
                        <img src={InsightsImage} className="w-full block mb-2" />
                        {__('Grow your reach and get paid while doing it. Connect to the power of the Microsoft News Network.')}
                    </div>
                    <div className="md:w-1/2 m-6  md:ml-0">
                        <img src={CreatorCentreImage} className="w-full block mb-2" />
                        {__('Get detailed performance insights.')}
                    </div>
                </div>
            )}
        </div>
    );
}