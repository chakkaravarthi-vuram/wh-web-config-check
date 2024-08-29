import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../../hoc/ThemeContext';

function NoticeBoardSettingsIcon(props) {
  const { className, onClick, style, title, isButtonColor } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      className={className}
      onClick={onClick}
      style={({ ...style }, { fill: buttonColor })}
    >
      <title>{title}</title>
      <g fillRule="evenodd">
        <path d="M22.017 0H5.983A5.988 5.988 0 000 5.983v16.034C0 25.317 2.682 28 5.983 28h16.034c3.3 0 5.983-2.682 5.983-5.983V5.983C28 2.683 25.318 0 22.017 0zM14 7c1.106 0 2 .894 2 2 0 1.106-.894 2-2 2-1.106 0-2-.894-2-2 0-1.106.894-2 2-2zM7 5h14a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2zm2 9h10a1 1 0 010 2H9a1 1 0 010-2zm0 4h10a1 1 0 010 2H9a1 1 0 010-2z" />
      </g>
    </svg>
  );
}
export default NoticeBoardSettingsIcon;
NoticeBoardSettingsIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
NoticeBoardSettingsIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
