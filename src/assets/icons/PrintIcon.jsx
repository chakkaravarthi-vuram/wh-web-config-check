import React from 'react';
import PropTypes from 'prop-types';

function PrintIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="16"
      viewBox="0 0 18 16"
    >
      <path
        d="M17.212 3.176h-3.15V.784A.783.783 0 0 0 13.272 0H4.727a.79.79 0 0 0-.788.784v2.392H.788A.79.79 0 0 0 0 3.961v8.784a.783.783 0 0 0 .788.784h2.757v1.687a.782.782 0 0 0 .788.784h9.334a.79.79 0 0 0 .788-.784v-1.687h2.757a.79.79 0 0 0 .788-.784V3.961a.783.783 0 0 0-.788-.785zM5.514 1.57h6.972v1.608H5.514V1.568zM12.88 14.43H5.12v-4.294h7.76v4.294zm.334-7.47h-1.772V5.392h1.772v1.569zm2.954 0h-1.772V5.392h1.772v1.569z"
        fill="#FFF"
        fillRule="nonzero"
      />
    </svg>
  );
}
export default PrintIcon;

PrintIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
  onBlur: null,
};
PrintIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
  onBlur: PropTypes.func,
};
