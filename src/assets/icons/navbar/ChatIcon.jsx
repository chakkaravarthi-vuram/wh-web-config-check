import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function ChatIcon(props) {
  const { className, onClick, style, title, id } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 19 20"
      className={className}
      onClick={onClick || null}
      style={style}
      id={id}
    >
      <title>{title}</title>
      <path
        // fill="#228BB5"
        d="M16.75 0C17.984 0 19 1.043 19 2.308v10.258c0 1.265-1.016 2.307-2.25 2.307H9.312l-4.796 4.905a.737.737 0 01-.851.147.774.774 0 01-.423-.772l.43-4.28H2.25c-1.234 0-2.25-1.042-2.25-2.307V2.308C0 1.043 1.016 0 2.25 0zM4.433 6.4c-.7 0-1.266.537-1.266 1.2 0 .663.567 1.2 1.266 1.2.7 0 1.267-.537 1.267-1.2 0-.663-.567-1.2-1.267-1.2zm5.075 0c-.7 0-1.267.537-1.267 1.2 0 .663.567 1.2 1.267 1.2s1.267-.537 1.267-1.2c0-.663-.568-1.2-1.267-1.2zm5.059 0c-.7 0-1.267.537-1.267 1.2 0 .663.567 1.2 1.267 1.2s1.266-.537 1.266-1.2c0-.663-.567-1.2-1.266-1.2z"
      />
    </svg>
  );
}
export default ChatIcon;

ChatIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  id: EMPTY_STRING,
};
ChatIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  id: PropTypes.string,
};
