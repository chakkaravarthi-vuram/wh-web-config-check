import React from 'react';

function CorrectIconV2(props) {
  const {
    className,
    title,
    style,
    tabIndex,
    onClick,
    onKeyDown,
    ariaLabel,
    role,
    color,
  } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      stroke={color || '#959BA3'}
      fill={color}
      stroke-width="25"
      viewBox="0 96 960 960"
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
      tabIndex={tabIndex || '-1'}
      style={{ ...style }}
      role={role}
      onKeyDown={onKeyDown}
    >
      <title>{title}</title>
      <path d="M378 810L154 586l43-43 181 181 384-384 43 43-427 427z" />
    </svg>
  );
}

export default CorrectIconV2;
