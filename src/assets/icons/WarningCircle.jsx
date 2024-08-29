import React from 'react';

function WarningCircle(props) {
    const { className, title } = props;
    return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 16 16"
        className={className}
    >
        <title>{title}</title>
        <path
            fill="#5466BD"
            d="M7.998 0C3.588 0 0 3.586 0 7.997 0 12.407 3.587 16 7.998 16 12.408 16 16 12.407 16 7.997S12.409 0 7.998 0zm0 1.333a6.655 6.655 0 016.669 6.664 6.66 6.66 0 01-6.669 6.668 6.656 6.656 0 01-6.665-6.668 6.652 6.652 0 016.665-6.664zm.005 2.775a.667.667 0 00-.669.666v4.06a.666.666 0 101.333 0v-4.06a.667.667 0 00-.664-.666zm0 6.12a.9.9 0 10-.008 1.8.9.9 0 00.008-1.8z"
        />
    </svg>
    );
}

export default WarningCircle;
