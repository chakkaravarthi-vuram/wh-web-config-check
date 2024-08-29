import React from 'react';

function DataListIcon(props) {
    const { className, height, width } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || '13'}
      height={height || '16'}
      fill="none"
      viewBox="0 0 13 16"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M7.778 0H1.556C.7 0 0 .72 0 1.6v12.8c0 .88.692 1.6 1.548 1.6h9.34c.856 0 1.556-.72 1.556-1.6V4.8L7.778 0zm1.555 8H3.111v1.6h6.222V8zm0 3.2H3.111v1.6h6.222v-1.6zm-7.776 3.2H10.889V5.6H7v-4H1.557v12.8z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default DataListIcon;
