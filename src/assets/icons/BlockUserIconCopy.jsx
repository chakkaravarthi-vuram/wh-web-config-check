import React from 'react';
import { ARIA_ROLES } from 'utils/UIConstants';

function BlockUserIconCopy(props) {
  const { className, onClick, title, role, ariaLabel, tabIndex, onKeyDown } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="34"
      height="34"
      viewBox="0 0 34 34"
      className={className}
      onClick={onClick}
      role={role || ARIA_ROLES.IMG}
      tabIndex={tabIndex}
      aria-label={ariaLabel || title}
      onKeyDown={onKeyDown}
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
            fill="#FE6C6A"
            fillRule="nonzero"
            d="M17 11a6 6 0 100 12 6 6 0 000-12zm-4.5 6a4.5 4.5 0 017.102-3.668l-6.27 6.27A4.5 4.5 0 0112.5 17zm4.5 4.5a4.5 4.5 0 01-2.602-.832l6.27-6.27A4.5 4.5 0 0117 21.5z"
          />
        </g>
      </g>
    </svg>
  );
}

export default BlockUserIconCopy;
