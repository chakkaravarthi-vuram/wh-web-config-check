import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../hoc/ThemeContext';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

function NewCorrectIcon(props) {
  const { className, onClick, role, ariaLabel, style, title, isButtonColor, id,
    isPrimaryColor, width, height } = props;
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
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      onClick={onClick}
      id={id}
      role={role}
      aria-label={ariaLabel}
      style={({ ...style }, { fill: buttonColor || primaryColor })}
    >
      <title>{title}</title>
      <g fill="none" fillRule="evenodd">
        <circle cx="14" cy="14" r="14" fill="#6CCF9C" />
        <path
          fill="#FFF"
          fillRule="nonzero"
          d="M17.891 9L20 10.89 12.57 19 8 14.646l1.974-2.027 2.456 2.34z"
        />
      </g>
    </svg>
  );
}
export default NewCorrectIcon;
NewCorrectIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
  id: EMPTY_STRING,
  width: 28,
  height: 28,
};
NewCorrectIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
  id: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};
