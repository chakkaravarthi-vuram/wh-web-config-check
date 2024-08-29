import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../hoc/ThemeContext';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

function SendBackIcon(props) {
  const { className, onClick, style, isButtonColor, id, isPrimaryColor } = props;
  let { buttonColor, primaryColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  if (!isPrimaryColor) {
    primaryColor = null;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      className={className}
      onClick={onClick}
      id={id}
      style={({ ...style }, { fill: buttonColor || primaryColor })}
    >
      <g fill="none" fillRule="evenodd">
        <circle cx="14" cy="14" r="14" fill="#F9B450" />
        <path fill="#FFF" d="M15 8v5h7v2h-7v5l-7-6 7-6z" />
      </g>
    </svg>
  );
}
export default SendBackIcon;
SendBackIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
  id: EMPTY_STRING,
};
SendBackIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
  id: PropTypes.string,
};
