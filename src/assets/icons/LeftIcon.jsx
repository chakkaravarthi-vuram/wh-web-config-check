import React from 'react';

function LeftIcon(props) {
  const { title, onClick, onKeydown, className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="13"
      fill="none"
      viewBox="0 0 8 13"
      className={className}
      onClick={onClick}
      onKeyDown={onKeydown}
    >
      <title>{title}</title>
      <path
        fill="#959BA3"
        d="M6.625 13L7.7 11.923l-4.95-4.95 4.95-4.95L6.625.95.6 6.974 6.625 13z"
      />
    </svg>
  );
}

export default LeftIcon;
