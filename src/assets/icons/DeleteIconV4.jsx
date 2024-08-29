import React from 'react';
import { ARIA_ROLES } from 'utils/UIConstants';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';

function DeleteIconV4(props) {
  const { className, onClick, title } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
      onClick={onClick}
      onKeyDown={(e) => onClick && keydownOrKeypessEnterHandle(e) && onClick()}
      tabIndex={0}
      role={ARIA_ROLES.BUTTON}
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
          fill="#FE6C6A"
          d="M11.404 8.257h1.47V7.5h-1.47v.757zm2.942-.757v-.313c0-.33-.122-.635-.325-.856A1.15 1.15 0 0013.182 6h-2.07a1.21 1.21 0 00-.84.332c-.217.22-.325.524-.325.855V7.5L7 7.519v1.474h.722l.008 7.281c0 .953.757 1.726 1.692 1.726h5.436c.935 0 1.693-.773 1.693-1.726l.001-7.273.734-.001-.005-1.5h-2.935z"
        />
      </g>
    </svg>
  );
}

export default DeleteIconV4;
