import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../hoc/ThemeContext';

function FloatingActionIcon(props) {
  const { className, style, title, isButtonColor } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className={className}
      style={{ ...style, fill: buttonColor }}
    >
      <title>{title}</title>
      <path
      fill="#FFF"
      fillRule="evenodd"
d="M11 0v9h9v2h-9v9H9v-9.001L0 11V9l9-.001V0h2z"
      />
    </svg>
  );
}
export default FloatingActionIcon;
FloatingActionIcon.defaultProps = {
  className: null,
  style: null,
  title: null,
};
FloatingActionIcon.propTypes = {
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
};
