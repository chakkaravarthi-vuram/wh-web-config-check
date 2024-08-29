import React from 'react';

function ChevronIconFlow(props) {
  const { className, ariaLabel, role } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="none"
      viewBox="0 0 14 14"
      className={className}
      ariaLabel={ariaLabel}
      role={role}
    >
      <g>
        <path
          stroke="#959BA3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.4"
          d="M2 5l5 5 5-5"
        />
      </g>
    </svg>
  );
}

export default ChevronIconFlow;
