import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../hoc/ThemeContext';

function NotesIcon(props) {
  const { className, onClick, style, title, isButtonColor, role, ariaLabel, ariaHidden } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="20"
      role={role}
      viewBox="0 0 18 20"
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      onClick={onClick}
      style={({ ...style }, { fill: buttonColor })}
    >
      <title>{title}</title>
      <path
        // fill="#AAAFBA"
        fillRule="evenodd"
        d="M2.385 0h9.625L18 4.603v13.564C18 19.175 16.927 20 15.615 20H2.385C1.073 20 0 19.175 0 18.167V1.832C0 .824 1.073 0 2.385 0zm.368 16h12.494c1.004 0 1.004 1 0 1H2.753c-1.004 0-1.004-1 0-1zm0-4h12.494c1.004 0 1.004 1 0 1H2.753c-1.004 0-1.004-1 0-1zm0-3h12.494c1.004 0 1.004 1 0 1H2.753c-1.004 0-1.004-1 0-1zM16 5.114c.002.478-.483.87-1.079.872L11.106 6c-.596.002-1.086-.387-1.088-.865L10 1.872c-.002-.477.483-.87 1.079-.872L16 5.114z"
      />
    </svg>
  );
}
export default NotesIcon;

NotesIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
NotesIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
