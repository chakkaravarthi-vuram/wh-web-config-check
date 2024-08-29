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
      width="22"
      height="16"
      className={className}
      onClick={onClick || null}
      style={({ ...style }, { fill: buttonColor })}
      id={id}
    >
      <title>{title}</title>
      <path
        fill="#5B6375"
        d="M11 0c7.741 0 10.82 7.414 10.948 7.73a.73.73 0 010 .54C21.821 8.586 18.741 16 11 16 3.259 16 .18 8.586.052 8.27a.73.73 0 010-.54C.179 7.414 3.259 0 11 0zm0 2.91C8.165 2.91 5.867 5.187 5.867 8S8.165 13.09 11 13.09c2.834-.003 5.13-2.28 5.133-5.09 0-2.812-2.298-5.09-5.133-5.09zm0 2.908c1.215 0 2.2.977 2.2 2.182a2.191 2.191 0 01-2.2 2.182c-1.215 0-2.2-.977-2.2-2.182s.985-2.182 2.2-2.182z"
      />
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
