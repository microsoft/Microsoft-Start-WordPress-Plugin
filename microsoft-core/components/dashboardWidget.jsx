// © Microsoft Corporation. All rights reserved.

export default function DashboardWidget({ className, children}) {
    return (
        <div className={`${className || ''} mb-5 p-8 bg-white border border-gray-300 rounded border-solid`}>
            {children}
        </div>
    );
}