// © Microsoft Corporation. All rights reserved.

export default function AzureDashboardWidget({ className, children}) {
    return (
        <div className={`${className || ''} mb-5 bg-white border border-gray-300 rounded border-solid`}>
            {children}
        </div>
    );
}