import React from 'react';

function BillingMenuIcon(props) {
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
      <g>
        <path
          fill="#9E9E9E"
          fillRule="evenodd"
          d="M4.167 3.96a.833.833 0 000 1.667h11.666a2.5 2.5 0 012.5 2.5v8.333a2.5 2.5 0 01-2.5 2.5H4.167a2.5 2.5 0 01-2.5-2.5V4.793a2.5 2.5 0 012.5-2.5h10a.833.833 0 010 1.667h-10zm-.834 3.191v9.31c0 .46.373.833.834.833h11.666c.46 0 .834-.374.834-.834V8.127a.833.833 0 00-.834-.834H4.167c-.293 0-.573-.05-.834-.142zm9.167 5.143a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  );
}

export default BillingMenuIcon;
