import React from 'react';
import PropTypes from 'prop-types';

function StandardFileIcon(props) {
  const { className, role, ariaLabel } = props;
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="29"
    viewBox="0 0 24 29"
    className={className}
    role={role}
    aria-label={ariaLabel}
    >
      <path
        fill="#6C727E"
        d="M15.6 0c.318 0 .624.126.848.352l7.2 7.2c.226.224.352.53.352.848v19.2a1.2 1.2 0 01-1.2 1.2H1.2A1.2 1.2 0 010 27.6V1.2A1.2 1.2 0 011.2 0zM18 20.4H6a1.2 1.2 0 000 2.4h12a1.2 1.2 0 000-2.4zm0-4.8H6A1.2 1.2 0 006 18h12a1.2 1.2 0 000-2.4zm-4.8-4.8H6a1.2 1.2 0 000 2.4h7.2a1.2 1.2 0 000-2.4z"
      />
    </svg>
  );
}

export default StandardFileIcon;

StandardFileIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  buttonColor: null,
};

StandardFileIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  buttonColor: PropTypes.string,
};
