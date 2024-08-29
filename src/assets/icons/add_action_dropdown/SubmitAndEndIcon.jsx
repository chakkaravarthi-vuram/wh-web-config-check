import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import ThemeContext from '../../../hoc/ThemeContext';

function SubmitToNextStepIcon(props) {
  const { className, onClick, style, title, id, isButtonColor } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      className={className}
      onClick={onClick || null}
      style={({ ...style }, { fill: buttonColor })}
      id={id}
    >
      <title>{title}</title>
      <path
        fill="#5B6375"
        d="M12.316 0a.99.99 0 01.985.985v7.598c2.179.417 3.846 2.35 3.828 4.661A4.771 4.771 0 0112.373 18a4.74 4.74 0 01-4.661-3.846H3.524L1.44 16.56a.838.838 0 01-.625.284.76.76 0 01-.284-.057.822.822 0 01-.531-.776V.985A.99.99 0 01.985 0zm.076 9.815a3.429 3.429 0 100 6.859 3.429 3.429 0 100-6.86zm.91 2.027a.683.683 0 01.946-.076.657.657 0 01.057.929l-1.819 2.065a.632.632 0 01-.473.227h-.02a.628.628 0 01-.473-.19l-1.118-1.117a.641.641 0 010-.928.641.641 0 01.929 0l.625.625zM8.866 10.1H2.861a.04.04 0 00-.038.038v1.212a.04.04 0 00.038.038h5.173c.208-.473.492-.91.833-1.288zm1.592-3.676H2.86a.04.04 0 00-.038.038v1.213a.04.04 0 00.038.038h7.598a.04.04 0 00.038-.038V6.46a.04.04 0 00-.038-.038zm0-3.657H2.86a.04.04 0 00-.038.038v1.213a.04.04 0 00.038.038h7.598a.04.04 0 00.038-.038V2.804a.04.04 0 00-.038-.038z"
      />
    </svg>
  );
}
export default SubmitToNextStepIcon;

SubmitToNextStepIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  id: EMPTY_STRING,
  isButtonColor: false,
};
SubmitToNextStepIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  id: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
