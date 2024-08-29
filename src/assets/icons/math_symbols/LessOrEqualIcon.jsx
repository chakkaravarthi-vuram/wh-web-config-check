import React from 'react';

function LessOrEqualtoIcon(props) {
    const { onClick, role, ariaLabel } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="8"
      viewBox="0 0 8 8"
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
    >
      <path
        fill="#6C727E"
        d="M.93 3.389l5.715 2.285c.07.029.14.041.196.041a.571.571 0 00.213-1.102L2.682 2.858 7.07 1.103A.571.571 0 006.645.041L.93 2.328a.571.571 0 000 1.06zm6.499 3.47H.57a.568.568 0 00-.57.554c0 .3.256.587.571.587H7.43a.571.571 0 100-1.143z"
      />
    </svg>
  );
}

export default LessOrEqualtoIcon;
