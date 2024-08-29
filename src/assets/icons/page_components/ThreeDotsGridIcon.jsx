import React from 'react';

function ThreeDotsGridIcon(props) {
  const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="20"
      fill="none"
      viewBox="0 0 14 20"
      className={className}
    >
      <g>
        <path
          fill="#D8DEE9"
          fillRule="evenodd"
          d="M2.5 4.167a1.667 1.667 0 113.333 0 1.667 1.667 0 01-3.333 0zm5.833 0a1.667 1.667 0 113.334 0 1.667 1.667 0 01-3.334 0zM2.5 10a1.667 1.667 0 113.333 0A1.667 1.667 0 012.5 10zm5.833 0a1.667 1.667 0 113.334 0 1.667 1.667 0 01-3.334 0zM2.5 15.833a1.667 1.667 0 113.333 0 1.667 1.667 0 01-3.333 0zm5.833 0a1.667 1.667 0 113.334 0 1.667 1.667 0 01-3.334 0z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  );
}

export default ThreeDotsGridIcon;
