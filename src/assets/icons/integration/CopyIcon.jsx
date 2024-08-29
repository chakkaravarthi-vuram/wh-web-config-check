import React from 'react';

function CopyIcon(props) {
    const { className, title, onClick } = props;
    return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 20 20"
        className={className}
        onClick={onClick}
    >
        <title>{title}</title>
        <g clipPath="url(#clip0_4227_5305)">
            <path
            stroke="#959BA3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.167 12.5h-.833a1.667 1.667 0 01-1.667-1.667v-7.5a1.667 1.667 0 011.667-1.666h7.5A1.667 1.667 0 0112.5 3.333v.834M9.167 7.5h7.5c.92 0 1.667.746 1.667 1.667v7.5c0 .92-.747 1.666-1.667 1.666h-7.5c-.92 0-1.667-.746-1.667-1.666v-7.5c0-.92.747-1.667 1.667-1.667z"
            />
        </g>
        <defs>
            <clipPath id="clip0_4227_5305">
                <path fill="#fff" d="M0 0H20V20H0z" />
            </clipPath>
        </defs>
    </svg>
    );
}

export default CopyIcon;
