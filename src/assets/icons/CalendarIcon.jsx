import React from 'react';
import PropTypes from 'prop-types';

function CalendarIcon(props) {
  const { className, onClick, style, title, referenceName, tabIndex, role, onKeyDown, ariaLabel, calenderIconRef } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={className}
      onClick={onClick}
      tabIndex={tabIndex}
      role={role}
      onKeyDown={onKeyDown}
      aria-label={ariaLabel}
      style={style}
      ui-auto={referenceName}
      ref={calenderIconRef}
    >
      <title>{title}</title>
      <path
        fillRule="nonzero"
        d="M16 6.019v8.112C16 15.158 15.118 16 14.042 16H1.958C.882 16 0 15.158 0 14.13V6.02h16zM13.705 12h-1.41c-.155 0-.295.163-.295.388v1.224c0 .204.124.388.295.388h1.41c.155 0 .295-.163.295-.388v-1.224c0-.204-.124-.388-.295-.388zm-5 0h-1.41c-.155 0-.295.163-.295.388v1.224c0 .204.124.388.295.388h1.41c.155 0 .295-.163.295-.388v-1.224c0-.204-.124-.388-.295-.388zm-5 0h-1.41c-.155 0-.295.163-.295.388v1.224c0 .204.124.388.295.388h1.41c.155 0 .295-.163.295-.388v-1.224c0-.204-.124-.388-.295-.388zm10-4h-1.41c-.155 0-.295.163-.295.388v1.224c0 .204.124.388.295.388h1.41c.155 0 .295-.163.295-.388V8.388c0-.204-.124-.388-.295-.388zm-5 0h-1.41C7.14 8 7 8.163 7 8.388v1.224c0 .204.124.388.295.388h1.41C8.86 10 9 9.837 9 9.612V8.388C9 8.184 8.876 8 8.705 8zm-5 0h-1.41C2.14 8 2 8.163 2 8.388v1.224c0 .204.124.388.295.388h1.41C3.86 10 4 9.837 4 9.612V8.388C4 8.184 3.876 8 3.705 8zm8.079-8c.6 0 1.076.455 1.076 1.027v.59h1.164c1.094 0 1.958.825 1.976 1.87V5.03H0V3.486c0-1.027.882-1.87 1.958-1.87h1.164v-.589C3.122.455 3.6 0 4.198 0c.6 0 1.077.455 1.077 1.027v.59h5.433v-.59c0-.572.476-1.027 1.076-1.027z"
      />
    </svg>
  );
}
export default CalendarIcon;
CalendarIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
};
CalendarIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
};
