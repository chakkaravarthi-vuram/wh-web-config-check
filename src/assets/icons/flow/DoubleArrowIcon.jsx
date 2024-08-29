import React from 'react';

function DoubleArrowIcon(props) {
    const { className, title, onClick } = props;
    return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        className={className}
        onClick={onClick}
    >
        <title>{title}</title>
        <path
             fill="#6C727E"
             d="M1.256 16L0 14.6 5.921 8 0 1.4 1.256 0l7.178 8-7.178 8zm7.566 0l-1.256-1.4L13.488 8 7.566 1.4 8.822 0 16 8l-7.178 8z"
        />
    </svg>
    );
}

export default DoubleArrowIcon;
