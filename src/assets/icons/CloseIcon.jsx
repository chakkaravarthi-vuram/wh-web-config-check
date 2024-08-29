import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ThemeContext from '../../hoc/ThemeContext';

function CloseIcon(props) {
  const { className, onClick, style, title, isButtonColor, ariaHidden, tabIndex, onKeyDown, role, ariaLabel, ariaLabelledby } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 512.001 512.001"
      //   style={{enableBackground:"new 0 0 512.001 512.001"}}
      className={className}
      onClick={onClick}
      role={role}
      onKeyDown={onKeyDown}
      fill="#6c727e"
      style={({ ...style }, { fill: buttonColor, stroke: buttonColor })}
      aria-hidden={ariaHidden}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
    >
      <title>{title}</title>
      <g>
        <g>
          <path
            d="M284.286,256.002L506.143,34.144c7.811-7.811,7.811-20.475,0-28.285c-7.811-7.81-20.475-7.811-28.285,0L256,227.717
        L34.143,5.859c-7.811-7.811-20.475-7.811-28.285,0c-7.81,7.811-7.811,20.475,0,28.285l221.857,221.857L5.858,477.859
        c-7.811,7.811-7.811,20.475,0,28.285c3.905,3.905,9.024,5.857,14.143,5.857c5.119,0,10.237-1.952,14.143-5.857L256,284.287
        l221.857,221.857c3.905,3.905,9.024,5.857,14.143,5.857s10.237-1.952,14.143-5.857c7.811-7.811,7.811-20.475,0-28.285
        L284.286,256.002z"
          />
        </g>
      </g>
    </svg>
  );
}
export default CloseIcon;
CloseIcon.defaultProps = {
  className: null,
  onClick: () => {},
  style: null,
  title: null,
  isButtonColor: false,
};
CloseIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
