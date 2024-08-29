import React from 'react';
import cx from 'classnames/bind';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import gClasses from '../../../../../../scss/Typography.module.scss';
import Input from '../../../../../../components/form_components/input/Input';
import { BS } from '../../../../../../utils/UIConstants';
import { BUTTON_TYPE } from '../../../../../../utils/Constants';
import { updateFlowDataChange } from '../../../../../../redux/reducer/EditFlowReducer';
import Button from '../../../../../../components/form_components/button/Button';
import styles from './TestMLModelConfiguration.module.scss';

function TestMLModelConfiguration() {
    return (
        <>
        <Input
          id="test_ml_model"
          className={cx(gClasses.MR10, gClasses.MT10, styles.DDField)}
          inputContainerClasses={gClasses.P3}
          label="Full Name"
          placeholder="Enter sample text"
        />
        <div className={cx(BS.D_FLEX, BS.JC_START, BS.W100, gClasses.MT16)}>
                            <Button
                                id="enable_mfa"
                                buttonType={BUTTON_TYPE.PRIMARY}
                                className={cx(styles.SecondaryButtonClass, gClasses.MR16)}
                            >
                                Skip test
                            </Button>
                            <Button
              buttonType={BUTTON_TYPE.OUTLINE_PRIMARY}
                            >
              Test
                            </Button>
        </div>
        </>
    );
}

const mapStateToProps = ({ EditFlowReducer }) => {
    return {
        isIntegrationConfigurationModalOpen: EditFlowReducer.flowData.isIntegrationConfigurationModalOpen,
        integerationList: EditFlowReducer.flowData.integerationList,
        integration_details: EditFlowReducer.flowData.integration_details,
        eventsList: EditFlowReducer.flowData.events,
        confirm_test: EditFlowReducer.flowData.confirm_test,
    };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateProcedureData: (...params) => {
      dispatch(updateFlowDataChange(...params));
    },
    dispatch,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TestMLModelConfiguration));
