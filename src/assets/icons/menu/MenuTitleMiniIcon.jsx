import React from 'react';

function MenuTitleIcon(props) {
    const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="4"
      fill="none"
      viewBox="0 0 16 4"
      className={className}
    >
      <g fill="#D9DDE2">
        <circle cx="2" cy="2" r="2" />
        <circle cx="8" cy="2" r="2" />
        <circle cx="14" cy="2" r="2" />
      </g>
    </svg>
  );
}

export default MenuTitleIcon;
