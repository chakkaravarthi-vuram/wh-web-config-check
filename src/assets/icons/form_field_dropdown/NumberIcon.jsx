import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function NumberIcon(props) {
  const { className, style, title, onClick } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      className={className}
      onClick={onClick || null}
      style={style}
    >
      <title>{title}</title>
      <path
        fill="#5B6375"
        d="M12 0H4a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V4a4 4 0 00-4-4zm2.667 12A2.667 2.667 0 0112 14.667H4A2.667 2.667 0 011.333 12V4A2.667 2.667 0 014 1.333h8A2.667 2.667 0 0114.667 4v8zM12.18 5.4h-1.067l.22-1.08A.679.679 0 1010 4.067L9.747 5.4h-2.5l.213-1.08a.679.679 0 10-1.333-.253L5.873 5.4H4.54a.667.667 0 000 1.333h1.067l-.494 2.534H3.78a.667.667 0 100 1.333h1.067l-.18 1.08a.667.667 0 00.526.787h.14a.667.667 0 00.667-.54l.253-1.334h2.514l-.214 1.08a.667.667 0 00.527.787h.127a.667.667 0 00.666-.54l.254-1.333h1.333a.667.667 0 000-1.334h-1.067l.494-2.533h1.333a.667.667 0 000-1.333l-.04.013zM9.007 9.267H6.5l.493-2.534H9.5l-.493 2.534z"
      />
    </svg>
  );
}
export default NumberIcon;
NumberIcon.defaultProps = {
  className: EMPTY_STRING,
  style: null,
  title: EMPTY_STRING,
  onClick: null,
};

NumberIcon.propTypes = {
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  title: PropTypes.string,
};
