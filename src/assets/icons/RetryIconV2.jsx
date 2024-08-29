import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ThemeContext from '../../hoc/ThemeContext';

function RetryIconV2(props) {
  const { className, onClick, style, title, isButtonColor, role, tabIndex, onKeyDown, ariaLabel } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
      onClick={onClick}
      style={{ ...style, fill: buttonColor }}
      role={role}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
      aria-label={ariaLabel}
    >
      <title>{title}</title>
      <g fill="none" fillRule="evenodd">
        <rect
          x=".5"
          y=".5"
          width="23"
          height="23"
          rx="4"
          fill="#F6F9FB"
          stroke="#B8BFC7"
        />
        <path
          d="M11.994 7.226h-.199v-.828a.399.399 0 0 0-.647-.311l-2.092 1.67a.399.399 0 0 0 0 .623l2.092 1.671a.399.399 0 0 0 .647-.313V8.91h.2a3.323 3.323 0 1 1-3.308 3.634.398.398 0 0 0-.399-.361H7.4a.399.399 0 0 0-.399.428 5.006 5.006 0 1 0 4.993-5.386z"
          fill="#6C727E"
          fillRule="nonzero"
        />
      </g>
    </svg>
  );
}
export default RetryIconV2;
RetryIconV2.defaultProps = {
  className: null,
  onClick: () => {},
  style: null,
  title: null,
  isButtonColor: false,
};
RetryIconV2.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
