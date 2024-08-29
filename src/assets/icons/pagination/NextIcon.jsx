import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function NextIcon(props) {
  const { className, style, title, onClick, ariaLabel, role } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="7"
      height="10"
      viewBox="0 0 7 10"
      role={role}
      className={className}
      aria-label={ariaLabel}
      onClick={onClick || null}
      style={style}
    >
      <title>{title}</title>
      <path fillRule="evenodd" d="M.5 5l6-4.5v9z" />
    </svg>
  );
}
export default NextIcon;
NextIcon.defaultProps = {
  className: EMPTY_STRING,
  style: null,
  title: EMPTY_STRING,
  onClick: null,
};

NextIcon.propTypes = {
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  title: PropTypes.string,
};
