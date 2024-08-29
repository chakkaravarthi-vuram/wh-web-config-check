import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ThemeContext from '../../hoc/ThemeContext';

function FilterIcon(props) {
  const { className, onClick, style, title, isButtonColor, ariaHidden, role, ariaLabel } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="11"
        height="12"
        fill="#959BA3"
        viewBox="0 0 16 16"
        aria-hidden={ariaHidden}
        className={className}
        onClick={onClick}
        style={({ ...style }, { fill: buttonColor })}
        role={role}
        aria-label={ariaLabel}
      >
        <title>{title}</title>
        <path
          fillRule="nonzero"
          d="M6 16a.998.998 0 01-1-1V9.287L.152 1.53A1 1 0 011 0h14a1.002 1.002 0 01.848 1.53L11 9.287V14a1 1 0 01-.758.97l-4 1L6 16zM2.804 2l4.044 6.47c.099.159.152.342.152.53v4.719l2-.5V9c0-.188.053-.371.152-.53L13.195 2H2.804zM5 8h6v2H5V8z"
        />
      </svg>
    );
  // return filterIcon;
}
export default FilterIcon;
FilterIcon.defaultProps = {
  type: 1,
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
  ariaHidden: false,
};
FilterIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  type: PropTypes.number,
  isButtonColor: PropTypes.bool,
  ariaHidden: PropTypes.bool,
};
