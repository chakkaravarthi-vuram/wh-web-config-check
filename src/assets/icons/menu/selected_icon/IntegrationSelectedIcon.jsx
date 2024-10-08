import React from 'react';

function IntegrationSelectedIcon(props) {
    const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="21"
      fill="none"
      viewBox="0 0 20 21"
      className={className}
    >
      <g clipPath="url(#clip0_15721_34615)">
        <path
          fill="#217CF5"
          fillRule="evenodd"
          d="M4.3.857h6.398c.44 0 .819 0 1.132.025.33.027.66.087.978.25.474.24.859.626 1.1 1.1.162.317.222.647.249.978.025.313.025.692.025 1.131v1.516h1.516c.439 0 .818 0 1.131.025.33.027.66.087.979.25.473.24.858.626 1.1 1.1.162.317.221.647.248.978.026.313.026.692.026 1.131v6.399c0 .438 0 .818-.026 1.13-.027.331-.086.661-.248.98a2.516 2.516 0 01-1.1 1.1c-.318.161-.648.221-.979.248-.313.026-.692.026-1.131.026H9.3c-.439 0-.818 0-1.131-.026-.33-.027-.66-.087-.979-.249a2.517 2.517 0 01-1.1-1.1c-.162-.318-.221-.648-.248-.978a14.925 14.925 0 01-.026-1.131v-1.516H4.3c-.438 0-.818 0-1.13-.026-.331-.027-.661-.087-.98-.249a2.517 2.517 0 01-1.1-1.1c-.161-.318-.22-.648-.248-.978-.025-.313-.025-.693-.025-1.131V4.34c0-.439 0-.818.025-1.131.027-.33.087-.66.249-.979a2.517 2.517 0 011.1-1.1c.318-.162.648-.222.978-.249C3.482.857 3.862.857 4.3.857zm8.182 6.7v3.15c0 .48 0 .79-.02 1.025-.018.226-.05.307-.069.346a.816.816 0 01-.357.357c-.038.02-.12.05-.345.069-.235.019-.545.02-1.025.02h-3.15v-3.15c0-.481 0-.79.02-1.026.018-.225.05-.307.07-.345a.817.817 0 01.356-.357c.038-.02.12-.05.345-.07.235-.018.545-.02 1.026-.02h3.15z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="clip0_15721_34615">
          <path
            fill="#fff"
            d="M0 0H19.998V20H0z"
            transform="translate(0 .04)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

export default IntegrationSelectedIcon;
