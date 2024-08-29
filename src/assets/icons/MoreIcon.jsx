import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';

function MoreIcon(props) {
  const { className, onClick, style, title, fillClass, role, focusable, ariaLabel, tabIndex,
    ariaHidden, height, fillColor, onMouseOver, onMouseOut, onFocus, onBlur } = props;
  const iconColor = fillColor || '#959BA3';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={height || '20'}
      viewBox="0 0 5 16"
      className={cx(className, fillClass)}
      onClick={onClick}
      onBlur={onBlur}
      style={({ ...style }, { fill: iconColor })}
      role={role}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
      focusable={focusable}
      aria-hidden={ariaHidden}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onFocus={onFocus}
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        d="M2 12a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm0-6a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm0-6a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"
      />
    </svg>
  );
}
export default MoreIcon;

MoreIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
  onBlur: null,
};
MoreIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
  onBlur: PropTypes.func,
};
