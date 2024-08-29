import React from 'react';
import PropTypes from 'prop-types';

function CloseIcon(props) {
  const { className, onClick, style, title, buttonColor, id } =
    props;
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      onClick={onClick}
      style={({ ...style }, { fill: buttonColor })}
      id={id}
    >
      <title>{title}</title>
      <path id="Icon" d="M15 5L5 15M5 5L15 15" stroke="#959BA3" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />

    </svg>
  );
}

export default CloseIcon;

CloseIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  buttonColor: null,
};

CloseIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  buttonColor: PropTypes.string,
};
