import React from 'react';

function FlowBigIcon(props) {
    const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="18"
      fill="none"
      viewBox="0 0 16 18"
      className={className}
    >
      <path
        fill="#217CF5"
        fillRule="evenodd"
        d="M10.507 1.8h3.715C15.2 1.8 16 2.61 16 3.6v12.6a1.794 1.794 0 01-1.778 1.8H1.778c-.124 0-.24-.01-.356-.027a1.775 1.775 0 01-.897-.495 1.894 1.894 0 01-.383-.576A1.88 1.88 0 010 16.2V3.6c0-.238.048-.474.142-.693a1.805 1.805 0 011.28-1.07c.116-.028.23-.037.356-.037h3.716C5.866.755 6.846 0 8 0c1.154 0 2.133.757 2.507 1.8zM3.555 5.4h8.89v1.8h-8.89V5.4zm8.89 3.6h-8.89v1.8h8.89V9zm-2.667 3.6H3.555v1.8h6.223v-1.8zM8 1.575a.675.675 0 110 1.35.675.675 0 010-1.348v-.002zM1.78 16.2h12.443V3.6H1.78v12.6z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default FlowBigIcon;
