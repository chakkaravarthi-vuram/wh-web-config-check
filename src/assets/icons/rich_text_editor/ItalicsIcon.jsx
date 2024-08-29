import React from 'react';
import PropTypes from 'prop-types';

function ItalicsIcon(props) {
  const { className, onClick, style, title } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="12"
      viewBox="0 0 13 12"
      className={className}
      onClick={onClick}
      style={style}
    >
      <title>{title}</title>
      <g fill="none" fillRule="evenodd">
        <path d="M0 0H12V12H0z" transform="translate(.5)" />
        <path
          fill="#333"
          d="M6.039 9.75L8.25 9.75 8.25 11.25 2.25 11.25 2.25 9.75 4.504 9.75 6.132 2.25 3.75 2.25 3.75 0.75 9.75 0.75 9.75 2.25 7.667 2.25 6.039 9.75z"
          transform="translate(.5)"
        />
      </g>
    </svg>
    // <svg
    //   id="Capa_1"
    //   enableBackground="new 0 0 458.353 458.353"
    //   height="512"
    //   viewBox="0 0 458.353 458.353"
    //   width="512"
    //   xmlns="http://www.w3.org/2000/svg"
    //   className={className}
    //   onClick={onClick}
    //   style={style}
    // >
    //   <title>{title}</title>
    //   <path d="m401.059 28.647v-28.647h-171.883v28.647h71.28l-173.791 401.059h-69.371v28.647h171.882v-28.647h-71.28l173.792-401.059z" />
    // </svg>
  );
}
export default ItalicsIcon;

ItalicsIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
};
ItalicsIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
};
