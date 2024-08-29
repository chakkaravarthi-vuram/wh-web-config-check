import React from 'react';

function HomeSelectedIcon(props) {
    const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      className={className}
    >
      <g>
        <path
          fill="#217CF5"
          d="M9.478.996a.85.85 0 011.044 0l7.5 5.833a.85.85 0 01.328.671v9.167a2.517 2.517 0 01-2.517 2.517H12.5a.85.85 0 01-.85-.85V10.85h-3.3v7.484c0 .469-.38.85-.85.85H4.167a2.517 2.517 0 01-2.517-2.517V7.5a.85.85 0 01.328-.67l7.5-5.834z"
        />
      </g>
    </svg>
  );
}

export default HomeSelectedIcon;
