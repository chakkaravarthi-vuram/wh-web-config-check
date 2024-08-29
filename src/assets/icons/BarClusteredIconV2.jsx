import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from 'hoc/ThemeContext';

function BarClusteredIconV2(props) {
    const { className, onClick, style, title, isButtonColor, role, ariaLabel } = props;
    let { buttonColor } = useContext(ThemeContext);
    if (!isButtonColor) {
      buttonColor = null;
    }
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="21"
    fill="none"
    viewBox="0 0 15 21"
    className={className}
    role={role}
    aria-label={ariaLabel}
    onClick={onClick}
    style={{ ...style, fill: buttonColor }}
    >
   <title>{title}</title>

    <path
      fill="#959BA3"
      d="M0 20.5v-7.688h2.5V20.5H0zm6.25 0V6.406h2.5V20.5h-2.5zm6.25 0V0H15v20.5h-2.5z"
    />
    </svg>
  );
}
export default BarClusteredIconV2;
BarClusteredIconV2.defaultProps = {
    className: null,
    onClick: null,
    style: null,
    title: null,
    isButtonColor: false,
  };
  BarClusteredIconV2.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.objectOf(PropTypes.any),
    title: PropTypes.string,
    isButtonColor: PropTypes.bool,
  };
