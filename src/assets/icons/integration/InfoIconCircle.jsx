import React from 'react';

function InfoIconCircle(props) {
    const { className, title } = props;
    return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="none"
        viewBox="0 0 18 18"
        className={className}
    >
        <title>{title}</title>
        <path
            fill="#484D57"
            fillRule="evenodd"
            d="M9 2.25a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM.75 9a8.25 8.25 0 1116.5 0A8.25 8.25 0 01.75 9zm7.5-3A.75.75 0 019 5.25h.008a.75.75 0 010 1.5H9A.75.75 0 018.25 6zM9 8.25a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0V9A.75.75 0 019 8.25z"
            clipRule="evenodd"
        />
    </svg>
    );
}

export default InfoIconCircle;
