import React from 'react';
import PropTypes from 'prop-types';

function NoViewIcon(props) {
  const { className, role, ariaLabel } = props;
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
      height="18"
      viewBox="0 0 24 18"
      className={className}
      role={role}
      aria-label={ariaLabel}
    >
      <path
        fill="#FFF"
        d="M17.252 9.617c0 .188.121.092 0 .28l3.64 2.544c1.428-1.098 2.207-2.005 2.936-3.133.121-.283.121-.47 0-.753C21.643 5.912 16.865 2 11.886 2c-1.336 0-2.825.389-4.04.765l1.995 1.463s1.197-.428 1.44-.428c3.4 0 5.97 1.644 5.97 5.817zm2.668 4.063l-3-2.16-6.6-4.95-1.68-1.35L6 3.15 2.04.27C1.56-.09.84-.09.36.27s-.48.9 0 1.26l3.97 3.162C2.65 5.952 1.045 7.392.12 8.64c-.12.27-.12.45 0 .72 2.344 3.156 7.157 6.734 11.88 6.734 2.16 0 3.982-.623 5.782-1.523l4.178 3.159c.48.36 1.2.36 1.68 0s.48-.9 0-1.26l-3.72-2.79zM6.758 8.804c0-.909.18-1.71.756-2.438l1.974 1.347c-.23.273-.309.729-.346 1.091-.187 1.817 1.007 3.098 3.126 3.098.461 0 .96-.307 1.421-.489l1.898 1.413c-1.173 1.265-2.664 1.468-3.818 1.468-3.329-.266-5.01-2.944-5.01-5.49z"
      />
    </svg>
  );
}

export default NoViewIcon;

NoViewIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  buttonColor: null,
};

NoViewIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  buttonColor: PropTypes.string,
};
