// © Microsoft Corporation. All rights reserved.

import { DashboardWidget } from 'microsoft_core/components'
import { __ } from "@wordpress/i18n";

export function Payment() {
    return (
        <DashboardWidget className = 'p-6 m-0 mb-0'>
            <p className="text-gray-400 m-0 p-0">
                {__("Microsoft shares revenue with content creators if they qualify. Visit these Microsoft sites for more information ")}

            </p>
            <ul className = "h-36 p-0 mt-6">
                <li className="flex border-b border-gray-300 border-solid border-0 py-2 m-0 pb-0">
                    <div className="flex-grow pb-4">
                        <p className="font-bold  mt-0 mb-1">{__("Payment Central ")}</p>
                        {__("Manage your account and profile to receive payments ")}
                    </div>
                    <a href="https://paymentcentral.microsoft.com/" target="_blank" className="whitespace-nowrap no-underline">
                        {__("Go to site ")}
                    </a>
                </li>
                <li className="flex  py-2 pt-0">
                    <div className="flex-grow pt-4">
                        <p className="font-bold mt-0 mb-1">{__("Royalty Statements")}</p>
                        {__("If you have royalty statements from Microsoft, they will appear here ")}
                    </div>
                    <a href="https://royalty.microsoft.com/" target="_blank" className="whitespace-nowrap  no-underline self-end">
                        {__("Check Statement")}
                    </a>
                </li>
            </ul>
        </DashboardWidget>
    );
}