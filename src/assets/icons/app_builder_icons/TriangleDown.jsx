import React, { useContext } from 'react';
import ThemeContext from '../../../hoc/ThemeContext';

function TriangleDownIcon(props) {
    const { className, onClick, style, title, isButtonColor, onBlur, id, role, ariaHidden } = props;
    let { buttonColor } = useContext(ThemeContext);
    if (!isButtonColor) {
        buttonColor = null;
    }
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="8"
        height="7"
        fill="#9E9E9E"
        viewBox="0 0 8 7"
        className={className}
        onClick={onClick}
        onBlur={onBlur}
        style={({ ...style }, { fill: buttonColor })}
        id={id}
        role={role}
        aria-hidden={ariaHidden}
    >
        <title>{title}</title>
        <path
            fill="#9E9E9E"
            fillRule="evenodd"
            d="M4 7L0 .89h8L4 7z"
            clipRule="evenodd"
        />
    </svg>
  );
}

export default TriangleDownIcon;
