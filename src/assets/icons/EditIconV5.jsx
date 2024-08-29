import React from 'react';

function EditIconV5(props) {
    const { className, title, onClick, ariaLabel, role } = props;
    return (
    <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        onClick={onClick}
        aria-label={ariaLabel}
        role={role}
    >
        <title>{title}</title>
        <path
            d="M3.75 14.25H4.8L11.2687 7.78125L10.2188 6.73125L3.75 13.2V14.25ZM14.475 6.69375L11.2875 3.54375L12.3375 2.49375C12.625 2.20625 12.9783 2.0625 13.3973 2.0625C13.8158 2.0625 14.1687 2.20625 14.4562 2.49375L15.5062 3.54375C15.7937 3.83125 15.9437 4.17825 15.9562 4.58475C15.9687 4.99075 15.8313 5.3375 15.5438 5.625L14.475 6.69375ZM13.3875 7.8L5.4375 15.75H2.25V12.5625L10.2 4.6125L13.3875 7.8ZM10.7437 7.25625L10.2188 6.73125L11.2687 7.78125L10.7437 7.25625Z"
            fill="#959BA3"
        />
    </svg>
    );
}
EditIconV5.defaultProps = {
    onClick: () => {},
};

export default EditIconV5;
