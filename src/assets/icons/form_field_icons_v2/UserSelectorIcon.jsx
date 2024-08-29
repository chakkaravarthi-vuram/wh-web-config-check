import React from 'react';

function UserSelectorIcon(props) {
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
          <path
            fill="#959BA3"
            fillRule="evenodd"
            d="M9.5 4a3 3 0 100 6 3 3 0 000-6zm-5 3a5 5 0 1110 0 5 5 0 01-10 0zm10.073-4.084a1 1 0 011.302-.552 5 5 0 010 9.272 1 1 0 01-.75-1.854 3 3 0 000-5.564 1 1 0 01-.552-1.302zM7.964 14H12a1 1 0 010 2H8c-.946 0-1.605 0-2.12.036-.507.034-.803.099-1.028.192a3.001 3.001 0 00-1.624 1.624c-.093.225-.158.52-.192 1.027C3 19.395 3 20.054 3 21a1 1 0 11-2 0v-.035c0-.902 0-1.63.04-2.222.042-.608.13-1.147.34-1.656a5 5 0 012.707-2.706c.51-.212 1.048-.3 1.656-.34C6.335 14 7.063 14 7.964 14zM19 14a1 1 0 011 1v2h2a1 1 0 010 2h-2v2a1 1 0 01-2 0v-2h-2a1 1 0 010-2h2v-2a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </g>
      </g>
    </svg>
  );
}

export default UserSelectorIcon;
