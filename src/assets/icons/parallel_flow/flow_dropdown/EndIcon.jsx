import React from 'react';

function EndIcon(props) {
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
            <path stroke="#6C727E" d="M8 2.257V13" />
            <path fill="#FFF" stroke="#6C727E" d="M.5 7.5h15v8H.5z" />
            <path
                fill="#6C727E"
                fillRule="nonzero"
                d="M4 12.91V10h1.96v.507H4.615v.693H5.86v.507H4.615v.695h1.35v.507zM9.284 10v2.91h-.532l-1.265-1.832h-.022v1.831H6.85V10h.54l1.256 1.83h.025V10zm1.938 2.91H10.19V10h1.04c.292 0 .544.058.755.174.211.116.374.282.488.5.114.216.171.476.171.778 0 .303-.057.563-.171.781a1.186 1.186 0 01-.49.501 1.564 1.564 0 01-.762.175zm-.416-.528h.39a.986.986 0 00.46-.097.622.622 0 00.281-.303c.063-.137.095-.313.095-.53 0-.215-.032-.39-.095-.527a.62.62 0 00-.28-.301.988.988 0 00-.46-.097h-.391v1.855z"
            />
        </g>
    </svg>
    );
}

export default EndIcon;
