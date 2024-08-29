import React from 'react';
import PropTypes from 'prop-types';

function SnoozedTaskIcon(props) {
  const { className, onClick, style, title, buttonColor, id, isSelected, ariaHidden } =
    props;
  const iconFill = isSelected ? '#217CF5' : '#959BA3';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="14"
      viewBox="0 0 15 14"
      className={className}
      aria-hidden={ariaHidden}
      onClick={onClick}
      style={({ ...style }, { fill: buttonColor })}
      id={id}
    >
      <title>{title}</title>
      <path
        d="M14.232 9.72h-2.183a.55.55 0 01-.426-.883l1.474-1.845h-1.048a.546.546 0 010-1.092h2.183a.55.55 0 01.43.885l-.949 1.19-.524.654h1.043a.546.546 0 010 1.092zM.538 2.545a.553.553 0 00.41-.186 7.79 7.79 0 011.62-1.37.541.541 0 00.17-.753C2.18-.643.604 1.19.134 1.633a.55.55 0 00.404.911zM10.62.989c.6.38 1.146.841 1.62 1.37a.545.545 0 10.814-.726c-.47-.443-2.041-2.276-2.603-1.398a.541.541 0 00.169.754zm1.921 9.278a6.423 6.423 0 01-1.468 1.986l.813.814a.55.55 0 01-.387.933.53.53 0 01-.382-.164l-.906-.906a6.581 6.581 0 01-7.14 0l-.905.906a.53.53 0 01-.765.001.55.55 0 01-.005-.77l.813-.814C-2.147 8.296.691.89 6.64.901a6.56 6.56 0 016.206 4.454h-.803a1.091 1.091 0 00-.076 2.177l-.759.95a1.095 1.095 0 00.824 1.785h.508zM8.883 6.91H7.137V4.023a.546.546 0 10-1.092 0v3.433a.547.547 0 00.546.546h2.292a.546.546 0 000-1.092z"
        fill={iconFill}
        fillRule="nonzero"
      />
    </svg>
  );
}

export default SnoozedTaskIcon;

SnoozedTaskIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  buttonColor: null,
};
SnoozedTaskIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  buttonColor: PropTypes.string,
};
