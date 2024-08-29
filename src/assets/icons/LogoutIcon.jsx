import React from 'react';
import { keydownOrKeypessEnterHandle } from '../../utils/UtilityFunctions';

function LogoutIcon(props) {
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
      <path
        fill="#9E9E9E"
        fillRule="evenodd"
        d="M.834 10c0-4.573 3.577-8.334 8.056-8.334a7.82 7.82 0 014.04 1.122.833.833 0 01-.858 1.43 6.152 6.152 0 00-3.182-.885c-3.5 0-6.39 2.955-6.39 6.666 0 3.712 2.89 6.667 6.39 6.667a6.152 6.152 0 003.181-.884.833.833 0 01.859 1.428 7.82 7.82 0 01-4.04 1.123c-4.479 0-8.056-3.761-8.056-8.334zm13.577-3.923a.833.833 0 011.179 0l3.333 3.333a.833.833 0 010 1.179l-3.333 3.333a.833.833 0 11-1.179-1.179l1.911-1.91H7.501a.833.833 0 010-1.667h8.821l-1.91-1.91a.833.833 0 010-1.18z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default LogoutIcon;
