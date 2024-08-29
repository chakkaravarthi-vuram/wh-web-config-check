import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function EmailFieldIcon(props) {
  const { className, style, title, onClick } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="13"
      viewBox="0 0 16 13"
      className={className}
      onClick={onClick || null}
      style={style}
    >
      <title>{title}</title>
      <path
        fill="#5B6375"
        fillRule="nonzero"
        d="M15.2 0H.8C.32 0 0 .32 0 .8V12c0 .48.32.8.8.8h14.4c.48 0 .8-.32.8-.8V.8c0-.48-.32-.8-.8-.8zm-2.32 1.6L8 5.36 3.12 1.6h9.76zm1.52 9.6H1.6V2.4l5.92 4.56c.4.32.8.08.96 0L14.4 2.4v8.8z"
      />
    </svg>
  );
}
export default EmailFieldIcon;
EmailFieldIcon.defaultProps = {
  className: EMPTY_STRING,
  style: null,
  title: EMPTY_STRING,
  onClick: null,
};

EmailFieldIcon.propTypes = {
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  title: PropTypes.string,
};
