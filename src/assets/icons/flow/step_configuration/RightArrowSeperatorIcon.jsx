import React from 'react';

function RightArrowSeperatorIcon(props) {
    const { className, title } = props;
    return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 16 16"
        className={className}
    >
        <title>{title}</title>
            <path
                stroke="#959BA3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.3"
                d="M3.333 8h9.334m0 0L8 3.333M12.666 8L8 12.667"
            />
    </svg>
    );
}

export default RightArrowSeperatorIcon;
