import React from 'react';

function LandingSearchExitIcon(props) {
  const { className, onClick, width, height, ariaLabel, ariaHidden, role, tabIndex, onKeyDown } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || '16'}
      height={height || '16'}
      fill="none"
      viewBox="0 0 16 16"
      role={role}
      className={className}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
    >
      <g clipPath="url(#clip0_4655_50)">
        <path
          fill="#959BA3"
          d="M2.4 15.191L.809 13.6l5.6-5.6-5.6-5.6L2.4.809l5.6 5.6 5.6-5.6L15.191 2.4 9.591 8l5.6 5.6-1.591 1.591-5.6-5.6-5.6 5.6z"
        />
      </g>
      <defs>
        <clipPath id="clip0_4655_50">
          <path fill="#fff" d="M0 0H16V16H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default LandingSearchExitIcon;
