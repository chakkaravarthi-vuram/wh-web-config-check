import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function AddNewFormFieldsIcon(props) {
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
          d="M12.75 6v5.249l5.25.001v1.5l-5.25-.001V18h-1.5v-5.251L6 12.75v-1.5l5.25-.001V6h1.5z"
        />
      </g>
    </svg>
  );
}
export default AddNewFormFieldsIcon;
AddNewFormFieldsIcon.defaultProps = {
  className: EMPTY_STRING,
  style: null,
  title: EMPTY_STRING,
  onClick: null,
};

AddNewFormFieldsIcon.propTypes = {
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  title: PropTypes.string,
};
