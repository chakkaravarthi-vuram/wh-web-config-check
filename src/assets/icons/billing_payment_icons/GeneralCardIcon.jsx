import React from 'react';

function GeneralCardIcon(props) {
    const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 48 48"
      className={className}
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <g>
          <path d="M0 0L48 0 48 48 0 48z" />
          <path
            fill="#B8BFC7"
            fillRule="nonzero"
            d="M40 8H8c-2.22 0-3.98 1.78-3.98 4L4 36c0 2.22 1.78 4 4 4h32c2.22 0 4-1.78 4-4V12c0-2.22-1.78-4-4-4zm-2 28H10c-1.1 0-2-.9-2-2V24h32v10c0 1.1-.9 2-2 2zm2-20H8v-4h32v4z"
          />
        </g>
      </g>
    </svg>
  );
}

export default GeneralCardIcon;
