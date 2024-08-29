import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function RadioButtonIcon(props) {
  const { className, style, title, onClick } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      className={className}
      onClick={onClick || null}
      style={style}
    >
      <title>{title}</title>
      <g fill="none" fillRule="evenodd">
        <rect
          width="16.5"
          height="16.5"
          x=".75"
          y=".75"
          stroke="#5B6375"
          strokeWidth="1.5"
          rx="8.25"
        />
        <rect width="8" height="8" x="5" y="5" fill="#5B6375" rx="4" />
      </g>
    </svg>
  );
}
export default RadioButtonIcon;
RadioButtonIcon.defaultProps = {
  className: EMPTY_STRING,
  style: null,
  title: EMPTY_STRING,
  onClick: null,
};
RadioButtonIcon.propTypes = {
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  title: PropTypes.string,
};
