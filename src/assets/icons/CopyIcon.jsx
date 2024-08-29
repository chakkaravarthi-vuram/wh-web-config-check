import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

function CopyIcon(props) {
  const {
    className,
  } = props;

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_6425_3327)">
        <path
          d="M13.3327 13.3334V15.6667C13.3327 16.6001 13.3327 17.0668 13.151 17.4233C12.9912 17.7369 12.7363 17.9919 12.4227 18.1517C12.0661 18.3334 11.5994 18.3334 10.666 18.3334H4.33268C3.39926 18.3334 2.93255 18.3334 2.57603 18.1517C2.26243 17.9919 2.00746 17.7369 1.84767 17.4233C1.66602 17.0668 1.66602 16.6001 1.66602 15.6667V9.33335C1.66602 8.39993 1.66602 7.93322 1.84767 7.5767C2.00746 7.2631 2.26243 7.00813 2.57603 6.84834C2.93255 6.66669 3.39926 6.66669 4.33268 6.66669H6.66602M9.33268 13.3334H15.666C16.5994 13.3334 17.0661 13.3334 17.4227 13.1517C17.7363 12.9919 17.9912 12.7369 18.151 12.4233C18.3327 12.0668 18.3327 11.6001 18.3327 10.6667V4.33335C18.3327 3.39993 18.3327 2.93322 18.151 2.5767C17.9912 2.2631 17.7363 2.00813 17.4227 1.84834C17.0661 1.66669 16.5994 1.66669 15.666 1.66669H9.33268C8.39926 1.66669 7.93255 1.66669 7.57603 1.84834C7.26243 2.00813 7.00746 2.2631 6.84767 2.5767C6.66602 2.93322 6.66602 3.39993 6.66602 4.33335V10.6667C6.66602 11.6001 6.66602 12.0668 6.84767 12.4233C7.00746 12.7369 7.26243 12.9919 7.57603 13.1517C7.93255 13.3334 8.39926 13.3334 9.33268 13.3334Z"
          stroke="#959BA3"
          stroke-width="1.7"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_6425_3327">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
export default CopyIcon;
CopyIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
  id: EMPTY_STRING,
  ariaHidden: false,
};
CopyIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
  id: PropTypes.string,
  ariaHidden: PropTypes.bool,
};
