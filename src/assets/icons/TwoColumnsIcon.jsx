import React from 'react';

function TwoColumnsIcon(props) {
  const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      className={className}
    >
      <g>
        <path
          stroke="#959BA3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M8 2v12M8 2h4.667A1.333 1.333 0 0114 3.333v9.334A1.334 1.334 0 0112.667 14H8V2zm0 0H3.333A1.333 1.333 0 002 3.333v9.334A1.333 1.333 0 003.333 14H8V2z"
        />
      </g>
    </svg>
  );
}

export default TwoColumnsIcon;
