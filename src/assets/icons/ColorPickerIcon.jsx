import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

function ColorPickerIcon(props) {
  const { className, onClick, style, title, id } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={className}
      onClick={onClick || null}
      style={style}
      id={id}
    >
      <title>{title}</title>
      <path
        fill="#FFFF"
        d="M8.742 4.422l2.836 2.836-6.792 6.792L1.002 16 0 14.998l1.951-3.785 6.79-6.79zm4.96.71l1.711-1.711c.783-.783.783-2.051 0-2.834-.782-.783-2.05-.783-2.833 0l-1.71 1.71-.71-.708c-.393-.392-1.025-.392-1.418 0-.39.391-.39 1.025 0 1.417l4.252 4.252c.392.39 1.026.39 1.417 0 .392-.393.392-1.025 0-1.418l-.708-.709z"
      />
    </svg>
  );
}
export default ColorPickerIcon;

ColorPickerIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  id: EMPTY_STRING,
};
ColorPickerIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  id: PropTypes.string,
};
