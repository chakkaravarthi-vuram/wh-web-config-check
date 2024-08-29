import React from 'react';

function ExpandArrowIcon(props) {
    const {
        className,
    } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      className={className}
    >
      <path
        stroke="#9E9E9E"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M11.306 6.536L7.77 10.07 4.234 6.536"
      />
    </svg>
  );
}

export default ExpandArrowIcon;
