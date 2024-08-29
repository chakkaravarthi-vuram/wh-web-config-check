import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

function AddIcon(props) {
  const { className, onClick, style, title, id, role, ariaLabel, ariaHidden } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      className={className}
      onClick={onClick || null}
      style={({ ...style })}
      id={id}
      role={role}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
    >
      <title>{title}</title>
      <path fillRule="evenodd" d="M7 0v5h5v2H7v5H5V6.999L0 7V5l5-.001V0h2z" />
    </svg>
  );
}
export default AddIcon;

AddIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  id: EMPTY_STRING,
  isButtonColor: false,
};
AddIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  id: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
