import React from 'react';

function NoDashBoardFoundIcon(props) {
  const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="54"
      height="54"
      fill="none"
      viewBox="0 0 54 54"
      className={className}
    >
      <path
        fill="#959BA3"
        d="M0 0h24.75v24.75H0V0zm29.25 0H54v24.75H29.25V0zM0 29.25h24.75V54H0V29.25zm39.375 0h4.5v10.125H54v4.5H43.875V54h-4.5V43.875H29.25v-4.5h10.125V29.25zM33.75 4.5v15.75H49.5V4.5H33.75zM4.5 4.5v15.75h15.75V4.5H4.5zm0 29.25V49.5h15.75V33.75H4.5z"
      />
      <path
        fill="#217CF5"
        d="M43.875 29.25h-4.5v10.125H29.25v4.5h10.125V54h4.5V43.875H54v-4.5H43.875V29.25z"
      />
    </svg>
  );
}

export default NoDashBoardFoundIcon;
