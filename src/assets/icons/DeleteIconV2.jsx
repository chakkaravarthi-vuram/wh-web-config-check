import React from 'react';
import { ARIA_ROLES } from 'utils/UIConstants';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';

function DeleteIconV2(props) {
  const { className, onClick, title } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="18"
      fill="none"
      viewBox="0 0 16 18"
      className={className}
      onClick={onClick}
      onKeyDown={(e) => onClick && keydownOrKeypessEnterHandle(e) && onClick()}
      tabIndex={onClick ? 0 : -1}
      role={ARIA_ROLES.BUTTON}
    >
      <title>{title}</title>
      <path
        fill="#959BA3"
        d="M2.525 18c-.417 0-.77-.146-1.062-.438a1.447 1.447 0 01-.438-1.062V3H0V1h4.7V0h6.6v1H16v2h-1.025v13.5c0 .4-.15.75-.45 1.05-.3.3-.65.45-1.05.45H2.525zM13 3H3v13h10V3zM5.175 14.35H7V4.375H5.175v9.975zm3.825 0h1.825V4.375H9v9.975z"
      />
    </svg>
  );
}

export default DeleteIconV2;
