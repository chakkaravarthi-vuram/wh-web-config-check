import React from 'react';
import PropTypes from 'prop-types';

function FeedbackIcon(props) {
  const { className, onClick, style, title, role } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="16"
      viewBox="0 0 18 16"
      className={className}
      onClick={onClick || null}
      style={style}
      role={role}
    >
      <title>{title}</title>
      <path d="M9.412 10.824a.706.706 0 0 1 .096 1.405l-.096.006H3.765a.706.706 0 0 1-.096-1.405l.096-.006h5.647zM9.412 8a.706.706 0 0 1 .096 1.405l-.096.007H3.765a.706.706 0 0 1-.096-1.406L3.765 8h5.647zM5.176 5.176a.706.706 0 0 1 .096 1.406l-.096.006H3.765a.706.706 0 0 1-.096-1.405l.096-.007h1.411z" />
      <path d="M6.588.941c0-.596.683-.91 1.133-.563l.072.064 4.941 4.941a.706.706 0 0 1-.402 1.2l-.097.005h-.762l1.173-.706c.132.095.226-.343.269-.19l.02.094.006.096v7.765a2.118 2.118 0 0 1-1.931 2.11l-.186.008H2.353a2.118 2.118 0 0 1-2.11-1.932l-.008-.186V2.353A2.118 2.118 0 0 1 2.353.235c.11 0 5.027-.049 5.125 0v.132l-.89 2.732V.941zm-4.423.732-.03.009a.706.706 0 0 0-.48.56l-.008.11v11.295a.706.706 0 0 0 .595.697l.11.009h8.472a.706.706 0 0 0 .697-.595l.008-.11V6.587H7.294a.706.706 0 0 1-.7-.61l-.006-.096V1.673H2.165zM8 2.646v1.461l1.496 1.07h1.035L8 2.645z" />
    </svg>
  );
}
export default FeedbackIcon;
FeedbackIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
};
FeedbackIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
};
