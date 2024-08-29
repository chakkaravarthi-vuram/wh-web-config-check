import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import ThemeContext from '../../../hoc/ThemeContext';

function UploadFailedIcon(props) {
  const { className, onClick, style, title, id, isButtonColor } = props;
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
    >
      <title>{title}</title>
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <g fill="#F07F7F" fillRule="nonzero" transform="translate(-155 -118)">
          <path d="M163 118a8 8 0 110 16 8 8 0 010-16zm0 1.6a6.4 6.4 0 100 12.8 6.4 6.4 0 000-12.8zm2.2 3.4l1.2 1.2-2.001 1.999 2.001 2.001-1.156 1.244-2.044-2.045-2.044 2.045L160 128.2l2-2.001-2-1.999 1.2-1.2 1.999 2 2.001-2z" />
        </g>
      </g>

    </svg>
  );
}
export default UploadFailedIcon;

UploadFailedIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  id: EMPTY_STRING,
  isButtonColor: false,
};
UploadFailedIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  id: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
