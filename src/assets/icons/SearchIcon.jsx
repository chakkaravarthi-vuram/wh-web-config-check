import React from 'react';
import PropTypes from 'prop-types';
import { ARIA_ROLES } from 'utils/UIConstants';

function SearchIcon(props) {
  const {
    className, onClick, title, ariaHidden, ariaLabel, onkeydown,
  } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden={ariaHidden}
      className={className}
      onClick={onClick || null}
      style={{ opacity: '0.4' }}
      role={ARIA_ROLES.IMG}
      aria-label={ariaLabel}
      onKeyDown={onkeydown}
    >
      <title>{title}</title>
      <path
        fillRule="nonzero"
        d="M15.734 14.486l-3.924-3.93a6.549 6.549 0 0 0-.592-8.625A6.517 6.517 0 0 0 6.571 0a6.517 6.517 0 0 0-4.647 1.931 6.59 6.59 0 0 0 0 9.306A6.517 6.517 0 0 0 6.57 13.17a6.46 6.46 0 0 0 3.968-1.34l3.946 3.908a.877.877 0 0 0 .635.263c.22 0 .46-.088.636-.263.329-.33.329-.9-.022-1.251zM6.593 11.39c-1.293 0-2.477-.505-3.398-1.405-1.863-1.865-1.863-4.916 0-6.804a4.771 4.771 0 0 1 3.398-1.404c1.293 0 2.477.505 3.398 1.404.92.9 1.403 2.107 1.403 3.402s-.505 2.48-1.403 3.402c-.9.922-2.127 1.405-3.398 1.405z"
      />
    </svg>
  );
}
export default SearchIcon;

SearchIcon.defaultProps = {
  className: null,
  onClick: null,
  title: null,
  ariaHidden: false,
};
SearchIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  ariaHidden: PropTypes.bool,
};
