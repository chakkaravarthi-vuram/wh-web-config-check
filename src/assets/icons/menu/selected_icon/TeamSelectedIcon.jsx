import React from 'react';

function TeamSelectedIcon(props) {
  const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="21"
      fill="none"
      viewBox="0 0 20 21"
      className={className}
    >
      <g clipPath="url(#clip0_15721_34614)">
        <path
          fill="#217CF5"
          fillRule="evenodd"
          d="M3.733 5.873a4.183 4.183 0 118.366 0 4.183 4.183 0 01-8.366 0zm8.395-3.41a.85.85 0 011.107-.469 4.184 4.184 0 010 7.758.85.85 0 11-.638-1.576 2.484 2.484 0 000-4.606.85.85 0 01-.47-1.107zM6.636 11.69h2.56c.751 0 1.358 0 1.851.034.509.034.96.107 1.386.284a4.183 4.183 0 012.264 2.264c.177.428.25.878.285 1.386.034.494.034 1.1.034 1.852v.03c0 .47-.381.85-.85.85h-12.5a.85.85 0 01-.85-.85v-.03c0-.751 0-1.358.034-1.852.035-.508.108-.958.285-1.386a4.183 4.183 0 012.264-2.264c.427-.176.877-.25 1.386-.284.493-.034 1.1-.034 1.851-.034zm8.373.743a.85.85 0 011.035-.611 4.185 4.185 0 013.138 4.051v1.667a.85.85 0 11-1.7 0v-1.667c0-1.156-.79-2.13-1.862-2.405a.85.85 0 01-.611-1.035z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="clip0_15721_34614">
          <path
            fill="#fff"
            d="M0 0H19.998V20H0z"
            transform="translate(0 .04)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

export default TeamSelectedIcon;
