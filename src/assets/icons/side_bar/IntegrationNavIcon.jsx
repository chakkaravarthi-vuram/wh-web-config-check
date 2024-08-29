import React from 'react';

function IntegrationNavIcon(props) {
    const { className, title } = props;
    return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="20"
        fill="none"
        viewBox="0 0 21 20"
        className={className}
    >
        <title>{title}</title>
        <g
            stroke="#9E9E9E"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            clipPath="url(#clip0_2960_15794)"
        >
            <path d="M1.682 4.333c0-.933 0-1.4.182-1.756.16-.314.415-.569.728-.729.357-.181.823-.181 1.757-.181h6.332c.934 0 1.4 0 1.757.181.314.16.569.415.728.729.182.356.182.823.182 1.756v6.334c0 .933 0 1.4-.182 1.756-.16.314-.414.569-.728.729-.357.181-.823.181-1.757.181H4.35c-.934 0-1.4 0-1.757-.181a1.667 1.667 0 01-.728-.729c-.182-.356-.182-.823-.182-1.756V4.333z" />
            <path d="M6.682 9.333c0-.933 0-1.4.181-1.756.16-.314.415-.569.729-.729.356-.181.823-.181 1.756-.181h6.333c.934 0 1.4 0 1.757.181.313.16.568.415.728.729.182.356.182.823.182 1.756v6.334c0 .933 0 1.4-.182 1.756-.16.314-.415.569-.728.729-.357.181-.823.181-1.757.181H9.348c-.933 0-1.4 0-1.756-.181a1.667 1.667 0 01-.729-.729c-.181-.356-.181-.823-.181-1.756V9.333z" />
        </g>
        <defs>
            <clipPath id="clip0_2960_15794">
            <path
                fill="#fff"
                d="M0 0H19.998V20H0z"
                transform="translate(.016)"
            />
            </clipPath>
        </defs>
    </svg>
    );
}

export default IntegrationNavIcon;
