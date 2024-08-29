import React from 'react';

function TaskSendBackIcon(props) {
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
              id="mask0_2960_12665"
              style={{ maskType: 'alpha' }}
              width="14"
              height="18"
              x="4"
              y="3"
              maskUnits="userSpaceOnUse"
            >
              <path
                fill="#D9D9D9"
                d="M18 9.2V3.5a.5.5 0 00-.5-.5H4.8a.8.8 0 00-.8.8v16.4a.8.8 0 00.8.8h4.4a.8.8 0 00.8-.8v-9.4a.8.8 0 01.8-.8h6.4a.8.8 0 00.8-.8z"
              />
            </mask>
            <g mask="url(#mask0_2960_12665)">
              <g>
                <path
                  fill="#DC6803"
                  fillRule="evenodd"
                  d="M11.107 9.321V5.5H6.5v13h9V9.321h-4.393zM17 8.571V19.2a.8.8 0 01-.8.8H5.8a.8.8 0 01-.8-.8V4.8a.8.8 0 01.8-.8h6.297a.8.8 0 01.566.234L17 8.571z"
                  clipRule="evenodd"
                />
              </g>
            </g>
          </g>
          <path
            fill="#DC6803"
            fillRule="evenodd"
            d="M12.988 12.136l-1.42 1.38h4.17c1.733 0 3.262 1.382 3.262 3.242S17.471 20 15.738 20h-1.641v-1.532h1.64c1.082 0 1.834-.835 1.834-1.71 0-.874-.752-1.709-1.834-1.709h-4.17l1.421 1.38-.959 1.137-2.794-2.715A.793.793 0 019 14.283c0-.217.085-.423.235-.568L12.029 11l.96 1.136z"
            clipRule="evenodd"
          />
        </g>
        </g>
    </svg>
  );
}

export default TaskSendBackIcon;
