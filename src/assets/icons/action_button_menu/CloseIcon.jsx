import React from 'react';
import PropTypes from 'prop-types';

function CloseIcon(props) {
  const { className, onClick, style, title } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={className}
      onClick={onClick}
      style={style}
    >
      <title>{title}</title>
      <path
        fill="#FFF"
        fillRule="evenodd"
        d="M14.142 0l1.414 1.414-6.364 6.364 6.364 6.364-1.414 1.414-6.364-6.364-6.364 6.364L0 14.142l6.364-6.364L0 1.414 1.414 0l6.364 6.364L14.142 0z"
      />
    </svg>
  );
}

export default CloseIcon;
CloseIcon.defaultProps = {
  className: null,
  onClick: null,
  title: null,
  style: null,
};
CloseIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
};
