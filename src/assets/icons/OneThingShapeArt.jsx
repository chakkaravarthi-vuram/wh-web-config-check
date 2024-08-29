import React from 'react';
import PropTypes from 'prop-types';

function OneThingShapeArt(props) {
  const { className, onClick, style, title } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="217"
      height="153"
      viewBox="0 0 250 255"
      className={className}
      onClick={onClick}
      style={style}
    >
      <title>{title}</title>
      <g fill="none" fillRule="evenodd">
        <path
          fill="#FFF"
          fillOpacity="0.03"
          fillRule="nonzero"
          d="M127.5 19C197.917 19 255 75.86 255 146s-57.083 127-127.5 127c-6.73 0-13.333-.525-19.78-1.524 8.906-12.423 14.202-27.59 14.202-44.015 0-1.976-.149-3.914-.305-5.86 1.954.155 3.9.296 5.883.296 42.087 0 76.195-33.976 76.195-75.897 0-41.914-34.108-75.897-76.195-75.897-42.087 0-76.203 33.983-76.203 75.897 0 1.975.149 3.914.297 5.86-1.946-.148-3.892-.296-5.875-.296-16.49 0-31.717 5.268-44.181 14.139C.528 159.28 0 152.703 0 146 0 75.86 57.083 19 127.5 19zM281 53c13.255 0 24 10.745 24 24s-10.745 24-24 24-24-10.745-24-24 10.745-24 24-24zm.421 9.263c-8.371 0-15.158 6.787-15.158 15.158 0 8.372 6.787 15.158 15.158 15.158 8.372 0 15.158-6.786 15.158-15.158 0-8.371-6.786-15.158-15.158-15.158zM232 8c9.941 0 18 8.059 18 18s-8.059 18-18 18-18-8.059-18-18 8.059-18 18-18zm.316 6.947c-6.279 0-11.369 5.09-11.369 11.369 0 6.278 5.09 11.368 11.369 11.368 6.278 0 11.368-5.09 11.368-11.368 0-6.279-5.09-11.369-11.368-11.369zM265 2a8 8 0 110 16 8 8 0 010-16zm.14 3.088a5.052 5.052 0 100 10.104 5.052 5.052 0 000-10.104z"
        />
        <path d="M90 0h217v154H90z" />
      </g>
    </svg>
  );
}
export default OneThingShapeArt;
OneThingShapeArt.defaultProps = {
  className: null,
  onClick: null,
  title: null,
  style: null,
};
OneThingShapeArt.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
};
