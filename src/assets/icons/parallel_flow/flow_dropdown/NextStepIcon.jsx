import React from 'react';

function NextStepIcon(props) {
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
        <g fill="none" fillRule="evenodd" stroke="#6C727E">
            <path d="M8 14V2" />
            <path
                fill="#FFF"
                d="M.5 12.5h15v3H.5zm0-6h15v3H.5zm0-6h15v3H.5z"
            />
        </g>
    </svg>
    );
}

export default NextStepIcon;
