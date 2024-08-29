import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';

function DropdownIcon(props) {
  const { className, style, title, onClick } = props;
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="8"
        fill="none"
        viewBox="0 0 12 8"
        className={className}
        onClick={onClick || null}
        style={style}
    >
      <title>{title}</title>
      <path
        fill="#959BA3"
        d="M6 4.976L10.125.851l1.178 1.179L6 7.333.697 2.03 1.875.85 6 4.976z"
      />
    </svg>
  );
}
export default DropdownIcon;
DropdownIcon.defaultProps = {
  className: EMPTY_STRING,
  style: null,
  title: EMPTY_STRING,
  onClick: null,
};
DropdownIcon.propTypes = {
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  title: PropTypes.string,
};
