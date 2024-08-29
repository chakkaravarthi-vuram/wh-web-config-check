import React from 'react';

function GreenTickCircleIcon(props) {
    const { className, title } = props;
    return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        className={className}
    >
        <title>{title}</title>
        <path
            fill="#039855"
            fillRule="evenodd"
            d="M0 12c0 6.63 5.37 12 12 12s12-5.37 12-12S18.63 0 12 0 0 5.37 0 12zm16.935-4.065a1.504 1.504 0 012.13 2.13l-7.5 7.5c-.27.27-.645.435-1.065.435-.42 0-.795-.165-1.065-.435l-4.5-4.5a1.504 1.504 0 012.13-2.13l3.435 3.45 6.435-6.45z"
            clipRule="evenodd"
        />
    </svg>
    );
}

export default GreenTickCircleIcon;
