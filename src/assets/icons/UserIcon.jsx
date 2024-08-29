import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../hoc/ThemeContext';

function UserIcon(props) {
  const { className, onClick, style, title, isButtonColor, role, ariaLabel, ariaHidden } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="16"
      viewBox="0 0 14 16"
      className={className}
      onClick={onClick}
      style={({ ...style }, { fill: buttonColor })}
      role={role}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        d="M10.902 8c1.461.778 2.505 2.296 2.748 4.111l.348 2.593c.035.666-.452 1.296-1.113 1.296H1.058C.397 16-.09 15.37.014 14.704l.348-2.593C.571 10.296 1.649 8.778 3.11 8a6.102 6.102 0 0 0 3.896 1.407c1.461 0 2.783-.518 3.896-1.407zM7 0c2.157 0 3.889 1.782 3.889 4S9.157 8 7 8 3.111 6.218 3.111 4 4.843 0 7 0z"
      />
    </svg>
  );
}
export default UserIcon;
UserIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
UserIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
