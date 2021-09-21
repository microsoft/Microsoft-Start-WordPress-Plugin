// © Microsoft Corporation. All rights reserved.

import "./dashboard.scss";

import { NavLink, Route, HashRouter as Router, Switch } from "react-router-dom";

import { Container } from 'microsoft_core/components'
import { Content } from './content/content.jsx';
import { MicrosoftLogo } from 'microsoft_core/icons.jsx'
import { Monetization } from "./monetization/monetization.jsx"
import { Payment } from "./payment/payment.jsx"
import React from 'react';
import ReactDOM from 'react-dom';
import { Settings } from "./settings/settings.jsx"
import { __ } from "@wordpress/i18n";

function AdminDashboard() {
    return (
        <Router>
            <div className="-ml-5">
                <header className="bg-white p-5 py-3">
                    <Container className="flex items-center flex-wrap">
                        {MicrosoftLogo(28, 28)}
                        <h3 className="m-0 ml-1 md:ml-3 whitespace-nowrap">
                            {__("Microsoft Publisher Dashboard")}
                        </h3>
                        <a href="/?rest_route=/microsoft/v1/bounce" target="_blank" className="font-bold sm:ml-auto">
                            {__("Microsoft Content Partner Center")} <span class="dashicons dashicons-external no-underline"></span>
                        </a>
                    </Container>
                </header>
                
                <nav className="py-1.5 pl-10 pr-5 bg-white border-solid border border-l-0 border-r-0 border-gray-300" id="tour-nav-01">
                    <Container>
                        <ul className="flex m-0 items-center h-9">
                            <li className="mr-6 m-0" >
                                <NavLink id="content-navi" exact to="/" className="text-black no-underline focus:shadow-none" activeClassName="border-b-2 border-0 border-solid border-microsoft font-bold">
                                    {__("Content")}
                                </NavLink >
                            </li>
                            <li className="mr-6 m-0">
                                <NavLink to="/payments" className="text-black no-underline focus:shadow-none" activeClassName="border-b-2 border-0 border-solid border-microsoft font-bold">{__('Payments')}</NavLink>                                
                            </li>
                            <li className="mr-6 m-0">
                                <NavLink to="/monetization" className="text-black no-underline focus:shadow-none" activeClassName="border-b-2 border-0 border-solid border-microsoft font-bold">{__('Monetization')}</NavLink>                                
                            </li>
                            <li className="mr-6 m-0">
                                <NavLink to="/settings" className="text-black no-underline focus:shadow-none" activeClassName="border-b-2 border-0 border-solid border-microsoft font-bold">{__('Settings')}</NavLink>
                            </li>
                            {msn_dashboard_render_status.profile && (
                                <li className="ml-auto m-0 flex items-center">
                                    <span className="mr-3 font-semibold">Hi, {msn_dashboard_render_status.profile.name}</span>
                                    <NavLink className="no-underline focus:shadow-none" exact to="/settings/profile" >
                                        <img className="rounded-full w-8" src={msn_dashboard_render_status.profile.avatar} width={32} height={32} />
                                    </NavLink >
                                </li>
                            )}
                        </ul>
                    </Container>
                </nav>

                <div className="flex flex-col">
                    <Switch>
                        <Route path="/" exact>
                            <Container>
                                <h1 className="mt-5 mb-2.5 text-xl" id="tour-nav-02">{__("Content")}</h1>
                                <Content />
                            </Container>
                        </Route>
                        <Route path="/payments">
                            <Container>
                                <h1 className="mt-5 mb-2.5 text-xl">{__("Payments")}</h1>
                                <Payment />
                            </Container>
                        </Route>
                        <Route path="/monetization">
                            <Container>
                                <h1 className="mt-5 mb-2.5 text-xl">{__("Monetization")}</h1>
                                <Monetization />
                            </Container>
                        </Route>
                        <Route path="/settings">
                            <Container>
                                <h1 className="mt-5 mb-2.5 text-xl">{__("Settings")}</h1>
                               <Settings />
                            </Container>
                        </Route>
                    </Switch>
                </div>
            </div>
        </Router>
    );
}

var root = document.getElementById('msn-dashboard');
if (root !== null) {
    ReactDOM.render(
        <div>
            <AdminDashboard />
        </div>, root);
}