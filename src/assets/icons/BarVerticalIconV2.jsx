import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from 'hoc/ThemeContext';

function BarVerticalIconV2(props) {
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
        d="M0 16V5h3.5v11H0zm6.25 0V0h3.5v16h-3.5zm6.25 0V9H16v7h-3.5z"
      />
    </svg>
  );
}

export default BarVerticalIconV2;

BarVerticalIconV2.defaultProps = {
    className: null,
    onClick: null,
    style: null,
    title: null,
    isButtonColor: false,
  };
  BarVerticalIconV2.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.objectOf(PropTypes.any),
    title: PropTypes.string,
    isButtonColor: PropTypes.bool,
  };
