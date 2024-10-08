import React from 'react';
import PropTypes from 'prop-types';

function UndoRedoIcon(props) {
  const { className, onClick, style, title } = props;
  return (
    <svg
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 512 512"
      className={className}
      onClick={onClick}
      style={style}
    >
      <title>{title}</title>

      <g>
        <g>
          <path
            d="M361.5,140.148H50.689l43.529-43.71c5.846-5.87,5.826-15.368-0.044-21.214c-5.871-5.847-15.368-5.826-21.213,0.044
        L4.372,144.143c-2.969,2.982-4.417,6.899-4.361,10.8C0.009,155.012,0,155.079,0,155.148c0,5.201,2.649,9.781,6.669,12.472
        l66.292,66.568c5.847,5.87,15.343,5.889,21.213,0.044c5.87-5.846,5.89-15.344,0.044-21.214l-42.692-42.87H361.5
        c66.444,0,120.5,54.056,120.5,120.5s-54.056,120.5-120.5,120.5H15c-8.284,0-15,6.716-15,15s6.716,15,15,15h346.5
        c82.986,0,150.5-67.514,150.5-150.5S444.486,140.148,361.5,140.148z"
          />
        </g>
      </g>
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
    </svg>
  );
}
export default UndoRedoIcon;

UndoRedoIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
};
UndoRedoIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
};
