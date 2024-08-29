import React from 'react';

function MultiplyOperatorIcon(props) {
  const { onClick, role, ariaLabel } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="7"
      height="7"
      viewBox="0 0 7 7"
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
    >
      <path
        fill="#6C727E"
        d="M6.794 5.806a.7.7 0 11-.99.989L3.5 4.49 1.195 6.794A.694.694 0 01.7 7a.7.7 0 01-.495-1.195l2.306-2.306L.205 1.195a.7.7 0 11.99-.99L3.5 2.512 5.805.206a.7.7 0 11.99.99L4.489 3.5l2.305 2.305z"
      />
    </svg>
  );
}

export default MultiplyOperatorIcon;
