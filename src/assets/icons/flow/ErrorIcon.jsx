import React from 'react';
import PropTypes from 'prop-types';

function ErrorIcon(props) {
  const { className, onClick, title } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={className}
      onClick={onClick}
    >
      <title>{title}</title>
      <g clipPath="url(#clip0_1046_76613)" fill="white">
        <path
          stroke="#F04438"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.333"
          d="M8 5.333V8m0 2.667h.006M14.666 8A6.667 6.667 0 111.333 8a6.667 6.667 0 0113.333 0z"
        />
      </g>
      <defs>
        <clipPath id="clip0_1046_76613">
          <path fill="#fff" d="M0 0H16V16H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
export default ErrorIcon;

ErrorIcon.defaultProps = {
  className: null,
  onClick: null,
  title: null,
};
ErrorIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
};
