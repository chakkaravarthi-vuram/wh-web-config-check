import React from 'react';

function HeaderUpArrow(props) {
  const { width, height } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || '16'}
      height={height || '16'}
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        stroke="#959BA3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.333"
        d="M8 12.667V3.333m0 0L12.666 8M8 3.333L3.333 8"
      />
    </svg>
  );
}

export default HeaderUpArrow;
