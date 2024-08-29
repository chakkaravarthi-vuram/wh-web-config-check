import React from 'react';
import PropTypes from 'prop-types';

function MemberIcon(props) {
  const { className, onClick, style, title, role } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="20"
      viewBox="0 0 18 20"
      className={className}
      onClick={onClick}
      style={style}
      role={role}
    >
      <title>{title}</title>
      <path
        fill="#FFF"
        fillRule="evenodd"
        d="M14.017 10c1.879.972 3.22 2.87 3.533 5.139l.448 3.24c.044.834-.582 1.621-1.431 1.621H1.36c-.85 0-1.476-.787-1.342-1.62l.447-3.241A6.673 6.673 0 014 10a7.98 7.98 0 005.009 1.76c1.878 0 3.578-.649 5.01-1.76zM9 0c2.773 0 5 2.227 5 5s-2.227 5-5 5-5-2.227-5-5 2.227-5 5-5z"
      />
    </svg>
  );
}

export default MemberIcon;
MemberIcon.defaultProps = {
  className: null,
  onClick: null,
  title: null,
  style: null,
};
MemberIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
};
