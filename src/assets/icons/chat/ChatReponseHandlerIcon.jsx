import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import ThemeContext from 'hoc/ThemeContext';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function ChatReponseHandlerIcon(props) {
  const { className, onClick, style, title, id, isButtonColor, role, ariaLabel } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="42"
      height="46"
      viewBox="0 0 42 46"
      className={cx(className)}
      onClick={onClick || null}
      style={({ ...style }, { fill: buttonColor })}
      id={id}
      role={role}
      aria-label={ariaLabel}
    >
      <title>{title}</title>
      <path
        fill="#959BA3"
        d="M13.269 45.838a1.732 1.732 0 001.869-.263l11.76-10.19h6.352a8.71 8.71 0 006.184-2.594A8.905 8.905 0 0042 26.54V8.846a8.905 8.905 0 00-2.566-6.252A8.71 8.71 0 0033.25 0H8.75a8.71 8.71 0 00-6.184 2.594A8.905 8.905 0 000 8.846V26.54a8.905 8.905 0 002.566 6.252 8.71 8.71 0 006.184 2.595h3.5v8.846a1.777 1.777 0 001.018 1.606zM9.1 31.274a5.094 5.094 0 01-3.606-1.498A5.122 5.122 0 014 26.16V9.114c0-1.357.537-2.657 1.494-3.616A5.094 5.094 0 019.1 4h23.8c1.353 0 2.65.539 3.606 1.498A5.122 5.122 0 0138 9.114V26.16a5.122 5.122 0 01-1.494 3.616 5.094 5.094 0 01-3.606 1.498h-6.8a1.69 1.69 0 00-1.105.41L15.9 39.5v-6.522c0-.452-.18-.885-.498-1.205-.319-.32-.751-.5-1.202-.5H9.1z"
      />
    </svg>
  );
}
export default ChatReponseHandlerIcon;

ChatReponseHandlerIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  id: EMPTY_STRING,
};
ChatReponseHandlerIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  id: PropTypes.string,
};
