// © Microsoft Corporation. All rights reserved.

import { PluginPostPublishPanel } from '@wordpress/edit-post';
import { __ } from "@wordpress/i18n";
import { withSelect } from '@wordpress/data';

const PostPublishPanel = ({meta}) => {
    const { msn_id } = meta;

    if (msn_id) {
        return (
            <PluginPostPublishPanel>
                <a href={`https://www.msn.com/en-us/creator/management/content/article`} target="_blank">{__("View Post in Microsoft")}</a>
            </PluginPostPublishPanel>
        )
    }

    return null;
};

export default withSelect(select => ({
        meta: select('core/editor').getEditedPostAttribute('meta') || {},
    }))(PostPublishPanel);