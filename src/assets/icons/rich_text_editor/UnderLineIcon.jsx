import React from 'react';
import PropTypes from 'prop-types';

function UnderLineIcon(props) {
  const { className, onClick, style, title } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      className={className}
      onClick={onClick}
      style={style}
    >
      <title>{title}</title>
      <g fill="none" fillRule="evenodd">
        <path d="M0 0H12V12H0z" />
        <path
          fill="#333"
          d="M.75 9.75h10.5v1.5H.75v-1.5zm3-5.25c0 1.243 1.007 2.25 2.25 2.25S8.25 5.743 8.25 4.5V.75h1.5V4.5c0 2.071-1.679 3.75-3.75 3.75-2.071 0-3.75-1.679-3.75-3.75V.75h1.5V4.5z"
        />
      </g>
    </svg>
  );
}
export default UnderLineIcon;

UnderLineIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  // isButtonColor: false,
};
UnderLineIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  // isButtonColor: PropTypes.bool,
};
