import React from 'react';

function RightDirArrowIcon(props) {
  const { onClick, className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      className={className}
      onClick={onClick}
    >
      <path
        stroke="#959BA3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
        d="M7.5 15l5-5-5-5"
      />
    </svg>
  );
}

export default RightDirArrowIcon;
