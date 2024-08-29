import * as React from 'react';

function DotIcon(props) {
    const {
        fillColor,
        className,
        onClick,
        title,
    } = props;
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    width={8}
    height={9}
    fill="none"
    onClick={onClick}
    className={className}
  >
    <title>{title}</title>
    <circle cx={4} cy={4.5} r={3} fill={fillColor} />
         </svg>;
}
export default DotIcon;
