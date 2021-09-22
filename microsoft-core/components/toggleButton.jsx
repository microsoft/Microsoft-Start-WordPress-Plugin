// © Microsoft Corporation. All rights reserved.

import classNames from 'classnames';

export default function ToggleButton({ value, onChange }) {

    var containerClasses = classNames({
        'w-8 h-5 flex items-center bg-gray-300 shadow-md border border-solid border-gray-300  rounded-full duration-300 ease-in-out': true,
        'bg-blue-400': value
    });

    var pillClasses = classNames({
        'bg-white w-5 h-5 rounded-full shadow-md border border-solid border-gray-300 transform duration-300 ease-in-out': true,
        'translate-x-4': value
    });

    return (
        <div className={containerClasses} onClick={() => { onChange(!value); }} >
            <div className={pillClasses} ></div>
        </div>
    );
}