import React from 'react';

function UserPlus(props) {
  const { width, height, strokeColor } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || '20'}
      height={height || '20'}
      fill="none"
      viewBox="0 0 20 20"
    >
      <g clipPath="url(#clip0_4530_1550)">
        <path
          stroke={strokeColor || '#217CF5'}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13.334 17.5v-1.667A3.333 3.333 0 0010 12.5H4.167a3.333 3.333 0 00-3.334 3.333V17.5M16.667 6.667v5m2.5-2.5h-5m-3.75-3.334a3.333 3.333 0 11-6.667 0 3.333 3.333 0 016.667 0z"
        />
      </g>
      <defs>
        <clipPath id="clip0_4530_1550">
          <path fill="#fff" d="M0 0H20V20H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default UserPlus;
