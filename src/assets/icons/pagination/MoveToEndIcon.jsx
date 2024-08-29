import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function MoveToEndIcon(props) {
  const { className, style, title, onClick, ariaLabel, role } = props;
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      className={className}
      aria-label={ariaLabel}
      role={role}
      onClick={onClick || null}
      style={style}
    >
      <title>{title}</title>
      <path fillRule="evenodd" d="M6 9.5L0 5 6 .5l.001 3L10 .5v9l-4-3v3z" />
    </svg>
  );
}
export default MoveToEndIcon;

MoveToEndIcon.defaultProps = {
  className: EMPTY_STRING,
  style: null,
  title: EMPTY_STRING,
  onClick: null,
};

MoveToEndIcon.propTypes = {
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  title: PropTypes.string,
};
