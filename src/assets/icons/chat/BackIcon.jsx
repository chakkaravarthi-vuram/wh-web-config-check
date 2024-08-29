import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function BackIcon(props) {
  const { className, onClick, style, title, id } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="20"
      viewBox="0 0 22 20"
      className={className}
      onClick={onClick || null}
      style={style}
      id={id}
    >
      <title>{title}</title>
      <path
        fill="#228BB5"
        fillRule="evenodd"
        d="M9.9 0l1.414 1.414-7.708 7.707h18.03v2H4.05l7.264 7.264-1.415 1.414L0 9.899 9.9 0z"
      />
    </svg>
  );
}
export default BackIcon;

BackIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  id: EMPTY_STRING,
};
BackIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  id: PropTypes.string,
};
