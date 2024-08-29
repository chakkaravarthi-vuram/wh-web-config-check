import React from 'react';

function LinkIcon(props) {
  const { className, onClick } = props;
  return (
    <svg
      width="22"
      height="12"
      fill="none"
      viewBox="0 0 22 12"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className={className}
    >
      <path
        fill="#959BA3"
        fillRule="evenodd"
        d="M8 6a6 6 0 016-6h2a6 6 0 010 12h-.5a1 1 0 110-2h.5a4 4 0 000-8h-2a4 4 0 00-4 4 1 1 0 11-2 0zM6 2a4 4 0 100 8h2a4 4 0 004-4 1 1 0 112 0 6 6 0 01-6 6H6A6 6 0 116 0h.5a1 1 0 010 2H6z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default LinkIcon;
