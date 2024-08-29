import React from 'react';
import PropTypes from 'prop-types';

function MoveToFirstIcon(props) {
  const { className, onClick, title, style } = props;
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      className={className}
      onClick={onClick || null}
      style={style}
    >
      <title>{title}</title>
      <path fill="#228BB5" fillRule="evenodd" d="M6 9.5L0 5 6 .5l.001 3L10 .5v9l-4-3v3z" />
    </svg>
  );
}
export default MoveToFirstIcon;

MoveToFirstIcon.defaultProps = {
  className: null,
  onClick: null,
  title: null,
  style: null,
};
MoveToFirstIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
};
