import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../../hoc/ThemeContext';

function UserManagementIcon(props) {
  const {
    className, onClick, style, title, isButtonColor,
  } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      className={className}
      onClick={onClick}
      style={({ ...style }, { fill: buttonColor })}
    >
      <title>{title}</title>
      <g fillRule="evenodd">
        <path
          d="M339.017 208h-16.034c-3.3 0-5.983 2.682-5.983 5.983v16.034c0 3.3 2.682 5.983 5.983 5.983h16.034c3.3 0 5.983-2.682 5.983-5.983v-16.034c0-3.3-2.682-5.983-5.983-5.983zM331 213.63c2.299 0 4.156 1.856 4.156 4.155 0 2.3-1.857 4.156-4.156 4.156-2.299 0-4.156-1.857-4.156-4.156 0-2.299 1.857-4.156 4.156-4.156zm7.87 15.562c0 .648-.531 1.15-1.15 1.15h-13.41c-.649 0-1.15-.531-1.15-1.15v-2.3c0-.353.177-.677.442-.913 1.68-1.385 4.392-2.27 7.398-2.27 3.036 0 5.718.885 7.427 2.27.266.236.442.56.442.914v2.299z"
          transform="translate(-317 -208)"
        />
      </g>
    </svg>
  );
}
export default UserManagementIcon;
UserManagementIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
UserManagementIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
