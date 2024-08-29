import React from 'react';

function GreatorOrEqualIcon(props) {
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
        d="M.612 5.356a.571.571 0 00.743.318l5.714-2.27a.612.612 0 00.36-.546.572.572 0 00-.36-.531L1.355.041a.57.57 0 10-.424 1.062l4.387 1.755L.931 4.613a.572.572 0 00-.319.743zM7.43 6.858H.57A.571.571 0 10.571 8H7.43a.571.571 0 100-1.143z"
      />
    </svg>
  );
}

export default GreatorOrEqualIcon;
