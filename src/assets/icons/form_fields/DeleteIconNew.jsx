import React from 'react';

function DeleteIconNew(props) {
    const { className, title, ariaLabel, role } = props;
    return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="11"
        height="12"
        viewBox="0 0 11 12"
        className={className}
        aria-label={ariaLabel}
        role={role}
    >
        <title>{title}</title>
        <path
            fill="#FFF"
            d="M1.683 12a.963.963 0 01-.706-.294A.963.963 0 01.683 11V1.5H0v-1h3.133V0h4.4v.5h3.134v1h-.684V11c0 .267-.1.5-.3.7-.2.2-.433.3-.7.3h-7.3zm7.3-10.5h-7.3V11h7.3V1.5zM3.45 9.567h1v-6.65h-1v6.65zm2.767 0h1v-6.65h-1v6.65zM1.75 1.5V11 1.5z"
        />
    </svg>
    );
}

export default DeleteIconNew;
