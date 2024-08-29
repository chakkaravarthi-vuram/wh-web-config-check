import React from 'react';

function TestSuccessIcon(props) {
  const { className, title } = props;
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>{title}</title>
      <path
        d="M28.3333 13.7732V14.9999C28.3317 17.8751 27.4006 20.6728 25.6791 22.9757C23.9575 25.2785 21.5377 26.9632 18.7804 27.7784C16.0232 28.5937 13.0763 28.4958 10.3793 27.4993C7.6822 26.5029 5.3795 24.6614 3.81457 22.2493C2.24965 19.8373 1.50635 16.984 1.69553 14.115C1.88471 11.246 2.99624 8.515 4.86433 6.32933C6.73243 4.14366 9.25701 2.62041 12.0615 1.98676C14.8661 1.35311 17.8003 1.64302 20.4266 2.81323M28.3333 4.33323L15 17.6799L11 13.6799"
        stroke="#039855"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export default TestSuccessIcon;
