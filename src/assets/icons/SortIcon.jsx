import React from 'react';
import PropTypes from 'prop-types';
import { ARIA_ROLES } from 'utils/UIConstants';

function SortIcon(props) {
  const { className, onClick, title, color } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="12"
      viewBox="0 0 8 12"
      className={className}
      role={ARIA_ROLES.IMG}
      onClick={onClick || null}
      style={{ opacity: '0.4' }}
      aria-label="sort"
    >
      <title>{title}</title>
      <path
        fill={color || '#000000'}
        d="M4.71 2.717l2.297 2.292L8 3.99 4 0 0 3.99l.993 1.02 2.298-2.293v6.566L.993 6.991 0 8.01 4 12l4-3.99-.993-1.02-2.298 2.293z"
      />
    </svg>
  );
}
export default SortIcon;

SortIcon.defaultProps = {
  className: null,
  onClick: null,
  title: null,
};
SortIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
};
