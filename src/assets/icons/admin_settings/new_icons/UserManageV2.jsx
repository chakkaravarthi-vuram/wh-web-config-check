import React from 'react';

function UserManageNewIcon(props) {
  const { role, ariaLabel } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="#B8BFC7"
      role={role}
      aria-label={ariaLabel}
    >
      <path
        d="M6.568 8.444c2.543 0 4.79.741 6.222 1.902.222.197.37.469.37.765v1.926a.964.964 0 01-.962.963H.963A.964.964 0 010 13.037v-1.926c0-.296.148-.568.37-.765 1.408-1.16 3.68-1.902 6.198-1.902zm0-8.444a3.477 3.477 0 013.481 3.481 3.477 3.477 0 01-3.481 3.482 3.477 3.477 0 01-3.482-3.482A3.477 3.477 0 016.568 0z"
      />
    </svg>
  );
}

export default UserManageNewIcon;
