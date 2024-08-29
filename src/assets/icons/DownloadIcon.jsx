import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ThemeContext from '../../hoc/ThemeContext';

function DownloadIcon(props) {
  const { className, onClick, style, title, isButtonColor, role, ariaLabel, ariaHidden, tabIndex, onKeyDown } = props;
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
      onClick={onClick}
      style={{ ...style, fill: buttonColor }}
      role={role}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
    >
      <title>{title}</title>
      <path
        fillRule="nonzero"
        d="M2.453 10.19v3.469h11.094v-3.47H16V16H0v-5.81h2.453zM9.227 0v7.377l1.955-1.853 1.742 1.65L8 11.84 3.076 7.175l1.742-1.65 1.955 1.852V0h2.454z"
      />
    </svg>
  );
}
export default DownloadIcon;
DownloadIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
DownloadIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
