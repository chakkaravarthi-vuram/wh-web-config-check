import React from 'react';

function BranchParallelIcon(props) {
    const { className, title } = props;
    return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="20"
        viewBox="0 0 16 16"
        className={className}
    >
        <title>{title}</title>
        <g fill="none" fillRule="evenodd">
            <path fill="#6C727E" d="M6 0h4v4H6z" />
            <path stroke="#6C727E" d="M8 2.257V13m-6 0V7.018h12V13" />
            <path
                fill="#FFF"
                stroke="#6C727E"
                d="M.5 12.5h3v3h-3zm6 0h3v3h-3zm6 0h3v3h-3z"
            />
        </g>
    </svg>
    );
}

export default BranchParallelIcon;
