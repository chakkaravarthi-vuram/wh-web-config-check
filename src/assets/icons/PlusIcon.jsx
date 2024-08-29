import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../hoc/ThemeContext';

function PlusIcon(props) {
  const { className, onClick, style, title, isButtonColor, onBlur, id, role, ariaHidden } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      className={className}
      onClick={onClick}
      onBlur={onBlur}
      style={({ ...style }, { fill: buttonColor })}
      id={id}
      role={role}
      aria-hidden={ariaHidden}
    >
      <title>{title}</title>
      <path
        d="M7 0v5h5v2H7v5H5V6.999L0 7V5l5-.001V0h2z"
        fillRule="evenodd"
      />
    </svg>
  );
}
export default PlusIcon;

PlusIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
  onBlur: null,
};
PlusIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
  onBlur: PropTypes.func,
};
