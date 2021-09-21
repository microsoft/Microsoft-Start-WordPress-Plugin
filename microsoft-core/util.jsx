// © Microsoft Corporation. All rights reserved.

import { addFilter, applyFilters } from '@wordpress/hooks';
import { getPlugin, registerPlugin } from "@wordpress/plugins";

import Sidebar from "microsoft_core/sidebar.jsx";

export const registerSidebars = () => {
    const pluginName = 'microsoft-sidebar';
    if(getPlugin(pluginName)){
        return;
    }

    registerPlugin(pluginName, {
        render: props => {
            let panels = applyFilters('microsoft_editor_plugin', []);
            return (
                <>
                    <Sidebar />
                    {panels}
                </>
            );
        }
    });
}



/**
 * Takes an React component and appends it to a filter list on applyFilter. 
 * @param {string} hookName 
 * @param {string} namespace 
 * @param {any} component 
 */
export const addComponentFilter = (hookName, namespace, component) => {
    addFilter(hookName, namespace, (filterList) => {
        return [...filterList, component]
    });
}