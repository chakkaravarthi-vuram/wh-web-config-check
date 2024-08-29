import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function TableIcon(props) {
  const { className, style, title, onClick } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      className={className}
      onClick={onClick || null}
      style={style}
    >
      <title>{title}</title>
      <path
        fill="#5B6375"
        d="M13.6 0H2.4A2.4 2.4 0 000 2.4v11.2A2.4 2.4 0 002.4 16h11.2a2.4 2.4 0 002.4-2.4V2.4A2.4 2.4 0 0013.6 0zM2.4 1.6h11.2a.8.8 0 01.8.8v2.4H1.6V2.4a.8.8 0 01.8-.8zm4 8V6.4h3.2v3.2H6.4zm3.2 1.6v3.2H6.4v-3.2h3.2zM4.8 9.6H1.6V6.4h3.2v3.2zm6.4-3.2h3.2v3.2h-3.2V6.4zm-9.6 7.2v-2.4h3.2v3.2H2.4a.8.8 0 01-.8-.8zm12 .8h-2.4v-3.2h3.2v2.4a.8.8 0 01-.8.8z"
      />
      <title>{title}</title>
    </svg>
  );
}
export default TableIcon;
TableIcon.defaultProps = {
  className: EMPTY_STRING,
  style: null,
  title: EMPTY_STRING,
  onClick: null,
};
TableIcon.propTypes = {
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  title: PropTypes.string,
};
