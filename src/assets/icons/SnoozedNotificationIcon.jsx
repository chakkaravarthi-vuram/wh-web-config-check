import React from 'react';
import PropTypes from 'prop-types';

function SnoozedNotificationIcon(props) {
  const { className, onClick, style, title, role } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="24"
      viewBox="0 0 26 24"
      className={className}
      role={role}
      onClick={onClick}
      style={{ ...style }}
    >
      <title>{title}</title>
      <path
        fill="#F4A46A"
        d="M24.397 16.664h-3.742a.943.943 0 01-.73-1.515l2.526-3.163h-1.796a.936.936 0 010-1.87h3.742a.942.942 0 01.74 1.515l-1.628 2.04-.899 1.122h1.787a.935.935 0 010 1.871zM.923 4.361a.948.948 0 00.701-.318 13.354 13.354 0 012.78-2.348.928.928 0 00.29-1.292C3.738-1.103 1.033 2.041.23 2.8a.944.944 0 00.693 1.56zm17.281-2.666a13.355 13.355 0 012.779 2.348.934.934 0 101.394-1.244c-.805-.758-3.5-3.902-4.463-2.396a.928.928 0 00.29 1.292zM21.498 17.6a11.01 11.01 0 01-2.517 3.406l1.394 1.394a.944.944 0 01-.665 1.6.908.908 0 01-.655-.28l-1.553-1.554a11.282 11.282 0 01-12.238 0L3.711 23.72a.907.907 0 01-.655.281.943.943 0 01-.664-1.6l1.394-1.394c-7.467-6.784-2.601-19.48 7.597-19.461A11.247 11.247 0 0122.021 9.18h-1.376a1.87 1.87 0 00-.13 3.734l-1.3 1.628a1.877 1.877 0 001.412 3.06h.87zm-6.27-5.754h-2.993V6.897a.936.936 0 10-1.872 0v5.885a.939.939 0 00.936.936h3.93a.936.936 0 000-1.872z"
      />
    </svg>
  );
}
export default SnoozedNotificationIcon;
SnoozedNotificationIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
SnoozedNotificationIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
