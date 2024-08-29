import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { ETextSize, Title, ETitleAlign, TextInput, TextArea } from '@workhall-pvt-lmt/wh-ui-library';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { cloneDeep } from '../../../../../../utils/jsUtility';
import { updateFlowDataChange, updateFlowStateChange } from '../../../../../../redux/reducer/EditFlowReducer';
import { BS } from '../../../../../../utils/UIConstants';
import styles from './BasicMLModalIntegration.module.scss';
import { ML_INTEGRATION } from '../MLModelConfiguration.constants';
import Dropdown from '../../../../../../components/form_components/dropdown/Dropdown';
// import TextArea from '../../../../../../components/form_components/text_area/TextArea';
import gClasses from '../../../../../../scss/Typography.module.scss';

function BasicIntegerationConfiguration(props) {
  const { MLModelsList, activeMLIntegrationData, updateMLIntegrationData, ml_integration_error_list, activeMLIntegrationServerError, updateFlowState } = props;
  const { t } = useTranslation();
  const [mlModelList, setMlModelList] = useState([]);
  const MLModelListData = (MLModelsList) => {
    const mlModels = [];
    MLModelsList?.forEach((model) => {
      if (model) {
        const eachList = {
          label: model.model_name,
          value: model.model_code,
          model_id: model.model_id,
        };
        mlModels.push(eachList);
      }
      setMlModelList(mlModels);
    });
  };
  console.log('activeMLIntegrationData', mlModelList, props);

  useEffect(() => {
    if (MLModelsList) {
      MLModelListData(MLModelsList);
    }
  }, [MLModelsList]);

  const onStepNameChangeHandler = (event) => {
    const clonedMlIntegrationData = cloneDeep(activeMLIntegrationData);
    clonedMlIntegrationData.step_name = event.target.value;
    if (clonedMlIntegrationData.ml_integration_error_list) delete clonedMlIntegrationData.ml_integration_error_list[ML_INTEGRATION.BASIC_INTEGRATION.STEP_NAME.ID];
    updateMLIntegrationData(clonedMlIntegrationData);
    updateFlowState({ activeMLIntegrationServerError: '' });
  };

  const onStepDescriptionChangeHandler = (event) => {
    console.log('onStepDescriptionChangeHandler ', onStepDescriptionChangeHandler);
    const clonedMlIntegrationData = cloneDeep(activeMLIntegrationData);
    clonedMlIntegrationData.description = event.target.value;
    updateMLIntegrationData(clonedMlIntegrationData);
  };

  const onSelectMLModelsHandler = (event) => {
    const clonedMlIntegrationData = cloneDeep(activeMLIntegrationData);
    clonedMlIntegrationData.selected_ml_model = event.target.value;
    console.log('onSelectMLModelsHandlerevent', event);
    const MLModelDetails = {
      model_name: event.target.label,
      model_code: event.target.value,
      model_id: event.target.model_id,
    };
    clonedMlIntegrationData.ml_integration_details = MLModelDetails;
    if (clonedMlIntegrationData.ml_integration_error_list) delete clonedMlIntegrationData.ml_integration_error_list[ML_INTEGRATION.BASIC_INTEGRATION.ML_MODEL_DROPDOWN.ID];
    updateMLIntegrationData(clonedMlIntegrationData);
  };

  useEffect(() => {
    MLModelListData(MLModelsList);
  }, []);

  return (
    <div className={cx(BS.H100)}>
      <div className={cx(styles.AddIntegrationTitle, BS.W100)}>
        <Title
          content={t(ML_INTEGRATION.BASIC_INTEGRATION.TITLE)}
          size={ETextSize.MD}
          className={cx(gClasses.FontWeight500, gClasses.MB24, styles.ChooseModelTitle)}
          alignment={ETitleAlign.middle}
        />
        {/* <SingleDropdown
          optionList={cloneDeep(mlModelList)}
          dropdownViewProps={{
            // placeholder: t(ML_INTEGRATION.BASIC_INTEGRATION.ML_MODEL_DROPDOWN.PLACEHOLDER),
            placeholder: 'Select your ML Model',
            labelName: t(ML_INTEGRATION.BASIC_INTEGRATION.ML_MODEL_DROPDOWN.LABEL),
          }}
          onClick={onSelectMLModelsHandler}
          // innerClassName={styles.DropdownInnerClass}
          // disablePopper
          // selectedValue={activeMLIntegrationData.selected_ml_model}
          // strictlySetSelectedValue
          // placeholder={t(
          //   ML_INTEGRATION.BASIC_INTEGRATION.ML_MODEL_DROPDOWN
          //     .PLACEHOLDER,
          // )}
          // setSelectedValue
          // id={ML_INTEGRATION.BASIC_INTEGRATION.ML_MODEL_DROPDOWN.ID}
          // label={t(
          //   ML_INTEGRATION.BASIC_INTEGRATION.ML_MODEL_DROPDOWN.LABEL,
          // )}
          // labelClassName={styles.ChooseModelLabel}
          // autoFocus
        /> */}

        <Dropdown
          optionList={mlModelList}
          innerClassName={styles.DropdownInnerClass}
          onChange={onSelectMLModelsHandler}
          disablePopper
          selectedValue={activeMLIntegrationData?.ml_integration_details?.model_code}
          // strictlySetSelectedValue
          placeholder={t(
            ML_INTEGRATION.BASIC_INTEGRATION.ML_MODEL_DROPDOWN
              .PLACEHOLDER,
          )}
          // setSelectedValue
          id={ML_INTEGRATION.BASIC_INTEGRATION.ML_MODEL_DROPDOWN.ID}
          label={t(
            ML_INTEGRATION.BASIC_INTEGRATION.ML_MODEL_DROPDOWN.LABEL,
          )}
          labelClassName={styles.ChooseModelLabel}
          autoFocus
          errorMessage={
            ml_integration_error_list?.[ML_INTEGRATION.BASIC_INTEGRATION.ML_MODEL_DROPDOWN.ID]
          }
        />
        {/* <Input
          id={ML_INTEGRATION.BASIC_INTEGRATION.STEP_NAME.ID}
          label={t(ML_INTEGRATION.BASIC_INTEGRATION.STEP_NAME.LABEL)}
          placeholder={t(
            ML_INTEGRATION.BASIC_INTEGRATION.STEP_NAME.PLACEHOLDER,
          )}
          onChangeHandler={onStepNameChangeHandler}
          value={activeMLIntegrationData.step_name}
          className={cx(gClasses.FontWeight500, styles.ChooseModelLabel)}
          inputContainerClasses={gClasses.BackgroundWhite}
          isRequired
        /> */}
         <TextInput
                id={ML_INTEGRATION.BASIC_INTEGRATION.STEP_NAME.ID}
                labelText={t(ML_INTEGRATION.BASIC_INTEGRATION.STEP_NAME.LABEL)}
                placeholder={t(ML_INTEGRATION.BASIC_INTEGRATION.STEP_NAME.PLACEHOLDER)}
                value={activeMLIntegrationData?.step_name}
                onChange={onStepNameChangeHandler}
                required
                className={cx(gClasses.FontWeight500, styles.ChooseModelLabel)}
                labelClassName={gClasses.ChooseModelLabel}
                inputClassName={gClasses.BackgroundWhite}
                errorMessage={
                  ml_integration_error_list?.[ML_INTEGRATION.BASIC_INTEGRATION.STEP_NAME.ID] || activeMLIntegrationServerError
                }
         />
        {/* <TextArea
          id={ML_INTEGRATION.BASIC_INTEGRATION.STEP_DESCRIPTION.ID}
          label={t(
            ML_INTEGRATION.BASIC_INTEGRATION.STEP_DESCRIPTION.LABEL,
          )}
          placeholder={t(
            ML_INTEGRATION.BASIC_INTEGRATION.STEP_DESCRIPTION.PLACEHOLDER,
          )}
          value={activeMLIntegrationData.description}
          onChangeHandler={onStepDescriptionChangeHandler}
          className={cx(styles.ChooseModelLabel)}
          innerClass={cx(styles.DescriptionClass, gClasses.BackgroundWhite)}
        /> */}
        <TextArea
          id={ML_INTEGRATION.BASIC_INTEGRATION.STEP_DESCRIPTION.ID}
          labelText={t(ML_INTEGRATION.BASIC_INTEGRATION.STEP_DESCRIPTION.LABEL)}
          placeholder={t(ML_INTEGRATION.BASIC_INTEGRATION.STEP_DESCRIPTION.PLACEHOLDER)}
          value={activeMLIntegrationData?.description}
          onChange={(event) => onStepDescriptionChangeHandler(event)}
          className={cx(gClasses.MT16, styles.ChooseModelLabel)}
        />
      </div>
    </div>
  );
}

const mapStateToProps = ({ EditFlowReducer }) => {
  return {
    isIntegrationConfigurationModalOpen:
      EditFlowReducer.flowData.isIntegrationConfigurationModalOpen,
    activeMLIntegrationData:
      EditFlowReducer.flowData.activeMLIntegrationData,
    activeMLIntegrationServerError: EditFlowReducer.activeMLIntegrationServerError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateProcedureData: (...params) => {
      dispatch(updateFlowDataChange(...params));
    },
    updateFlowState: (value) => {
      dispatch(updateFlowStateChange(value));
    },
    dispatch,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BasicIntegerationConfiguration),
);
