import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../hoc/ThemeContext';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

function ChevronIcon(props) {
  const { className, onClick, style, title, isButtonColor, id, role, onKeyDown, tabIndex, ariaLabel } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="9"
      viewBox="0 0 14 9"
      className={className}
      onClick={onClick}
      tabIndex={tabIndex || (onClick ? '0' : '')}
      style={({ ...style }, { fill: buttonColor })}
      id={id}
      role={role}
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        d="M.458 7.206L6.778.708l.133.138.296-.304 6.495 6.68-1.427 1.48-5.2-5.33-5.172 5.319L.458 7.206z"
      />
    </svg>
  );
}
export default ChevronIcon;

ChevronIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
  id: EMPTY_STRING,
};
ChevronIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
  id: PropTypes.string,
};
