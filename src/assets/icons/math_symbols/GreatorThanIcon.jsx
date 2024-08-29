import React from 'react';

function GreatorOperatorIcon(props) {
  const { onClick, role, ariaLabel } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="8"
      viewBox="0 0 8 8"
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
    >
      <path
        fill="#6C727E"
        d="M.668 8a.666.666 0 01-.3-1.264L5.844 4 .37 1.262A.666.666 0 11.965.07l6.667 3.334a.665.665 0 010 1.192L.964 7.929A.67.67 0 01.668 8z"
      />
    </svg>
  );
}

export default GreatorOperatorIcon;
