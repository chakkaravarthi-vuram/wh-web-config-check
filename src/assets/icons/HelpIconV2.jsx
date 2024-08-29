import React from 'react';

function HelpIconV2(props) {
    const { onClick, className, role, style, ariaLabel, buttonColor, id } = props;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 16 16"
        id={id}
        className={className}
        role={role}
        aria-label={ariaLabel}
        onClick={onClick}
        style={{ ...style, fill: buttonColor }}
      >
        <g clipPath="url(#clip0_30_13224)">
          <path
            stroke="#B8BFC7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.333"
            d="M6.06 6a2 2 0 013.887.667c0 1.333-2 2-2 2M8 11.333h.007M14.667 8A6.667 6.667 0 111.333 8a6.667 6.667 0 0113.334 0z"
          />
        </g>
        <defs>
          <clipPath id="clip0_30_13224">
            <path fill="#fff" d="M0 0H16V16H0z" />
          </clipPath>
        </defs>
      </svg>
    );
}

export default HelpIconV2;
