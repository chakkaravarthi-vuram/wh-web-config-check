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
        <path
          stroke="#959BA3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
          d="M12 15.5H7.5c-1.396 0-2.093 0-2.661.172a4 4 0 00-2.667 2.667C2 18.907 2 19.604 2 21m14-3l2 2 4-4m-7.5-8.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
        />
      </g>
    </svg>
  );
}

export default UserSelectorIcon;
