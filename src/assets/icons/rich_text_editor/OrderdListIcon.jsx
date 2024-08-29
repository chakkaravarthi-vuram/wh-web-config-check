import React from 'react';
import PropTypes from 'prop-types';

function OrderdListIcon(props) {
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
          d="M11.25 9.75v1.5H3v-1.5h8.25zm0-4.5v1.5H3v-1.5h8.25zm0-4.5v1.5H3V.75h8.25z"
        />
        <path
          fill="#333"
          fillRule="nonzero"
          d="M1.066 3L1.066 0 .097.21.097.7.573.7.573 3zM2.082 7v-.528H.992L.988 6.46l.378-.429c.245-.283.413-.496.505-.64.091-.143.137-.308.137-.495 0-.278-.086-.497-.258-.656C1.577 4.08 1.338 4 1.03 4c-.289 0-.52.095-.696.285-.175.19-.26.423-.253.696l.004.012h.632c0-.135.028-.247.084-.334.055-.087.132-.13.229-.13.109 0 .19.033.244.1.055.068.082.16.082.273 0 .08-.027.174-.08.282-.054.108-.138.232-.252.37l-.897 1V7h1.954zM1.045 12c.302 0 .55-.076.745-.23.194-.152.292-.362.292-.63 0-.162-.042-.302-.126-.419-.084-.117-.2-.204-.349-.261.13-.063.235-.15.314-.261.078-.112.117-.234.117-.366 0-.266-.09-.47-.27-.616C1.586 9.072 1.345 9 1.044 9c-.26 0-.48.072-.662.216-.181.144-.268.333-.26.565l.003.012h.625c0-.08.032-.145.095-.196.064-.05.138-.076.222-.076.106 0 .188.031.244.094.055.063.083.14.083.232 0 .116-.03.207-.093.272-.062.066-.151.099-.267.099H.732v.502h.303c.129 0 .228.033.298.097.071.065.106.168.106.31 0 .101-.033.185-.1.252-.068.067-.158.1-.271.1-.1 0-.184-.031-.253-.095-.07-.063-.104-.142-.104-.235H.082c-.009.28.084.492.28.636.194.143.422.215.683.215z"
        />
      </g>
    </svg>
  );
}
export default OrderdListIcon;

OrderdListIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
};
OrderdListIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
};
