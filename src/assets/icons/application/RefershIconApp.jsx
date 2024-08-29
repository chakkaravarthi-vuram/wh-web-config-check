import React from 'react';

function RefreshIconApp(props) {
  const { className, title } = props;
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    className={className}
  >
    <title>{title}</title>
    <path
      stroke="#9E9E9E"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.67}
      d="M17.043 10.745a7.083 7.083 0 0 1-13.179 2.798l-.208-.361m-.702-3.925a7.083 7.083 0 0 1 13.179-2.798l.209.36M2.91 15.057l.61-2.277 2.277.61M14.2 6.612l2.277.61.61-2.276"
    />
         </svg>;
}
export default RefreshIconApp;
