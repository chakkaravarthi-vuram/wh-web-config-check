import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function InfoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <path
        fill="#5B6375"
        fillRule="nonzero"
        d="M8 0c4.413 0 8 3.587 8 8s-3.587 8-8 8-8-3.587-8-8 3.587-8 8-8zm0 1.752A6.245 6.245 0 001.752 8 6.245 6.245 0 008 14.248 6.245 6.245 0 0014.248 8 6.245 6.245 0 008 1.752zm.017 4.884c.471 0 .842.387.842.842v3.031h.219c.455 0 .842.371.842.843a.845.845 0 01-.842.842H6.956c-.455 0-.825-.37-.825-.842s.37-.843.825-.843h.219V8.32h-.22a.84.84 0 01-.824-.842.83.83 0 01.825-.842zm0-2.981a1.128 1.128 0 110 2.256 1.128 1.128 0 010-2.256z"
      />
    </svg>
  );
}
export default InfoIcon;
InfoIcon.defaultProps = {
  className: EMPTY_STRING,
  style: null,
  title: EMPTY_STRING,
  onClick: null,
};
InfoIcon.propTypes = {
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  title: PropTypes.string,
};
