import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function MyFlowIcon(props) {
  const {
    className, onClick,
  } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="20"
      viewBox="0 0 17 20"
      className={className}
      onClick={onClick || null}
    >
      <path
        fill="#FFF"
        fillRule="nonzero"
        d="M15 1h-2a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1H1a1 1 0 0 0-1 1v17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm-1 17H2V3h1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1h1v15zM8 6c1.11 0 2 .89 2 2 0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2zm3.363 10H4.604c-.377 0-.656-.472-.596-.972l.199-1.945c.12-1.36.735-2.5 1.57-3.083.616.667 1.392 1.056 2.227 1.056.834 0 1.59-.39 2.226-1.056.835.583 1.431 1.722 1.57 3.083L12 15.028c.02.5-.258.972-.636.972z"
      />
    </svg>
  );
}
export default MyFlowIcon;

MyFlowIcon.defaultProps = {
  className: EMPTY_STRING,
  onClick: null,
};

MyFlowIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};
