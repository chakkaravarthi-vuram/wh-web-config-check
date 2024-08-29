import React from 'react';

function JoinParallelIcon(props) {
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
            <path fill="#6C727E" d="M6 16h4v-4H6z" />
            <path stroke="#6C727E" d="M8 13.743V3M2 3v5.982h12V3" />
            <path
                fill="#FFF"
                stroke="#6C727E"
                d="M.5 3.5h3v-3h-3zm6 0h3v-3h-3zm6 0h3v-3h-3z"
            />
        </g>
    </svg>
    );
}

export default JoinParallelIcon;
