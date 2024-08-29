import React from 'react';

function PresentIndicator(props) {
  const { className } = props;

  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      fill="none"
      viewBox="0 0 12 12"
    >
      <g>
        <path
          fill="#039855"
          fillRule="evenodd"
          d="M10.837 2.163a.556.556 0 010 .785L4.727 9.06a.556.556 0 01-.787 0L1.163 6.282a.556.556 0 01.785-.786l2.385 2.385 5.719-5.718a.556.556 0 01.785 0z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  );
}

export default PresentIndicator;
