import React from 'react';

function DeleteDataListIcon(props) {
  const { className, title } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="56"
      height="56"
      fill="none"
      viewBox="0 0 56 56"
      className={className}
    >
        <title>{title}</title>
      <rect width="48" height="48" x="4" y="4" fill="#FEE4E2" rx="24" />
      <rect
        width="48"
        height="48"
        x="4"
        y="4"
        stroke="#FEF3F2"
        strokeWidth="8"
        rx="24"
      />
      <path
        stroke="#D92D20"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 22h2m0 0h16m-16 0v14a2 2 0 002 2h10a2 2 0 002-2V22H21zm3 0v-2a2 2 0 012-2h4a2 2 0 012 2v2m-6 5v6m4-6v6"
      />
    </svg>
  );
}

export default DeleteDataListIcon;
