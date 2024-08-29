import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../hoc/ThemeContext';

function EditDetailsIcon(props) {
  const { className, onClick, style, title, isButtonColor, role, ariaLabel } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="20"
      viewBox="0 0 18 20"
      className={className}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
      style={({ ...style }, { fill: buttonColor })}
    >
      <title>{title}</title>
      <path
        // fill="#AAAFBA"
        fillRule="evenodd"
        d="M14 0c2.21 0 4 1.79 4 4v12c0 2.21-1.79 4-4 4H4c-2.21 0-4-1.79-4-4V4c0-2.21 1.79-4 4-4h10zM9.665 6.747L4 12.413l.012 2.575L6.587 15l5.666-5.665-2.588-2.588zm1.578-1.577l-1.02 1.02 2.588 2.587.032-.032.087-.087.13-.13.16-.161.447-.446.163-.163c.378-.378.106-1.264-.609-1.979-.714-.715-1.6-.987-1.978-.609z"
      />
    </svg>
  );
}
export default EditDetailsIcon;

EditDetailsIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
EditDetailsIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
