import React, { useContext } from 'react';
import ThemeContext from '../../../hoc/ThemeContext';

function SettingsAppIcon(props) {
    const {
        className,
        onClick,
        style,
        title,
        isButtonColor,
        onBlur,
        id,
        role,
        ariaHidden,
        onKeyDown,
    } = props;
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
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        style={({ ...style }, { fill: buttonColor })}
        id={id}
        role={role}
        aria-hidden={ariaHidden}
    >
        <title>{title}</title>
        <path
            stroke="#9E9E9E"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            d="M7.829 16.143l.487 1.095a1.843 1.843 0 003.37 0l.487-1.095a2.02 2.02 0 012.059-1.186l1.191.127a1.844 1.844 0 001.685-2.919l-.705-.97A2.025 2.025 0 0116.02 10c0-.428.135-.844.387-1.19l.705-.97a1.842 1.842 0 00-.654-2.728 1.844 1.844 0 00-1.031-.19l-1.192.126a2.021 2.021 0 01-2.058-1.19l-.49-1.096a1.844 1.844 0 00-3.371 0l-.487 1.096a2.021 2.021 0 01-2.058 1.19l-1.196-.126A1.844 1.844 0 002.89 7.84l.706.97a2.024 2.024 0 010 2.381l-.706.97a1.843 1.843 0 001.685 2.918l1.192-.127a2.028 2.028 0 012.062 1.19z"
        />
        <path
            stroke="#9E9E9E"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
        />
    </svg>
  );
}

export default SettingsAppIcon;
