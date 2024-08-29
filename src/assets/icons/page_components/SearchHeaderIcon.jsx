import React from 'react';

function SearchHeaderIcon(props) {
  const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      className={className}
    >
      <g>
        <g>
          <mask id="path-1-inside-1_24252_70697" fill="#fff">
            <rect width="19" height="7" x="2" y="3" rx="1" />
          </mask>
          <rect
            width="19"
            height="7"
            x="2"
            y="3"
            stroke="#9E9E9E"
            strokeWidth="3.2"
            mask="url(#path-1-inside-1_24252_70697)"
            rx="1"
          />
        </g>
        <path
          stroke="#9E9E9E"
          strokeLinecap="round"
          strokeWidth="1.66"
          d="M3 20.5h12"
        />
        <path
          stroke="#9E9E9E"
          strokeLinecap="round"
          strokeWidth="1.66"
          d="M3 17h17"
        />
        <path
          stroke="#9E9E9E"
          strokeLinecap="round"
          strokeWidth="1.66"
          d="M3 13.5h12"
        />
      </g>
    </svg>
  );
}

export default SearchHeaderIcon;
