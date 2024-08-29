import React from 'react';

function AbsentIndicator(props) {
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
          fill="#F04438"
          fillRule="evenodd"
          d="M1.646 1.646a.5.5 0 01.708 0L6 5.293l3.646-3.647a.5.5 0 01.708.708L6.707 6l3.647 3.646a.5.5 0 01-.708.708L6 6.707l-3.646 3.647a.5.5 0 01-.708-.708L5.293 6 1.646 2.354a.5.5 0 010-.708z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  );
}

export default AbsentIndicator;
