import React from 'react';
import PropTypes from 'prop-types';

function FilterIcon(props) {
  const { className, onClick, style, title } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={className}
      onClick={onClick}
      style={style}
    >
      <title>{title}</title>

      <path
        fillRule="nonzero"
        d="M15.95 7.114c-.026-.225-.288-.393-.516-.393a1.76 1.76 0 0 1-1.21-3.074.445.445 0 0 0 .05-.607 8.066 8.066 0 0 0-1.27-1.28.447.447 0 0 0-.61.05 1.84 1.84 0 0 1-1.994.45A1.783 1.783 0 0 1 9.32.521a.448.448 0 0 0-.394-.47A8.066 8.066 0 0 0 7.128.049a.447.447 0 0 0-.397.456A1.778 1.778 0 0 1 5.635 2.21c-.692.257-1.47.08-1.982-.45a.445.445 0 0 0-.604-.05 7.945 7.945 0 0 0-1.293 1.28.45.45 0 0 0 .046.61c.561.503.743 1.305.453 2A1.85 1.85 0 0 1 .514 6.677a.435.435 0 0 0-.461.393 7.862 7.862 0 0 0 0 1.818c.02.234.293.394.522.394a1.76 1.76 0 0 1 1.645 1.098 1.78 1.78 0 0 1-.446 1.977.445.445 0 0 0-.05.605c.372.474.797.903 1.266 1.28.184.148.45.128.61-.046a1.846 1.846 0 0 1 1.998-.453 1.771 1.771 0 0 1 1.08 1.736c-.012.236.16.44.394.47.306.034.614.052.922.052.294 0 .587-.016.879-.05a.447.447 0 0 0 .397-.459 1.775 1.775 0 0 1 1.093-1.706 1.848 1.848 0 0 1 1.977.456c.157.172.42.194.604.05a8.071 8.071 0 0 0 1.293-1.28.446.446 0 0 0-.047-.61 1.76 1.76 0 0 1 1.191-3.08h.1c.235.013.44-.16.469-.394a8.197 8.197 0 0 0 0-1.813zm-7.938 3.57a2.668 2.668 0 1 1-.001-5.336 2.668 2.668 0 0 1 0 5.336z"
      />
    </svg>
  );
}

export default FilterIcon;
FilterIcon.defaultProps = {
  className: null,
  onClick: null,
  title: null,
  style: null,
};
FilterIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
};
