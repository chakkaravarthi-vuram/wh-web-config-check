import React from 'react';

function DangerTriangleIcon(props) {
  const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="35"
      fill="none"
      viewBox="0 0 40 35"
      aria-hidden
      className={className}
    >
      <path
        fill="#CD3636"
        d="M4.94 35h30.12c3.08 0 5-3.34 3.46-6L23.46 2.98c-1.54-2.66-5.38-2.66-6.92 0L1.48 29c-1.54 2.66.38 6 3.46 6zM20 21c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2s2 .9 2 2v4c0 1.1-.9 2-2 2zm2 8h-4v-4h4v4z"
      />
    </svg>
  );
}

export default DangerTriangleIcon;
