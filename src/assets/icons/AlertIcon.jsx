import React from 'react';
import PropTypes from 'prop-types';

function AlertIcon(props) {
  const { className, ariaHidden } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      aria-hidden={ariaHidden}
      className={className}
    >
      <g fill="none" fillRule="evenodd">
        <rect fill="#EFBE70" width="20" height="20" rx="10" />
        <path d="M11 9v6H9V9h2zm0-4v2H9V5h2z" fill="#FFF" />
      </g>
    </svg>
  );
}

export default AlertIcon;

AlertIcon.defaultProps = {
  className: '',
  ariaHidden: false,
};

AlertIcon.propTypes = {
  className: PropTypes.string,
  ariaHidden: PropTypes.bool,
};
