import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../../hoc/ThemeContext';

function LookUpIcon(props) {
  const { className, onClick, style, title, isButtonColor } = props;
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
      <path
        // fill="#6767B4"
        fillRule="nonzero"
        d="M22.017 0H5.983A5.988 5.988 0 000 5.983v16.034C0 25.317 2.682 28 5.983 28h16.034c3.3 0 5.983-2.682 5.983-5.983V5.983C28 2.683 25.318 0 22.017 0zM7 9h14a3 3 0 013 3v5a3 3 0 01-3 3H7a3 3 0 01-3-3v-5a3 3 0 013-3zm11 8l-3-4h6l-3 4zM8 11h2v7H8v-7zm0 5h4v2H8v-2z"
      />
    </svg>
  );
}

export default LookUpIcon;

LookUpIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
LookUpIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
