import React from 'react';
import PropTypes from 'prop-types';

function NextIcon(props) {
  const { className, onClick, style, title } = props;
  return (
    <svg
      width="18"
      height="12"
      viewBox="0 0 18 12"
      className={className}
      onClick={onClick}
      style={style}
    >
      <title>{title}</title>
      <path fill="#D8DEE9" fillRule="evenodd" d="M0 5h10V0l8 6-8 6V7H0V5z" />
    </svg>
  );
}

export default NextIcon;
NextIcon.defaultProps = {
  className: null,
  onClick: null,
  title: null,
  style: null,
};
NextIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
};
