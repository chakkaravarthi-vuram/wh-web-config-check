import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import ThemeContext from '../../../hoc/ThemeContext';

function CancelIcon(props) {
  const { className, onClick, style, title, id, isButtonColor } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      className={className}
      onClick={onClick || null}
      style={({ ...style }, { fill: buttonColor })}
      id={id}
    >
      <title>{title}</title>
      <path
        fill="#5B6375"
        d="M9 0a9 9 0 100 18A9 9 0 009 0zM5.822 4.5L9 7.65l3.206-3.15 1.266 1.238L10.294 9l3.178 3.15-1.266 1.237L9 10.237l-3.178 3.15-1.266-1.237L7.734 9 4.556 5.738 5.822 4.5z"
      />
    </svg>
  );
}
export default CancelIcon;

CancelIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  id: EMPTY_STRING,
  isButtonColor: false,
};
CancelIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  id: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
