import React from 'react';
import PropTypes from 'prop-types';

function QuestionMarkIcon(props) {
  const { className, style } = props;
  console.log('BACKGROUND COLOR QMARK', style);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="30"
      viewBox="0 0 22 30"
      className={className}
    >
      <defs>
        <filter
          id="hzfjzff7ka"
          width="211.1%"
          height="211.1%"
          x="-55.6%"
          y="-55.6%"
          filterUnits="objectBoundingBox"
        >
          <feOffset
            dx="4"
            dy="4"
            in="SourceAlpha"
            result="shadowOffsetOuter1"
          />
          <feGaussianBlur
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
            stdDeviation="3"
          />
          <feColorMatrix
            in="shadowBlurOuter1"
            result="shadowMatrixOuter1"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.07 0"
          />
          <feMerge>
            <feMergeNode in="shadowMatrixOuter1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g
        fill={style.backgroundColor}
        fillRule="nonzero"
        filter="url(#hzfjzff7ka)"
        transform="translate(-11 -7)"
      >
        <path
fill="#D8D8D8"
        d="M19.282 21.48c0-.68.057-1.195.17-1.546.113-.352.393-.723.838-1.114.875-.703 1.6-1.478 2.174-2.326a4.824 4.824 0 00.861-2.76c0-1.484-.459-2.644-1.377-3.48C21.03 9.418 19.751 9 18.11 9c-1.515 0-2.752.389-3.709 1.166-.957.777-1.424 1.861-1.4 3.252l.035.07h2.742c0-.695.227-1.22.68-1.576.453-.355 1.004-.533 1.652-.533.758 0 1.342.209 1.752.627.41.418.615 1.006.615 1.764 0 .656-.18 1.255-.539 1.798-.359.543-.843 1.112-1.453 1.705-.86.727-1.414 1.33-1.664 1.811-.25.48-.379 1.28-.387 2.396h2.848zm.047 4.829v-2.73h-2.906v2.73h2.906z"
        />
      </g>
    </svg>
  );
}

export default QuestionMarkIcon;

QuestionMarkIcon.defaultProps = {
  className: null,
  onClick: null,
  title: null,
  style: null,
  id: null,
};
QuestionMarkIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  id: PropTypes.string,
};
