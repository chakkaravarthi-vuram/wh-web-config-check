import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

function ArrowDownIcon(props) {
  const {
    className,
    onClick,
    onDragStart,
  } = props;

  return (
    <svg
      width="20"
      height="20"
      className={className}
      onClick={onClick}
      onDragStart={onDragStart}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.0007 4.16665V15.8333M10.0007 15.8333L15.834 9.99998M10.0007 15.8333L4.16732 9.99998"
        stroke="#959BA3"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
export default ArrowDownIcon;
ArrowDownIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
  id: EMPTY_STRING,
  ariaHidden: false,
};
ArrowDownIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
  id: PropTypes.string,
  ariaHidden: PropTypes.bool,
};
