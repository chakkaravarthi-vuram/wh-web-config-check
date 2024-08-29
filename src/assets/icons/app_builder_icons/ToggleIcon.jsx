import React, { useContext } from 'react';
import ThemeContext from '../../../hoc/ThemeContext';

function ToggleIcon(props) {
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
        <path
            stroke="#959BA3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            d="M13 19V1M5.8 19h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 001.311-1.311C19 16.72 19 15.88 19 14.2V5.8c0-1.68 0-2.52-.327-3.162a3 3 0 00-1.311-1.311C16.72 1 15.88 1 14.2 1H5.8c-1.68 0-2.52 0-3.162.327a3 3 0 00-1.311 1.311C1 3.28 1 4.12 1 5.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 001.311 1.311C3.28 19 4.12 19 5.8 19z"
        />
    </svg>
  );
}

export default ToggleIcon;
