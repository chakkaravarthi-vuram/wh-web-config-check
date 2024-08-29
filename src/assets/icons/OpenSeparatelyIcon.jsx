import React from 'react';
import { keydownOrKeypessEnterHandle } from '../../utils/UtilityFunctions';

function OpenSeparatelyIcon(props) {
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
      <path
        fill="#9E9E9E"
        fillRule="evenodd"
        d="M5.183 0H7.2a.9.9 0 110 1.8H5.22c-.77 0-1.295 0-1.7.034-.395.032-.596.09-.737.162a1.8 1.8 0 00-.787.787c-.072.14-.13.342-.162.737-.033.405-.034.93-.034 1.7v7.56c0 .77 0 1.295.034 1.7.032.395.09.596.162.737a1.8 1.8 0 00.787.787c.14.072.342.13.737.162.405.033.93.034 1.7.034h7.56c.77 0 1.295 0 1.7-.034.395-.032.596-.09.737-.162a1.8 1.8 0 00.787-.787c.072-.14.13-.342.162-.737.033-.405.034-.93.034-1.7V10.8a.9.9 0 111.8 0v2.017c0 .725 0 1.323-.04 1.81-.041.505-.13.97-.352 1.407a3.6 3.6 0 01-1.574 1.574c-.436.222-.901.31-1.407.352-.487.04-1.085.04-1.81.04H5.183c-.725 0-1.323 0-1.81-.04-.506-.041-.97-.13-1.407-.352a3.6 3.6 0 01-1.574-1.574c-.222-.436-.31-.901-.352-1.407C0 14.14 0 13.542 0 12.817V5.183c0-.725 0-1.323.04-1.81.041-.506.13-.97.352-1.407A3.6 3.6 0 011.966.392C2.402.17 2.867.082 3.373.04 3.86 0 4.458 0 5.183 0zM10.8.9a.9.9 0 01.9-.9h5.4a.9.9 0 01.9.9v5.4a.9.9 0 01-1.8 0V3.073L9.636 9.636a.9.9 0 01-1.272-1.272L14.927 1.8H11.7a.9.9 0 01-.9-.9z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default OpenSeparatelyIcon;
