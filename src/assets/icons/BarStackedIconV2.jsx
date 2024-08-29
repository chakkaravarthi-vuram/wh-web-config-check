import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from 'hoc/ThemeContext';

function BarStackedIconV2(props) {
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
      d="M0 16v-2.75h3.5V16H0zm0-4.25v-3.5h3.5v3.5H0zm0-5V0h3.5v6.75H0zM6.25 16V9.25h3.5V16h-3.5zm0-8.25v-3.5h3.5v3.5h-3.5zm0-5V0h3.5v2.75h-3.5zM12.5 16v-1.5H16V16h-3.5zm0-3.25v-3.5H16v3.5h-3.5zm0-5V0H16v7.75h-3.5z"
    />
    </svg>
  );
}
export default BarStackedIconV2;
BarStackedIconV2.defaultProps = {
    className: null,
    onClick: null,
    style: null,
    title: null,
    isButtonColor: false,
  };
  BarStackedIconV2.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.objectOf(PropTypes.any),
    title: PropTypes.string,
    isButtonColor: PropTypes.bool,
  };
