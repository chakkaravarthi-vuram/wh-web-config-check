import React from 'react';

function PlusIconBlueNew(props) {
  const { title, className, onClick, onKeyDown, tabIndex, fillColor } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="12"
      fill="none"
      viewBox="0 0 13 12"
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={className}
    >
      <title>{title}</title>
      <path
        fill={fillColor || '#217CF5'}
        d="M12.5 6.75H7.25V12h-1.5V6.75H.5v-1.5h5.25V0h1.5v5.25h5.25v1.5z"
      />
    </svg>
  );
}

export default PlusIconBlueNew;
