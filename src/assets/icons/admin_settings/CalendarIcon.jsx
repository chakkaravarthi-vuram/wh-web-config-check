import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../../hoc/ThemeContext';

function CalendarIcon(props) {
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
          d="M339.017 264h-16.034c-3.3 0-5.983 2.682-5.983 5.983v16.034c0 3.3 2.682 5.983 5.983 5.983h16.034c3.3 0 5.983-2.682 5.983-5.983v-16.034c0-3.3-2.682-5.983-5.983-5.983zm-.607 6c.87 0 1.571.699 1.59 1.549v12.883c0 .87-.7 1.568-1.571 1.568h-14.858c-.87 0-1.571-.699-1.571-1.568v-12.864c0-.87.7-1.568 1.571-1.568zm-1.552 5.251h-11.735c-.435 0-.776.34-.776.775v6.838c0 .435.34.775.776.775h11.735c.435 0 .776-.34.776-.775v-6.838c0-.435-.34-.775-.776-.775zM327.622 280c.21 0 .378.202.378.454v1.092c0 .252-.168.454-.378.454h-1.244c-.21 0-.378-.202-.378-.454v-1.092c0-.252.168-.454.378-.454zm4 0c.21 0 .378.202.378.454v1.092c0 .252-.168.454-.378.454h-1.244c-.21 0-.378-.202-.378-.454v-1.092c0-.252.168-.454.378-.454zm4 0c.21 0 .378.202.378.454v1.092c0 .252-.168.454-.378.454h-1.244c-.21 0-.378-.202-.378-.454v-1.092c0-.252.168-.454.378-.454zm-8-3c.21 0 .378.202.378.454v1.092c0 .252-.168.454-.378.454h-1.244c-.21 0-.378-.202-.378-.454v-1.092c0-.252.168-.454.378-.454zm4 0c.21 0 .378.202.378.454v1.092c0 .252-.168.454-.378.454h-1.244c-.21 0-.378-.202-.378-.454v-1.092c0-.252.168-.454.378-.454zm4 0c.21 0 .378.202.378.454v1.092c0 .252-.168.454-.378.454h-1.244c-.21 0-.378-.202-.378-.454v-1.092c0-.252.168-.454.378-.454zm.214-5.413c-.568 0-1.022.453-1.022 1.02s.454 1.02 1.022 1.02c.568 0 1.022-.453 1.022-1.02s-.454-1.02-1.022-1.02zm-9.69 0c-.569 0-1.023.453-1.023 1.02s.454 1.02 1.022 1.02c.568 0 1.022-.453 1.022-1.02s-.454-1.02-1.022-1.02z"
          transform="translate(-317 -264)"
        />
      </g>
    </svg>
  );
}
export default CalendarIcon;
CalendarIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
CalendarIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
