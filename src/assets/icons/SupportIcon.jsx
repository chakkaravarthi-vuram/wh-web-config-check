import React from 'react';
import PropTypes from 'prop-types';

function SupportIcon(props) {
  const { onClick, role, title, ariaHidden } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      onClick={onClick}
      aria-hidden={ariaHidden}
      role={role}
    >
      <title>{title}</title>
      <path
        fill="#217CF5"
        d="M8 0c4.436 0 8 3.564 8 8s-3.564 8-8 8-8-3.564-8-8 3.564-8 8-8zm2 11a3.782 3.782 0 01-2 .583A3.782 3.782 0 016 11l-2 2.042c1.071.875 2.5 1.458 4 1.458s2.929-.51 4-1.458L10 11zM2.929 4C2 5.071 1.5 6.5 1.5 8s.5 2.929 1.429 4L5 9.929c-.429-.5-.643-1.215-.643-1.929s.214-1.429.572-2l-2-2zM13.07 4L11 5.929a3.84 3.84 0 01.571 2 3.84 3.84 0 01-.571 2L13.071 12c.858-1.071 1.429-2.5 1.429-4s-.5-2.929-1.429-4zM8 6c-1.133 0-2 .867-2 2s.867 2 2 2 2-.867 2-2-.867-2-2-2zm0-4.5c-1.5 0-2.929.51-4 1.458L6 5a3.782 3.782 0 012-.583c.714 0 1.429.218 2 .583l2-2.042C10.929 2.083 9.5 1.5 8 1.5z"
      />
    </svg>
  );
}

export default SupportIcon;
SupportIcon.defaultProps = {
  className: null,
  onClick: null,
  title: null,
  style: null,
  id: null,
};
SupportIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  id: PropTypes.string,
};
