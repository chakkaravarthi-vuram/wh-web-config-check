import React from 'react';

function PlusOperatorIcon(props) {
  const { onClick, role, ariaLabel } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="9"
      height="9"
      viewBox="0 0 9 9"
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
    >
      <path
        fill="#6C727E"
        d="M9 4.5c0 .383-.31.693-.692.693H5.192v3.115a.692.692 0 11-1.384 0V5.193H.692a.692.692 0 110-1.385h3.116V.693a.692.692 0 111.384 0v3.115h3.116c.383 0 .692.31.692.692z"
      />
    </svg>
  );
}

export default PlusOperatorIcon;
