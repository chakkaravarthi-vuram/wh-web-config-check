import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function ExistingFormFieldsIcon(props) {
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
      <g fill="none" fillRule="evenodd">
        <circle cx="12" cy="12" r="12" fill="#EFF1F4" />
        <path
          fill="#2295BF"
          d="M18 16v1.5H6V16h12zm0-3v1.5H6V13h12zm0-3v1.5H6V10h12zm0-3v1.5H6V7h12z"
        />
      </g>
    </svg>
  );
}
export default ExistingFormFieldsIcon;
ExistingFormFieldsIcon.defaultProps = {
  className: EMPTY_STRING,
  style: null,
  title: EMPTY_STRING,
  onClick: null,
};

ExistingFormFieldsIcon.propTypes = {
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  title: PropTypes.string,
};
