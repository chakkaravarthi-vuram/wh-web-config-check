import React from 'react';
import { ARIA_ROLES } from 'utils/UIConstants';

function EditIconV4Copy(props) {
  const { className, onClick, title, role, ariaLabel, tabIndex, onKeyDown } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="34"
      height="34"
      viewBox="0 0 34 34"
      className={className}
      onClick={onClick}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
      role={role || ARIA_ROLES.IMG}
      aria-label={ariaLabel || title}
    >
      <title>{title}</title>
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <g>
          <rect
            width="33"
            height="33"
            x="0.5"
            y="0.5"
            fill="#FFF"
            stroke="#DADFE7"
            rx="4"
          />
          <path
            fill="#6C727E"
            fillRule="nonzero"
            d="M18.416 13l2.566 2.582-6.598 6.598a.26.26 0 01-.12.067l-2.934.733h-.063a.26.26 0 01-.26-.322l.738-2.935a.26.26 0 01.068-.12L18.416 13zm1.63-1.63a1.33 1.33 0 011.84 0l.732.732a1.299 1.299 0 010 1.839l-.898.898-2.572-2.571z"
          />
        </g>
      </g>
    </svg>
  );
}

export default EditIconV4Copy;
