import React from 'react';
import PropTypes from 'prop-types';

function CompletedTaskIcon(props) {
  const { className, onClick, style, title, buttonColor, id, isSelected, ariaHidden } =
    props;
  const iconFill = isSelected ? '#217CF5' : '#959BA3';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="14"
      viewBox="0 0 12 14"
      className={className}
      aria-hidden={ariaHidden}
      onClick={onClick}
      style={({ ...style }, { fill: buttonColor })}
      id={id}
    >
      <title>{title}</title>
      <path
        d="M10.5.7H9.1a.7.7 0 0 0-.7-.7H2.8a.7.7 0 0 0-.7.7H.7a.7.7 0 0 0-.7.7v11.9a.7.7 0 0 0 .7.7h9.8a.7.7 0 0 0 .7-.7V1.4a.7.7 0 0 0-.7-.7zm-.7 11.9H1.4V2.1h.7a.7.7 0 0 0 .7.7h5.6a.7.7 0 0 0 .7-.7h.7v10.5zM8.54 6.718 7.536 5.673 4.665 8.664l-1.161-1.21L2.5 8.5l2.164 2.256L8.54 6.718z"
        fill={iconFill}
        fillRule="nonzero"
      />
    </svg>
  );
}

export default CompletedTaskIcon;

CompletedTaskIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  buttonColor: null,
};
CompletedTaskIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  buttonColor: PropTypes.string,
};
