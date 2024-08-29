import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

function BillingIcon(props) {
  const { className, onClick, style, title, id } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="20"
      viewBox="0 0 16 20"
      className={className}
      onClick={onClick || null}
      style={style}
      id={id}
    >
      <title>{title}</title>
      <path
        fill="#FFF"
        d="M14 0c1.105 0 2 .895 2 2v16c0 1.105-.895 2-2 2H2c-1.105 0-2-.895-2-2V2C0 .895.895 0 2 0h12zm0 2H2v16h12V2zM8 4c.513 0 .936.362.993.828l.007.11v.232c1.165.411 2 1.519 2 2.826 0 .492-.398.89-.89.89-.456 0-.831-.344-.883-.786l-.006-.104c0-.5-.302-.93-.736-1.115C8.342 6.957 8.177 7 8 7s-.342-.043-.486-.118c-.433.185-.735.613-.735 1.114 0 .512.315.951.762 1.133C7.675 9.047 7.832 9 8 9c1.656 0 3 1.346 3 3.004 0 1.302-.836 2.412-2 2.825v.234C9 15.58 8.552 16 8 16c-.513 0-.936-.362-.993-.828L7 15.062v-.233c-1.164-.412-2-1.523-2-2.825 0-.492.398-.89.89-.89.456 0 .831.344.883.787l.006.103c0 .497.304.927.737 1.115C7.66 13.042 7.824 13 8 13s.34.042.484.117c.433-.186.737-.616.737-1.113 0-.512-.315-.951-.762-1.133-.134.082-.291.129-.459.129-1.656 0-3-1.346-3-3.004 0-1.307.835-2.416 2-2.826v-.233C7 4.42 7.448 4 8 4z"
      />
    </svg>
  );
}
export default BillingIcon;

BillingIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  id: EMPTY_STRING,
};
BillingIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  id: PropTypes.string,
};
