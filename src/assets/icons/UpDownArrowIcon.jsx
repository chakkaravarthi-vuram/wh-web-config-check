import React from 'react';
import PropTypes from 'prop-types';

function UpDownArrowIcon(props) {
  const { className, onClick, title, role, ariaLabel } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="6"
      height="9"
      className={className}
      onClick={onClick}
      title={title}
      viewBox="0 0 6 9"
      role={role}
      aria-label={ariaLabel}
    >
      <path
        fill="#217CF5"
        fillRule="evenodd"
        d="M0 5h6L3 9 0 5zm3-5l3 4H0l3-4z"
      />
    </svg>
  );
}

export default UpDownArrowIcon;

UpDownArrowIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
UpDownArrowIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
