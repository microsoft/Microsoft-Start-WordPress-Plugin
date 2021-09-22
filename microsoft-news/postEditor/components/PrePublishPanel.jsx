// © Microsoft Corporation. All rights reserved.

import NewsPanelBody from "./newsPanelBody.jsx"
import { PluginPrePublishPanel } from '@wordpress/edit-post';
import { __ } from "@wordpress/i18n";

const PrePublishPanel = props => {
    return (
        <PluginPrePublishPanel>
            <NewsPanelBody />
        </PluginPrePublishPanel>
    );
};

export default PrePublishPanel;
