import React from 'react';

function EqualOperatorIcon(props) {
  const { onClick, role, ariaLabel } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="9"
      height="6"
      viewBox="0 0 9 6"
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
    >
      <path
        fill="#6C727E"
        d="M.692 1.365h7.616c.382 0 .692-.31.692-.692A.676.676 0 008.308 0H.692A.688.688 0 000 .673c0 .363.31.692.692.692zm7.616 2.77H.692A.688.688 0 000 4.806c0 .363.31.693.692.693h7.616A.691.691 0 009 4.807a.676.676 0 00-.692-.673z"
      />
    </svg>
  );
}

export default EqualOperatorIcon;
