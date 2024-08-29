import React from 'react';

function BillingSelectedIcon(props) {
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
          d="M4.167 3.373a.833.833 0 000 1.667h11.666a2.5 2.5 0 012.5 2.5v8.333a2.5 2.5 0 01-2.5 2.5H4.167a2.5 2.5 0 01-2.5-2.5V4.207a2.5 2.5 0 012.5-2.5h10a.833.833 0 010 1.666h-10z"
          clipRule="evenodd"
        />
        <path
          fill="#fff"
          d="M12.5 11.707a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0z"
        />
      </g>
    </svg>
  );
}

export default BillingSelectedIcon;
