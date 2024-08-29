import React from 'react';
import PropTypes from 'prop-types';

function PinIcon(props) {
  const { className, onClick, title, style } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="14"
      viewBox="0 0 16 14"
      className={className}
      onClick={onClick || null}
      style={style}
    >
      <title>{title}</title>
      <path
        fill="#5B6375"
        d="M14.736 6.281l-6.202 6.052c-.973.969-2.272 1.56-3.657 1.667h-.354c-1.206.013-2.366-.445-3.222-1.274-1.885-1.839-1.7-5.014.41-7.074L7.27.23c.314-.305.822-.305 1.136 0 .152.147.238.348.238.558 0 .21-.086.41-.238.558L2.839 6.776c-1.49 1.446-1.675 3.624-.418 4.85.627.58 1.482.867 2.343.786.997-.08 1.93-.51 2.626-1.21l6.242-6.03c.935-.774 1.064-2.136.29-3.065-.949-.754-2.342-.628-3.133.283L4.587 8.443c-.203.192-.328.448-.354.723-.023.2.045.401.185.55.41.289.979.22 1.305-.157l6.532-6.375c.314-.305.821-.305 1.136 0 .152.148.238.349.238.558 0 .21-.086.41-.238.558l-6.524 6.367c-.945 1.007-2.547 1.081-3.585.165-.94-1.01-.868-2.573.161-3.498l6.162-6.052c1.422-1.529 3.84-1.655 5.42-.283 1.405 1.54 1.276 3.897-.29 5.282z"
      />
    </svg>
  );
}
export default PinIcon;
PinIcon.defaultProps = {
  className: null,
  onClick: null,
  title: null,
  style: null,
};
PinIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
};
