import React from 'react';

function ExpandIcon(props) {
    const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        fill="#217cf5"
        fillRule="evenodd"
        d="M15 4a1 1 0 110-2h6a1 1 0 011 1v6a1 1 0 11-2 0V5.414L5.414 20H9a1 1 0 110 2H3a1 1 0 01-1-1v-6a1 1 0 112 0v3.586L18.586 4H15z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default ExpandIcon;
