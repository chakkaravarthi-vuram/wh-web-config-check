import React, { useContext } from 'react';
import ThemeContext from '../../../hoc/ThemeContext';

function PlusTabIcon(props) {
    const { className, onClick, style, title, isButtonColor, onBlur, id, role, ariaHidden } = props;
    let { buttonColor } = useContext(ThemeContext);
    if (!isButtonColor) {
        buttonColor = null;
    }
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 20 20"
            className={className}
            onClick={onClick}
            onBlur={onBlur}
            style={({ ...style }, { fill: buttonColor })}
            id={id}
            role={role}
            aria-hidden={ariaHidden}
        >
        <title>{title}</title>
        <g clipPath="url(#clip0_1220_4236)">
            <path
            stroke="#3789F6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.67"
            d="M10 4.167v11.667M4.165 10h11.667"
            />
        </g>
        <defs>
            <clipPath id="clip0_1220_4236">
            <path fill="#fff" d="M0 0H20V20H0z" />
            </clipPath>
        </defs>
        </svg>
    );
}

export default PlusTabIcon;
