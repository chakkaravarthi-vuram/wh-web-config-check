import React from 'react';

function DeleteIconV2(props) {
    const { className, title, style, tabIndex, onClick, onKeyDown, ariaLabel, role } = props;
    return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 96 960 960"
        className={className}
        onClick={onClick}
        aria-label={ariaLabel}
        tabIndex={tabIndex || '-1'}
        style={({ ...style })}
        role={role}
        onKeyDown={onKeyDown}
    >
        <title>{title}</title>
        <path
        d="M277.37 944.131q-37.783 0-64.392-26.609-26.609-26.609-26.609-64.392v-514.5h-45.5v-91H354.5v-45.5h250.522v45.5h214.109v91h-45.5v514.5q0 37.783-26.609 64.392-26.609 26.609-64.392 26.609H277.37zM682.63 338.63H277.37v514.5h405.26v-514.5zM355.696 775.761h85.5v-360h-85.5v360zm163.108 0h85.5v-360h-85.5v360zM277.37 338.63v514.5-514.5z"
        />
    </svg>
    );
}

export default DeleteIconV2;
