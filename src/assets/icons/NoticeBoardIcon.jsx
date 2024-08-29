import React from 'react';

function NoticeBoardIcon(props) {
    const { className, style } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      className={className}
      style={style}
    >
      <path
        fillRule="evenodd"
        d="M12 0a2 2 0 012 2v10a2 2 0 01-2 2H2a2 2 0 01-2-2V2a2 2 0 012-2h10zm-1.111 10.111H3.11a.778.778 0 000 1.556h7.778a.778.778 0 000-1.556zm0-3.111H3.11a.778.778 0 000 1.556h7.778a.778.778 0 000-1.556zM7 1.556a1.554 1.554 0 100 3.111 1.555 1.555 0 100-3.111z"
      />
    </svg>
  );
}

export default NoticeBoardIcon;
