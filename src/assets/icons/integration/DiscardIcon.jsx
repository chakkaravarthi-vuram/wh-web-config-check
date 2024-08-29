import React from 'react';

function DiscardIcon(props) {
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
            <g clipPath="url(#clip0_8889_28115)">
                <path
                fill="#9E9E9E"
                fillRule="evenodd"
                d="M10 2.5a7.5 7.5 0 100 15 7.5 7.5 0 000-15zM.833 10a9.167 9.167 0 1118.333 0A9.167 9.167 0 01.833 10zM6.91 6.91a.833.833 0 011.179 0l1.91 1.911 1.911-1.91a.833.833 0 011.179 1.178L11.179 10l1.91 1.91a.833.833 0 11-1.179 1.18L10 11.177 8.089 13.09a.833.833 0 11-1.179-1.178L8.821 10l-1.91-1.91a.833.833 0 010-1.18z"
                clipRule="evenodd"
                />
            </g>
            <defs>
                <clipPath id="clip0_8889_28115">
                    <path fill="#fff" d="M0 0H20V20H0z" />
                </clipPath>
            </defs>
        </svg>
    );
}

export default DiscardIcon;
