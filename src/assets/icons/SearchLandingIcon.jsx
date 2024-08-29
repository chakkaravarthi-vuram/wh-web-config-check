import React from 'react';

function SearchLandingIcon(props) {
    const { className, onClick, role, ariaHidden, ariaLabel } = props;
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            role={role}
            aria-hidden={ariaHidden}
            className={className}
            onClick={onClick}
            aria-label={ariaLabel}
        >
            <path
                fill="#9E9E9E"
                fillRule="evenodd"
                d="M11.5 4a7.5 7.5 0 105.188 12.916 1.01 1.01 0 01.228-.228A7.5 7.5 0 0011.5 4zm7.388 13.473A9.461 9.461 0 0021 11.5a9.5 9.5 0 10-9.5 9.5 9.46 9.46 0 005.973-2.113l2.82 2.82a1 1 0 001.414-1.414l-2.82-2.82z"
                clipRule="evenodd"
            />
        </svg>
    );
}

export default SearchLandingIcon;
