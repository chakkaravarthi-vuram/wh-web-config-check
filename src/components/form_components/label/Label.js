import React from 'react';
import cx from 'classnames/bind';
import Skeleton from 'react-loading-skeleton';
import PropTypes from 'prop-types';

import gClasses from '../../../scss/Typography.module.scss';
import styles from './Label.module.scss';
import { BS } from '../../../utils/UIConstants';
import { EMPTY_STRING, SPACE, ASTERISK } from '../../../utils/strings/CommonStrings';
import HelpIcon from '../../../assets/icons/HelpIcon';

export const LABEL_TYPES = {
  TYPE_1: 1,
  TYPE_2: 2,
  TYPE_3: 3, // Form FIeld Label Type
};

function Label(props) {
  const {
    isDataLoading,
    labelFor,
    id,
    content,
    role,
    message,
    isRequired,
    className,
    onClickHandler,
    innerClassName,
    toolTipId,
    type = LABEL_TYPES.TYPE_1,
    placement,
    labelFontClass,
    labelFontClassAdmin,
    labelStyles,
    radioLabelStyle,
    LabelStylesOtherSettings,
    StrictToolTipId,
    hideLabelClass,
    ariaLabel,
    isAdditionalInfo,
    additionalInfo,
  } = props;
  let fontStyle = null;
  let labelFieldClass = null;
  if (hideLabelClass) {
    labelFieldClass = gClasses.FieldName;
  }
  if (labelFontClass) {
    fontStyle = labelFontClass;
    console.log('labelFontClass', labelFontClass, content);
  } else if (type === LABEL_TYPES.TYPE_1) fontStyle = !hideLabelClass && gClasses.FTwo12BlackV13;
  else if (type === LABEL_TYPES.TYPE_2) fontStyle = gClasses.FTwo12GrayV10;
  else fontStyle = gClasses.FOne12GrayV2;

  const labelClass = cx(
    labelFontClassAdmin,
    labelStyles,
    fontStyle,
    styles.Label,
    BS.D_FLEX,
    className,
    gClasses.MB3,
  );
  return (
    <div className={labelClass} onMouseDown={onClickHandler} role="presentation">
      <label role={role} htmlFor={labelFor} id={id} aria-label={ariaLabel} className={cx(styles.LabelWidth, innerClassName, labelStyles, radioLabelStyle, labelFontClassAdmin, LabelStylesOtherSettings, labelFieldClass, gClasses.LabelStyle)}>
        {isDataLoading ? (
          <div className={cx(gClasses.Height16, gClasses.Width50)}>
            <Skeleton />
          </div>
        ) : (
          content
        )}
        {!isDataLoading && <span className={styles.Required} aria-hidden="true">{isRequired ? SPACE + ASTERISK : null}</span>}
        { isAdditionalInfo && <span className={cx(gClasses.FTwo13GrayV66, gClasses.FontWeight500, styles.AditionalInfo, gClasses.ML2)}>{`(${additionalInfo})`}</span>}
      </label>
      {!isDataLoading && message ? <HelpIcon className={gClasses.HelpIcon} ariaLabel="help" title={message} id={toolTipId} placement={placement} StrictToolTipId={StrictToolTipId} /> : null}
    </div>
  );
}

export default Label;
Label.propTypes = {
  id: PropTypes.string,
  isDataLoading: PropTypes.bool,
  labelFor: PropTypes.string,
  content: PropTypes.string,
  role: PropTypes.string,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  className: PropTypes.string,
  isRequired: PropTypes.bool,
  placement: PropTypes.string,
  labelFontClass: PropTypes.element,
  StrictToolTipId: PropTypes.bool,
  isAdditionalInfo: PropTypes.bool,
  additionalInfo: PropTypes.string,

};

Label.defaultProps = {
  id: EMPTY_STRING,
  className: EMPTY_STRING,
  isRequired: false,
  isDataLoading: false,
  labelFor: EMPTY_STRING,
  content: EMPTY_STRING,
  role: EMPTY_STRING,
  message: EMPTY_STRING,
  placement: EMPTY_STRING,
  labelFontClass: null,
  StrictToolTipId: false,
  isAdditionalInfo: false,
  additionalInfo: EMPTY_STRING,
};
