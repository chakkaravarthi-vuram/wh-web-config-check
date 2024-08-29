import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function YesOrNoIcon(props) {
  const { className, style, title, onClick } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      className={className}
      onClick={onClick || null}
      style={style}
    >
      <title>{title}</title>
      <g fill="none" fillRule="evenodd">
        <circle
          cx="6"
          cy="12"
          r="5.375"
          fill="#FFF"
          stroke="#5B6375"
          strokeWidth="1.25"
        />
        <circle
          cx="12"
          cy="6"
          r="5.375"
          fill="#FFF"
          stroke="#5B6375"
          strokeWidth="1.25"
        />
        <path
          fill="#5B6375"
          d="M9 13.988L7.988 15 6 13.005 4.012 15 3 13.988 4.995 12 3 10.012 4.012 9 6 10.995 7.988 9 9 10.012 7.005 12zM11.494 9L9 6.47l.827-.827 1.697 1.696L14.864 4l.779.827z"
        />
      </g>
    </svg>
  );
}
export default YesOrNoIcon;
YesOrNoIcon.defaultProps = {
  className: EMPTY_STRING,
  style: null,
  title: EMPTY_STRING,
  onClick: null,
};

YesOrNoIcon.propTypes = {
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  title: PropTypes.string,
};
