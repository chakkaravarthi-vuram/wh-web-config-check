import React from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { VALIDATION_CONSTANT } from 'utils/constants/validation.constant';
import { useTranslation } from 'react-i18next';
import { Button, EButtonType } from '@workhall-pvt-lmt/wh-ui-library';
import QuestionMasscoutIcon from '../../assets/icons/QuestionMasscoutIcon';
import style from './UpdateConfirmPopover.module.scss';
import { ARIA_ROLES, BS } from '../../utils/UIConstants';
import gClasses from '../../scss/Typography.module.scss';
import { clearAlertPopOverStatusAction } from '../../redux/actions/Actions';
import { UTIL_COLOR } from '../../utils/Constants';

function UpdateConfirmPopover(props) {
  const { onYesHandler, onNoHandler, title, subTitle, titleStyle, alertIcon, subtitleStyle, labelStyle } = props;
  const { t } = useTranslation();
  return (
    <div
      className={cx(style.OuterContainer, BS.D_FLEX, BS.D_FLEX_JUSTIFY_CENTER, labelStyle)}
    >
      <div className={cx(BS.D_FLEX_JUSTIFY_CENTER)}>
        { alertIcon || <QuestionMasscoutIcon role={ARIA_ROLES.IMG} />}
      </div>
      <h5 className={cx(style.AreYouSureLabel, gClasses.MT20, titleStyle, BS.TEXT_CENTER)}>
       {title}
      </h5>
      <p
        className={cx(
          subtitleStyle,
          style.SaveAsDraftLabel,
          BS.D_FLEX_JUSTIFY_CENTER,
          gClasses.MT5,
        )}
      >
       {subTitle}
      </p>
      <div className={cx(BS.D_FLEX, BS.D_FLEX_JUSTIFY_CENTER, gClasses.MT10)}>
        <Button
          buttonText={t(VALIDATION_CONSTANT.YES)}
          onClickHandler={onYesHandler}
          type={EButtonType.OUTLINE_SECONDARY}
          className={cx(style.MdCancelBtn, gClasses.MR16)}
        />
        <Button
          buttonText={t(VALIDATION_CONSTANT.NO)}
          onClickHandler={onNoHandler}
          colorSchema={{ activeColor: UTIL_COLOR.RED_600 }}
          type={EButtonType.PRIMARY}
        />
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
    return {
      onClearAlertPopOverStatusAction: () => {
        dispatch(clearAlertPopOverStatusAction());
      },
    };
  };

export default connect(null, mapDispatchToProps)(UpdateConfirmPopover);
