import React from 'react';

function AnotherFlowIcon(props) {
    const { className, title } = props;
    return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        fill="none"
        viewBox="0 0 32 32"
        className={className}
    >
        <title>{title}</title>
        <rect width="32" height="32" fill="#217CF5" rx="3" />
        <path stroke="#fff" strokeWidth="2" d="M8 7H16V15H8z" />
        <path stroke="#fff" strokeWidth="2" d="M18 19H24V25H18z" />
        <path fill="#fff" d="M11 16H13V22H11z" />
        <path
            fill="#fff"
            d="M17 20H19V26H17z"
            transform="rotate(90 17 20)"
        />
    </svg>
    );
}

export default AnotherFlowIcon;
