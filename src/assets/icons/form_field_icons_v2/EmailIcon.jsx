import React from 'react';

function DataListPropertyPickerIcon(props) {
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
          fill="#959BA3"
          fillRule="evenodd"
          d="M2.92 5.607L12 11.962l9.08-6.355A1.157 1.157 0 0020 4.85H4c-.493 0-.918.317-1.08.757zm18.23 2.026l-8.663 6.063a.85.85 0 01-.975 0L2.85 7.633V18c0 .63.52 1.15 1.15 1.15h16c.63 0 1.15-.52 1.15-1.15V7.633zM1.15 6c0-1.57 1.28-2.85 2.85-2.85h16c1.57 0 2.85 1.28 2.85 2.85v12c0 1.57-1.28 2.85-2.85 2.85H4c-1.57 0-2.85-1.28-2.85-2.85V6z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  );
}

export default DataListPropertyPickerIcon;
