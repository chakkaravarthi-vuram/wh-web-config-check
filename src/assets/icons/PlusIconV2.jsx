import React, { useContext } from 'react';
import ThemeContext from '../../hoc/ThemeContext';

function PlusIconNew(props) {
  const { className, onClick, style, title, isButtonColor, onBlur, id, role, ariaHidden } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="20"
      fill="none"
      viewBox="0 0 21 20"
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
        stroke="#217CF5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10.5 4.167v11.667M4.665 10h11.667"
      />
    </svg>
  );
}

export default PlusIconNew;
