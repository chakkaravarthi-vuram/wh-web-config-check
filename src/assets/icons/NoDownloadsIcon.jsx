import React from 'react';

function NoDownloadsIcon(props) {
const { className, onClick, style } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="72"
      height="72"
      viewBox="0 0 72 72"
      className={className}
      onClick={onClick}
      style={style}
    >
      <path
        fill="#B8BFC7"
        d="M64.876 44.572l-10.17-17.145H17.294l-6.038 10.288h.026l-4.005 6.857H27c0 5.68 4.027 10.283 9 10.283 4.972 0 9-4.603 9-10.282h19.876zm7.124 0V72H0V44.572l14.098-23.998h43.808L72 44.572zM22.248 51.43H6.003v13.712h59.994V51.435H49.752c-2.318 6.052-7.605 10.282-13.757 10.282-6.151 0-11.434-4.23-13.751-10.282h.004v-.005zm16.753-37.714H33V0h6v13.716zm14.333 2.151l-4.667-4.307 7.268-10.287 4.666 4.312-7.267 10.282zm-30.002-4.302l-4.666 4.306L11.398 5.59l4.667-4.316 7.267 10.292z"
      />
    </svg>
  );
}

export default NoDownloadsIcon;
