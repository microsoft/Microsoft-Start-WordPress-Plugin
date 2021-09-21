// © Microsoft Corporation. All rights reserved.

import React, { useState } from 'react';

import { Button } from "@wordpress/components"
import ConnectImage from './connectImage.jsx'
import { DashboardWidget } from 'microsoft_core/components'
import PopupMonitor from '@automattic/popup-monitor';
import { __ } from "@wordpress/i18n";

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

export function Join() {
    var [connecting, setConnecting] = useState(false);

    return (
        <DashboardWidget className="flex items-center">
            <div className="">
                <p className="text-2xl">{__("Grow your audience with Microsoft")}</p>
                <p className="mb-8">{__("You've been invited to join Microsoft Content Partner Network Program. With this new program, you can make your WordPress posts available to the millions of people who visit Microsoft News every day.")}</p>
                <Button isPrimary onClick={() => login(setConnecting)} >{!connecting ? __("Join now") : __("Connecting")}</Button>
            </div>
            <ConnectImage />
        </DashboardWidget>
    );
}

export function Reconnect() {
    var [connecting, setConnecting] = useState(false);

    return (
        <DashboardWidget className="flex items-center">
            <div className="">
                <p className="text-2xl">{__("You're Disconnected, Reconnect Again ")}</p>
                <p>{__("Your WordPress website is disconnected from your Microsoft Creator Center Account. Click 'Connect' below to sign into your Microsoft Account and connect your website.")}</p>
                <Button isPrimary onClick={() => login(setConnecting)} >{!connecting ? __("Reconnect") : __("Connecting")}</Button>
            </div>
            <ConnectImage />
        </DashboardWidget>
    );
}
