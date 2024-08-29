import React from 'react';

function DashboardIcon(props) {
    const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="none"
      viewBox="0 0 14 14"
      aria-hidden
      className={className}
    >
      <path
        fill="#959BA3"
        d="M0 1a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H1a1 1 0 01-1-1V1zM0 10a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H1a1 1 0 01-1-1v-3zM9 1a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V1zM9 10a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3z"
      />
    </svg>
  );
}

export default DashboardIcon;
