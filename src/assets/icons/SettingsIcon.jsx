import React from 'react';
import { keydownOrKeypessEnterHandle } from '../../utils/UtilityFunctions';

function SettingsIcon(props) {
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
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
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
        d="M14.583 3.333a2.083 2.083 0 100 4.166 2.083 2.083 0 000-4.166zm-2.357-.834a3.75 3.75 0 110 5.833H4.583a2.917 2.917 0 110-5.833h7.643zm-1.18 1.667H4.583a1.25 1.25 0 000 2.5h6.463a3.744 3.744 0 01-.213-1.25c0-.438.075-.859.213-1.25zm-9.38 10.417a3.75 3.75 0 016.107-2.917h7.643a2.917 2.917 0 010 5.833H7.773a3.75 3.75 0 01-6.107-2.917zm7.287 1.25h6.463a1.25 1.25 0 000-2.5H8.953c.138.39.213.811.213 1.25 0 .438-.075.859-.213 1.25zm-3.537-3.334a2.083 2.083 0 100 4.167 2.083 2.083 0 000-4.167z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default SettingsIcon;
