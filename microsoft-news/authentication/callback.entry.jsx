// © Microsoft Corporation. All rights reserved.

import "./callback.scss";

import { Button, Spinner } from "@wordpress/components"
import React, { useEffect } from 'react';
import { Route, HashRouter as Router, Switch, useParams } from "react-router-dom";

import ReactDOM from 'react-dom';
import { __ } from "@wordpress/i18n";

function SaveToken() {
    let { token } = useParams();

    useEffect(() => {
        let fetchOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'X-WP-Nonce': wpApiSettings.nonce
            },
            body: JSON.stringify({
                token: token
            })
        };

        fetch("/?rest_route=/microsoft/v1/token", fetchOptions)
            .then(() => {
                if (window.opener) {
                    window.opener.location.reload();
                    window.close();
                } else {
                    window.location = window.location.href.substr(0, window.location.href.indexOf('#'));
                }
            });
    }, [token]);

    return <Spinner />;
}

function RedeemCode() {
    let { redeemCode, sharePastPosts, sharePastPostsStartDate } = useParams();

    useEffect(() => {
        let fetchOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'X-WP-Nonce': wpApiSettings.nonce
            },
            body: JSON.stringify({
                redeemCode,
                sharePastPosts,
                sharePastPostsStartDate
            })
        };

        fetch("/?rest_route=/microsoft/v1/redeemCode", fetchOptions)
            .then(() => {
                if (window.opener) {
                    window.opener.location.reload();
                    window.close();
                } else {
                    window.location = window.location.href.substr(0, window.location.href.indexOf('#'));
                }
            });
    }, [redeemCode, sharePastPosts, sharePastPostsStartDate]);

    return <Spinner />;
}

function DebugRoute() {
    var params = useParams();
    return (
        <div className="flex items-center justify-center flex-col p-20 fixed top-0 bottom-0 left-0 right-0 bg-white">
            <span className="m-2">
                {params.errorMessage}
            </span>
            <Button isPrimary onClick={() => window.close()}>Close</Button>
        </div>
    );
}

function Callback() {
    return (
        <div className="fixed top-0 bottom-0 left-0 right-0 bg-white">
            <Router>
                <Switch>
                    <Route path="/token=:token">
                        <SaveToken />
                    </Route>
                    <Route path={[
                            '/redeem_code=:redeemCode&share_past_posts=:sharePastPosts&share_past_posts_start_date=:sharePastPostsStartDate',
                            '/redeem_code=:redeemCode&share_past_posts=:sharePastPosts'
                        ]}>
                        <RedeemCode />
                    </Route>
                    <Route path="/error_code=:errorCode&error_message=:errorMessage">
                        <DebugRoute />
                    </Route>
                    <Route path="*">
                        Unknown Route
                        <DebugRoute />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

var root = document.getElementById('msn-callback');
if (root !== null) {
    ReactDOM.render(<Callback />, root);
}
