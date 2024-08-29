import React from 'react';

function EditSecurityIcon(props) {
  const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      className={className}
    >
      <path
        fill="#959BA3"
        fillRule="evenodd"
        d="M4 5.333a4 4 0 018 0v1.352l.168.011c.375.03.72.097 1.043.261.501.256.91.664 1.165 1.166.165.323.23.668.261 1.042.03.361.03.804.03 1.34v.323c0 .536 0 .98-.03 1.34-.03.375-.096.72-.261 1.043-.256.501-.664.91-1.165 1.165-.324.165-.668.23-1.043.261-.36.03-.804.03-1.34.03H5.172c-.536 0-.98 0-1.34-.03-.375-.03-.72-.096-1.043-.26a2.667 2.667 0 01-1.165-1.166c-.165-.324-.23-.668-.261-1.043a17.8 17.8 0 01-.03-1.34v-.322c0-.537 0-.98.03-1.34.03-.375.096-.72.261-1.043.256-.502.664-.91 1.165-1.166.324-.164.668-.23 1.043-.26.054-.005.11-.009.168-.012V5.333zm1.333 1.334h5.334V5.333a2.667 2.667 0 10-5.334 0v1.334zM3.941 8.025c-.293.024-.442.067-.546.12-.251.128-.455.332-.583.583-.053.104-.096.254-.12.546-.025.3-.025.688-.025 1.26v.266c0 .571 0 .96.025 1.26.024.292.067.441.12.545.128.251.332.455.583.583.104.053.253.096.546.12.3.025.688.025 1.259.025h5.6c.571 0 .96 0 1.26-.025.292-.024.441-.067.545-.12.251-.128.455-.332.583-.583.053-.104.096-.253.12-.546.025-.3.025-.688.025-1.259v-.267c0-.57 0-.959-.025-1.259-.024-.292-.067-.442-.12-.546a1.333 1.333 0 00-.583-.583c-.104-.053-.253-.096-.546-.12C11.76 8.001 11.371 8 10.8 8H5.2c-.571 0-.96 0-1.26.025z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default EditSecurityIcon;
