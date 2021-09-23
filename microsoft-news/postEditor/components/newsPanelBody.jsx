// © Microsoft Corporation. All rights reserved.

import { FormToggle, PanelBody, PanelRow } from "@wordpress/components";
import { PostExcerpt, PostFeaturedImage, PostTaxonomies } from '@wordpress/editor';
import React, { useEffect } from 'react';
import { withDispatch, withSelect } from '@wordpress/data';

import { NewsSelector } from './selector.jsx';
import { __ } from "@wordpress/i18n";
import { categories } from "../categories.jsx"
import classNames from 'classnames';

const NewsPanelBody = ({ meta, visibility, editPost, ...props }) => {
    const { MSN_Location, MSN_Categories, MSN_Publish_Option, msn_id } = meta;

    const setCategory = (value) => editPost({ meta: { MSN_Categories: value } });
    const setOption = (value) => editPost({ meta: { MSN_Publish_Option: value } });
    const setLocation = (value) => editPost({ meta: { MSN_Location: value } });
    let categoryList = Object.entries(categories).map(pair => <option value={pair[1]}>{pair[0]}</option>);

    let parsedLocationData = {};
    if(MSN_Location) {
        parsedLocationData = JSON.parse(MSN_Location);
    }
    const { geo, address } = parsedLocationData;
    
    useEffect(() => {
            const script = document.createElement('script');
            script.src = "https://assets.msn.com/staticsb/statics/latest/ugc/js/renderComponent.js";
            script.async = true;
            document.body.appendChild(script);

            return () => {
              document.body.removeChild(script);
            }
    }, []);

    const activateSideBar = classNames({
        "opacity-50 pointer-events-none": !MSN_Publish_Option,
    });

    let panelRows = null
    if (msn_sidebar_settings.enabled === 'false') {
        panelRows = (
            <PanelRow>
                <div>
                    <p><b className="text-red-500">{__("MSN connection needs to setup before being used.")}</b></p>
                </div>
            </PanelRow>
        );
    }

    else if (visibility == 'private' || visibility == "password") {
        panelRows = (
            <PanelRow>
                <div>
                    <p><b> {__("Settings Unavailable (Visibility set to" + visibility)}</b></p>
                </div>
            </PanelRow>
        );
    }

    else {
        panelRows = (
            <>
                <PanelRow>
                    <label>{__('Share')}</label>
                    <FormToggle checked={MSN_Publish_Option} onChange={() => setOption(!MSN_Publish_Option)} />
                </PanelRow>

                <div className={activateSideBar}>

                    <div className="pb-5">
                        <strong>{__("Microsoft content settings")}</strong>

                        <PanelRow>
                            <div className="w-full">
                                <label className="block mb-1">
                                    {__('Content image')}
                                </label>
                                <PostFeaturedImage />
                            </div>
                        </PanelRow>
                        <PanelRow>
                            <PostExcerpt />
                        </PanelRow>
                    </div>
                    <div className="pb-5">
                        <PanelRow>
                            <NewsSelector name='categories' title={__('Category')} onChange={setCategory} value={MSN_Categories}>
                                {__(categoryList)}
                            </NewsSelector>
                        </PanelRow>
                        <PanelRow>
                            <PostTaxonomies taxonomyWrapper={(content, taxonomy) => {
                                if (taxonomy.slug !== 'post_tag') {
                                    return null;
                                }
                                return content;
                            }} />
                        </PanelRow>
                    </div>
                    <div className="pb-5">
                        {__(MSN_Location) && (
                        <PanelRow>
                            <div className="w-full">
                                <label className="block mb-1">{'Location'}</label>
                                <iframe id="locationSelector" src={`https://int.msn.com/en-us/creator/embed/locationSelector?locality=${address.addressLocality}&region=${address.addressRegion}&subRegion=${address.addressSubregion}&country=${address.addressCountry}&latitude=${geo.latitude}&longitude=${geo.longitude}`}></iframe>
                                <input id="locationSelectorInput" onClick={(e) => setLocation(e.target.value)} value={MSN_Location} type="hidden"/>
                            </div>
                        </PanelRow>
                        )}
                        {__(!MSN_Location) && (
                        <PanelRow>
                            <div className="w-full">
                                <label className="block mb-1">{'Location'}</label>
                                <iframe id="locationSelector" src={'https://int.msn.com/en-us/creator/embed/locationSelector'}></iframe>
                                <input id="locationSelectorInput" onClick={(e) => setLocation(e.target.value)} value={MSN_Location} type="hidden"/>
                            </div>
                        </PanelRow>
                        )}
                    </div>
                </div>

                {msn_id && (
                    <PanelRow>
                        <a href={`https://www.msn.com/en-us/creator/management/content/article`} target="_blank">{__("View Post in Microsoft")}</a>
                    </PanelRow>
                )}
            </>
        );
    }

    return (
        <PanelBody title={__('Share this post to Microsoft')} className="msn-sidebar" >
            {panelRows}
        </PanelBody>
    );
};

export default withDispatch(dispatch => ({
    editPost: dispatch('core/editor').editPost
}))(
    withSelect(select => ({
        meta: select('core/editor').getEditedPostAttribute('meta') || {},
        visibility: select('core/editor').getEditedPostVisibility(),
    }))
        (NewsPanelBody)
);
