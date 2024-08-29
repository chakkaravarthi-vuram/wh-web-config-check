import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ThemeContext from '../../hoc/ThemeContext';

function ReplicateTaskIcon(props) {
  const { className, onClick, style, isButtonColor, ariaLabel, role } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
     <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      className={className}
      aria-label={ariaLabel}
      role={role}
      onClick={onClick}
      style={{ ...style, fill: buttonColor }}
     >
      <path
        fill="#6C727E"
        d="M2.746 3.473v1.454H1.455v7.618h7.618v-1.272h1.454V14H0V3.473h2.746zM14 0v10.527H3.473V0H14zM9.25 3H8v1.874l-1.875.001v1.25L8 6.124V8h1.25V6.124l1.875.001v-1.25L9.25 4.874V3z"
      />
     </svg>
  );
}
export default ReplicateTaskIcon;
ReplicateTaskIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
ReplicateTaskIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
