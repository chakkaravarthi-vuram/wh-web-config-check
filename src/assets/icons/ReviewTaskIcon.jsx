import React from 'react';

function ReviewTaskIcon(props) {
    const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      className={className}
    >
        <g>
        <g>
          <g>
            <mask
              id="mask0_2960_12686"
              style={{ maskType: 'alpha' }}
              width="14"
              height="18"
              x="3"
              y="3"
              maskUnits="userSpaceOnUse"
            >
              <path
                fill="#D9D9D9"
                d="M17 9.2V3.5a.5.5 0 00-.5-.5H3.8a.8.8 0 00-.8.8v16.4a.8.8 0 00.8.8h4.4a.8.8 0 00.8-.8v-9.4a.8.8 0 01.8-.8h6.4a.8.8 0 00.8-.8z"
              />
            </mask>
            <g mask="url(#mask0_2960_12686)">
              <g>
                <path
                  fill="#344054"
                  fillRule="evenodd"
                  d="M10.107 9.321V5.5H5.5v13h9V9.321h-4.393zM16 8.571V19.2a.8.8 0 01-.8.8H4.8a.8.8 0 01-.8-.8V4.8a.8.8 0 01.8-.8h6.297a.8.8 0 01.566.234L16 8.571z"
                  clipRule="evenodd"
                />
              </g>
            </g>
          </g>
          <path
            fill="#344054"
            fillRule="evenodd"
            d="M10.546 15.5a8.628 8.628 0 001.079 1.409c.84.884 1.983 1.67 3.375 1.67s2.535-.787 3.375-1.67a8.628 8.628 0 001.079-1.409 8.628 8.628 0 00-1.079-1.409c-.84-.883-1.983-1.67-3.375-1.67s-2.535.787-3.375 1.67a8.628 8.628 0 00-1.079 1.409zm9.734 0l.644-.318-.001-.002-.002-.004-.006-.012a3.48 3.48 0 00-.096-.175 10.048 10.048 0 00-1.393-1.87C18.464 12.11 16.967 11 15 11s-3.465 1.108-4.425 2.12a10.049 10.049 0 00-1.469 2.005 3.51 3.51 0 00-.02.04l-.007.011-.002.004v.001s-.001.001.643.319l-.644-.318a.702.702 0 000 .636l.644-.318-.644.318.001.002.002.004.006.012a3.51 3.51 0 00.097.175 10.049 10.049 0 001.393 1.87C11.535 18.89 13.032 20 15 20s3.465-1.108 4.425-2.12a10.048 10.048 0 001.47-2.005 3.48 3.48 0 00.02-.04l.006-.011.002-.004v-.001s.001-.001-.643-.319zm0 0l.644.318a.703.703 0 000-.636l-.644.318zM15 14.79a.715.715 0 00-.72.71c0 .392.322.71.72.71.398 0 .72-.318.72-.71a.715.715 0 00-.72-.71zm-2.16.71c0-1.177.967-2.132 2.16-2.132s2.16.955 2.16 2.132-.967 2.132-2.16 2.132-2.16-.955-2.16-2.132zm-2.476-.319z"
            clipRule="evenodd"
          />
        </g>
        </g>
    </svg>
  );
}

export default ReviewTaskIcon;
