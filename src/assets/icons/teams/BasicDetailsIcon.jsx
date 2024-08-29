import React from 'react';

function BasicDetailsIcon(props) {
  const { style } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      style={{ ...style }}
    >
      <g clipPath="url(#clip0_3599_320)">
        <path
          stroke="#959BA3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.667"
          d="M9.166 3.333H3.333A1.667 1.667 0 001.666 5v11.667a1.667 1.667 0 001.667 1.666H15a1.667 1.667 0 001.666-1.666v-5.834m-1.25-8.75a1.768 1.768 0 012.5 2.5L10 12.5l-3.333.833L7.5 10l7.916-7.917z"
        />
      </g>
      <defs>
        <clipPath id="clip0_3599_320">
          <path fill="#fff" d="M0 0H20V20H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default BasicDetailsIcon;
