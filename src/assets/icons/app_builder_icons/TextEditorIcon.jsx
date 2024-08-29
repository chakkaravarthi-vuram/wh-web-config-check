import React, { useContext } from 'react';
import ThemeContext from '../../../hoc/ThemeContext';

function TextEditorIcon(props) {
    const { className, onClick, style, title, isButtonColor, onBlur, id, role, ariaHidden, fillColor } = props;
    let { buttonColor } = useContext(ThemeContext);
    if (!isButtonColor) {
        buttonColor = null;
    }
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="20"
        fill="none"
        viewBox="0 0 22 20"
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
            fill={fillColor}
            stroke="#959BA3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            d="M12 5H4.2c-1.12 0-1.68 0-2.108.218a2 2 0 00-.874.874C1 6.52 1 7.08 1 8.2v3.6c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874C2.52 15 3.08 15 4.2 15H12m4-10h1.8c1.12 0 1.68 0 2.108.218a2 2 0 01.874.874C21 6.52 21 7.08 21 8.2v3.6c0 1.12 0 1.68-.218 2.108a2 2 0 01-.874.874C19.48 15 18.92 15 17.8 15H16m0 4V1m2.5 0h-5m5 18h-5"
        />
    </svg>
  );
}

export default TextEditorIcon;
