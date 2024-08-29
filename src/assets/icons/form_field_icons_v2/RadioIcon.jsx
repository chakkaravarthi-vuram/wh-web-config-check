import React from 'react';

function RadioIcon(props) {
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
        <g>
          <g fill="#959BA3">
            <path d="M16 11.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
            <path
              fillRule="evenodd"
              d="M22 11.5C22 17.299 17.299 22 11.5 22S1 17.299 1 11.5 5.701 1 11.5 1 22 5.701 22 11.5zM11.5 20a8.5 8.5 0 100-17 8.5 8.5 0 000 17z"
              clipRule="evenodd"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}

export default RadioIcon;
