import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../hoc/ThemeContext';

function AddDataIcon(props) {
  const {
    className, onClick, style, title, isButtonColor,
  } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="72"
      height="72"
      fill="none"
      viewBox="0 0 72 72"
      className={className}
      onClick={onClick}
      style={({ ...style }, { fill: buttonColor })}
    >
           <title>{title}</title>

      <path
        fill="#959BA3"
        d="M13.5 63c-1.2 0-2.25-.45-3.15-1.35C9.45 60.75 9 59.7 9 58.5v-45c0-1.2.45-2.25 1.35-3.15.9-.9 1.95-1.35 3.15-1.35h29.625v4.5H13.5v45h45V28.875H63V58.5c0 1.2-.45 2.25-1.35 3.15-.9.9-1.95 1.35-3.15 1.35h-45zm7.8-11.775h4.5V30.6h-4.5v20.625zm12.45 0h4.5v-30.45h-4.5v30.45zm12.45 0h4.5v-11.1h-4.5v11.1zm5.775-24.6V20.1h-6.6v-4.5h6.6V9h4.5v6.6H63v4.5h-6.525v6.525h-4.5z"
      />
      <path
        fill="#217CF5"
        d="M51.975 26.625V20.1h-6.6v-4.5h6.6V9h4.5v6.6H63v4.5h-6.525v6.525h-4.5z"
      />
    </svg>
  );
}

export default AddDataIcon;

AddDataIcon.defaultProps = {
    className: null,
    onClick: null,
    style: null,
    title: null,
    isButtonColor: false,
  };
  AddDataIcon.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.objectOf(PropTypes.any),
    title: PropTypes.string,
    isButtonColor: PropTypes.bool,
  };
