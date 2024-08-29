import React from 'react';

function ChevronUp(props) {
  const { className, ariaLabel, role } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="20"
      fill="none"
      viewBox="0 0 18 20"
      className={className}
      ariaLabel={ariaLabel}
      role={role}
    >
      <g>
        <path
          fill="#9E9E9E"
          fillRule="evenodd"
          d="M14.105 12.589a.677.677 0 01-1.04 0l-3.896-4.41-3.895 4.41a.677.677 0 01-1.04 0 .913.913 0 010-1.179l4.415-5a.677.677 0 011.04 0l4.416 5a.913.913 0 010 1.179z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  );
}

export default ChevronUp;
