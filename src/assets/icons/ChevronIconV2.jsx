import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../hoc/ThemeContext';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

function ChevronIconV2(props) {
  const { className, onClick, style, title, isButtonColor, id, role, onKeyDown, tabIndex, ariaLabel } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
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
      <g>
        <path
          stroke="#959BA3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 15l6-6 6 6"
        />
      </g>
    </svg>
  );
}
export default ChevronIconV2;

ChevronIconV2.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
  id: EMPTY_STRING,
};
ChevronIconV2.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
  id: PropTypes.string,
};
