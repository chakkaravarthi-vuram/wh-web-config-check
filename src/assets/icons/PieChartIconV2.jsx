import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ThemeContext from '../../hoc/ThemeContext';

function PieChartIconV2(props) {
  const { className, onClick, style, isButtonColor, role, ariaLabel } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      className={className}
      onClick={onClick}
      style={{ ...style, fill: buttonColor }}
      role={role}
      aria-label={ariaLabel}
    >
      <path
        fill="#959BA3"
        d="M10.75 9.25h7.725c-.183-2.033-1.004-3.796-2.463-5.287C14.554 2.47 12.8 1.658 10.75 1.525V9.25zm-1.5 9.225V1.525c-2.183.183-4.02 1.092-5.513 2.725C2.246 5.883 1.5 7.8 1.5 10s.746 4.117 2.237 5.75c1.492 1.633 3.33 2.542 5.513 2.725zm1.5 0c2.05-.133 3.804-.946 5.262-2.438 1.459-1.491 2.28-3.254 2.463-5.287H10.75v7.725zM10 20a9.738 9.738 0 01-3.9-.788 10.099 10.099 0 01-3.175-2.137c-.9-.9-1.612-1.958-2.137-3.175A9.738 9.738 0 010 10c0-1.383.263-2.683.787-3.9a10.099 10.099 0 012.138-3.175c.9-.9 1.958-1.612 3.175-2.137A9.738 9.738 0 0110 0c1.383 0 2.683.263 3.9.787a10.098 10.098 0 013.175 2.138c.9.9 1.613 1.958 2.137 3.175A9.738 9.738 0 0120 10a9.738 9.738 0 01-.788 3.9 10.098 10.098 0 01-2.137 3.175c-.9.9-1.958 1.613-3.175 2.137A9.738 9.738 0 0110 20z"
      />
    </svg>
  );
}

export default PieChartIconV2;

PieChartIconV2.defaultProps = {
    className: null,
    onClick: null,
    style: null,
    title: null,
    isButtonColor: false,
  };
  PieChartIconV2.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.objectOf(PropTypes.any),
    title: PropTypes.string,
    isButtonColor: PropTypes.bool,
  };
