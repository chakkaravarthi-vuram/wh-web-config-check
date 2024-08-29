import React from 'react';
import PropTypes from 'prop-types';

function MoreOptionsIcon(props) {
  const { className, onClick, style, title } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="5"
      viewBox="0 0 21 5"
      className={className}
      onClick={onClick}
      style={style}
    >
      <title>{title}</title>
      <path
        fill="#AAAFBA"
        fillRule="evenodd"
        d="M2.5 0a2.5 2.5 0 010 5 2.5 2.5 0 010-5zm8 0a2.5 2.5 0 010 5 2.5 2.5 0 010-5zm8 0a2.5 2.5 0 010 5 2.5 2.5 0 010-5z"
      />
    </svg>
  );
}

export default MoreOptionsIcon;
MoreOptionsIcon.defaultProps = {
  className: null,
  onClick: null,
  title: null,
  style: null,
};
MoreOptionsIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
};
