import React from 'react';

function CheckIcon(props) {
    const { onClick, className, role, style, ariaLabel, buttonColor } = props;
    const color = buttonColor ?? '#217CF5';
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            role={role}
            aria-label={ariaLabel}
            onClick={onClick}
            style={{ ...style }}
        >
            <g id="Check">
                <path
                    d="M16.6668 5L7.50016 14.1667L3.3335 10"
                    stroke={color}
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
        </svg>
    );
}

export default CheckIcon;
