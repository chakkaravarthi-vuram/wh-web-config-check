import React from 'react';
import { ARIA_ROLES } from 'utils/UIConstants';

function TaskIcon(props) {
  const { className, style, title } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="16"
      viewBox="0 0 13 16"
      className={className}
      style={style}
      role={ARIA_ROLES.IMG}
    >
      <title>{title}</title>
      <path
        fill="#FFF"
        d="M7.778 0H1.556C.7 0 .008.72.008 1.6L0 14.4c0 .88.692 1.6 1.548 1.6h9.34c.856 0 1.556-.72 1.556-1.6V4.8L7.778 0zm3.11 14.4H1.557V1.6H7v4h3.889v8.8zm-7.14-5.56L2.645 9.968 5.398 12.8 9.8 8.272 8.703 7.144l-3.297 3.392L3.749 8.84z"
      />
    </svg>
  );
}
export default TaskIcon;
