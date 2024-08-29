import React from 'react';

function LessOperatorIcon(props) {
  const { onClick, role, ariaLabel } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="8"
      viewBox="0 0 8 8"
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
    >
      <path
        fill="#6C727E"
        d="M7.314 8a.668.668 0 01-.297-.07L.35 4.595A.685.685 0 010 4c0-.253.143-.483.369-.597L7.035.07a.667.667 0 01.596 1.193L2.156 4l5.475 2.737c.33.165.463.565.298.895A.675.675 0 017.314 8z"
      />
    </svg>
  );
}

export default LessOperatorIcon;
