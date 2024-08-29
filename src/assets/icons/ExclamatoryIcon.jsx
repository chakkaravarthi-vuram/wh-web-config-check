import React from 'react';
import PropTypes from 'prop-types';

function ExclamatoryIcon(props) {
  const { className, onClick, style, id, title } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={className}
      onClick={onClick || null}
      style={style}
      id={id}
    >
      <title>{title}</title>
      <g fill="none" fillRule="evenodd">
        <circle cx="8" cy="8" r="8" fill="#F07F7F" />
        <path
          fill="#FFF"
          d="M8 11c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1zm0-8c.552 0 1 .448 1 1v5c0 .552-.448 1-1 1s-1-.448-1-1V4c0-.552.448-1 1-1z"
        />
      </g>
    </svg>
  );
}
export default ExclamatoryIcon;
ExclamatoryIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  id: null,
  title: null,
};
ExclamatoryIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  id: PropTypes.string,
  title: PropTypes.string,
};
