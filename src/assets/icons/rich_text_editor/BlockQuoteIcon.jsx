import React from 'react';
import PropTypes from 'prop-types';

function BlockQuoteIcon(props) {
  const { className, onClick, style, title } = props;
  return (
    <svg
      id="Capa_1"
      enableBackground="new 0 0 409.294 409.294"
      height="512"
      viewBox="0 0 409.294 409.294"
      width="512"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
      style={style}
    >
      <title>{title}</title>
      <path d="m0 204.647v175.412h175.412v-175.412h-116.941c0-64.48 52.461-116.941 116.941-116.941v-58.471c-96.728 0-175.412 78.684-175.412 175.412z" />
      <path d="m409.294 87.706v-58.471c-96.728 0-175.412 78.684-175.412 175.412v175.412h175.412v-175.412h-116.941c0-64.48 52.461-116.941 116.941-116.941z" />
    </svg>
  );
}
export default BlockQuoteIcon;

BlockQuoteIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
};
BlockQuoteIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
};
