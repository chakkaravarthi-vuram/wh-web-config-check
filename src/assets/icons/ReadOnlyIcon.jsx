import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../hoc/ThemeContext';

function ReadOnlyIcon(props) {
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
      width="16"
      height="10"
      viewBox="0 0 16 10"
      className={className}
      onClick={onClick}
      style={({ ...style }, { fill: buttonColor })}
    >
      <title>{title}</title>
      <path
        // fill="#228BB5"
        fillRule="evenodd"
        stroke="none"
        d="M.082 5.274C2.078 8.277 4.962 10 8 10c3.037 0 5.924-1.721 7.916-4.726a.496.496 0 000-.548C13.922 1.723 11.037 0 8 0 4.963 0 2.079 1.722.083 4.726a.496.496 0 000 .548zM5 5c0-1.655 1.345-3 3-3 1.654 0 3 1.345 3 3S9.653 8 8 8C6.345 8 5 6.655 5 5z"
      />
    </svg>
  );
}

export default ReadOnlyIcon;

ReadOnlyIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};

ReadOnlyIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
