import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import ThemeContext from 'hoc/ThemeContext';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function FrequentChatResponseHandlerIcon(props) {
  const { className, onClick, style, title, id, isButtonColor } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      className={cx(className)}
      onClick={onClick || null}
      style={({ ...style }, { fill: buttonColor })}
      id={id}
    >
      <title>{title}</title>
      <g fill="#B8BFC7">
        <path d="M4 21v4a1 1 0 001.707.707L10.414 21H11v1c0 1.654 1.346 3 3 3h4.723l4.762 2.857A.999.999 0 0025 27v-2c1.654 0 3-1.346 3-3v-9c0-1.655-1.346-3-3-3h-1V4c0-2.206-1.794-4-4-4H4C1.794 0 0 1.794 0 4v13c0 2.206 1.794 4 4 4zm20-4v-5h1c.551 0 1 .449 1 1v9c0 .551-.449 1-1 1h-1a1 1 0 00-1 1v1.234l-3.485-2.091A1 1 0 0019 23h-5c-.551 0-1-.449-1-1v-1h7c2.206 0 4-1.794 4-4zM2 4c0-1.103.897-2 2-2h16c1.103 0 2 .897 2 2v13c0 1.103-.897 2-2 2H10a1 1 0 00-.707.293L6 22.586V20a1 1 0 00-1-1H4c-1.103 0-2-.897-2-2V4z" />
        <path d="M8.317 6.763c.397-1.748 2.261-2.873 4.238-2.564C14.03 4.43 15.24 5.512 15.5 6.83c.272 1.387-.466 2.772-1.836 3.447-.436.215-.718.697-.718 1.227v1.044c0 .515-.468.933-1.045.933s-1.045-.417-1.045-.933v-1.044a3.18 3.18 0 011.8-2.862c.597-.294.906-.879.786-1.49-.108-.549-.633-1.018-1.248-1.114-.955-.15-1.68.44-1.829 1.096-.114.506-.668.834-1.23.73-.567-.103-.932-.596-.818-1.101zm4.127 8.793a1.037 1.037 0 11-2.074 0 1.037 1.037 0 012.074 0z" />
      </g>
    </svg>
  );
}
export default FrequentChatResponseHandlerIcon;

FrequentChatResponseHandlerIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  id: EMPTY_STRING,
};
FrequentChatResponseHandlerIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  id: PropTypes.string,
};
