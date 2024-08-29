import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

function MoreVerticalIcon(props) {
  const {
    className,
  } = props;

  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.99935 10.8333C10.4596 10.8333 10.8327 10.4602 10.8327 9.99998C10.8327 9.53974 10.4596 9.16665 9.99935 9.16665C9.53911 9.16665 9.16602 9.53974 9.16602 9.99998C9.16602 10.4602 9.53911 10.8333 9.99935 10.8333Z"
        stroke="#959BA3"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.99935 4.99998C10.4596 4.99998 10.8327 4.62688 10.8327 4.16665C10.8327 3.70641 10.4596 3.33331 9.99935 3.33331C9.53911 3.33331 9.16602 3.70641 9.16602 4.16665C9.16602 4.62688 9.53911 4.99998 9.99935 4.99998Z"
        stroke="#959BA3"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.99935 16.6666C10.4596 16.6666 10.8327 16.2935 10.8327 15.8333C10.8327 15.3731 10.4596 15 9.99935 15C9.53911 15 9.16602 15.3731 9.16602 15.8333C9.16602 16.2935 9.53911 16.6666 9.99935 16.6666Z"
        stroke="#959BA3"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
export default MoreVerticalIcon;
MoreVerticalIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
  id: EMPTY_STRING,
  ariaHidden: false,
};
MoreVerticalIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
  id: PropTypes.string,
  ariaHidden: PropTypes.bool,
};
