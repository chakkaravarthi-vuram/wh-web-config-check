import React from 'react';

function WarningTriangleIcon(props) {
    const { className, onClick, style } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="20"
      viewBox="0 0 24 20"
      className={className}
      onClick={onClick}
      style={({ ...style })}
    >
      <path
        d="M23.692 17.983L13.262.848c-.694-1.141-1.83-1.125-2.524.016L.308 17.975C-.386 19.118.133 20 1.46 20h21.08c1.329 0 1.847-.877 1.153-2.018zM11.99 4.64c.668 0 1.185.744 1.15 1.652l-.211 5.476c-.034.908-.458 1.652-.942 1.652-.483 0-.908-.744-.942-1.652l-.209-5.476c-.034-.908.484-1.652 1.154-1.652zm0 12.905c-.843 0-1.421-.621-1.404-1.47 0-.867.58-1.47 1.404-1.47.859 0 1.402.603 1.42 1.47 0 .849-.561 1.47-1.42 1.47z"
      />
    </svg>
  );
}

export default WarningTriangleIcon;
