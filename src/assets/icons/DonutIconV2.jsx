import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from 'hoc/ThemeContext';

function DonutIconV2(props) {
    const { className, onClick, style, title, isButtonColor, role, ariaLabel } = props;
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
    role={role}
    aria-label={ariaLabel}
    onClick={onClick}
    style={{ ...style, fill: buttonColor }}
    >
    <title>{title}</title>

    <path
      fill="#959BA3"
      d="M11.025.05c2.383.233 4.408 1.183 6.075 2.85 1.667 1.666 2.617 3.691 2.85 6.075h-7.1a2.449 2.449 0 00-.688-1.1 2.92 2.92 0 00-1.137-.65V.05zm1.5 1.9V6.3c.233.15.458.32.675.512.217.192.392.413.525.663h4.325a8.402 8.402 0 00-2.075-3.463 8.027 8.027 0 00-3.45-2.062zM8.975.05v7.175A3.072 3.072 0 007.563 8.35a2.958 2.958 0 00-.538 1.725c0 .6.18 1.142.538 1.625.358.483.829.833 1.412 1.05v7.2c-2.55-.233-4.68-1.292-6.387-3.175-1.709-1.883-2.563-4.117-2.563-6.7 0-2.584.85-4.838 2.55-6.763C4.275 1.387 6.408.3 8.975.05zm-1.5 1.9c-1.817.5-3.262 1.508-4.337 3.025-1.075 1.516-1.613 3.216-1.613 5.1 0 1.85.55 3.512 1.65 4.987a8.18 8.18 0 004.3 3.013v-4.35a4.406 4.406 0 01-1.437-1.575 4.3 4.3 0 01-.513-2.075c0-.75.167-1.459.5-2.125a4.31 4.31 0 011.45-1.65V1.95zm5.375 9.075h7.1c-.233 2.383-1.183 4.408-2.85 6.075-1.667 1.666-3.692 2.616-6.075 2.85v-7.2a3 3 0 001.137-.638c.325-.291.555-.654.688-1.087zm.875 1.5a8.285 8.285 0 01-.537.675 2.362 2.362 0 01-.663.525v4.325a7.766 7.766 0 003.45-2.05 8.5 8.5 0 002.075-3.475h-4.325z"
    />
    </svg>
  );
}
export default DonutIconV2;
DonutIconV2.defaultProps = {
    className: null,
    onClick: null,
    style: null,
    title: null,
    isButtonColor: false,
  };
  DonutIconV2.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.objectOf(PropTypes.any),
    title: PropTypes.string,
    isButtonColor: PropTypes.bool,
  };
