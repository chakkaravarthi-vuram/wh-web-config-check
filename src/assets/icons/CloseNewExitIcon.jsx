import React, { useContext } from 'react';
import ThemeContext from '../../hoc/ThemeContext';

function CloseNewExitIcon(props) {
    const { className, onClick, style, title, isButtonColor } = props;
    let { buttonColor } = useContext(ThemeContext);
    if (!isButtonColor) {
      buttonColor = null;
    }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={className}
      onClick={onClick}
      fill="#6c727e"
      style={({ ...style }, { fill: buttonColor, stroke: buttonColor })}
    >
      <defs>
        <clipPath id="i0">
          <path d="M1440 0v891H0V0h1440z" />
        </clipPath>
        <clipPath id="i1">
          <path d="M14.222 0L16 1.778 9.777 8 16 14.222 14.222 16 8 9.777 1.778 16 0 14.222 6.223 8 0 1.778 1.778 0 8 6.223 14.222 0z" />
        </clipPath>
      </defs>
      <title>{title}</title>
      <g clipPath="url(#i0)" transform="translate(-1059 -325)">
        <g clipPath="url(#i1)" transform="translate(680 310) translate(379 15)">
          <path
            fill="#218BB5"
            d="M-3.62376795e-13 -8.8817842e-15L16 -8.8817842e-15 16 16 -3.62376795e-13 16 -3.62376795e-13 -8.8817842e-15z"
          />
        </g>
      </g>
    </svg>
  );
}

export default CloseNewExitIcon;
