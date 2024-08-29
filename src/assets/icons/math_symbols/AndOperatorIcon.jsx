import React from 'react';

function AndOperatorIcon(props) {
    const { onClick } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="7"
      viewBox="0 0 20 7"
      onClick={onClick}
    >
      <text
        fill="#6C727E"
        fillRule="evenodd"
        fontFamily="Inter-SemiBold, Inter"
        fontSize="9"
        fontWeight="500"
        transform="translate(-9 -9)"
      >
        <tspan x="9" y="16">
          AND
        </tspan>
      </text>
    </svg>
  );
}

export default AndOperatorIcon;
