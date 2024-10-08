import React from 'react';

function SingleLineIcon(props) {
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
      <g id="align-left">
        <path
          stroke="#959BA3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
          d="M13 7H5.2c-1.12 0-1.68 0-2.108.218a2 2 0 00-.874.874C2 8.52 2 9.08 2 10.2v3.6c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874C3.52 17 4.08 17 5.2 17H13m4-10h1.8c1.12 0 1.68 0 2.108.218a2 2 0 01.874.874C22 8.52 22 9.08 22 10.2v3.6c0 1.12 0 1.68-.218 2.108a2 2 0 01-.874.874C20.48 17 19.92 17 18.8 17H17m0 4V3m2.5 0h-5m5 18h-5"
        />
      </g>
    </svg>
  );
}

export default SingleLineIcon;
