import React from 'react';

function InfoIcon(props) {
  const { className, onClick } = props;
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className={className}
    >
      <g>
        <path
          fill="#959BA3"
          fillRule="evenodd"
          d="M12 2.85a9.15 9.15 0 100 18.3 9.15 9.15 0 000-18.3zM1.15 12C1.15 6.008 6.008 1.15 12 1.15S22.85 6.008 22.85 12 17.992 22.85 12 22.85 1.15 17.992 1.15 12zm10-4c0-.47.38-.85.85-.85h.01a.85.85 0 010 1.7H12a.85.85 0 01-.85-.85zm.85 3.15c.47 0 .85.38.85.85v4a.85.85 0 01-1.7 0v-4c0-.47.38-.85.85-.85z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  );
}

export default InfoIcon;
