import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../hoc/ThemeContext';

function EditIcon(props) {
  const { className, onClick, style, title, isButtonColor, role, tabIndex, ariaLabel, onKeyDown } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={className}
      onClick={onClick}
      role={role}
      style={({ ...style }, { fill: buttonColor })}
      tabIndex={tabIndex || '-1'}
      onKeyDown={onKeyDown}
      aria-label={ariaLabel}
    >
      <title>{title}</title>
      <path
        fillRule="nonzero"
        d="M5.355 14.878l.465-.465-4.233-4.233L11.11.657a2.245 2.245 0 0 1 3.174 0l1.059 1.059a2.245 2.245 0 0 1 0 3.174l-9.988 9.988zm-.599.588c-.404.343-.919.534-1.453.534H.374A.374.374 0 0 1 0 15.626v-2.929c0-.534.19-1.049.534-1.453l4.222 4.222z"
      />
    </svg>
  );
}
export default EditIcon;
EditIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
EditIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
