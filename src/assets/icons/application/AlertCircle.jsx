import React from 'react';

function AlertCircle(props) {
  const { className, title, role } = props;
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    className={className}
    role={role}
  >
    <title>{title}</title>
    <path
      stroke="#D92D20"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4m0 4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z"
    />
         </svg>;
}
export default AlertCircle;
