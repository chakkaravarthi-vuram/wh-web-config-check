import React from 'react';

function MLModelIcon(props) {
    const { className,
        // title
    } = props;
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <g clipPath="url(#clip0_27055_41699)">
                <path
                stroke="#9E9E9E"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.6"
                d="M3.75 18.333v-4.166m0-8.334V1.666M1.667 3.75h4.166m-4.167 12.5h4.167m5-13.75L9.388 6.257c-.235.611-.352.917-.535 1.174a2.5 2.5 0 01-.589.588c-.257.183-.562.3-1.173.536L3.333 10l3.758 1.445c.61.235.916.352 1.173.535.228.162.427.361.589.589.183.257.3.562.535 1.173l1.445 3.758 1.445-3.758c.235-.61.353-.916.536-1.173a2.5 2.5 0 01.588-.589c.257-.183.563-.3 1.174-.535L18.333 10l-3.757-1.445c-.611-.235-.917-.353-1.174-.536a2.498 2.498 0 01-.588-.588c-.183-.257-.3-.563-.536-1.174L10.833 2.5z"
                />
            </g>
            <defs>
                <clipPath id="clip0_27055_41699">
                <path fill="#fff" d="M0 0H20V20H0z" />
                </clipPath>
            </defs>
        </svg>
    );
}

export default MLModelIcon;
