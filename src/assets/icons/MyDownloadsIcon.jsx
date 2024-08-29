import React from 'react';
import { keydownOrKeypessEnterHandle } from '../../utils/UtilityFunctions';

function HelpCircleIcon(props) {
  const {
    className,
    onClick,
    ariaLabel,
    ariaHidden,
    role,
    tabIndex,
    onKeyDown,
  } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      role={role}
      className={className}
      tabIndex={tabIndex}
      onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onKeyDown(e)}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
    >
      <g clipPath="url(#clip0_7329_13212)">
        <path
          fill="#9E9E9E"
          fillRule="evenodd"
          d="M10 2.499a7.5 7.5 0 100 15 7.5 7.5 0 000-15zm-9.166 7.5a9.167 9.167 0 1118.333 0 9.167 9.167 0 01-18.333 0zm9.382-3.313a1.667 1.667 0 00-1.854 1.09.833.833 0 11-1.572-.554 3.333 3.333 0 016.477 1.11c0 1.276-.946 2.118-1.62 2.568a6.707 6.707 0 01-1.406.707l-.029.01-.009.004H10.2l-.001.001s-.002 0-.265-.79l.264.79a.833.833 0 01-.528-1.58l.013-.005.062-.023a5.035 5.035 0 00.977-.5c.574-.383.879-.791.879-1.182v-.001a1.667 1.667 0 00-1.385-1.645zm-1.049 7.48c0-.46.373-.834.834-.834h.008a.833.833 0 010 1.667h-.008a.833.833 0 01-.834-.834z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="clip0_7329_13212">
          <path fill="#fff" d="M0 0H20V20H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default HelpCircleIcon;
