import { NavLink, Route, Switch } from "react-router-dom";

import { Connection } from "./components/connection.jsx"
import { ContentSettings } from "./components/contentSettings.jsx"
import { Profile } from "./components/profile.jsx"
import React from 'react';
import { __ } from "@wordpress/i18n";

export function Settings() {
    return (
        <div class="bg-white border-solid border border-gray-300">
            <nav className="py-3.5 border-solid border-0 border-b border-gray-300">
                <ul className="flex m-0 items-center">
                    <li className="m-0 px-3.5" >
                        <NavLink exact to="/settings" className="text-black no-underline focus:shadow-none pb-3" activeClassName="border-b-2 border-0 border-solid border-microsoft font-bold">
                            {__("Connection")}
                        </NavLink >
                    </li>
                    <li className="px-3.5 m-0">
                        {msn_dashboard_render_status.enabled && (
                            <NavLink to="/settings/profile" className="text-black no-underline focus:shadow-none pb-3" activeClassName="border-b-2 border-0 border-solid border-microsoft font-bold">
                                {__('Account profile')}
                            </NavLink>
                        )}

                        {!msn_dashboard_render_status.enabled && (<span className="text-gray-300">{__('Account Profile')}</span>)}

                    </li>
                    <li className="px-3.5 m-0">
                        {msn_dashboard_render_status.enabled && (
                            <NavLink to="/settings/content" className="text-black no-underline focus:shadow-none pb-3" activeClassName="border-b-2 border-0 border-solid border-microsoft font-bold">
                                {__('Content Settings')}
                            </NavLink>
                        )}
                        {!msn_dashboard_render_status.enabled && (<span className="text-gray-300">{__('Content Settings')}</span>)}
                    </li>
                </ul>
            </nav>
            <Switch>
                <Route path="/settings" exact>
                    <Connection />
                </Route>
                <Route path="/settings/profile">
                    <Profile />
                </Route>
                <Route path="/settings/content">
                    <ContentSettings />
                </Route>
            </Switch>
        </div>
    );

}