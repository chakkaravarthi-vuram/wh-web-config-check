import React from 'react';

function TableIcon(props) {
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
        <path
          fill="#959BA3"
          fillRule="evenodd"
          d="M10 3.7h8A2.3 2.3 0 0120.3 6v2H10V3.7zm-2 0H6A2.3 2.3 0 003.7 6v2H8V3.7zM3.7 10v8A2.3 2.3 0 006 20.3h2V10H3.7zM10 20.3h8a2.3 2.3 0 002.3-2.3v-8H10v10.3zM2 6a4 4 0 014-4h12a4 4 0 014 4v12a4 4 0 01-4 4H6a4 4 0 01-4-4V6z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  );
}

export default TableIcon;
