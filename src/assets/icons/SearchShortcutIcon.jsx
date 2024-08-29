import React from 'react';
import PropTypes from 'prop-types';

function SearchShortcutIcon(props) {
  const { className, title } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      className={className}
      viewBox="0 0 20 20"
      fill="none"
    >
      <title>{title}</title>
      <path
        d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
        stroke="#959BA3"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
export default SearchShortcutIcon;

SearchShortcutIcon.defaultProps = {
  className: null,
  onClick: null,
  title: null,
  ariaHidden: false,
};
SearchShortcutIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  ariaHidden: PropTypes.bool,
};
