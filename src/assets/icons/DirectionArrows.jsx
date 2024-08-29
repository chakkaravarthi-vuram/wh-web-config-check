import React, { useContext } from 'react';
import ThemeContext from '../../hoc/ThemeContext';

export function RightArrowIcon(props) {
  const { className, style, isButtonColor, onClick, title } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = '#FFF';
  }

  return (
    <svg
      width="8"
      height="12"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 8 12"
      className={className}
      style={({ ...style }, { fill: buttonColor })}
      onClick={onClick}
    >
      <title>{title}</title>
      <path
        d="M.797 10.223c-.396.399-.396 1.056 0 1.478.42.398 1.072.398 1.468 0l4.938-4.95a1.097 1.097 0 0 0 0-1.502L2.265.3C1.868-.1 1.216-.1.797.3a1.097 1.097 0 0 0 0 1.502L4.99 6 .797 10.223z"
        fillRule="evenodd"
      />
    </svg>
  );
}

export function LeftArrowIcon(props) {
  const { className, style, isButtonColor } = props;
  let buttonColor = null;
  if (!isButtonColor) {
    buttonColor = '#FFF';
  }

  return (
    <svg
    width="7"
    height="12"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 7 12"
    className={className}
    style={({ ...style }, { fill: buttonColor })}
    >
      <path
        d="M6.703 10.223c.396.399.396 1.056 0 1.478-.42.398-1.072.398-1.468 0L.297 6.75a1.097 1.097 0 0 1 0-1.502L5.235.3C5.632-.1 6.284-.1 6.703.3c.396.423.396 1.08 0 1.502L2.51 6l4.193 4.223z"
        fillRule="evenodd"
      />
    </svg>
  );
}
