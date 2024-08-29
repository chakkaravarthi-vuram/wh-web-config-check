import { Chip, Size, TextInput, Variant } from '@workhall-pvt-lmt/wh-ui-library';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import styles from './FormHeader.module.scss';
import FormSettingsIcon from '../../../../assets/icons/FormSettingsIcon';
import { ARIA_ROLES } from '../../../../utils/UIConstants';
import FormHeaderConfiguration from './form_header_configuration/FormHeaderConfiguration';
import { FORM_CONFIG_STRINGS } from '../../Form.string';
import { validate } from '../../../../utils/UtilityFunctions';
import { FormHeaderConfigurationSchema } from './form_header_configuration/FormHeader.schema';
import jsUtility from '../../../../utils/jsUtility';
import { saveFormHeaderApiThunk } from '../../../../redux/actions/Form.Action';
import { getModuleIdByModuleType } from '../../Form.utils';
import { MODULE_TYPES } from '../../../../utils/Constants';

function FormHeader(props) {
  const {
    headerData,
    metaData,
    errorList,
    onHeaderUpdate,
    stepDetails,
  } = props;

  const [headerDataState, setHeaderDataState] = useState(headerData);
  const [formConfigErrorList, setFormConfigErrorList] = useState({});
  const [isFormConfigModalOpen, setFormConfigModalVisibility] = useState(false);

  const onSuccessfulSaveHandler = (newValue) => {
    setHeaderDataState(newValue);
    onHeaderUpdate(newValue);
  };

  useEffect(() => {
    if (!stepDetails.title) { // if there is no form title, then save step_name as form title
      const params = {
        _id: metaData.stepId,
        flow_id: metaData.moduleId,
        title: stepDetails.step_name,
        description: null,
        is_dynamic_title: false,
      };
      saveFormHeaderApiThunk(params, () => {
        onSuccessfulSaveHandler({
          title: stepDetails.step_name,
          description: null,
        });
      });
    }
  }, []);

  useEffect(() => {
    setFormConfigErrorList((p) => { return { ...p, ...(errorList || {}) }; });
  }, [errorList]);

  const { t } = useTranslation();
  const onFormConfigurationCloseHandler = () => {
    setFormConfigModalVisibility(false);
    setFormConfigErrorList({});
  };

  const onValidateHandler = (value) => {
    const formConfigData = {
      form_title: value.title !== null ? value.title.trim() : '',
      form_description: value.description !== null ? value.description.trim() : '',
    };

    const error_list = validate(formConfigData, FormHeaderConfigurationSchema(t));
    setFormConfigErrorList(error_list);
    return error_list;
  };

  const onBlurHandler = () => {
    const error = onValidateHandler(headerDataState);
    onHeaderUpdate(headerDataState);
    if (jsUtility.isEmpty(error)) {
      const moduleObj = getModuleIdByModuleType(metaData, MODULE_TYPES.FLOW);
      const params = {
        _id: moduleObj.step_id,
        flow_id: moduleObj.flow_id,
        title: headerDataState.title,
        description: headerDataState.description || null,
        is_dynamic_title: false,
      };
      saveFormHeaderApiThunk(params, () => {
        onSuccessfulSaveHandler({
          title: headerDataState.title,
          description: headerDataState.description,
        });
        setFormConfigErrorList({});
      });
    }
  };

  const getFormHeaderConfiguration = () => (
    <FormHeaderConfiguration
      headerData={headerDataState}
      metaData={metaData}
      onSuccess={onSuccessfulSaveHandler}
      onValidate={onValidateHandler}
      isFormConfigModalOpen={isFormConfigModalOpen}
      onCloseClickHandler={onFormConfigurationCloseHandler}
      formConfigErrorList={formConfigErrorList}
    />
  );

  return (
    <div className={styles.FormHeaderWrapper}>
      {isFormConfigModalOpen && getFormHeaderConfiguration()}
      <Chip
        text={FORM_CONFIG_STRINGS(t).CHIP.FORM_HEADER}
        textColor="#217CF5"
        backgroundColor="#EBF4FF"
        className={cx(styles.FormHeaderChip, gClasses.CenterVH)}
      />
      <FormSettingsIcon
        role={ARIA_ROLES.IMG}
        className={styles.FormSettingsIcon}
        onClick={() => setFormConfigModalVisibility(true)}
      />
      <TextInput
        variant={Variant.borderLess}
        size={Size.md}
        value={headerDataState.title}
        placeholder={FORM_CONFIG_STRINGS(t).FORM_CONFIG.HEADER
          .FORM_DISABLED_TITLE_PLACEHOLDER}
        inputInnerClassName={cx(styles.FormTitle, !headerDataState.title && styles.DisabledColor)}
        inputClassName={!jsUtility.isEmpty(formConfigErrorList.form_title) && !isFormConfigModalOpen && styles.ErrorBorder}
        onChange={(e) => {
          setHeaderDataState({ ...headerDataState, title: e.target.value });
          !jsUtility.isEmpty(formConfigErrorList) && onValidateHandler({ ...headerDataState, title: e.target.value });
        }}
        onBlurHandler={onBlurHandler}
        errorMessage={
          !isFormConfigModalOpen && formConfigErrorList[
            FORM_CONFIG_STRINGS(t).FORM_CONFIG.HEADER.FORM_TITLE_ID
          ]
        }
      />
      <TextInput
        variant={Variant.borderLess}
        size={Size.md}
        value={headerDataState.description}
        placeholder={FORM_CONFIG_STRINGS(t).FORM_CONFIG.HEADER
          .FORM_DISABLED_DESCRIPTION_PLACEHOLDER}
        onChange={(e) => {
          setHeaderDataState({ ...headerDataState, description: e.target.value });
          !jsUtility.isEmpty(formConfigErrorList) && onValidateHandler({ ...headerDataState, description: e.target.value });
        }}
        onBlurHandler={onBlurHandler}
        inputClassName={!jsUtility.isEmpty(formConfigErrorList.form_description) && !isFormConfigModalOpen && styles.ErrorBorder}
        errorMessage={
          !isFormConfigModalOpen && formConfigErrorList[
            FORM_CONFIG_STRINGS(t).FORM_CONFIG.HEADER.FORM_DESCRIPTION_ID
          ]
        }
      />
    </div>
  );
}

export default FormHeader;
