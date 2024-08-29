import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ThemeContext from '../../hoc/ThemeContext';

function SaveIcon(props) {
  const { className, onClick, style, title, isButtonColor } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={className}
      onClick={onClick}
      style={{ ...style, fill: buttonColor }}
    >
      <title>{title}</title>
      <path
        fill="#6C727E"
        d="M10.4 9.6V16H5.6V9.6h4.8zM4 0v3.2a.8.8 0 00.8.8H8a.8.8 0 00.8-.8V0H12a.8.8 0 01.568.232l3.2 3.2A.8.8 0 0116 4v11.2a.8.8 0 01-.8.8H12V8.8a.8.8 0 00-.8-.8H4.8a.8.8 0 00-.8.8V16H.8a.8.8 0 01-.8-.8V.8A.8.8 0 01.8 0H4zm3.2 0v2.4H5.6V0h1.6z"
      />
    </svg>
  );
}
export default SaveIcon;
SaveIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
SaveIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
