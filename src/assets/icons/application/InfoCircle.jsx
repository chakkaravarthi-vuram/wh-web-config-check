import React from 'react';

function InfoCircle(props) {
  const { fill, className, width, height } = props;
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width || 20}
    height={height || 20}
    fill="none"
    className={className}
  >
    <g clipPath="url(#a)">
      <path
        fill={fill || '#9E9E9E'}
        fillRule="evenodd"
        d="M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15ZM.835 10a9.167 9.167 0 1 1 18.333 0A9.167 9.167 0 0 1 .834 10Zm8.333-3.334c0-.46.373-.833.834-.833h.008a.833.833 0 0 1 0 1.667h-.008a.833.833 0 0 1-.834-.834Zm.834 2.5c.46 0 .833.373.833.834v3.333a.833.833 0 0 1-1.667 0V10c0-.46.373-.834.834-.834Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
         </svg>;
}
export default InfoCircle;
