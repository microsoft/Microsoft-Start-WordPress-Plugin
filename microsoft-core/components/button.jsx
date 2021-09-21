// © Microsoft Corporation. All rights reserved.

export default function DashboardWidget(args) {
    let { children, ...props } = args;

    return (
        <button {...props} className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded border-0 active:bg-blue-900">
                {children}
        </button>
    );
}
