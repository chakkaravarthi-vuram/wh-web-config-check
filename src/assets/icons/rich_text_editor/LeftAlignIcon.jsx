import React from 'react';
import PropTypes from 'prop-types';

function LeftAlignIcon(props) {
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
          d="M8.25 9.75v1.5H.75v-1.5h7.5zm3-3v1.5H.75v-1.5h10.5zm-3-3v1.5H.75v-1.5h7.5zm3-3v1.5H.75V.75h10.5z"
        />
      </g>
    </svg>
  );
}
export default LeftAlignIcon;
LeftAlignIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  // isButtonColor: false,
};
LeftAlignIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  // isButtonColor: PropTypes.bool,
};
