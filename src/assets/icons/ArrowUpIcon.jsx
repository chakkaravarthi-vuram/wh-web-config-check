import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

function ArrowUpIcon(props) {
  const {
    className,
    onClick,
  } = props;

  return (
    <svg
      width="20"
      height="20"
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <path
        d="M9.99935 15.8334V4.16669M9.99935 4.16669L4.16602 10M9.99935 4.16669L15.8327 10"
        stroke="#959BA3"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
export default ArrowUpIcon;
ArrowUpIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
  id: EMPTY_STRING,
  ariaHidden: false,
};
ArrowUpIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
  id: PropTypes.string,
  ariaHidden: PropTypes.bool,
};
