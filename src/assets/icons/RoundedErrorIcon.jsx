import React from 'react';
import PropTypes from 'prop-types';

function RoundedErrorIcon(props) {
  const { className, role, ariaHidden } = props;
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" role={role} aria-hidden={ariaHidden} className={className}>
      <title>Error Icon</title>
      <g fill="none" fillRule="evenodd">
        <rect fill="#F07F7F" opacity=".6" width="20" height="20" rx="10" />
        <path d="M11 14v2H9v-2h2zm0-10v8H9V4h2z" fill="#FFF" />
      </g>
    </svg>

  );
}

export default RoundedErrorIcon;

RoundedErrorIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  buttonColor: null,
};

RoundedErrorIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  buttonColor: PropTypes.string,
};
