import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ThemeContext from '../../hoc/ThemeContext';

function RetryIcon(props) {
  const { className, onClick, style, title, isButtonColor } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="14"
    viewBox="0 0 13 14"
      className={className}
      onClick={onClick}
      style={{ ...style, fill: buttonColor }}
    >
      <title>{title}</title>
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <g fill={isButtonColor ? buttonColor : '#228BB5'} fillRule="nonzero" transform="translate(-1327 -439)">
          <g transform="translate(1327 439)">
            <path d="M11.317 4.9l-1.648.977c.35.598.54 1.298.54 2.042a4.086 4.086 0 01-4.084 4.083A4.095 4.095 0 012.042 7.92a4.095 4.095 0 014.083-4.084v1.853l4.477-2.8L6.125.073v1.852A6.018 6.018 0 00.117 7.933c0 3.296 2.698 5.994 6.008 5.994a6.018 6.018 0 006.008-6.008c0-1.094-.306-2.13-.816-3.019z" />
          </g>
        </g>
      </g>
    </svg>
  );
}
export default RetryIcon;
RetryIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
RetryIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
