import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import ThemeContext from '../../../hoc/ThemeContext';

function SendForReviewIcon(props) {
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
        <path fill="#5B6375" d="M9 0a9 9 0 11-9 9 9.01 9.01 0 019-9z" />
        <path
          fill="#FFF"
          d="M9 7.857V6.719a1.1 1.1 0 01.693-1.069 1.08 1.08 0 011.242.214c.491.47.968.958 1.449 1.44.274.274.54.553.82.821.54.513.525 1.27-.055 1.825a97.25 97.25 0 00-2.068 2.065c-.36.36-.77.531-1.276.385A1.141 1.141 0 019 11.35v-1.198H5.567a1.116 1.116 0 01-.984-.517 1.147 1.147 0 01.952-1.776h2.266c.403-.002.794-.002 1.199-.002z"
        />
      </g>
    </svg>
  );
}
export default SendForReviewIcon;

SendForReviewIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  id: EMPTY_STRING,
  isButtonColor: false,
};
SendForReviewIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  id: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
