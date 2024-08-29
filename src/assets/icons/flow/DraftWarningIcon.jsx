import React from 'react';
import PropTypes from 'prop-types';

function DraftWarningIcon(props) {
  const { className, onClick, title } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="16"
      viewBox="0 0 18 16"
      className={className}
      onClick={onClick}
    >
      <title>{title}</title>
      <g fill="none" fillRule="evenodd">
        <g fill="#D88244" fillRule="nonzero">
          <path d="M1266 212c.552 0 1 .448 1 1v5c0 .552-.448 1-1 1s-1-.448-1-1v-5c0-.552.448-1 1-1zm0 8c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1zm7.712-14c.72 0 1.288.601 1.288 1.338v11.87c0 .717-.568 1.318-1.288 1.318h-4.718c-.152 0-.285-.136-.285-.29v-1.106c0-.155.133-.291.285-.291h4.282c.057 0 .095-.058.095-.097v-8.824h-14.742v8.804c0 .059.038.097.095.097h4.282c.152 0 .285.136.285.291v1.106c0 .155-.133.29-.285.29h-4.718c-.7 0-1.288-.6-1.288-1.338v-11.85c0-.717.568-1.318 1.288-1.318z" transform="translate(-1257 -206)" />
        </g>
      </g>
    </svg>
  );
}
export default DraftWarningIcon;

DraftWarningIcon.defaultProps = {
  className: null,
  onClick: null,
  title: null,
};
DraftWarningIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
};
