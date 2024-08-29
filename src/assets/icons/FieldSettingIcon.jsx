import React from 'react';

function FieldSettingIcon(props) {
    const { className, onClick } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      className={className}
      onClick={onClick}
    >
      <g clipPath="url(#clip0_18056_29677)">
        <g
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        >
          <path d="M8 10a2 2 0 100-4 2 2 0 000 4z" />
          <path d="M12.933 10a1.1 1.1 0 00.22 1.213l.04.04a1.333 1.333 0 11-1.886 1.887l-.04-.04a1.1 1.1 0 00-1.214-.22 1.1 1.1 0 00-.666 1.006V14a1.333 1.333 0 11-2.667 0v-.06A1.1 1.1 0 006 12.933a1.1 1.1 0 00-1.213.22l-.04.04a1.334 1.334 0 11-1.887-1.886l.04-.04a1.1 1.1 0 00.22-1.214 1.1 1.1 0 00-1.007-.667H2A1.333 1.333 0 112 6.72h.06A1.1 1.1 0 003.067 6a1.1 1.1 0 00-.22-1.213l-.04-.04A1.333 1.333 0 114.693 2.86l.04.04a1.1 1.1 0 001.214.22H6a1.1 1.1 0 00.667-1.007V2a1.333 1.333 0 112.666 0v.06A1.1 1.1 0 0010 3.066a1.1 1.1 0 001.213-.22l.04-.04a1.333 1.333 0 111.887 1.887l-.04.04a1.1 1.1 0 00-.22 1.214V6a1.1 1.1 0 001.007.667H14a1.333 1.333 0 010 2.666h-.06a1.1 1.1 0 00-1.007.667z" />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_18056_29677">
          <path fill="#fff" d="M0 0H16V16H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default FieldSettingIcon;
