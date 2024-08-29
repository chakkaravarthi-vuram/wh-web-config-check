import React from 'react';

function RichTextIcon(props) {
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
      <g
        stroke="#9E9E9E"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      >
        <path d="M4.51 8.346V6.78c0-.989.772-1.78 1.718-1.78h12.053C19.236 5 20 5.8 20 6.78v1.566" />
        <path d="M12.255 20V5.714" />
        <path d="M8.984 19.999h6.542" />
      </g>
    </svg>
  );
}

export default RichTextIcon;
