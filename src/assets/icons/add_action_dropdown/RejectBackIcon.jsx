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
      <g fill="none">
        <path fill="#5B6375" d="M9 0a9 9 0 109 9 9.01 9.01 0 00-9-9z" />
        <path
          fill="#FFF"
          d="M9 7.857V6.719a1.102 1.102 0 00-.693-1.069 1.08 1.08 0 00-1.242.214c-.491.47-.968.958-1.449 1.44-.274.274-.54.553-.82.821-.54.513-.525 1.27.055 1.825a97.25 97.25 0 012.068 2.065c.36.36.77.531 1.276.385.465-.143.787-.564.805-1.05v-1.198h3.433c.396.015.771-.182.984-.517a1.147 1.147 0 00-.952-1.776h-2.266c-.403-.002-.794-.002-1.199-.002z"
        />
      </g>
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
