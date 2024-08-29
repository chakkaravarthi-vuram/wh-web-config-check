import React from 'react';
import PropTypes from 'prop-types';

function RedWarningIcon(props) {
  const {
    className, title, onClick,
  } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      className={className}
      title={title}
      onClick={onClick}
    >
      <g fill="none" fillRule="evenodd">
        <circle cx="16" cy="16" r="16" fill="#FE6C6A" />
        <path fill="#FFF" d="M14 6h4v14h-4zm0 16h4v4h-4z" />
      </g>
    </svg>
  );
}

export default RedWarningIcon;

RedWarningIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
RedWarningIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
