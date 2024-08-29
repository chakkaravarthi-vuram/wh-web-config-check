import React from 'react';

function InfoCircle(props) {
  const { iconFillColor = '#9E9E9E', iconRef } = props;
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={iconRef}
    >
      <g id="info-circle" clip-path="url(#clip0_4768_32990)">
        <path
          id="Icon (Stroke)"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M7.99984 2.00033C4.68613 2.00033 1.99984 4.68662 1.99984 8.00033C1.99984 11.314 4.68613 14.0003 7.99984 14.0003C11.3135 14.0003 13.9998 11.314 13.9998 8.00033C13.9998 4.68662 11.3135 2.00033 7.99984 2.00033ZM0.666504 8.00033C0.666504 3.95024 3.94975 0.666992 7.99984 0.666992C12.0499 0.666992 15.3332 3.95024 15.3332 8.00033C15.3332 12.0504 12.0499 15.3337 7.99984 15.3337C3.94975 15.3337 0.666504 12.0504 0.666504 8.00033ZM7.33317 5.33366C7.33317 4.96547 7.63165 4.66699 7.99984 4.66699H8.0065C8.37469 4.66699 8.67317 4.96547 8.67317 5.33366C8.67317 5.70185 8.37469 6.00033 8.0065 6.00033H7.99984C7.63165 6.00033 7.33317 5.70185 7.33317 5.33366ZM7.99984 7.33366C8.36803 7.33366 8.6665 7.63213 8.6665 8.00033V10.667C8.6665 11.0352 8.36803 11.3337 7.99984 11.3337C7.63165 11.3337 7.33317 11.0352 7.33317 10.667V8.00033C7.33317 7.63213 7.63165 7.33366 7.99984 7.33366Z"
          fill={iconFillColor}
        />
      </g>
      <defs>
        <clipPath id="clip0_4768_32990">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default InfoCircle;
