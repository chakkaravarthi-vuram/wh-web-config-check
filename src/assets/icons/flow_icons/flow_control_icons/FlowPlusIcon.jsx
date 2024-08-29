import React from 'react';

function FlowPlusIcon(props) {
  const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      className={className}
    >
      <g>
        <path
          fill="#9E9E9E"
          fillRule="evenodd"
          d="M10 3.333c.46 0 .833.373.833.833v5h5a.833.833 0 010 1.667h-5v5a.833.833 0 01-1.666 0v-5h-5a.833.833 0 110-1.667h5v-5c0-.46.373-.833.833-.833z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  );
}

export default FlowPlusIcon;
