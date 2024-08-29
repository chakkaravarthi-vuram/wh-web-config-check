import React from 'react';

function DatalistListingIcon(props) {
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
      <path
        stroke="#9E9E9E"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
        d="M11.666 1.891v3.442c0 .467 0 .7.09.879.08.157.208.284.365.364.178.09.411.09.878.09h3.442m-3.109 4.167H6.666m6.666 3.334H6.666M8.333 7.5H6.666m5-5.833H7.333c-1.4 0-2.1 0-2.635.272a2.5 2.5 0 00-1.093 1.093c-.272.535-.272 1.235-.272 2.635v8.666c0 1.4 0 2.1.272 2.635a2.5 2.5 0 001.093 1.093c.535.272 1.235.272 2.635.272h5.333c1.4 0 2.1 0 2.634-.272a2.5 2.5 0 001.093-1.093c.272-.534.272-1.235.272-2.635V6.667l-5-5z"
      />
    </svg>
  );
}

export default DatalistListingIcon;
