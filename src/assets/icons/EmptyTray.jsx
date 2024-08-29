import React from 'react';
import { ARIA_ROLES } from 'utils/UIConstants';

function EmptyTrayIcon(props) {
  const { ariaLabel } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      role={ARIA_ROLES.IMG}
      aria-label={ariaLabel}
    >
      <path
        fill="#959BA3"
        d="M14.417 9.905l-2.26-3.81H3.843L2.501 8.381h.006l-.89 1.524H6c0 1.262.895 2.285 2 2.285s2-1.023 2-2.285h4.417zm1.583 0V16H0V9.905l3.133-5.333h9.735L16 9.905zM4.944 11.429h-3.61v3.047h13.332V11.43h-3.61c-.515 1.345-1.69 2.285-3.057 2.285s-2.541-.94-3.056-2.285h.001zm3.723-8.381H7.333V0h1.334v3.048zm3.185.478l-1.037-.957L12.43.283l1.037.958-1.615 2.285zM5.185 2.57l-1.037.957-1.615-2.285L3.57.283 5.185 2.57z"
      />
    </svg>
  );
}

export default EmptyTrayIcon;
