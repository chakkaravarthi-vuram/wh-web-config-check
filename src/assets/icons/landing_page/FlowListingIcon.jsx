import React from 'react';

function FlowListingIcon(props) {
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
        stroke="#9E9E9E"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
        d="M6.5 8.5V12M6.625 8.25a1.625 1.625 0 100-3.25 1.625 1.625 0 000 3.25zM6.5 15a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13.5 15a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
      />
      <path
        stroke="#9E9E9E"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
        d="M6.567 8.5a2.021 2.021 0 001.967 1.517l1.716-.009a2.984 2.984 0 012.834 2.009"
      />
      <path
        stroke="#9E9E9E"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
        d="M7.5 18.333h5c4.166 0 5.833-1.666 5.833-5.833v-5c0-4.167-1.666-5.833-5.833-5.833h-5c-4.167 0-5.833 1.666-5.833 5.833v5c0 4.167 1.666 5.833 5.833 5.833z"
      />
    </svg>
  );
}

export default FlowListingIcon;
