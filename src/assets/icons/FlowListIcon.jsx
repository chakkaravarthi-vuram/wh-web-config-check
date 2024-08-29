import React from 'react';

function FlowIcon(props) {
    const { className, height, width } = props;
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width || '16'}
    height={height || '16'}
    fill="none"
    viewBox="0 0 16 16"
    className={className}
    >
    <g clipPath="url(#clip0_2063_2799)">
      <path
        stroke="#959BA3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
        d="M1.333 11.333L8 14.667l6.667-3.334M1.333 8L8 11.333 14.667 8M8 1.333L1.333 4.667 8 8l6.667-3.333L8 1.333z"
      />
    </g>
    <defs>
      <clipPath id="clip0_2063_2799">
        <path fill="#fff" d="M0 0H16V16H0z" />
      </clipPath>
    </defs>
    </svg>
  );
}

export default FlowIcon;
