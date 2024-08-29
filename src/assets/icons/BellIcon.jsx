import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../hoc/ThemeContext';

function BellIcon(props) {
  const { className, onClick, style, title, isButtonColor, role, ariaLabel, ariaHidden } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="20"
      viewBox="0 0 18 20"
      className={className}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      style={({ ...style }, { fill: buttonColor })}
    >
      <title>{title}</title>
      <path
        // fill="#AAAFBA"
        fillRule="nonzero"
        d="M9.003 0C9.939.002 10.758.542 11 1.317a10.07 10.07 0 00-4 .016C7.236.55 8.059.002 9.003 0zm.495 20C7.699 19.995 6.192 18.703 6 17h7c-.192 1.704-1.702 2.997-3.502 3zm6.828-3h-3.31a.33.33 0 00-.077 0H5.716l-.038-.002c-.013 0-.026 0-.04.002H1.672A1.677 1.677 0 010 15.324c0-.4.323-.723.722-.725H.78a2.05 2.05 0 002.048-2.05v-4.34C2.828 4.785 5.61 2 9.03 2s6.2 2.787 6.2 6.21v4.338c0 1.13.916 2.048 2.048 2.05.4.001.723.326.722.726 0 .924-.749 1.674-1.674 1.676z"
      />
    </svg>
  );
}
export default BellIcon;

BellIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
BellIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
