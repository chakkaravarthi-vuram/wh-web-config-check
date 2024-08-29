import React from 'react';
import { ARIA_ROLES } from 'utils/UIConstants';
import cx from 'clsx';
import gClasses from 'scss/Typography.module.scss';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';

function DeleteIcon(props) {
  const { className, onClick, title, height, width } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || '21'}
      height={height || '20'}
      fill="none"
      viewBox="0 0 21 20"
      className={cx(className, gClasses.CursorPointer)}
      onClick={onClick}
      onKeyDown={(e) => onClick && keydownOrKeypessEnterHandle(e) && onClick()}
      tabIndex={onClick ? 0 : -1}
      role={ARIA_ROLES.BUTTON}
    >
      <title>{title}</title>
      <path
        stroke="#D92D20"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.667"
        d="M8.193 2.5h5m-10 2.5h15m-1.666 0l-.585 8.766c-.087 1.315-.131 1.973-.415 2.472a2.5 2.5 0 01-1.082 1.012c-.517.25-1.176.25-2.494.25H9.436c-1.319 0-1.978 0-2.494-.25a2.5 2.5 0 01-1.082-1.012c-.284-.5-.328-1.157-.416-2.472L4.86 5m4.167 3.75v4.167M12.36 8.75v4.167"
      />
    </svg>
  );
}

export default DeleteIcon;
