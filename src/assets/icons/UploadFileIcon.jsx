import React from 'react';
import PropTypes from 'prop-types';

function UploadFileIcon(props) {
  const { className, role, title, ariaLabel } = props;
  return (
    <svg
      role={role}
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="20"
      fill="none"
      viewBox="0 0 21 20"
      className={className}
      aria-label={ariaLabel}
    >
      <title>{title}</title>
      <g>
        <path
          stroke="#9E9E9E"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.67"
          d="M18 12.5v3.333a1.666 1.666 0 01-1.667 1.667H4.667A1.667 1.667 0 013 15.833V12.5m11.667-5.833L10.5 2.5m0 0L6.333 6.667M10.5 2.5v10"
        />
      </g>
    </svg>
  );
}

export default UploadFileIcon;

UploadFileIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  buttonColor: null,
};

UploadFileIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  buttonColor: PropTypes.string,
};
