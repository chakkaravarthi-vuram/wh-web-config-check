import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../hoc/ThemeContext';

function RefreshIcon(props) {
  const { className, onClick, style, isButtonColor, ariaHidden, role, ariaLabel, tabIndex, onkeydown } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
      onClick={onClick}
      style={{ ...style, fill: buttonColor }}
      aria-hidden={ariaHidden}
      role={role}
      aria-label={ariaLabel}
      onKeyDown={onkeydown}
      tabIndex={tabIndex}
    >
      <g fill="none" fillRule="evenodd">
        <rect
          width="23"
          height="23"
          x="0.5"
          y="0.5"
          fill="#F6F9FB"
          stroke="#B8BFC7"
          rx="4"
        />
        <path
          fill="#6C727E"
          fillRule="nonzero"
          d="M15.972 9.4c.032.038.06.078.089.115.595.797.945 1.787.945 2.86v.105a4.775 4.775 0 01-3.17 4.4c-.35.123-.718.208-1.097.248l-.002 1.622-2.169-1.907-.746-.654 1.264-1.102 1.662-1.446-.009 1.651a2.957 2.957 0 001.893-4.653l1.34-1.238zM11.763 6l2.166 1.904.746.657-1.261 1.099-1.662 1.449.006-1.648a2.956 2.956 0 00-1.884 4.65l-1.338 1.24A4.768 4.768 0 017.5 12.375v-.104a4.78 4.78 0 013.213-4.417 4.703 4.703 0 011.047-.23L11.763 6z"
        />
      </g>
    </svg>
  );
}
export default RefreshIcon;
RefreshIcon.defaultProps = {
  type: 1,
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
RefreshIcon.propTypes = {
  type: PropTypes.number,
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
