import React from 'react';

function AlertTriangleIcon(props) {
  const { className, width = 16, height = 16 } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 16 16"
      className={className}
    >
      <g>
        <path
          stroke="#DC6803"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
          d="M8 5.333V8m0 2.666h.007M6.86 1.906l-5.647 9.427a1.334 1.334 0 001.14 2h11.293a1.332 1.332 0 001.14-2L9.14 1.906a1.333 1.333 0 00-2.28 0z"
        />
      </g>
    </svg>
  );
}

export default AlertTriangleIcon;
