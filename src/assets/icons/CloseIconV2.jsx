import React from 'react';
import cx from 'classnames';
import gClasses from 'scss/Typography.module.scss';

function CloseIconV2(props) {
    const { className, onClick, fillClass, width, height, ariaLabel, ariaHidden, role, tabIndex, onKeyDown, title } = props;
  let iconFill = '';
  if (fillClass) {
    iconFill = fillClass;
  } else {
    iconFill = '#959BA3';
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || '13'}
      height={height || '13'}
      viewBox="0 0 13 13"
      role={role}
      className={cx(className, gClasses.CursorPointer)}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
    >
      <title>{title}</title>
      <path
        fill={iconFill}
        d="M1.95 12.342L.655 11.05l4.55-4.55-4.55-4.55L1.95.656l4.55 4.55 4.55-4.55 1.293 1.293-4.55 4.55 4.55 4.55-1.293 1.293-4.55-4.55-4.55 4.55z"
      />
    </svg>
  );
}

export default CloseIconV2;
