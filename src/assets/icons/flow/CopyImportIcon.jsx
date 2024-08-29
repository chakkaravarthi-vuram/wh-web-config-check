import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function ImportIcon(props) {
  const { className, onClick, style, title, id } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      className={className}
      onClick={onClick || null}
      style={style}
      id={id}
    >
      <title>{title}</title>

      <path
        //   fill="#228BB5"
        fillRule="nonzero"
        d="M19.2 19.2v3.2c0 .922-.678 1.6-1.6 1.6h-8c-.922 0-1.6-.678-1.6-1.6v-8c0-.922.678-1.6 1.6-1.6h3.2V9.6c0-.922.678-1.6 1.6-1.6h8c.922 0 1.6.678 1.6 1.6v8c0 .922-.678 1.6-1.6 1.6h-3.2zm-1.6 0h-3.2c-.922 0-1.6-.678-1.6-1.6v-3.2H9.6v8h8v-3.2zm-3.2-9.6v8h8v-8h-8z"
      />
    </svg>
  );
}
export default ImportIcon;

ImportIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  id: EMPTY_STRING,
};
ImportIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  id: PropTypes.string,
};
