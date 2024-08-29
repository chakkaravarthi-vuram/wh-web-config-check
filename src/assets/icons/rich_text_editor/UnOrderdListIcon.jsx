import React from 'react';
import PropTypes from 'prop-types';

function UnOrderdListIcon(props) {
  const { className, onClick, style, title } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      className={className}
      onClick={onClick}
      style={style}
    >
      <title>{title}</title>
      <g fill="none" fillRule="evenodd">
        <path d="M0 0H12V12H0z" />
        <path
          fill="#333"
          d="M11.25 9.75v1.5H3v-1.5h8.25zm-9.75 0c.414 0 .75.336.75.75s-.336.75-.75.75-.75-.336-.75-.75.336-.75.75-.75zm9.75-4.5v1.5H3v-1.5h8.25zm-9.75 0c.414 0 .75.336.75.75s-.336.75-.75.75S.75 6.414.75 6s.336-.75.75-.75zm9.75-4.5v1.5H3V.75h8.25zM1.5.75c.414 0 .75.336.75.75s-.336.75-.75.75-.75-.336-.75-.75.336-.75.75-.75z"
        />
      </g>
    </svg>
  );
}
export default UnOrderdListIcon;

UnOrderdListIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  // isButtonColor: false,
};
UnOrderdListIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
};
