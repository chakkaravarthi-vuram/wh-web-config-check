import React from 'react';
import cx from 'classnames';
import gClasses from '../scss/Typography.module.scss';

function BlueLoadingSpinnerIcon(props) {
  const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      fill="none"
      viewBox="0 0 48 48"
      className={cx(gClasses.SpinAnimation, className)}
    >
      <g>
        <g>
          <g strokeLinecap="round" strokeWidth="4">
            <path
              stroke="url(#paint0_linear_5814_9944)"
              d="M3 24c0 11.25 9 21 21 21 6 0 12-3 15.75-6.75"
            />
            <path
              stroke="#217CF5"
              d="M45 24c0-12-9.402-21-21-21S3 12 3 24"
            />
          </g>
        </g>
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_5814_9944"
          x1="41.25"
          x2="1.5"
          y1="34.5"
          y2="34.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.224" stopColor="#217CF5" stopOpacity="0.03" />
          <stop offset="1" stopColor="#217CF5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default BlueLoadingSpinnerIcon;
