import React from 'react';

function BeautifyIcon(props) {
    const { className, role, ariaHidden, ariaLabel } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="12"
      viewBox="0 0 11 12"
      className={className}
      role={role}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
    >
      <path
        fill="#6C727E"
        d="M5.958 4.583l1.375 1.375-1.375 1.375.917.917 2.292-2.292-2.292-2.291-.917.916zM0 0v11.917h11V0H0zm10.083 11H.917V.917h9.166V11zM5.042 7.333L3.667 5.958l1.375-1.375-.917-.916-2.292 2.291L4.125 8.25l.917-.917z"
      />
    </svg>
  );
}

export default BeautifyIcon;
