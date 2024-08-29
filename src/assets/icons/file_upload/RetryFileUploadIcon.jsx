import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import ThemeContext from '../../../hoc/ThemeContext';

function RetryFileUploadIcon(props) {
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
        <g fill="#B2B6C1" fillRule="nonzero" transform="translate(-176 -118)">
          <path d="M184 118a8 8 0 110 16 8 8 0 010-16zm0 1.6a6.4 6.4 0 100 12.8 6.4 6.4 0 000-12.8zm0 1.4l2.98 1.828-2.98 1.82v-1.204c-1.495 0-2.718 1.194-2.718 2.653s1.223 2.652 2.718 2.652c1.495 0 2.718-1.184 2.718-2.652 0-.483-.126-.938-.359-1.326l1.097-.635c.34.578.544 1.25.544 1.96 0 2.151-1.796 3.904-4 3.904-2.204 0-4-1.753-4-3.894 0-2.15 1.796-3.903 4-3.903V121z" />
        </g>
      </g>
    </svg>
  );
}
export default RetryFileUploadIcon;

RetryFileUploadIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  id: EMPTY_STRING,
  isButtonColor: false,
};
RetryFileUploadIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  id: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
