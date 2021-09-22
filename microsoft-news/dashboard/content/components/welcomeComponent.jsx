// © Microsoft Corporation. All rights reserved.

import { __, _e } from "@wordpress/i18n";

import { DashboardWidget } from 'microsoft_core/components'

export const WelcomeComponent = function () {

    if(!msn_dashboard_render_status.profile) {
        return <span>Error loading account details</span>;
    }

    return (
        <DashboardWidget>
            <div className="flex">
                <div id='text' className="flex-auto">
                    <h1 className="leading-none">{__("Congrats, ")} {msn_dashboard_render_status.profile.name}</h1>
                    <p>
                        {__("We're happy to have you as part of the Microsoft Content Partner Network Program.")} <br />
                        {__("Once your profile is approved you can start posting.")}
                    </p>
                </div>
                <div id="profile" className="relative" >
                    <img className="rounded-full" src={msn_dashboard_render_status.profile.avatar} alt="" width="80" height="80" />
                    <figcaption className="text-center">
                        <a
                            href="https://account.microsoft.com/profile/"
                            target="_blank"
                        >
                            {__("Edit Profile")}
                        </a>
                    </figcaption>
                    <div className="absolute w-10 h-10 bg-yellow-300 rounded-full top-14 -right-3 border-2 border-white border-solid group justify-center flex items-center">
                        <div className="bg-gray-300 -top-3 px-2 py-1 absolute whitespace-nowrap text-center font-bold rounded-2xl border-2 border-black opacity-0 group-hover:opacity-90">Pending Review</div>
                        <span className="text-white text-2xl h-12">&hellip;</span>
                    </div>
                </div>
            </div>
        </DashboardWidget>
    )
}