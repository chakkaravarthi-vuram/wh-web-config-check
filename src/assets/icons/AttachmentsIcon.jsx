import React from 'react';
import PropTypes from 'prop-types';

function AttachmentsIcon(props) {
  const { className, role, ariaLabel } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="16"
      viewBox="0 0 15 16"
      className={className}
      role={role}
      aria-label={ariaLabel}
    >
      <path
        fill="#959BA3"
        d="M10.494 0A4.39 4.39 0 007.53 1.181L1.687 6.626c-2.25 2.142-2.25 5.605 0 7.767 2.249 2.143 5.885 2.143 8.156 0l2.627-2.502-1.45-1.381-2.439 2.262-.189.26c-1.45 1.382-3.804 1.382-5.255 0-1.43-1.361-1.387-3.563 0-4.944l5.844-5.506c.82-.78 2.186-.78 3.027 0 .82.781.777 2.022 0 2.823L6.753 10.35c-.21.2-.568.2-.8 0a.538.538 0 010-.761l.127-.06 4.043-3.588-1.45-1.381-4.17 3.648a2.406 2.406 0 000 3.503c1.01.96 2.67.98 3.679 0l5.255-4.885c1.64-1.561 1.64-4.083 0-5.625A4.26 4.26 0 0010.473.02l.021-.02z"
      />
    </svg>
  );
}

export default AttachmentsIcon;

AttachmentsIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  buttonColor: null,
};

AttachmentsIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  buttonColor: PropTypes.string,
};
