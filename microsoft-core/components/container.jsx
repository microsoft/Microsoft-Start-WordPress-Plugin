// © Microsoft Corporation. All rights reserved.

export default function Container({children, className}) {
    return (
        <div className="container">
            <div className={`mx-5 sm:mx-10 xl:mx-0 ${className || ''}`}>
                {children}
            </div>
        </div>
    );
}