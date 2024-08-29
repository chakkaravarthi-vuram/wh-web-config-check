import React from 'react';

function LockIcon(props) {
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
      <path
        stroke="#959BA3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.667"
        d="M5.833 9.167V5.834a4.167 4.167 0 018.334 0v3.333m-10 0h11.666c.92 0 1.667.746 1.667 1.667v5.833c0 .92-.746 1.667-1.667 1.667H4.167c-.92 0-1.667-.747-1.667-1.667v-5.833c0-.92.746-1.667 1.667-1.667z"
      />
    </svg>
  );
}

export default LockIcon;
