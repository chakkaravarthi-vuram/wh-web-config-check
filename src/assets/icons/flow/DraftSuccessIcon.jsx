import React from 'react';
import PropTypes from 'prop-types';

function DraftSuccessIcon(props) {
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
        <g fill="#2ECC71" fillRule="nonzero">
          <path d="M1265.488 324.4c.266-.35.777-.35 1.043 0l2.235 2.967c.341.446.02 1.086-.53 1.086h-1.137v5.16c0 .212-.17.387-.379.387h-1.44c-.208 0-.379-.175-.379-.388v-5.159h-1.137c-.55 0-.871-.64-.53-1.086zm8.224-6.4c.72 0 1.288.601 1.288 1.338v11.87c0 .717-.568 1.318-1.288 1.318h-4.718c-.152 0-.285-.136-.285-.29v-1.106c0-.155.133-.291.285-.291h4.282c.057 0 .095-.058.095-.097v-8.824h-14.742v8.804c0 .059.038.097.095.097h4.282c.152 0 .285.136.285.291v1.106c0 .155-.133.29-.285.29h-4.718c-.7 0-1.288-.6-1.288-1.338v-11.85c0-.717.568-1.318 1.288-1.318z" transform="translate(-1257 -318)" />
        </g>
      </g>
    </svg>

  );
}
export default DraftSuccessIcon;

DraftSuccessIcon.defaultProps = {
  className: null,
  onClick: null,
  title: null,
};
DraftSuccessIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
};
