import React from 'react';

function ListIcon(props) {
    const { className, title } = props;
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="16"
            viewBox="0 0 19 16"
            className={className}
        >
            <title>{title}</title>
            <path
                fill="#6C727E"
                d="M16 13h2v.5h-1v1h1v.5h-2v1h3v-4h-3v1zm1-9h1V0h-2v1h1v3zm-1 3h1.8L16 9.1v.9h3V9h-1.8L19 6.9V6h-3v1zM0 1h14v2H0V1zm0 12h14v2H0v-2zm0-6h14v2H0V7z"
            />
        </svg>
    );
}

export default ListIcon;
