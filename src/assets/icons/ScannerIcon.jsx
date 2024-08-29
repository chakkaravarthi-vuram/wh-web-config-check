import React from 'react';

function ScannerIcon(props) {
  const { className, onClick, title, tabIndex, role, onKeyDown } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="16"
      viewBox="0 0 20 16"
      className={className}
      onClick={onClick}
      tabIndex={tabIndex}
      role={role}
      onKeyDown={onKeyDown}
    >
      <title>{title}</title>
      <path
        fill="#6C727E"
        d="M0 16v-4.044h1.333v2.71h2.711V16H0zm15.489 0v-1.333H18.2v-2.711h1.333V16H15.49zM2.51 13.533V2.444h1.78v11.09H2.51zm2.689 0V2.444h.933v11.09H5.2zm2.711 0V2.444h1.845v11.09H7.91zm2.778 0V2.444h2.689v11.09h-2.69zm3.622 0V2.444h.933v11.09h-.933zm1.845 0V2.444H17v11.09h-.844zM0 4.044V0h4.044v1.333h-2.71v2.711H0zm18.2 0v-2.71h-2.711V0h4.044v4.044H18.2z"
      />
    </svg>
  );
}

export default ScannerIcon;
