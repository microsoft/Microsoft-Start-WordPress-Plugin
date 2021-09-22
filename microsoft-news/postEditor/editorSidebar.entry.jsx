// © Microsoft Corporation. All rights reserved.

import "./editorSidebar.scss";

import { addComponentFilter, registerSidebars } from "microsoft_core/util.jsx";

import NewsPanelBody from "./components/newsPanelBody.jsx"
import PostPublishPanel from "./components/PostPublishPanel.jsx"
import PrePublishPanel from "./components/PrePublishPanel.jsx"
import { ToggleControl } from "@wordpress/components"
import { __ } from "@wordpress/i18n";
import { addFilter } from '@wordpress/hooks';

const { Fragment } = wp.element;
const { InspectorAdvancedControls } = wp.editor;
const { createHigherOrderComponent } = wp.compose;

addComponentFilter( 'microsoft_sidebar_panels', 'microsoft-news', <NewsPanelBody /> );
addComponentFilter( 'microsoft_editor_plugin', 'microsoft-news', <PrePublishPanel /> );
addComponentFilter( 'microsoft_editor_plugin', 'microsoft-news', <PostPublishPanel /> );

/**
 * Add custom attribute for mobile visibility.
 * @param {Object} settings Settings for the block.
 * @return {Object} settings Modified settings.
 */
 function addAttributes(settings) {
    if (typeof settings.attributes !== 'undefined') {
        settings.attributes = Object.assign(settings.attributes, {
            pushToMsn: {
                type: 'boolean',
                default: true
            }
        })
    }
    return settings;
}

/**
 * Add mobile visibility controls on Advanced Block Panel.
 * @param {function} BlockEdit Block edit component.
 * @return {function} BlockEdit Modified block edit component.
 */
const withAdvancedControls = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        const {
            attributes,
            setAttributes,
            isSelected,
        } = props;

        const {
            pushToMsn,
        } = attributes;

        return (
            <Fragment>
                <BlockEdit{...props} />
                {
                    isSelected &&
                    <InspectorAdvancedControls>
                        <ToggleControl
                            label={__('Push To Msn')}
                            checked={!!pushToMsn}
                            onChange={() => setAttributes({ pushToMsn: !pushToMsn })}
                            help={() => pushToMsn ? __('Push block to MSN') : __('Do not push block to MSN ')}
                        />
                    </InspectorAdvancedControls>
                }
            </Fragment>
        );
    };
}, 'withAdvancedControls');

addFilter(
    'blocks.registerBlockType',
    'microsoft-news/custom-attributes',
    addAttributes
);

addFilter(
    'editor.BlockEdit',
    'microsoft-news/custom-advanced-control',
    withAdvancedControls
);

registerSidebars();