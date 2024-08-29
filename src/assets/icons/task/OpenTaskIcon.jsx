import React from 'react';
import PropTypes from 'prop-types';

function OpenTaskIcon(props) {
  const { className, onClick, style, title, ariaLabel, buttonColor, id, isTaskListing, ariaHidden, role } =
    props;
  let iconFill;
  if (isTaskListing) {
    iconFill = '#959BA3';
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="16"
      viewBox="0 0 13 16"
      className={className}
      onClick={onClick}
      style={({ ...style, fill: buttonColor })}
      id={id}
      aria-hidden={ariaHidden}
      role={role}
      aria-label={ariaLabel}
    >
      <title>{title}</title>
      <path
        d="M7.778 0H1.556C.7 0 .008.72.008 1.6L0 14.4c0 .88.692 1.6 1.548 1.6h9.34c.856 0 1.556-.72 1.556-1.6V4.8L7.778 0zm3.11 14.4H1.557V1.6H7v4h3.889v8.8zm-7.14-5.56L2.645 9.968 5.398 12.8 9.8 8.272 8.703 7.144l-3.297 3.392L3.749 8.84z"
        fill={iconFill}
        fillRule="nonzero"
      />
    </svg>
  );
}

export default OpenTaskIcon;

OpenTaskIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  buttonColor: null,
};

OpenTaskIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  buttonColor: PropTypes.string,
};
