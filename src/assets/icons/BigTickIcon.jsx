import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../hoc/ThemeContext';

function BigTickIcon(props) {
  const { className, onClick, style, title, isButtonColor } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      className={className}
      onClick={onClick}
      style={({ ...style }, { fill: buttonColor })}
    >
      <title>{title}</title>
      <g fill="#6CCF9C" fillRule="evenodd">
        <path d="M18 0c9.941 0 18 8.059 18 18s-8.059 18-18 18S0 27.941 0 18 8.059 0 18 0z" opacity="0.2" />
        <path fillRule="nonzero" d="M23.837 10L27 13.023 15.854 26 9 19.033l2.961-3.242 3.684 3.744z" />
      </g>
    </svg>
  );
}

export default BigTickIcon;

BigTickIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
BigTickIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
