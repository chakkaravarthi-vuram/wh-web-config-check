import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../hoc/ThemeContext';

function DataSetIcon(props) {
  const {
    className, onClick, style, title, isButtonColor, fillColor, ariaLabel, role, ariaHidden,
  } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      width="14"
      height="16"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
      role={role}
      style={({ ...style }, { fill: buttonColor })}
      aria-hidden={ariaHidden}
    >
       <title>{title}</title>
      <path
        d="M4.667 0v1.778h4.666V0H13a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1h3.667zM11.2 11.556H2.8v1.777h8.4v-1.777zM11.2 8H2.8v1.778h8.4V8zm0-3.556H2.8v1.778h8.4V4.444z"
        fill={fillColor}
        fillRule="evenodd"
      />
    </svg>
  );
}

export default DataSetIcon;
DataSetIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
  fillColor: '#adb6c7',
};
DataSetIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
  fillColor: PropTypes.string,
};
