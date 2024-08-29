import React from 'react';

function LinkExistingIcon(props) {
    const { className, title } = props;
    return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        className={className}
    >
        <title>{title}</title>
        <g fill="none" fillRule="evenodd">
            <path fill="#6C727E" d="M6 0h4v4H6z" />
            <path stroke="#6C727E" d="M8 2.257V13" />
            <path
                fill="#FFF"
                stroke="#6C727E"
                d="M.5 12.5h15v3H.5zm0-6h15v3H.5z"
            />
        </g>
    </svg>
    );
}

export default LinkExistingIcon;
