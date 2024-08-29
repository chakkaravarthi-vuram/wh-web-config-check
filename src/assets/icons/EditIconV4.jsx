import React from 'react';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';

function EditIconV4(props) {
  const { className, onClick, title, tabIndex, role, ariaLabel } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
      onClick={onClick}
      onKeyDown={(e) => onClick && keydownOrKeypessEnterHandle(e) && onClick()}
      tabIndex={tabIndex}
      role={role}
      aria-label={ariaLabel}
    >
      <title>{title}</title>
      <g fill="none" fillRule="evenodd">
        <rect
          width="23"
          height="23"
          x="0.5"
          y="0.5"
          fill="#FFF"
          stroke="#DADFE7"
          rx="4"
        />
        <path
          fill="#6C727E"
          fillRule="nonzero"
          d="M13.428 8.004l2.57 2.586-6.608 6.609a.26.26 0 01-.12.067L6.33 18h-.062a.26.26 0 01-.26-.323l.739-2.94a.26.26 0 01.067-.12l6.614-6.613zm1.634-1.634a1.332 1.332 0 011.842 0l.734.733a1.3 1.3 0 010 1.843l-.9.9-2.576-2.576z"
        />
      </g>
    </svg>
  );
}

export default EditIconV4;
