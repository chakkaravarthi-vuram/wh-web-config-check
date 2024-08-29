import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../hoc/ThemeContext';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

function CorrectIcon(props) {
  const { className, onClick, style, title, isButtonColor, id, isPrimaryColor, ariaHidden, ariaLabel, role, tabIndex, keydown } = props;
  let { buttonColor, primaryColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  if (!isPrimaryColor) {
    primaryColor = null;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="13"
      viewBox="0 0 16 13"
      className={className}
      onClick={onClick}
      id={id}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      style={({ ...style }, { fill: buttonColor || primaryColor })}
      role={role}
      tabIndex={tabIndex}
      onKeyDown={keydown}
    >
      <title>{title}</title>
      <path fillRule="nonzero" d="M16 2.185L13.82 0 5.53 8.302l-3.35-3.356L0 7.131l5.531 5.542z" />
    </svg>
  );
}
export default CorrectIcon;
CorrectIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
  id: EMPTY_STRING,
  ariaHidden: false,
};
CorrectIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
  id: PropTypes.string,
  ariaHidden: PropTypes.bool,
};
