import React from 'react';
import { ARIA_ROLES } from 'utils/UIConstants';

function ResetPasswordIcon(props) {
    const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="77"
      viewBox="0 0 100 77"
      className={className}
      role={ARIA_ROLES.IMG}
      aria-hidden="true"
    >
      <title>Email Sent Image</title>
      <g fill="none">
        <path
          fill="#697181"
          d="M19.34 0h72.797C96.459 0 100 3.537 100 7.863v46.673c0 4.326-3.54 7.863-7.863 7.863H42.259c.55-2 .845-4.103.845-6.278 0-13.022-10.554-23.576-23.576-23.576-2.83 0-5.54.498-8.054 1.412V7.863C11.474 3.537 15.011 0 19.337 0h.004z"
        />
        <path
          fill="#11A5E3"
          d="M19.531 37c10.787 0 19.532 8.746 19.532 19.531 0 10.787-8.743 19.532-19.532 19.532C8.745 76.063 0 67.317 0 56.53S8.746 37 19.531 37z"
        />
        <path
          fill="#FFF"
          d="M14.491 50.203a1.224 1.224 0 011.464-1.96l9.554 7.139a1.224 1.224 0 01-.019 1.976l-9.535 7.123a1.224 1.224 0 01-1.464-1.96l8.243-6.158-8.243-6.157v-.003zm4.029-37.326a2.02 2.02 0 01-1.02-2.664 2.02 2.02 0 012.664-1.02L55.74 25.185 91.317 9.193a2.017 2.017 0 111.643 3.684l-36.4 16.361a2.005 2.005 0 01-1.643 0l-36.4-16.36h.003z"
        />
      </g>
    </svg>
  );
}

export default ResetPasswordIcon;
