import React from 'react';
import PropTypes from 'prop-types';

function EditIconV3(props) {
  const { className, onClick, style, title } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 19 19"
      className={className}
      onClick={onClick}
      style={style}
    >
     <title>{title}</title>
      <path
        fill="#959BA3"
        d="M2 17h1.4l8.625-8.625-1.4-1.4L2 15.6V17zM16.3 6.925l-4.25-4.2 1.4-1.4A1.92 1.92 0 0114.863.75a1.92 1.92 0 011.412.575l1.4 1.4c.383.383.583.846.6 1.388a1.806 1.806 0 01-.55 1.387L16.3 6.925zM14.85 8.4L4.25 19H0v-4.25l10.6-10.6 4.25 4.25zm-3.525-.725l-.7-.7 1.4 1.4-.7-.7z"
      />
    </svg>
  );
}

export default EditIconV3;

EditIconV3.defaultProps = {
    className: null,
    onClick: null,
    title: null,
    style: null,
  };
  EditIconV3.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    title: PropTypes.string,
    style: PropTypes.objectOf(PropTypes.any),
  };
