import React from 'react';

function TeamsIcon(props) {
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
          stroke="#9E9E9E"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M18.333 17.5v-1.667a3.335 3.335 0 00-2.5-3.228m-2.917-9.863a3.334 3.334 0 010 6.182m1.25 8.576c0-1.553 0-2.33-.253-2.942a3.334 3.334 0 00-1.804-1.804c-.613-.254-1.39-.254-2.943-.254h-2.5c-1.553 0-2.33 0-2.942.254a3.334 3.334 0 00-1.804 1.804c-.253.612-.253 1.389-.253 2.942M11.25 5.833a3.333 3.333 0 11-6.667 0 3.333 3.333 0 016.667 0z"
        />
      </g>
    </svg>
  );
}

export default TeamsIcon;
