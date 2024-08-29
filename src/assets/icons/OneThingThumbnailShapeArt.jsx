import React from 'react';
import PropTypes from 'prop-types';

function OneThingThumbnailShapeArt(props) {
  const { className, onClick, title } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="69"
      height="74"
      viewBox="0 0 69 74"
      className={className}
      onClick={onClick}
    >
      <title>{title}</title>
      <defs>
        <filter
          id="prefix__a"
          width="140%"
          height="140%"
          x="-20%"
          y="-20%"
          filterUnits="objectBoundingBox"
        >
          <feOffset dx="4" dy="4" in="SourceAlpha" result="shadowOffsetOuter1" />
          <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="3" />
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
        <path
          id="prefix__b"
          d="M0 43.5c0 2.296.18 4.549.525 6.749a25.828 25.828 0 0115.073-4.843c.677 0 1.34.05 2.005.101-.05-.666-.102-1.33-.102-2.007 0-14.356 11.64-25.996 25.999-25.996 14.359 0 25.996 11.64 25.996 25.996 0 14.359-11.637 25.996-25.996 25.996a25.2 25.2 0 01-2.007-.101c.053.666.104 1.33.104 2.007 0 5.626-1.807 10.821-4.846 15.076 2.2.342 4.453.522 6.749.522C67.524 87 87 67.524 87 43.5S67.524 0 43.5 0 0 19.476 0 43.5z"
        />
      </defs>
      <g fill="none" fillRule="evenodd" filter="url(#prefix__a)" transform="translate(2 -36)">
        <g transform="translate(-30 38)">
          <mask id="prefix__c" fill="#fff">
            <use xlinkHref="#prefix__b" />
          </mask>
          <use fill="#FFF" opacity="0.2" xlinkHref="#prefix__b" />
          <path d="M30 0h57v62H30z" mask="url(#prefix__c)" />
        </g>
      </g>
    </svg>
  );
}
export default OneThingThumbnailShapeArt;
OneThingThumbnailShapeArt.defaultProps = {
  className: null,
  onClick: null,
  title: null,
};
OneThingThumbnailShapeArt.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
};
