import React from 'react';

function MeatBallMenu(props) {
  const { className, onClick, title } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      className={className}
      onClick={onClick}
      title={title}
    >
      <circle
        cx="18"
        cy="12"
        r="2"
        fill="#959BA3"
        transform="rotate(90 18 12)"
      />
      <circle
        cx="12"
        cy="12"
        r="2"
        fill="#959BA3"
        transform="rotate(90 12 12)"
      />
      <circle cx="6" cy="12" r="2" fill="#959BA3" transform="rotate(90 6 12)" />
    </svg>
  );
}

export default MeatBallMenu;
