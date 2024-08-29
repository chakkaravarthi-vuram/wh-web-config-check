import React from 'react';

function DatalistMiniIcon(props) {
    const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="11"
      fill="none"
      viewBox="0 0 8 11"
      className={className}
    >
      <path
        fill="#217CF5"
        fillRule="evenodd"
        d="M5 0H1C.45 0 0 .463 0 1.029v8.228c0 .566.445 1.029.995 1.029H7c.55 0 1-.463 1-1.029V3.086L5 0zm1 5.143H2V6.17h4V5.143zM6 7.2H2v1.029h4V7.2zM1 9.257h6V3.6H4.5V1.029H1v8.228z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default DatalistMiniIcon;
