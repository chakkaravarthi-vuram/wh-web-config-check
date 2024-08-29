import React from 'react';

function AppHeaderDropdownIcon(props) {
    const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="7"
      fill="none"
      viewBox="0 0 12 7"
      className={className}
    >
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M1 1l5 5 5-5"
      />
    </svg>
  );
}

export default AppHeaderDropdownIcon;
