import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';

import CloseIconNew from 'assets/icons/CloseIconNew';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import ResponseHandlerIcon from '../../assets/icons/response_status_handler/ResponseHandlerIcon';
import gClasses from '../../scss/Typography.module.scss';
import { ARIA_ROLES, BS } from '../../utils/UIConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import styles from './ResponseHandler.module.scss';

function ResponseHandler(props) {
  const { className, messageObject, hideIllustration, onCloseIconClick, isTask = false, customResponseIcon, outerClass, linkComponent } = props;
  const CustomIcon = customResponseIcon || ResponseHandlerIcon;
  const ARIA_LABEL = {
    NOT_FOUND: 'Not found',
  };
  return (
    <div className={cx({ [BS.P_RELATIVE]: isTask }, BS.H100, gClasses.CenterVH, gClasses.FlexDirectionColumn, outerClass)}>
     {isTask && (
      <div
      className={cx(styles.CloseIcon, BS.P_ABSOLUTE)}
      onClick={onCloseIconClick}
      onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onCloseIconClick}
      role="button"
      tabIndex={0}
      >
      <CloseIconNew className={cx(styles.CloseButton, gClasses.CursorPointer)} fillClass="#6c727e" />
      </div>
      )}
    <div className={cx(className, BS.TEXT_CENTER)}>
      {!hideIllustration && <CustomIcon role={ARIA_ROLES.IMG} ariaLabel={ARIA_LABEL.NOT_FOUND} type={messageObject.type} />}
      <div className={cx(gClasses.FTwo18BlackV4, gClasses.FontWeight500, gClasses.MT20)}>
        {messageObject.title}
      </div>
      <div className={cx(gClasses.FOne13GrayV17, gClasses.MT5)}>{messageObject.subTitle}</div>
      {linkComponent}
    </div>
    </div>
  );
}

ResponseHandler.defaultProps = {
  className: EMPTY_STRING,
};
ResponseHandler.propTypes = {
  className: PropTypes.string,
  messageObject: PropTypes.objectOf(PropTypes.any).isRequired,
};
export default ResponseHandler;
