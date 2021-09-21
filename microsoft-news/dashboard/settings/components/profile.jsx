import React from 'react';
import { __ } from "@wordpress/i18n";

export const Profile = function () {
    if(!msn_dashboard_render_status.profile) {
        return <span>Error loading account details</span>;
    }

    return (
        <div className="w-auto p-7">
            <div>
                <h2 className="m-0 mb-1">{__("Profile")}</h2>
                <p className="m-0 mb-2 text-gray-600">{__("Configure your publish profile in the Microsoft Creator Centre.")}</p>
            </div>
            <div className="flex justify-center max-w-sm mt-5">
                <figure>
                    <img className="mx-auto rounded-full" src={msn_dashboard_render_status.profile.avatar}  width={120} height={120} />
                    <figcaption className="text-center"><a href={'/?rest_route=/microsoft/v1/bounce/setting/account-profile'} target="_blank">{__('Edit Profile')}</a></figcaption>
                </figure>
            </div>
            <div>
                <label className="block font-bold mt-3">{__('Name')}</label>
                <p>{msn_dashboard_render_status.profile.name}</p>
            </div>

            <div>
                <label className="block font-bold mt-3">{__("Description")}</label>
                <p>{msn_dashboard_render_status.profile.introduction}</p>
            </div>

        </div>
    )
}