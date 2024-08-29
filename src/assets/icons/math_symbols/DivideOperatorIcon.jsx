import React from 'react';

function DivideOperatorIcon(props) {
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
        d="M8.308 3.808H.692A.688.688 0 000 4.48c0 .363.31.692.692.692h7.616c.382 0 .692-.31.692-.692a.675.675 0 00-.692-.673zM4.5 2.077A1.04 1.04 0 004.5 0a1.04 1.04 0 000 2.077zm0 4.846A1.04 1.04 0 004.5 9a1.04 1.04 0 000-2.077z"
      />
    </svg>
  );
}

export default DivideOperatorIcon;
