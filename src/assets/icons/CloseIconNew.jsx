import React from 'react';

function CloseIconNew(props) {
  const { className, onClick, fillClass, width, height, ariaLabel, ariaHidden, role, tabIndex, onKeyDown } = props;
  let iconFill = '';
  if (fillClass) {
    iconFill = fillClass;
  } else {
    iconFill = '#b8bfc7';
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || '13'}
      height={height || '13'}
      viewBox="0 0 13 13"
      role={role}
      className={className}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
    >
      <path
        fill={iconFill}
        fillRule="evenodd"
        d="M2.179.293l4.006 4.006L10.192.293a1 1 0 011.32-.083l.095.083.471.471a1 1 0 010 1.415L8.071 6.185l4.007 4.007a1 1 0 010 1.415l-.471.471a1 1 0 01-1.415 0L6.185 8.071l-4.006 4.007a1 1 0 01-1.32.083l-.095-.083-.471-.471a1 1 0 010-1.415l4.006-4.007L.293 2.179a1 1 0 010-1.415L.764.293a1 1 0 011.415 0z"
        strokeWidth="10"
      />
    </svg>
  );
}

export default CloseIconNew;
