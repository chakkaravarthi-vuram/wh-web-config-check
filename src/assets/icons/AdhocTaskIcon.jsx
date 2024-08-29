import React from 'react';

function TaskIconV2(props) {
  const { className, style, title, role, width, height } = props;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" role={role} width={width || '12'} height={height || '11.3'} viewBox="0 0 16 15" className={className} style={style}>
      <path d="M10.262 0c.316 0 .636.077.905.243.507.314.82.856.833 1.453.013.606 0 1.215 0 1.82L12.003 3H14a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2V5a2 2 0 012-2h2V1.79c0-.273.045-.538.156-.786L4.23.858c.143-.25.352-.453.593-.607.25-.162.541-.23.833-.249C5.714 0 5.772 0 5.83 0zM9.191 6H6.906A.919.919 0 006 6.906v1.683c0 .49.415.906.906.906h2.285a.942.942 0 00.641-.264.915.915 0 00.265-.642c-.01-.233 0-1.614 0-1.683A.919.919 0 009.191 6zm1.002-4.194l-.199.003-.199.003H6.113l-.167-.002-.128-.002.001.091V3h4.369v-.722c0-.146.008-.296.007-.445l-.002-.027z" fill="#959BA3" fillRule="evenodd" />
      <title>{title}</title>
    </svg>
  );
}
export default TaskIconV2;
