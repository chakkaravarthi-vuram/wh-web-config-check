import React from 'react';
import { keydownOrKeypessEnterHandle } from '../../utils/UtilityFunctions';

function SearchIconNew(props) {
  const {
    id,
    className,
    onClick,
    ariaLabel,
    ariaHidden,
    role,
    tabIndex,
    onKeyDown,
  } = props;
  return (
    <svg
      id={id}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      role={role}
      className={className}
      tabIndex={tabIndex}
      onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onKeyDown(e)}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
    >
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M11.5 4a7.5 7.5 0 105.188 12.916 1.01 1.01 0 01.228-.228A7.5 7.5 0 0011.5 4zm7.388 13.473A9.461 9.461 0 0021 11.5a9.5 9.5 0 10-9.5 9.5 9.46 9.46 0 005.973-2.113l2.82 2.82a1 1 0 001.414-1.414l-2.82-2.82z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default SearchIconNew;
