import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function WhiteTickIcon(props) {
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
      <g fill="none" fillRule="evenodd">
        <circle cx="8" cy="8" r="8" fill="#FFF" />
        <path fill="#6CCF9C" fillRule="nonzero" d="M10.594 5L12 6.323 7.046 12 4 8.952l1.316-1.419 1.637 1.639z" />
      </g>
    </svg>
  );
}
export default WhiteTickIcon;

WhiteTickIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  id: EMPTY_STRING,
};
WhiteTickIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  id: PropTypes.string,
};
