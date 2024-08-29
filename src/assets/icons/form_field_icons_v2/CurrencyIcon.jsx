import React from 'react';

function CurrencyIcon(props) {
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
          d="M12 2.85a9.15 9.15 0 100 18.3 9.15 9.15 0 000-18.3zM1.15 12C1.15 6.008 6.008 1.15 12 1.15S22.85 6.008 22.85 12 17.992 22.85 12 22.85 1.15 17.992 1.15 12zM12 4.65c.47 0 .85.38.85.85v.65h.317a3.183 3.183 0 013.183 3.183.85.85 0 01-1.7 0c0-.819-.664-1.483-1.483-1.483H11a1.65 1.65 0 100 3.3h2a3.35 3.35 0 110 6.7h-.15v.65a.85.85 0 01-1.7 0v-.65h-.317a3.183 3.183 0 01-3.183-3.183.85.85 0 111.7 0c0 .819.664 1.483 1.483 1.483H13a1.65 1.65 0 100-3.3h-2a3.35 3.35 0 010-6.7h.15V5.5c0-.47.38-.85.85-.85z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  );
}

export default CurrencyIcon;
