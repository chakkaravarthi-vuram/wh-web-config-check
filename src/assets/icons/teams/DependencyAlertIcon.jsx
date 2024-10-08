import React from 'react';

function DependencyAlertIcon(props) {
  const { className, style } = props;
  return (
    <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={({ ...style })}
    >
      <g>
      <path
        d="M14.9998 20.3332V14.9998M14.9998 9.6665H15.0132M28.3332 14.9998C28.3332 22.3636 22.3636 28.3332 14.9998 28.3332C7.63604 28.3332 1.6665 22.3636 1.6665 14.9998C1.6665 7.63604 7.63604 1.6665 14.9998 1.6665C22.3636 1.6665 28.3332 7.63604 28.3332 14.9998Z"
        stroke="#DC6803"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      </g>
    </svg>
  );
}

export default DependencyAlertIcon;
