import React from 'react';
import { ARIA_ROLES } from '../../utils/UIConstants';

function HeaderHamburgerIcon(props) {
    const { className, onClick } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      className={className}
      role={ARIA_ROLES.BUTTON}
      onClick={onClick}
    >
      <g>
        <path
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 12h18M3 6h18M3 18h18"
        />
      </g>
    </svg>
  );
}

export default HeaderHamburgerIcon;
