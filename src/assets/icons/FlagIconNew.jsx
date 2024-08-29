import React from 'react';
import { ARIA_ROLES } from 'utils/UIConstants';

function FlagIconNew(props) {
  const { className, title, ariaLabel } = props;
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="13"
        height="16"
        viewBox="0 0 13 16"
        className={className}
        role={ARIA_ROLES.IMG}
        aria-label={ariaLabel}
    >
    <title>{title}</title>
    <path
        fill="#B8BFC7"
        fillRule="evenodd"
        d="M1.677 8.663h8.89L8.472 5.458c-.168-.347-.168-.693 0-.953l2.013-2.772H1.677v6.93zM.84 16c-.505 0-.84-.347-.84-.866V.866C0 .346.335 0 .839 0H12.16c.504 0 .839.347.839.866 0 .174-.084.347-.168.52l-2.6 3.552 2.6 4.072c.252.433.168.953-.251 1.213-.168.086-.336.173-.42.173H1.677v4.738c0 .433-.335.866-.838.866z"
    />
    </svg>
  );
}
export default FlagIconNew;
