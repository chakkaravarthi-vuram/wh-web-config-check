import React from 'react';
import { keydownOrKeypessEnterHandle } from '../../utils/UtilityFunctions';

function FlowIconNew(props) {
  const {
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
      <g>
        <path
          stroke="#9E9E9E"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M7.002 9.5l-5 2.5 9.642 4.82c.131.066.197.1.266.112.06.011.123.011.184 0 .069-.013.135-.046.266-.111L22.002 12l-5-2.5m-10 5l-5 2.5 9.642 4.82c.131.066.197.1.266.112.06.011.123.011.184 0 .069-.013.135-.046.266-.111L22.002 17l-5-2.5m-15-7.5l9.642-4.822c.131-.065.197-.098.266-.11a.5.5 0 01.184 0c.069.012.135.045.266.11L22.002 7l-9.642 4.82c-.131.066-.197.1-.266.112a.501.501 0 01-.184 0c-.069-.013-.135-.046-.266-.111L2.002 7z"
        />
      </g>
    </svg>
  );
}

export default FlowIconNew;
