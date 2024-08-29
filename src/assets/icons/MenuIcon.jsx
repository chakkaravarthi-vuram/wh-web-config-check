import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';

function MenuIcon(props) {
  const { className, onClick, title, ariaHidden, ariaLabel, role, tabIndex, ariaExpanded, onKeyDown } = props;
  return (
    <svg
      width="18"
      height="16"
      viewBox="0 0 18 16"
      onKeyDown={onKeyDown}
      aria-expanded={ariaExpanded}
      role={role}
      tabIndex={tabIndex}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
    <title>{title}</title>
    <g transform="matrix(-1 0 0 1 18 0)" fill="none" fillRule="evenodd">
        <rect fill="#959BA3" width="18" height="2" rx="1" />
        <rect fill="#959BA3" x="8" y="7" width="10" height="2" rx="1" />
        <rect fill="#959BA3" y="14" width="18" height="2" rx="1" />
        <path fill="#217CF5" d="m0 8 6-4v8z" />
    </g>
    </svg>
  );
}
export default MenuIcon;
MenuIcon.defaultProps = {
  className: null,
  onClick: null,
  title: EMPTY_STRING,
  ariaHidden: false,
  ariaLabel: EMPTY_STRING,
};
MenuIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  ariaHidden: PropTypes.bool,
  ariaLabel: PropTypes.string,
};
