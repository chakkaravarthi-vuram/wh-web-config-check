import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function DateTimeIcon(props) {
  const { className, style, title, onClick } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      className={className}
      onClick={onClick || null}
      style={style}
    >
      <title>{title}</title>
      <path
        fill="#5B6375"
        d="M4 6.019v8.112C4 15.158 3.118 16 2.042 16h-.084C.882 16 0 15.158 0 14.13V6.02h4zM11 6a5 5 0 110 10 5 5 0 010-10zm-8.295 6h-1.41c-.155 0-.295.163-.295.388v1.224c0 .204.124.388.295.388h1.41c.155 0 .295-.163.295-.388v-1.224c0-.204-.124-.388-.295-.388zm7.78-4c-.268 0-.485.183-.485.41v4.18c0 .227.217.41.485.41l.03-.002.028.002h2.972c.268 0 .485-.183.485-.41 0-.226-.217-.41-.485-.41H10.97V8.41c0-.227-.217-.41-.485-.41zm-7.78 0h-1.41C1.14 8 1 8.163 1 8.388v1.224c0 .204.124.388.295.388h1.41C2.86 10 3 9.837 3 9.612V8.388C3 8.184 2.876 8 2.705 8zm9.079-8c.6 0 1.076.455 1.076 1.027v.59h1.164c1.094 0 1.958.825 1.976 1.87V5.03H0V3.486c0-1.027.882-1.87 1.958-1.87h1.164v-.589C3.122.455 3.6 0 4.198 0c.6 0 1.077.455 1.077 1.027v.59h5.433v-.59c0-.572.476-1.027 1.076-1.027z"
      />
      <title>{title}</title>
    </svg>
  );
}
export default DateTimeIcon;
DateTimeIcon.defaultProps = {
  className: EMPTY_STRING,
  style: null,
  title: EMPTY_STRING,
  onClick: null,
};
DateTimeIcon.propTypes = {
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  title: PropTypes.string,
};
