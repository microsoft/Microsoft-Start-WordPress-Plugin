// © Microsoft Corporation. All rights reserved.

import { PluginPostPublishPanel } from '@wordpress/edit-post';
import { __ } from "@wordpress/i18n";
import { withSelect } from '@wordpress/data';

const PostPublishPanel = ({meta}) => {
    const { msn_id, MSN_Markets } = meta;

    if (msn_id) {
        return (
            <PluginPostPublishPanel>
                <a href={`https://www.msn.com/${MSN_Markets}/creator/management/content/article`} target="_blank">{__("View Post in Microsoft")}</a>
            </PluginPostPublishPanel>
        )
    }

    return null;
};

export default withSelect(select => ({
        meta: select('core/editor').getEditedPostAttribute('meta') || {},
    }))(PostPublishPanel);