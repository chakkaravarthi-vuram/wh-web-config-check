import React from 'react';
import PropTypes from 'prop-types';

function GeneralTaskIcon(props) {
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
        d="M15 1h-2a1 1 0 00-1-1H4a1 1 0 00-1 1H1a1 1 0 00-1 1v17a1 1 0 001 1h14a1 1 0 001-1V2a1 1 0 00-1-1zm-1 17H2V3h1a1 1 0 001 1h8a1 1 0 001-1h1v15zm-9-8h6a1 1 0 010 2H5a1 1 0 010-2zm4-2v6a1 1 0 01-2 0V8a1 1 0 012 0z"
      />
    </svg>
  );
}

export default GeneralTaskIcon;
GeneralTaskIcon.defaultProps = {
  className: null,
  onClick: null,
  title: null,
  style: null,
};
GeneralTaskIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
};
