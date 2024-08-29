import React from 'react';

function LeftDirArrowIcon(props) {
    const { onClick, className, fill } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      className={className}
      onClick={onClick}
    >
      <path
        stroke={fill || '#959BA3'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
        d="M12.5 15l-5-5 5-5"
      />
    </svg>
  );
}

export default LeftDirArrowIcon;
