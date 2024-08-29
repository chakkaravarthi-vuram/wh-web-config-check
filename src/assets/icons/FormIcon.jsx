import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

function FormIcon(props) {
  const { className, onClick, style, title, id } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="16"
      viewBox="0 0 13 16"
      className={className}
      onClick={onClick || null}
      style={style}
      id={id}
    >
      <title>{title}</title>
      <path
        fill="#FFF"
        fillRule="evenodd"
        d="M11 0c1.105 0 2 .895 2 2v12c0 1.105-.895 2-2 2H2c-1.105 0-2-.895-2-2V2C0 .895.895 0 2 0h9zM9 11H4c-.552 0-1 .448-1 1s.448 1 1 1h5c.552 0 1-.448 1-1s-.448-1-1-1zm0-4H4c-.552 0-1 .448-1 1s.448 1 1 1h5c.552 0 1-.448 1-1s-.448-1-1-1zm0-4H4c-.552 0-1 .448-1 1s.448 1 1 1h5c.552 0 1-.448 1-1s-.448-1-1-1z"
      />
    </svg>
  );
}
export default FormIcon;

FormIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  id: EMPTY_STRING,
};
FormIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  id: PropTypes.string,
};
