import React from 'react';

function SuperAdminMenuIcon(props) {
  const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      className={className}
    >
      <path
        fill="#9E9E9E"
        fillRule="evenodd"
        d="M8.885 1.667h2.23c.44 0 .819 0 1.13.025.33.027.658.086.973.247a2.5 2.5 0 011.093 1.093c.16.315.22.643.247.972.025.312.025.691.025 1.13v3.2h1.61c.21 0 .415 0 .589.013.19.016.415.053.641.168.314.16.569.415.729.728.115.226.152.451.167.642.014.173.014.378.014.588v6.193a.833.833 0 010 1.667H1.667a.833.833 0 010-1.666v-6.194c0-.21 0-.415.014-.588.015-.19.052-.416.167-.642.16-.313.415-.568.729-.728.226-.115.45-.152.641-.168a7.65 7.65 0 01.589-.014h1.61V5.134c0-.439 0-.818.025-1.13.027-.33.087-.657.247-.972a2.5 2.5 0 011.093-1.093c.315-.16.643-.22.972-.247.312-.026.691-.026 1.13-.025zM5.417 10H3.833c-.247 0-.382 0-.48.008l-.01.001-.001.011a6.818 6.818 0 00-.009.48v6.166h2.084V10zm1.666 6.666v-11.5c0-.48.001-.79.02-1.026.019-.227.05-.31.071-.352a.833.833 0 01.364-.364c.042-.021.126-.052.352-.07.236-.02.546-.02 1.027-.02h2.166c.48 0 .791 0 1.027.02.227.018.31.049.352.07.156.08.284.207.364.364.02.041.052.125.07.352.02.236.02.546.02 1.027v11.5H7.084zm7.5 0h2.084V10.5a6.778 6.778 0 00-.01-.49l-.01-.002a6.855 6.855 0 00-.48-.008h-1.584v6.666zM8.333 5.833c0-.46.373-.833.834-.833h1.666a.833.833 0 010 1.667H9.167a.833.833 0 01-.834-.834zm0 3.334c0-.46.373-.834.834-.834h1.666a.833.833 0 010 1.667H9.167a.833.833 0 01-.834-.833zm0 3.333c0-.46.373-.834.834-.834h1.666a.833.833 0 010 1.667H9.167a.833.833 0 01-.834-.833z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default SuperAdminMenuIcon;
