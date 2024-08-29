import React from 'react';
import PropTypes from 'prop-types';

function CreateFlowIcon(props) {
  const { className, onClick, style, title } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="20"
      viewBox="0 0 16 20"
      className={className}
      onClick={onClick}
      style={style}
    >
      <title>{title}</title>
      <path
        fill="#FFF"
        d="M15 1h-2a1 1 0 00-1-1H4a1 1 0 00-1 1H1a1 1 0 00-1 1v17a1 1 0 001 1h14a1 1 0 001-1V2a1 1 0 00-1-1zm-1 17H2V3h1a1 1 0 001 1h8a1 1 0 001-1h1v15zM5 6h6a1 1 0 010 2H5a1 1 0 010-2zm0 4h6a1 1 0 010 2H5a1 1 0 010-2zm0 4h6a1 1 0 010 2H5a1 1 0 010-2z"
      />
    </svg>
  );
}

export default CreateFlowIcon;
CreateFlowIcon.defaultProps = {
  className: null,
  onClick: null,
  title: null,
  style: null,
};
CreateFlowIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
};
