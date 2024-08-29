import React from 'react';

function TriggerFlowIcon(props) {
  const { className, title } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="13"
      fill="none"
      viewBox="0 0 12 13"
      className={className}
    >
      <title>{title}</title>
      <path
        fill="#959BA3"
        fillRule="evenodd"
        d="M7.672 1.7h2.476c.652 0 1.185.54 1.185 1.2v8.4a1.196 1.196 0 01-1.185 1.2H1.852c-.083 0-.16-.006-.238-.018a1.183 1.183 0 01-.598-.33 1.261 1.261 0 01-.255-.384 1.253 1.253 0 01-.094-.468V2.9a1.203 1.203 0 01.948-1.176c.077-.018.153-.024.237-.024H4.33C4.578 1.004 5.23.5 6 .5s1.422.504 1.672 1.2zM3.037 4.1h5.926v1.2H3.036V4.1zm5.926 2.4H3.037v1.2h5.926V6.5zM7.185 8.9H3.037v1.2h4.148V8.9zM6 1.55a.45.45 0 110 .9.45.45 0 010-.899V1.55zM1.852 11.3h8.296V2.9H1.852v8.4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default TriggerFlowIcon;
