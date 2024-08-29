import React from 'react';
import PropTypes from 'prop-types';

function ActiveTeamIcon(props) {
  const {
    className, onClick, style, title, role, buttonColor,
  } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="20"
      viewBox="0 0 18 20"
      className={className}
      onClick={onClick}
      role={role}
      style={({ ...style }, { fill: buttonColor })}
    >
      <title>{title}</title>
      <path fillRule="evenodd" d="M23.999 68c.86.69 1.86 1.201 2.943 1.49-.486.838-.804 1.787-.906 2.8-.301-.184-.656-.29-1.036-.29-1.105 0-2 .895-2 2s.895 2 2 2c.558 0 1.062-.228 1.425-.596.36.99.94 1.875 1.678 2.598L21.36 78c-.85 0-1.476-.787-1.342-1.62l.447-3.241C20.734 70.87 22.12 68.972 24 68zM33 68c2.761 0 5 2.239 5 5s-2.239 5-5 5-5-2.239-5-5 2.239-5 5-5zm1.982 3c-.14 0-.28.066-.38.175-.273.296-.61.65-.897.957l-.205.22-.06.066c-.227.248-.48.514-.726.775l-.356.382-.1.043-.86-.96c-.08-.087-.187-.146-.298-.166l-.083-.008h-.04c-.22.021-.38.174-.441.393-.08.218-.02.436.12.61.46.502.76.852 1.242 1.353.06.066.14.11.2.131.22.066.4.022.56-.153.381-.414.822-.872 1.343-1.44.315-.343.676-.711 1.005-1.058l.317-.338.04-.044c.16-.174.18-.48.06-.676-.1-.174-.26-.262-.44-.262zM29 58c2.773 0 5 2.227 5 5 0 1.129-.369 2.167-.993 3.001L33 66c-1.872 0-3.572.735-4.828 1.932C25.797 67.542 24 65.49 24 63c0-2.773 2.227-5 5-5z" transform="translate(-315 -222) translate(295 164)" />
    </svg>
  );
}

export default ActiveTeamIcon;

ActiveTeamIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  buttonColor: null,
};

ActiveTeamIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  buttonColor: PropTypes.string,
};
