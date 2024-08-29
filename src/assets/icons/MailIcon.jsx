import React from 'react';
import PropTypes from 'prop-types';

function MailIcon(props) {
  const {
    className, onClick, title, style, role,
  } = props;

  return (
    <svg
      width="16"
      height="12"
      viewBox="0 0 16 12"
      className={className}
      style={({ ...style })}
      onClick={onClick}
      role={role}
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        d="M10.824 6.635l4.774 4.684a1.752 1.752 0 0 1-1.376.681H1.778c-.554 0-1.05-.266-1.377-.681l4.776-4.685 1.226 1.203c.44.432 1.018.648 1.597.648s1.157-.216 1.598-.648l1.226-1.202zm5.155-5.056c.012.087.021.176.021.267v8.308c0 .091-.009.18-.021.268L11.47 6zm-15.958 0l4.508 4.42-4.508 4.423A1.925 1.925 0 0 1 0 10.154V1.846c0-.091.009-.18.021-.268zM14.222 0c.554 0 1.05.266 1.376.682l-6.61 6.484a1.434 1.434 0 0 1-1.975 0L.4.68A1.752 1.752 0 0 1 1.778 0z"
      />
    </svg>
  );
}
export default MailIcon;

MailIcon.defaultProps = {
  className: null,
  onClick: null,
  title: null,
  style: null,
};
MailIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
};
