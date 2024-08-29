import React from 'react';

function ZoomInIcon(props) {
    const { className, onClick, role, ariaLabel, tabIndex, title, onKeyPress } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      onKeyPress={onKeyPress}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
      title={title}
      role={role}
      viewBox="0 0 14 14"
      className={className}
      onClick={onClick || null}
    >
      <path
        fill="#FFF"
        fillRule="evenodd"
        d="M8 0v6h6v2H8v6H6V8H0V6h6V0h2z"
      />
    </svg>
  );
}

export default ZoomInIcon;
