// © Microsoft Corporation. All rights reserved.

import { Join, Reconnect } from "./components/authentication.jsx";

import { DashboardWidget } from 'microsoft_core/components';
import { MSNDashboard } from './components/MSNDashboard.jsx';
import React from 'react';
import { WelcomeComponent } from "./components/welcomeComponent.jsx";

export function Content() {
    if (!msn_dashboard_render_status.profile || msn_dashboard_render_status.default) {
        return (<Join />);
    }
    else if (msn_dashboard_render_status.pending) {
        return (<>
            <WelcomeComponent />
            <MSNDashboard />
        </>);
    }
    else if (msn_dashboard_render_status.active) {
        return (<>
            <MSNDashboard />
        </>);
    }
    else if (msn_dashboard_render_status.disconnected) {
        return (<>
            <Reconnect />
        </>);
    }
    else {
        return (<DashboardWidget>
            Retrieving the MSN STATUS failed
        </DashboardWidget>);
    }
}
