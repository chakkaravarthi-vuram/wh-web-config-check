import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function UploadIcon(props) {
  const { className, style, title, onClick, fillColor } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="16"
      viewBox="0 0 17 16"
      className={className}
      onClick={onClick || null}
      style={style}
    >
      <title>{title}</title>
      <path
        fill={fillColor || '#5B6375'}
        fillRule="nonzero"
        d="M12.883 5.068l-1.25 1.25a.31.31 0 0 1-.438 0L9.301 4.424v7.706c0 .17-.14.31-.31.31H7.223a.31.31 0 0 1-.31-.31V4.424L5.02 6.318a.31.31 0 0 1-.438 0l-1.25-1.25a.31.31 0 0 1 0-.438L7.872.09A.308.308 0 0 1 8.108 0a.308.308 0 0 1 .235.09l4.541 4.54a.31.31 0 0 1 0 .438zm3.332 10.658v-7.15s0-.096-.084-.176c-.066-.061-.159-.061-.159-.061h-1.645s-.07 0-.144.067c-.077.07-.077.159-.077.159v5.326H2.109V8.576s0-.096-.084-.176c-.066-.061-.159-.061-.159-.061H.221s-.07 0-.144.067C0 8.476 0 8.565 0 8.565v7.166A.27.27 0 0 0 .269 16h15.673c.15 0 .273-.123.273-.274z"
      />
    </svg>
  );
}
export default UploadIcon;
UploadIcon.defaultProps = {
  className: EMPTY_STRING,
  style: null,
  title: EMPTY_STRING,
  onClick: null,
};

UploadIcon.propTypes = {
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  title: PropTypes.string,
};
