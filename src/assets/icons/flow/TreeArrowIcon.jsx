import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function TreeArrowIcon(props) {
  const { className, onClick, style, title, id } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="13"
      viewBox="0 0 8 13"
      className={className}
      onClick={onClick || null}
      style={style}
      id={id}
    >
      <title>{title}</title>
      <path fill="#228BB5" fillRule="evenodd" d="M1 0v9h2.833V7.167l3.334 2.5-3.334 2.5V10H0V0h1z" />
    </svg>
  );
}
export default TreeArrowIcon;

TreeArrowIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  id: EMPTY_STRING,
};
TreeArrowIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  id: PropTypes.string,
};
