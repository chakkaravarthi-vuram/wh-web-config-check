import React from 'react';
import cx from 'classnames/bind';
import {
  Button,
  EButtonType,
  ETextSize,
  Modal,
  ModalSize,
  Text,
} from '@workhall-pvt-lmt/wh-ui-library';
import { connect } from 'react-redux';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import styles from './ConditionalConfiguration.module.scss';
import { updateFlowStateChange } from '../../../../../redux/reducer/EditFlowReducer';
import ActionCard from './action_card/ActionCard';
import CloseIconNew from '../../../../../assets/icons/CloseIconNew';
import { CONDITIONAL_CONFIG_STRINGS } from './ConditionalConfiguration.strings';
import {
  conditionalConfigDataChange,
  useConditionalConfig,
} from './useConditionalConfiguration';
import {
  constructSaveStepActionPostData,
  constructSaveStepActionValidateData,
} from './ConditionalConfiguration.utils';
import { saveStepActionThunk } from '../../../../../redux/actions/FlowStepConfiguration.Action';

function ConditionalConfiguration(props) {
  const {
    updateFlowState,
    currentStepId,
    saveStepAction,
    flowData,
    flowData: { steps = [] },
  } = props;

  const { dispatch, state } = useConditionalConfig();

  const { forwardActions = [] } = state;

  const { t } = useTranslation();

  const onCloseConfiguration = () => {
    updateFlowState({
      isConditionConfigurationModalOpen: false,
    });
  };

  const onSaveStepActions = () => {
    const currentStep = steps?.find(
      (eachStep) => eachStep.step_uuid === currentStepId,
    );

    const postData = constructSaveStepActionPostData({
      currentStep,
      forwardActions,
      flowData,
    });

    const { validatedActions, hasErrorValidation } =
      constructSaveStepActionValidateData({
        forwardActions,
        t,
      });

    dispatch(conditionalConfigDataChange({ forwardActions: validatedActions }));

    if (!hasErrorValidation) {
      saveStepAction({ data: postData, currentStepId });
    }

    console.log(
      'constructSaveStepActionPostData',
      postData,
      steps,
      currentStepId,
      validatedActions,
      hasErrorValidation,
    );
  };

  // Modal Footer
  const getFooter = () => (
    <div className={cx(styles.ConfigFooter, gClasses.RightH)}>
      <div className={styles.SaveAndCancel}>
        <Button
          buttonText="Cancel"
          type={EButtonType.OUTLINE_SECONDARY}
          className={styles.Cancel}
          onClickHandler={onCloseConfiguration}
        />
        <Button
          buttonText="Save"
          type={EButtonType.PRIMARY}
          onClickHandler={onSaveStepActions}
        />
      </div>
    </div>
  );

  return (
    <Modal
      modalSize={ModalSize.lg}
      isModalOpen
      customModalClass={styles.AddEventModal}
      headerContent={
        <div className={styles.ConfigHeader}>
          <div className={styles.HeaderTitle}>
            <Text
              content={CONDITIONAL_CONFIG_STRINGS.HEADER.TITLE}
              size={ETextSize.MD}
              className={styles.Title}
            />
            <button onClick={onCloseConfiguration} className={styles.CloseIcon}>
              <CloseIconNew />
            </button>
          </div>
        </div>
      }
      mainContent={<ActionCard />}
      footerContent={getFooter()}
    />
  );
}

const mapStateToProps = (state) => {
  return {
    flowData: state.EditFlowReducer.flowData,
    currentStepId: state.EditFlowReducer.conditionConfigurationStepId,
    isConditionConfigurationModalOpen:
      state.EditFlowReducer.isConditionConfigurationModalOpen,
  };
};

const mapDispatchToProps = {
  updateFlowState: updateFlowStateChange,
  saveStepAction: saveStepActionThunk,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConditionalConfiguration);
