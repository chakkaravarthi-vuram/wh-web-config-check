import React from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import { BS } from 'utils/UIConstants';
import { FLOW_STRINGS } from 'containers/edit_flow/EditFlow.strings';
import gClasses from 'scss/Typography.module.scss';
import styles from './StepFooter.module.scss';
import { STEP_FOOTER_BUTTONS } from '../../configurations/Configuration.strings';

function StepFooter(props) {
  const { t } = useTranslation();
  const {
    onNextClick,
    onDeleteStepHandler,
    isInitialStep,
    saveAndCloseHandler,
    onBackStepHandler,
    currentProgress,
  } = props;

  console.log('currentProgress', currentProgress);
  const { CONFIGURATION } = FLOW_STRINGS.STEPS.STEP;
  const nextButtonText = (currentProgress === CONFIGURATION.INDEX ? STEP_FOOTER_BUTTONS(t).SAVE_STEP : STEP_FOOTER_BUTTONS(t).NEXT);
  return (
    <div
      className={cx(
        BS.D_FLEX,
        BS.ALIGN_ITEM_CENTER,
        BS.H100,
        styles.FooterContainer,
      )}
    >
        <div>
          {currentProgress > 0 && (
            <Button
              buttonType={BUTTON_TYPE.LIGHT}
              className={cx(BS.TEXT_NO_WRAP, gClasses.MR15, styles.BackButton)}
              onClick={onBackStepHandler}
            >
              {STEP_FOOTER_BUTTONS(t).BACK}
            </Button>
          )}
          {isInitialStep && (
            <Button
              buttonType={BUTTON_TYPE.DELETE}
              className={cx(BS.TEXT_NO_WRAP, styles.DeleteButton)}
              onClick={onDeleteStepHandler}
            >
              {STEP_FOOTER_BUTTONS(t).DELETE_STEP}
            </Button>
          )}
        </div>
      <div className={styles.PrimaryButtonContainer}>
        <Button
          buttonType={BUTTON_TYPE.LIGHT}
          className={cx(BS.TEXT_NO_WRAP, styles.SaveButton)}
          onClick={saveAndCloseHandler}
        >
          {STEP_FOOTER_BUTTONS(t).SAVE_AND_CLOSE}
        </Button>
        <Button
          buttonType={BUTTON_TYPE.PRIMARY}
          className={cx(BS.TEXT_NO_WRAP, styles.NextButton)}
          onClick={() => onNextClick()}
          nextArrow={currentProgress !== CONFIGURATION.INDEX}
        >
          {nextButtonText}
        </Button>
      </div>
    </div>
  );
}

export default StepFooter;
