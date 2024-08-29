import React from 'react';
import PropTypes from 'prop-types';

function HelpGearIcon(props) {
  const { className, onClick, style, title, role } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="16"
      viewBox="0 0 21 21"
      className={className}
      onClick={onClick || null}
      style={style}
      role={role}
    >
      <title>{title}</title>
      <path
      fill="#000"
        d="M60.978 41.662c0-.918-.743-1.662-1.66-1.662H41.66c-.918 0-1.661.744-1.661 1.662l.022 13.734c0 .919.743 1.662 1.66 1.662h5.77l2.207 3.5c.371.59 1.245.59 1.617 0l2.272-3.5h5.791c.918 0 1.661-.743 1.661-1.662l-.022-13.734zM53 52c0 .559-.412 1-.934 1h-8.132c-.522 0-.934-.441-.934-1 0-.559.412-1 .934-1h8.132c.522 0 .934.47.934 1zm4.038-3H43.962c-.537 0-.962-.441-.962-1 0-.559.425-1 .962-1h13.076c.537 0 .962.441.962 1 0 .53-.425 1-.962 1zm0-4H43.962c-.537 0-.962-.441-.962-1 0-.559.425-1 .962-1h13.076c.537 0 .962.441.962 1 0 .559-.425 1-.962 1z"
        transform="translate(-50.000000, -640.000000) translate(10.000000, 600.000000)"
      />
    </svg>
  );
}
export default HelpGearIcon;
HelpGearIcon.defaultProps = {
  className: null,
  onClick: null,
  title: null,
  style: null,
};
HelpGearIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
};
