import React from 'react';
import PropTypes from 'prop-types';

function BackIcon(props) {
    const { className, onClick, onBlur, role, ariaLabel, title } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="10"
      viewBox="0 0 13 10"
      className={className}
      onClick={onClick}
      onBlur={onBlur}
      role={role}
      aria-label={ariaLabel}
    >
      <title>{title}</title>
      <path
        fill="#217CF5"
        d="M4.566 9.398L.846 5.686c-.01-.006-.015-.016-.02-.02a.874.874 0 01-.247-.49c0-.014-.005-.03-.005-.045-.005-.03-.005-.06-.005-.09l.005-.086c0-.015.005-.03.005-.045a.859.859 0 01.247-.489l.02-.02L4.566.688a.883.883 0 01.626-.257c.227 0 .454.086.626.257a.887.887 0 010 1.25l-2.236 2.23h8.192c.484 0 .883.398.883.882a.9.9 0 01-.257.624.873.873 0 01-.626.257H3.582l2.236 2.232a.887.887 0 010 1.25.905.905 0 01-1.252-.016z"
      />
    </svg>
  );
}

export default BackIcon;
BackIcon.defaultProps = {
    className: null,
    onClick: null,
    style: null,
    title: null,
    isButtonColor: false,
    onBlur: null,
  };
  BackIcon.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.objectOf(PropTypes.any),
    title: PropTypes.string,
    isButtonColor: PropTypes.bool,
    onBlur: PropTypes.func,
  };
