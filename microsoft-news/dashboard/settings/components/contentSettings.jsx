// © Microsoft Corporation. All rights reserved.

import { Button, FormToggle } from '@wordpress/components';
import React, { useEffect, useState } from 'react';

import { __ } from "@wordpress/i18n";
import {categories} from "../../../postEditor/categories.jsx"
import { languages } from "../../../postEditor/msnLanguages.jsx"

function setGlobal(selection) {
    let fetchOptions = {
        method: "POST",
        headers: {
            'Content-Type': "application/json",
            'X-WP-Nonce': wpApiSettings.nonce
        },
        body: JSON.stringify(selection),
    }
    fetch("/?rest_route=/microsoft/v1/publish-settings", fetchOptions);
}
export const ContentSettings = function () {
    let languageDictionary = languages.reduce((languages, country) => { languages[country.value] = country; return languages }, {});
    let categoryList = Object.entries(categories).map(pair => <option value={pair[1]}>{pair[0]}</option>);

    const [language, setLanguage] = useState();
    const [category, setCategory] = useState();
    const [market, setMarket] = useState();
    const [option, setOption] = useState();
    const [showNotice, setNotice] = useState(0);

    useEffect(() => {
        fetch('/?rest_route=/microsoft/v1/publish-settings', { headers: { 'X-WP-Nonce': wpApiSettings.nonce } })
            .then(response => response.json())
            .then((response) => {
                setLanguage(response.language);
                setMarket(response.market);
                setOption(response.option);
                setCategory(response.category)
            })
    }, []);

    return (
        <div className="w-auto p-7">
            {showNotice == 201 &&
                <div class="notice notice-success settings-error">
                    <p>
                        <strong>{__("Settings Saved.")}</strong>
                    </p>
                </div>
            }

            {showNotice == 500 &&
                <div class="notice notice-error settings-error">
                    <p>
                        <strong>{__("Something went wrong.")}</strong>
                    </p>
                </div>
            }

            <h2 className="m-0 mt-0">{__("Default Publish Setting:")}</h2>
            <p className="mb-8">
                {__('These settings help Microsoft Creator Centre target your content to the right audiences. Configuring your default settings will save you time when publishing your content.')}
            </p>


            <div className="inline-block">
                <div className="flex">
                    <label className="font-bold">{__("Automatically publish new posts to MSN")}</label>
                    <div className="ml-auto">
                        <FormToggle checked={option} onChange={() => setOption(!option)} />
                    </div>
                </div>

                <div>
                    <label className="block font-bold mt-10">{__("Default Category:")}</label>
                    <select className="w-80" name="categories" id="categories" value={category}  disabled={!category} onChange={(e)=>{
                        setCategory(e.target.value)
                    }}>
                        {categoryList}
                    </select>
                </div>

                <div>
                    <label className="block font-bold mt-5">{__('Default Language:')}</label>

                    <select className="w-80" name="languages" id="languages" value={language}  disabled={!language} onChange={(e) => {
                        setLanguage(e.target.value);
                        setMarket(languageDictionary[e.target.value].markets[0].value);
                    }
                    }>
                        {languages.map(language => <option value={language.value}>{__(language.name)}</option>)}
                    </select >
                </div>


                <div>
                    <label className="block font-bold mt-5">{__("Default Market:")}</label>
                    {languageDictionary && (
                        <select className="w-80" name="markets" id="markets" value={market}  disabled={!language} onChange={(e) => setMarket(e.target.value)}>
                            {(language && languageDictionary[language].markets || []).map(market => <option value={market.value}>{__(market.name)}</option>)}
                        </select>
                    )}
                </div>


                <div className="mt-3">
                    <Button className="px-8" isPrimary onClick={() => setGlobal({ language, market, option, category })}>
                        {__("Save Changes")}
                    </Button>
                </div>
            </div>
        </div>
    )

    function setGlobal(selection) {
        let fetchOptions = {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                'X-WP-Nonce': wpApiSettings.nonce
            },
            body: JSON.stringify(selection),
        }

        let data = fetch("/?rest_route=/microsoft/v1/publish-settings", fetchOptions)
            .then(function (result) {
                if (result['status'] === 201) {
                    setNotice(201);
                }
                else {
                    setNotice(500);
                }
            });
    }
}