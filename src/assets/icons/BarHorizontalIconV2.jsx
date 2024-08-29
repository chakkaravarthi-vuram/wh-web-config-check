import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from 'hoc/ThemeContext';

function BarHorizontalIconV2(props) {
    const { className, onClick, style, title, isButtonColor, role, ariaLabel } = props;
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
      role={role}
      aria-label={ariaLabel}
      onClick={onClick}
      style={{ ...style, fill: buttonColor }}

    >
     <title>{title}</title>

      <path
        fill="#959BA3"
        d="M0 0h11v3.5H0V0zm0 6.25h16v3.5H0v-3.5zm0 6.25h7V16H0v-3.5z"
      />
    </svg>
  );
}
export default BarHorizontalIconV2;
BarHorizontalIconV2.defaultProps = {
    className: null,
    onClick: null,
    style: null,
    title: null,
    isButtonColor: false,
  };
  BarHorizontalIconV2.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.objectOf(PropTypes.any),
    title: PropTypes.string,
    isButtonColor: PropTypes.bool,
  };
