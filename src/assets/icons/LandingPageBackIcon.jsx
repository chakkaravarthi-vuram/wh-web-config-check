import React from 'react';

function LandingPageBackIcon(props) {
    const { className, onClick } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      className={className}
      onClick={onClick}
    >
      <path
        fill="#959BA3"
        fillRule="evenodd"
        d="M10.707 5.293a1 1 0 010 1.414L6.414 11H20a1 1 0 110 2H6.414l4.293 4.293a1 1 0 01-1.414 1.414l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default LandingPageBackIcon;
