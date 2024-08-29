import * as React from 'react';

function Edit(props) {
  const {
    className,
    onClick,
    title,
  } = props;
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    onClick={onClick}
    className={className}
  >
    <title>{title}</title>
    <path
      stroke="#9E9E9E"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.7}
      d="M15 8.333 11.668 5M2.084 17.917l2.82-.314c.345-.038.517-.057.678-.11.143-.046.279-.11.404-.194.142-.093.264-.215.51-.46L17.5 5.832A2.357 2.357 0 0 0 14.167 2.5L3.162 13.505c-.245.245-.368.368-.46.51a1.667 1.667 0 0 0-.195.403c-.052.161-.071.334-.11.678l-.313 2.82Z"
    />
         </svg>;
}
export default Edit;
