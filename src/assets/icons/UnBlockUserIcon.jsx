import React from 'react';

function UnBlockUserIcon(props) {
    const { className, onClick, title, role, ariaLabel } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
    >
        <title>{title}</title>
      <g fill="none" fillRule="evenodd">
        <rect
          width="23"
          height="23"
          x="0.5"
          y="0.5"
          fill="#FFF"
          stroke="#DADFE7"
          rx="4"
        />
        <g transform="translate(6 6)">
          <circle cx="6" cy="6" r="6" fill="#6CCF9C" />
          <path
            fill="#FFF"
            fillRule="nonzero"
            d="M8.77 3L10 4.134 5.666 9 3 6.387l1.152-1.216 1.432 1.405z"
          />
        </g>
      </g>
    </svg>
  );
}

export default UnBlockUserIcon;
