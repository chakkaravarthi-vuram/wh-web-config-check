import React from 'react';

function PasswordEye(props) {
    const {
      className,
      onClick,
      onMouseDown,
      onMouseUp,
      onMouseLeave,
      role,
      ariaPressed,
      ariaHidden,
      tabIndex,
      onKeyPress,
    } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="12"
      viewBox="0 0 17 12"
      className={className}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      role={role}
      id="passwordEye"
      aria-pressed={ariaPressed}
      aria-hidden={ariaHidden}
      tabIndex={tabIndex}
      onKeyPress={onKeyPress}
    >
      <title>Show password</title>
      <path
        fill="#ADB6C7"
        d="M8.182 0c5.757 0 8.048 5.56 8.143 5.798a.551.551 0 010 .404C16.23 6.44 13.939 12 8.182 12 2.424 12 .133 6.44.038 6.202a.551.551 0 010-.404C.133 5.56 2.424 0 8.182 0zm0 2.182a3.818 3.818 0 100 7.636 3.818 3.818 0 000-7.636zm0 2.182a1.636 1.636 0 110 3.272 1.636 1.636 0 010-3.272z"
      />
    </svg>
  );
}

export default PasswordEye;
