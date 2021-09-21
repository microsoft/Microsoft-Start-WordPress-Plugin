// © Microsoft Corporation. All rights reserved.

import { __ } from "@wordpress/i18n";

export const NewsSelector = ({name, title, value, children, onChange, ...props}) => {
    return <div className="w-full">
        <label className="block mb-1">{title}</label>
        <select className="w-full" name={name} id={name} onChange={(e) => onChange(e.target.value)} value={value}>
            {children}
        </select>
    </div>
}