import React from 'react';

function FourColumnsIcon(props) {
  const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      className={className}
    >
      <g clipPath="url(#clip0_8257_41328)">
        <g>
          <path
            fill="#9E9E9E"
            d="M10.91 15.272V.725h1.453v14.547h-1.454V.725h1.454v14.547h-1.454zm-3.638 0V.725h1.453v14.547H7.272V.725h1.453v14.547H7.272zm-3.638 0V.725h1.454v14.547H3.634V.725h1.454v14.547H3.634zM.728.728V0H16v16H0V0h.728v.728h.728v13.819h13.09V1.457H.729V.727z"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_8257_41328">
          <rect
            width="16"
            height="16"
            fill="#fff"
            rx="2"
            transform="matrix(1 0 0 -1 0 16)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

export default FourColumnsIcon;
