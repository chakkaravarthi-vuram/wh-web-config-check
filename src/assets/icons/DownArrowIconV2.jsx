import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ThemeContext from '../../hoc/ThemeContext';

function DownArrowIconV2(props) {
  const {
    className,
    onClick,
    style,
    title,
    isButtonColor,
    role,
    ariaLabel,
  } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="9"
      fill="none"
      viewBox="0 0 12 9"
      className={className}
    role={role}
    aria-label={ariaLabel}
    onClick={onClick}
    style={{ ...style, fill: buttonColor }}
    >
      <title>{title}</title>
      <path fill="#959BA3" d="M12 .75H0l6 8 6-8z" />
    </svg>
  );
}
  export default DownArrowIconV2;

  DownArrowIconV2.defaultProps = {
    className: null,
    onClick: null,
    style: null,
    title: null,
    isButtonColor: false,
    donutBGColor1: null,
    donutBGColor2: null,
    donutBGColor3: null,
  };
  DownArrowIconV2.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.objectOf(PropTypes.any),
    title: PropTypes.string,
    isButtonColor: PropTypes.bool,
    donutBGColor1: PropTypes.string,
    donutBGColor2: PropTypes.string,
    donutBGColor3: PropTypes.string,
  };
