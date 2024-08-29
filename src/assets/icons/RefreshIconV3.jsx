import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../hoc/ThemeContext';

function RefreshIconV3(props) {
  const { className, onClick, style, isButtonColor, ariaHidden, role, ariaLabel, tabIndex, onkeydown } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      className={className}
      onClick={onClick}
      style={{ ...style, fill: buttonColor }}
      aria-hidden={ariaHidden}
      role={role}
      aria-label={ariaLabel}
      onKeyDown={onkeydown}
      tabIndex={tabIndex}
    >
      <path
        fill="#959BA3"
        d="M13.65 2.35A7.958 7.958 0 008 0C3.58 0 .01 3.58.01 8S3.58 16 8 16c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 018 14c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L9 7h7V0l-2.35 2.35z"
      />
    </svg>
  );
}

export default RefreshIconV3;
RefreshIconV3.defaultProps = {
    className: null,
    onClick: null,
    style: null,
    title: null,
    isButtonColor: false,
  };
  RefreshIconV3.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.objectOf(PropTypes.any),
    title: PropTypes.string,
    isButtonColor: PropTypes.bool,
  };
