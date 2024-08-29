import React from 'react';
import PropTypes from 'prop-types';

function LogoSmall(props) {
  const { className, onClick, title, id } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 40"
      className={className}
      onClick={onClick}
      id={id}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id="40drx70v0a" x1="28.398%" x2="71.602%" y1="100%" y2="0%">
          <stop offset="0%" stopColor="#72BE44" />
          <stop offset="100%" stopColor="#00A0FD" />
        </linearGradient>
      </defs>
      <g fill="none" fillRule="evenodd">
        <g>
          <g>
            <path
              fill="url(#40drx70v0a)"
              d="M51.451 0L42.911 27.909 37.879 11.885 33.849 24.021 39.287 39.784 46.514 39.784 59.999 0z"
              transform="translate(-170 -180) translate(170 180)"
            />
            <path
              fill="#FFF"
              d="M25.53 0L22.132 11.545 20.755 16.23 17.317 27.909 8.78 0 0 0 13.487 39.784 20.714 39.784 24.582 28.328 26.177 23.605 29.89 12.608 34.147 0z"
              transform="translate(-170 -180) translate(170 180)"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
export default LogoSmall;

LogoSmall.defaultProps = {
  className: null,
  onClick: null,
  title: null,
  id: null,
};
LogoSmall.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  id: PropTypes.string,
};
