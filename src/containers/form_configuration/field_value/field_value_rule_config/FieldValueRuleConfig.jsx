import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { Button, EButtonType, Modal, ModalStyleType, ModalSize, TextInput, ToggleButton, EButtonIconPosition, Skeleton } from '@workhall-pvt-lmt/wh-ui-library';
import { connect, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import gClasses from '../../../../scss/Typography.module.scss';
import styles from '../FieldValue.module.scss';
import { BS } from '../../../../utils/UIConstants';
import CloseIconV2 from '../../../../assets/icons/CloseIconV2';
import FormulaBuilder from '../../../../components/formula_builder/FormulaBuilder';
import jsUtility, { cloneDeep, get, isNull } from '../../../../utils/jsUtility';
import { clearDefaultValueActiveRule, defaultValueActiveRuleDataChange, fieldDefaultValueDataChange, setDefaultValueActiveRule, setDefaultValueActiveRuleError } from '../../../../redux/reducer/VisibilityReducer';
import { CONDITION_BUILDER_INITIAL_STATE } from '../../../../components/condition_builder/ConditionBuilder.strings';
import { getDefaultRuleByIdApiThunk, saveRuleThunk } from '../../../../redux/actions/Visibility.Action';
import { getVisibilityExternalFieldsDropdownList } from '../../../../redux/reducer';
import { globalFormulaBuilderEvaluateThunk } from '../../../../redux/actions/FormulaBuilder.Actions';
import { clearFormulaBuilderValues } from '../../../../redux/reducer/FormulaBuilderReducer';
import { getFormulaValidationData, replaceNonBreakCharacterToEmpty } from '../../../../components/formula_builder/formula_tokenizer_utils/formulaBuilder.utils';
import { BUILDER_TYPES, confirmBuilderChangePopover, constructSaveRuleData, validateVisibilityBasicFields } from '../../field_visibility/FieldVisibilityRule.utils';
import { FIELD_DEFAULT_VALUE_STRINGS } from '../FieldValueRule.strings';
import DeleteRuleModal from '../../delete_rule/DeleteRuleModal';
import { RULE_TYPE } from '../../../../utils/constants/rule/rule.constant';
import ConfigurationRuleBuilder from '../../../../components/configuration_rule_builder/ConfigurationRuleBuilder';
import { MODULE_TYPES } from '../../../../utils/Constants';
import BlueLoadingSpinnerIcon from '../../../../assets/BlueLoadingSpinner';
import InfoCircle from '../../../../assets/icons/application/InfoCircle';
import { validateConfigurationRule, validateConfigurationRuleLValue, validateConfigurationRuleOperator, validateConfigurationRuleRValue } from '../../../../components/configuration_rule_builder/ConfigurationRuleBuilder.utils';
import { FIELD_TYPE } from '../../../../utils/constants/form_fields.constant';
import { defaultValueRuleOperatorThunk } from '../../../../redux/actions/DefaultValueRule.Action';
import { getModuleIdByModuleType } from '../../../form/Form.utils';
import { RESPONSE_FIELD_KEYS } from '../../../../utils/constants/form/form.constant';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { CancelToken } from '../../../../utils/UtilityFunctions';
import { getUniqueRuleNameApi } from '../../../../axios/apiService/rule.apiService';
import { CONFIGURATION_RULE_BUILDER, FIELD_LABEL, VALUE_LABEL } from '../../../../components/configuration_rule_builder/ConfigurationRuleBuilder.strings';

function FieldVisibilityRuleConfig(props) {
  const {
    onClose,
    onSave,
    ruleUUID,
    metaData: {
      moduleId,
      ruleId,
    },
    metaData,
    field,
    moduleType,
    ruleType,
    // isFormConfiguration,
    // getDueDateRules,
    // stepDetails = {},
    tableUUID,
    code,
    defaultValueReducer,
    removedRuleUUID,
    ruleNameGenerate,
    hideToggle = false,
    disableConfigurationRule = false,
    isDataManipulatorRule = false,
    defaultRuleType = null,
    isLoading = false,
  } = props;
  const dispatch = useDispatch();
  const [deleteRuleData, setDeleteRuleData] = useState(null);
  const { t } = useTranslation();
  const { MODAL } = FIELD_DEFAULT_VALUE_STRINGS(t);
  const { activeRule, activeRuleError, activeRuleLoading } = defaultValueReducer;
  const isDueDateRule = ruleType === RULE_TYPE.DUE_DATA;
  const fieldType = get(field, [RESPONSE_FIELD_KEYS.FIELD_TYPE]);
  const isDateField = fieldType === FIELD_TYPE.DATE || fieldType === FIELD_TYPE.DATETIME;

  useEffect(() => {
    if (ruleUUID) {
      const params = {
        rule_uuid: ruleUUID,
        ...getModuleIdByModuleType(metaData, moduleType),
      };
      delete params.step_id;

      if (isDateField || isDueDateRule) {
        dispatch(getDefaultRuleByIdApiThunk(params, field));
      } else {
        console.log('ruelsd', disableConfigurationRule, ruleUUID);
        if (!disableConfigurationRule) {
          dispatch(fieldDefaultValueDataChange({ activeRuleLoading: true }));
          dispatch(defaultValueRuleOperatorThunk(fieldType)).then((data) => {
            if (ruleUUID) {
              dispatch(getDefaultRuleByIdApiThunk(params, field, data));
            }
          }).catch(() => dispatch(fieldDefaultValueDataChange({ activeRuleLoading: false })));
        } else {
          if (ruleUUID) {
            dispatch(getDefaultRuleByIdApiThunk(params, field, {}));
          }
        }
      }
    } else {
      if (!isDateField && !isDueDateRule && !disableConfigurationRule) dispatch(defaultValueRuleOperatorThunk(fieldType));
    }
  }, []);

  useEffect(() => {
    if (ruleUUID) return;
    const clonedActiveRule = cloneDeep(activeRule);
    if (isDueDateRule || isDateField) {
      clonedActiveRule.ruleType = BUILDER_TYPES.EXPRESSION;
    }
    dispatch(fieldDefaultValueDataChange({ activeRule: cloneDeep(clonedActiveRule) }));

    const uniqueRuleNameCancelToken = new CancelToken();
    getUniqueRuleNameApi(
      { name: ruleNameGenerate, rule_type: ruleType, ...getModuleIdByModuleType(metaData, moduleType, false) },
      uniqueRuleNameCancelToken,
    )
      .then((response) => {
        clonedActiveRule.ruleName = response;
        if (!isNull(defaultRuleType)) {
          clonedActiveRule.ruleType = defaultRuleType;
        }
        dispatch(setDefaultValueActiveRule(clonedActiveRule));
      })
      .catch((e) => {
        console.error('xyz errors', e);
        dispatch(setDefaultValueActiveRule(clonedActiveRule));
      })
      .finally(() =>
        dispatch(fieldDefaultValueDataChange({ activeRuleLoading: false })),
      );
  }, [ruleUUID]);

  const changeBuilderType = (value) => {
    const clonedActiveRule = jsUtility.cloneDeep(activeRule);
    clonedActiveRule.ruleType = value;
    clonedActiveRule.ruleExpression =
      value === BUILDER_TYPES.CONDITIONAL
        ? CONDITION_BUILDER_INITIAL_STATE
        : {};
    dispatch(setDefaultValueActiveRule(clonedActiveRule));
    dispatch(clearFormulaBuilderValues());
  };

  const onBuilderChangeHandler = (event, id, value) => {
    let isChanged = false;
    if (activeRule.ruleType === BUILDER_TYPES.CONFIGURATION_RULE) {
      const change = jsUtility.get(activeRule.ruleExpression, 'operator', null);
      isChanged = !!change;
    } else if (activeRule.ruleType === BUILDER_TYPES.EXPRESSION) {
      const change = code ? jsUtility.cloneDeep(code).trim() : '';
      isChanged = !!change;
    }
    if (isChanged) {
      confirmBuilderChangePopover(() => changeBuilderType(value), t);
    } else {
      changeBuilderType(value);
    }
  };

  const onChangeRuleName = (e) => {
    const clonedActiveRule = jsUtility.cloneDeep(activeRule);
    clonedActiveRule.ruleName = e.target.value;
    dispatch(setDefaultValueActiveRule(clonedActiveRule));
  };

  const onCancelClicked = () => {
    dispatch(clearDefaultValueActiveRule());
    dispatch(setDefaultValueActiveRuleError({}));
    dispatch(clearFormulaBuilderValues());
    onClose();
  };

  const onCloseHandler = () => {
    onCancelClicked();
  };

  const onSaveClicked = async () => {
    const clonedActiveRule = jsUtility.cloneDeep(activeRule);
    const errorList = validateVisibilityBasicFields(activeRule);
    let error = { ...errorList };

    if (clonedActiveRule.ruleType === BUILDER_TYPES.EXPRESSION) {
      try {
        const validatingCode = replaceNonBreakCharacterToEmpty(code);
        const validationError = getFormulaValidationData(validatingCode);
        if (validationError) {
          error.input = MODAL.FORMULA_REQUIRED;
          error.expression = true;
          dispatch(setDefaultValueActiveRuleError(error));
        }
        const postCode = await dispatch(
          globalFormulaBuilderEvaluateThunk(code),
        );
        if (postCode) clonedActiveRule.ruleExpression.expression = postCode;
      } catch (err) {
        error.expression = true;
      }
    } else if (clonedActiveRule.ruleType === BUILDER_TYPES.CONFIGURATION_RULE) {
      const configurationRuleError = validateConfigurationRule(clonedActiveRule?.ruleExpression);
      error = { ...error, ...(configurationRuleError || {}) };
    }
    dispatch(setDefaultValueActiveRuleError(error));

    if (jsUtility.isEmpty(error)) {
      if (removedRuleUUID) clonedActiveRule.ruleUUID = removedRuleUUID;
      const postData = constructSaveRuleData(clonedActiveRule, metaData, moduleType, ruleType, isDataManipulatorRule);
      dispatch(saveRuleThunk(postData, onCloseHandler, moduleType))
        .then((rule) => { onSave?.(rule); });
    }
  };

  const configurationBuilderChange = (rule, id) => {
    let individualErrors = {};
    switch (id) {
      case CONFIGURATION_RULE_BUILDER.FIELDS.OPERATOR.ID:
        individualErrors = validateConfigurationRuleOperator(rule);
        break;
      case FIELD_LABEL().ID:
        individualErrors = validateConfigurationRuleLValue(rule);
      break;
      case VALUE_LABEL().ID:
        individualErrors = validateConfigurationRuleRValue(rule);
      break;
      default: break;
    }

    const errorList = validateVisibilityBasicFields(activeRule);
    const error = { ...errorList, ...(individualErrors || {}) };
    dispatch(setDefaultValueActiveRuleError(error));

    dispatch(defaultValueActiveRuleDataChange({ ruleExpression: rule }));
  };
  // Component Variable

  const getBuilder = () => {
    if (activeRuleLoading || isLoading) {
      return (
        <BlueLoadingSpinnerIcon
          className={cx(
            gClasses.MT100,
            gClasses.MB65,
            BS.D_BLOCK,
            BS.ML_AUTO,
            BS.MR_AUTO,
          )}
        />
      );
    }

    if (isDueDateRule || activeRule.ruleType === BUILDER_TYPES.EXPRESSION) {
      return (
        <FormulaBuilder
          fieldError={activeRuleError}
          taskId={moduleId}
          modalId={MODAL.ID}
          isTaskForm={moduleType === MODULE_TYPES.TASK}
          isDataListForm={moduleType === MODULE_TYPES.DATA_LIST}
        />
      );
    }

    return (
      <ConfigurationRuleBuilder
        moduleType={moduleType}
        moduleId={moduleId}
        ruleId={ruleId}
        rule={activeRule?.ruleExpression}
        onRuleReduxUpdator={configurationBuilderChange}
        ruleError={activeRuleError}
        fieldType={field?.fieldType || field?.field_type}
        fieldUUID={field?.fieldUUID || field?.field_uuid}
        tableUUID={tableUUID}
        isTableField={!!tableUUID}
        isSourceTableField={false}
      />
    );
  };

  const headerContent = (
    <div className={cx(styles.HeaderTitle)}>
      {ruleType === RULE_TYPE.DEFAULT_VALUE ? MODAL.TITLE : MODAL.DUE_DATE_TITLE}
      <div>
        <CloseIconV2 className={styles.CloseIcon} onClick={onCancelClicked} />
      </div>
      {activeRule.isExistingRule && (
        <div className={cx(styles.Warning, gClasses.CenterV, gClasses.MT24)}>
          <InfoCircle className={gClasses.MR8} fill="#DC6803" />
          {MODAL.EXISTING_RULE_WARNING}
        </div>
      )}
    </div>
  );

  const modalContent = (
    <div className={styles.FlexHome}>
      <div className={cx(styles.FlexItem3)}>
        <div className={cx(styles.BigText, gClasses.CenterVSpaceBetween, gClasses.MB12)}>
          {activeRuleLoading ?
            <Skeleton height={24} width={150} />
            : MODAL.CONFIGURATION_TYPE.OPTIONS.find((o) => o.value === activeRule.ruleType)?.label
          }
          {!hideToggle &&
            <ToggleButton
              isActive={activeRule.ruleType === BUILDER_TYPES.EXPRESSION}
              onChange={() => onBuilderChangeHandler({}, EMPTY_STRING, activeRule.ruleType === BUILDER_TYPES.EXPRESSION ? 2 : 1)}
              label={MODAL.USE_ADVANCED}
              toggleAlign={EButtonIconPosition.RIGHT}
              labelClassName={cx(gClasses.FTwo12BlackV20, gClasses.FontWeight500, gClasses.MR8)}
              disabled={activeRuleLoading || isDateField || isDueDateRule || (field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.USER_TEAM_PICKER)}
            />
          }
        </div>
        <div>{getBuilder()}</div>
      </div>
      <div className={cx(styles.FlexItem1)}>
        <TextInput
          required
          value={activeRule.ruleName}
          labelText={MODAL.RULE_NAME}
          onChange={onChangeRuleName}
          errorMessage={activeRuleError.ruleName}
          isLoading={activeRuleLoading || isLoading}
        />
      </div>
    </div>
  );

  const FooterButtons = (
    <div className={cx(BS.D_FLEX, BS.JC_END, BS.ALIGN_ITEM_CENTER)}>
      <div className={BS.D_FLEX}>
        <button
          className={cx(styles.Button, gClasses.MR8)}
          onClick={onCancelClicked}
        >
          {MODAL.CANCEL}
        </button>
        <Button
          buttonText={MODAL.SAVE_RULE}
          type={EButtonType.PRIMARY}
          onClick={onSaveClicked}
          disabled={activeRuleLoading}
        />
      </div>
    </div>
  );

  return (
    <>
      <Modal
        id={MODAL.ID}
        isModalOpen
        headerContent={headerContent}
        headerContentClassName={styles.ModalLayoutHeader}
        mainContent={modalContent}
        modalStyle={ModalStyleType.modal}
        customModalClass={styles.ModalContainerClass}
        className={styles.AppBasicDetailsModal}
        mainContentClassName={styles.ModalLayoutContent}
        modalSize={ModalSize.lg}
        footerContent={FooterButtons}
        footerContentClassName={cx(styles.ModalFooterClass)}
      />
      {deleteRuleData && (
        <DeleteRuleModal
          metaData={deleteRuleData}
          successFn={onCloseHandler}
          errorFn={() => { }}
          cancelFn={() => setDeleteRuleData(null)}
        />
      )}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    externalFieldsDropdownList: getVisibilityExternalFieldsDropdownList(
      state,
      null,
      false,
    ),
    defaultValueReducer: state.VisibilityReducer.fieldDefaultValueReducer,
    code: state.FormulaBuilderReducer?.code,
  };
};

export default connect(mapStateToProps)(FieldVisibilityRuleConfig);
