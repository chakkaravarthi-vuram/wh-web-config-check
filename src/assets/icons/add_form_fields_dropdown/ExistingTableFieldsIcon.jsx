import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function ExistingTableFieldsIcon(props) {
  const { className, style, title, onClick } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
      onClick={onClick || null}
      style={style}
    >
      <title>{title}</title>
      <g fill="#EFF1F4" fillRule="evenodd">
        <circle cx="12" cy="12" r="12" />
        <g stroke="#2295BF">
          <path strokeWidth="1.5" d="M6.75 7.75h10.5v8.5H6.75z" />
          <path d="M7.5 10.5h9v1h-9z" />
          <path d="M10.5 8.5h1v7h-1zm3 0h1v7h-1z" />
        </g>
      </g>
    </svg>
  );
}
export default ExistingTableFieldsIcon;
ExistingTableFieldsIcon.defaultProps = {
  className: EMPTY_STRING,
  style: null,
  title: EMPTY_STRING,
  onClick: null,
};

ExistingTableFieldsIcon.propTypes = {
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  title: PropTypes.string,
};
