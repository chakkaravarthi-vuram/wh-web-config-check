import React from 'react';

function BigAlertIcon(props) {
    const { className, role, ariaLabel } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="42"
      viewBox="0 0 48 42"
      className={className}
      role={role}
      aria-label={ariaLabel}
    >
      <g fill="none" fillRule="evenodd">
        <path
          fill="#FE6C6A"
          d="M47.354 34.685L28.412 2.438C27.532.914 25.895 0 24.007 0c-1.888 0-3.461.914-4.405 2.438L.661 34.685a4.83 4.83 0 000 4.877C1.54 41.086 3.178 42 5.003 42h37.883c1.825 0 3.461-.914 4.342-2.438 1.007-1.524 1.007-3.353.126-4.877z"
        />
        <path
          fill="#FFF"
          fillRule="nonzero"
          d="M27 26.5v-16h-6v16h6zm-2.962 8c.85 0 1.556-.29 2.118-.871.563-.58.844-1.297.844-2.148 0-.852-.281-1.562-.844-2.13-.562-.567-1.268-.851-2.118-.851-.875 0-1.6.284-2.175.852-.575.567-.863 1.277-.863 2.129 0 .851.288 1.567.863 2.148.575.58 1.3.871 2.175.871z"
        />
      </g>
    </svg>
  );
}

export default BigAlertIcon;
