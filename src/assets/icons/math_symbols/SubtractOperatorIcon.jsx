import React from 'react';

function SubtractOperatorIcon(props) {
  const { onClick, role, ariaLabel } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="9"
      height="2"
      viewBox="0 0 9 2"
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
    >
      <path
        fill="#6C727E"
        d="M8.308 1.385H.692A.692.692 0 11.692 0h7.616a.692.692 0 110 1.385z"
      />
    </svg>
  );
}

export default SubtractOperatorIcon;
