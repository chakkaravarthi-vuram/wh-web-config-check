import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ThemeContext from '../../hoc/ThemeContext';

function FilePreviewDownloadIcon(props) {
  const { className, onClick, style, title, isButtonColor, ariaLabel, role, tabIndex, onKeyDown } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
      role={role}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
      style={{ ...style, fill: buttonColor }}
    >
      <title>{title}</title>
      <path
        fill="#6C727E"
        d="M1.672 7.945v2.383h7.862V7.945h1.672v2.425c0 .792-.568 1.46-1.339 1.603l-.147.02-.145.007H1.63c-.792 0-1.46-.568-1.603-1.338l-.02-.147L0 10.37V7.945h1.672zM6.439 0l-.001 5.97 1.548-1.55 1.182 1.182-2.975 2.974a.835.835 0 01-.986.142L5.11 8.66l-.098-.083-2.974-2.974L3.219 4.42l1.547 1.547V0H6.44z"
      />
    </svg>
  );
}
export default FilePreviewDownloadIcon;
FilePreviewDownloadIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
FilePreviewDownloadIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
