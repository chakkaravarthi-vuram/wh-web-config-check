import React, { useContext } from 'react';
import ThemeContext from '../../../hoc/ThemeContext';

function ExpandIcon(props) {
    const { className, onClick, style, isButtonColor, onBlur, id, role, ariaHidden } = props;
    let { buttonColor } = useContext(ThemeContext);
    if (!isButtonColor) {
        buttonColor = null;
    }
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        fill="none"
        viewBox="0 0 12 12"
        className={className}
        onClick={onClick}
        onBlur={onBlur}
        style={({ ...style }, { fill: buttonColor })}
        id={id}
        role={role}
        aria-hidden={ariaHidden}
    >
      <path
        fill="#217CF5"
        fillRule="evenodd"
        d="M10 7.5a.5.5 0 011 0v3a.5.5 0 01-.5.5h-3a.5.5 0 010-1h1.793L2 2.707V4.5a.5.5 0 01-1 0v-3a.5.5 0 01.5-.5h3a.5.5 0 010 1H2.707L10 9.293V7.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default ExpandIcon;
