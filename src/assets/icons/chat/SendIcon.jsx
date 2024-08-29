import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from 'hoc/ThemeContext';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function SendIcon(props) {
  const { className, onClick, style, title, id, isButtonColor, ariaLabel } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={className}
      onClick={onClick || null}
      style={({ ...style }, { fill: buttonColor })}
      id={id}
      ariaLabel={ariaLabel}
    >
      <title>{title}</title>
      <path
        // fill="#FFF"
        fillRule="evenodd"
        d="M15.36 6.92L1.542.107C.82-.249 0 .325 0 1.187v3.546c0 .749.487 1.394 1.164 1.54L6.221 7.36c.644.138.644 1.14 0 1.278l-5.057 1.09C.487 9.873 0 10.518 0 11.268v3.544c0 .863.82 1.437 1.543 1.08L15.359 9.08c.855-.42.855-1.74 0-2.16"
      />
    </svg>
  );
}
export default SendIcon;

SendIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  id: EMPTY_STRING,
};
SendIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  id: PropTypes.string,
};
