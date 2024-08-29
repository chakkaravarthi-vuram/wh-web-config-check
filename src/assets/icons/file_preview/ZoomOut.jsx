import React from 'react';

function ZoomOutIcon(props) {
    const { className, onClick, ariaLabel, tabIndex, title, onKeyPress, role } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="2"
      viewBox="0 0 14 2"
      className={className}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
      role={role}
      title={title}
      onKeyPress={onKeyPress}
      onClick={onClick || null}
    >
      <path fill="#FFF" fillRule="evenodd" d="M0 0h14v2H0z" />
    </svg>
  );
}

export default ZoomOutIcon;
