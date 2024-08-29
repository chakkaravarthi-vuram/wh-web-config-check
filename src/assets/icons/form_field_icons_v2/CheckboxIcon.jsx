import React from 'react';

function CheckboxIcon(props) {
  const { className, onClick } = props;
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className={className}
    >
      <g>
        <g fill="#959BA3" fillRule="evenodd" clipRule="evenodd">
          <path d="M18 3.7H6A2.3 2.3 0 003.7 6v12A2.3 2.3 0 006 20.3h12a2.3 2.3 0 002.3-2.3V6A2.3 2.3 0 0018 3.7zM6 2a4 4 0 00-4 4v12a4 4 0 004 4h12a4 4 0 004-4V6a4 4 0 00-4-4H6z" />
          <path d="M17.707 8.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L11 13.586l5.293-5.293a1 1 0 011.414 0z" />
        </g>
      </g>
    </svg>
  );
}

export default CheckboxIcon;
