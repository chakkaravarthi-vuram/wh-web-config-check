import React from 'react';

function EraseFormulaIcon(props) {
    const { className, role, ariaLabel, ariaHidden } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="12"
      viewBox="0 0 13 12"
      className={className}
      role={role}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
    >
      <path
        fill="#6C727E"
        d="M12.412 4.788c0-.483-.196-.94-.536-1.293L8.91.529a1.83 1.83 0 00-2.574 0l-5.8 5.788C.196 6.657 0 7.114 0 7.61c0 .484.196.94.536 1.294l1.79 1.79H1.293c-.365 0-.653.3-.653.653 0 .366.3.653.653.653h9.812c.366 0 .653-.3.653-.653 0-.366-.3-.653-.653-.653H7.277l4.612-4.612c.327-.34.523-.797.523-1.294zm-8.218 5.906l-2.73-2.731a.505.505 0 010-.706l2.9-2.9 3.684 3.684-2.64 2.653H4.195z"
      />
    </svg>
  );
}

export default EraseFormulaIcon;
