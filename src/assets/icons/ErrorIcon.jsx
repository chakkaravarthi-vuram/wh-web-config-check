import React from 'react';
import PropTypes from 'prop-types';

function ErrorIcon(props) {
  const { className, onClick, style, ariaHidden } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="32"
      viewBox="0 0 36 32"
      className={className}
      onClick={onClick || null}
      style={style}
      aria-hidden={ariaHidden}
    >
      <path
        fill="#FFF"
        fillRule="nonzero"
        d="M35.373 25.08L22.048 2.307A4.686 4.686 0 0 0 18 0c-1.671 0-3.214.879-4.05 2.306L.627 25.081a4.56 4.56 0 0 0 0 4.613A4.687 4.687 0 0 0 4.675 32h26.65c1.67 0 3.214-.88 4.049-2.306a4.56 4.56 0 0 0 0-4.613zm-15.953.623c0 .734-.604 1.33-1.347 1.33H18a1.338 1.338 0 0 1-1.347-1.33v-.072c0-.734.603-1.328 1.347-1.328h.073c.743 0 1.347.594 1.347 1.328v.072zm-.074-4.094c0 .734-.602 1.33-1.346 1.33a1.338 1.338 0 0 1-1.347-1.33L15.78 9.542c0-.734 1.476-1.616 2.22-1.616.744 0 2.22.882 2.22 1.616l-.874 12.067z"
      />
    </svg>
  );
}
export default ErrorIcon;
ErrorIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
};
ErrorIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
};
