import React from 'react';

function CloseDatalistsIcon(props) {
    const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      className={className}
    >
      <path
        stroke="#959BA3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
        d="M15 5L5 15M5 5l10 10"
      />
    </svg>
  );
}

export default CloseDatalistsIcon;
