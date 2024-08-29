import React from 'react';

function ErrorWarnIcon(props) {
    const { className, ariaHidden } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={className}
      aria-hidden={ariaHidden}
    >
      <path
        fill="#F07F7F"
        d="M8 4c.44 0 .8.36.8.8V8c0 .44-.36.8-.8.8-.44 0-.8-.36-.8-.8V4.8c0-.44.36-.8.8-.8zm-.008-4C3.576 0 0 3.584 0 8s3.576 8 7.992 8C12.416 16 16 12.416 16 8s-3.584-8-8.008-8zM8 14.4A6.398 6.398 0 011.6 8c0-3.536 2.864-6.4 6.4-6.4 3.536 0 6.4 2.864 6.4 6.4 0 3.536-2.864 6.4-6.4 6.4zm.8-2.4H7.2v-1.6h1.6V12z"
      />
    </svg>
  );
}

export default ErrorWarnIcon;
