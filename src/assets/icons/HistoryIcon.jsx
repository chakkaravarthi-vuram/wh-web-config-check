import React, { useContext } from 'react';
import ThemeContext from '../../hoc/ThemeContext';

function HistoryIcon(props) {
  const { className, onClick, style, title, isButtonColor, onBlur } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
      onClick={onClick}
      onBlur={onBlur}
      style={({ ...style }, { fill: buttonColor })}
    >
      <title>{title}</title>

      <g fill="none" fillRule="evenodd">
        <rect width="23" height="23" x="0.5" y="0.5" stroke="#228BB5" rx="6" />
        <path
          fill="#228BB5"
          fillRule="nonzero"
          d="M11.994 6a6.08 6.08 0 00-5.421 3.298l-.243-.436a.709.709 0 00-1.24-.01.708.708 0 00.005.7l.97 1.731c.185.332.599.46.938.287l1.726-.882a.707.707 0 00-.574-1.285 4.675 4.675 0 013.839-1.991c2.586 0 4.66 2.05 4.66 4.588 0 2.537-2.074 4.588-4.66 4.588-2.213 0-4.05-1.518-4.534-3.535a.707.707 0 10-1.373.331C6.724 16.034 9.135 18 11.994 18c3.339 0 6.071-2.69 6.071-6s-2.732-6-6.071-6zm.06 2.46a.705.705 0 00-.695.716V12c0 .214.098.417.265.551l1.765 1.412a.706.706 0 10.882-1.103l-1.5-1.202V9.176a.704.704 0 00-.717-.716z"
        />
      </g>
    </svg>
  );
}
export default HistoryIcon;
