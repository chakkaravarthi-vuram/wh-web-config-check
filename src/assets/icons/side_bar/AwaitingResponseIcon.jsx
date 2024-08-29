import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function AwaitingResponseIcon(props) {
  const {
    className, onClick,
  } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="20"
      viewBox="0 0 16 20"
      className={className}
      onClick={onClick || null}
    >
      <path
        fill="#FFF"
        fillRule="nonzero"
        d="M12 0a1 1 0 0 1 1 1h2a1 1 0 0 1 1 1v17a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h2a1 1 0 0 1 1-1zM3 3H2v15h12V3h-1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zm5 4a1 1 0 0 1 1 1v3h2l-3 4-3-4h2V8a1 1 0 0 1 1-1z"
      />
    </svg>
  );
}
export default AwaitingResponseIcon;

AwaitingResponseIcon.defaultProps = {
  className: EMPTY_STRING,
  onClick: null,
};

AwaitingResponseIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};
