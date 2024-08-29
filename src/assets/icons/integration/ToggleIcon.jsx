import React from 'react';

function ToggleIcon(props) {
    const { className, title } = props;
    return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 20 20"
        className={className}
    >
        <title>{title}</title>
        <path
            stroke="#959BA3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.667"
            d="M13.333 4.167H6.666a5.833 5.833 0 100 11.666h6.667a5.833 5.833 0 000-11.666z"
        />
        <path
            stroke="#959BA3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.667"
            d="M13.333 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
        />
    </svg>
    );
}

export default ToggleIcon;
