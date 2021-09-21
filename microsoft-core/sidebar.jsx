// © Microsoft Corporation. All rights reserved.

import { PluginSidebar, PluginSidebarMoreMenuItem } from "@wordpress/edit-post";

import { MicrosoftLogo } from 'microsoft_core/icons.jsx';
import { __ } from "@wordpress/i18n";
import { applyFilters } from '@wordpress/hooks';

const Sidebar = props => {
    let sidebarPanels = applyFilters('microsoft_sidebar_panels', []);
    return (
        <>
            <PluginSidebarMoreMenuItem target="Microsoft Sidebar" icon={MicrosoftLogo(28, 28)}>
                {__('Microsoft')}
            </PluginSidebarMoreMenuItem>
            <PluginSidebar name="Microsoft Sidebar" icon={MicrosoftLogo(28, 28)} title={__('Microsoft')} isPinnable={true}>
                {sidebarPanels}
            </PluginSidebar>
        </>
    );
}

export default Sidebar;
 