import React from 'react';

function Plus(props) {
    const { buttonColor, className } = props;
    const color = buttonColor ?? '#217CF5';
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none">
            <path
                fill={color}
                fillRule="evenodd"
                d="M8 2.667c.368 0 .666.298.666.666v4h4a.667.667 0 1 1 0 1.334h-4v4a.667.667 0 1 1-1.333 0v-4h-4a.667.667 0 0 1 0-1.334h4v-4c0-.368.299-.666.667-.666Z"
                clipRule="evenodd"
            />
        </svg>
    );
}
export default Plus;
