import React from 'react';

function OrOperatorIcon(props) {
    const { onClick } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="8"
      viewBox="0 0 13 8"
      onClick={onClick}
    >
      <text
        fill="#6C727E"
        fillRule="evenodd"
        fontFamily="Inter-SemiBold, Inter"
        fontSize="9"
        fontWeight="500"
        transform="translate(-41 -9)"
      >
        <tspan x="41" y="16">
          OR
        </tspan>
      </text>
    </svg>
  );
}

export default OrOperatorIcon;
