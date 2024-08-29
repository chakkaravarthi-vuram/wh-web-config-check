import React from 'react';

function UserSelectedIcon(props) {
    const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="21"
      fill="none"
      viewBox="0 0 20 21"
      className={className}
    >
      <g>
        <path
          fill="#217CF5"
          fillRule="evenodd"
          d="M5.817 5.873a4.183 4.183 0 118.366 0 4.183 4.183 0 01-8.366 0zm-2.108 7.042a4.183 4.183 0 012.958-1.225h6.666a4.183 4.183 0 014.184 4.183v1.667c0 .47-.38.85-.85.85H3.333a.85.85 0 01-.85-.85v-1.667c0-1.11.441-2.173 1.226-2.958z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  );
}

export default UserSelectedIcon;
