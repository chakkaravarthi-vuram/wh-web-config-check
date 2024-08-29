import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import ThemeContext from 'hoc/ThemeContext';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function ChatSearchResponseHandlerIcon(props) {
  const { className, onClick, style, title, id, isButtonColor, ariaHidden } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="35"
      viewBox="0 0 32 35"
      className={cx(className)}
      onClick={onClick || null}
      style={({ ...style }, { fill: buttonColor })}
      id={id}
      aria-hidden={ariaHidden}
    >
      <title>{title}</title>
      <path
        fill="#B8BFC7"
        d="M16 18.333c4.242.005 8.309 1.586 11.308 4.399 3 2.811 4.687 6.624 4.692 10.601 0 .596-.339 1.146-.889 1.444a1.882 1.882 0 01-1.778 0c-.55-.298-.889-.848-.889-1.444 0-4.168-2.371-8.02-6.222-10.103-3.85-2.084-8.594-2.084-12.444 0-3.85 2.084-6.222 5.935-6.222 10.103 0 .596-.34 1.146-.89 1.444a1.882 1.882 0 01-1.777 0C.339 34.479 0 33.929 0 33.333c.005-3.977 1.692-7.79 4.692-10.601C7.69 19.92 11.758 18.338 16 18.333zm0-1.667c-2.358 0-4.619-.877-6.286-2.44-1.667-1.563-2.603-3.683-2.603-5.893s.936-4.33 2.603-5.892C11.381.878 13.642 0 16 0c2.357 0 4.618.878 6.285 2.44 1.667 1.564 2.603 3.683 2.603 5.893-.002 2.21-.94 4.328-2.606 5.89-1.666 1.562-3.926 2.44-6.282 2.443zm0-3.333c1.414 0 2.77-.527 3.771-1.464 1-.938 1.562-2.21 1.562-3.536s-.562-2.598-1.562-3.535c-1-.938-2.357-1.465-3.771-1.465-1.415 0-2.771.527-3.772 1.465-1 .937-1.562 2.209-1.562 3.535 0 1.327.562 2.598 1.562 3.536 1 .937 2.357 1.464 3.772 1.464z"
      />
    </svg>
  );
}
export default ChatSearchResponseHandlerIcon;

ChatSearchResponseHandlerIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  id: EMPTY_STRING,
};
ChatSearchResponseHandlerIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  id: PropTypes.string,
};
