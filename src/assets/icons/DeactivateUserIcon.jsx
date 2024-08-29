import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../hoc/ThemeContext';

function DeactivateIcon(props) {
  const { className, onClick, style, title, isButtonColor } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
      onClick={onClick}
      style={({ ...style }, { fill: buttonColor })}
    >
      <title>{title}</title>
      <path
        fill="#E62A2A"
        d="M5.3 13.33c.26.108.44.346.476.624.035.277-.08.553-.303.723-2.242 1.685-3.653 4.252-3.876 7.048h21.062c.432 0 .783.35.783.783 0 .432-.35.782-.783.782H0v-.782c-.005-3.57 1.671-6.933 4.523-9.078.223-.17.52-.208.778-.1zm14.526-.996c1.107 0 2.169.44 2.951 1.222.783.783 1.223 1.845 1.223 2.952 0 2.305-1.869 4.174-4.174 4.174-2.305 0-4.174-1.869-4.174-4.174 0-2.305 1.869-4.174 4.174-4.174zm2.551 2.363l-4.361 4.362c.529.376 1.161.579 1.81.58 1.17-.002 2.242-.655 2.78-1.695.536-1.04.448-2.292-.229-3.247zm-.74-.74c-.955-.677-2.207-.765-3.247-.228s-1.693 1.609-1.694 2.779c0 .649.203 1.281.579 1.81zM11.478 0c3.746 0 6.783 3.037 6.783 6.783 0 1.798-.715 3.524-1.987 4.796-1.272 1.272-2.997 1.986-4.796 1.986-3.746 0-6.782-3.036-6.782-6.782S7.732 0 11.478 0zm0 1.565c-2.881 0-5.217 2.336-5.217 5.218C6.26 9.664 8.597 12 11.478 12c2.882 0 5.218-2.336 5.218-5.217 0-1.384-.55-2.711-1.528-3.69-.979-.978-2.306-1.528-3.69-1.528z"
      />
    </svg>
  );
}
export default DeactivateIcon;
DeactivateIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
DeactivateIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
