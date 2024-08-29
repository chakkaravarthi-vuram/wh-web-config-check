import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { Button, EButtonType, Modal, ModalStyleType, ModalSize, TextInput, ToggleButton, EButtonIconPosition, Skeleton } from '@workhall-pvt-lmt/wh-ui-library';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import gClasses from '../../../../scss/Typography.module.scss';
import styles from '../FieldVisibility.module.scss';
import { BS } from '../../../../utils/UIConstants';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { BUILDER_TYPES, confirmBuilderChangePopover, constructSaveRuleData, validateVisibilityBasicFields, validateVisibilityRuleCondition } from '../FieldVisibilityRule.utils';
import ConditionBuilder from '../../../../components/condition_builder/ConditionBuilder';
import CloseIconV2 from '../../../../assets/icons/CloseIconV2';
import FormulaBuilder from '../../../../components/formula_builder/FormulaBuilder';
import jsUtility, { isEmpty } from '../../../../utils/jsUtility';
import { clearVisibilityActiveRule, fieldVisibilityDataChange, setVisibilityActiveRule, setVisibilityActiveRuleError, setVisibilityRuleExpression } from '../../../../redux/reducer/VisibilityReducer';
import { getExternalFields } from '../../../../axios/apiService/formulaBuilder.apiService';
import { CONDITION_BUILDER_INITIAL_STATE } from '../../../../components/condition_builder/ConditionBuilder.strings';
import { externalFieldsClear, getVisibilityRuleDetailsById, saveRuleThunk, visibilityExternalFieldsThunk } from '../../../../redux/actions/Visibility.Action';
import { getVisibilityExternalFieldsDropdownList } from '../../../../redux/reducer';
import { globalFormulaBuilderEvaluateThunk } from '../../../../redux/actions/FormulaBuilder.Actions';
import { clearFormulaBuilderValues } from '../../../../redux/reducer/FormulaBuilderReducer';
import { getFormulaValidationData, replaceNonBreakCharacterToEmpty } from '../../../../components/formula_builder/formula_tokenizer_utils/formulaBuilder.utils';
import { FIELD_VISIBILITY_ALLOWED_FIELD, FIELD_VISIBILITY_STRINGS } from '../FieldVisibilityRule.strings';
import DeleteRuleModal from '../../delete_rule/DeleteRuleModal';
import BlueLoadingSpinnerIcon from '../../../../assets/BlueLoadingSpinner';
import { MODULE_TYPES } from '../../../../utils/Constants';
import InfoCircle from '../../../../assets/icons/application/InfoCircle';
import { FIELD_LIST_TYPE } from '../../../../utils/constants/form.constant';
import { getModuleIdByModuleType } from '../../../form/Form.utils';
import { getUniqueRuleNameApi } from '../../../../axios/apiService/rule.apiService';
import { CancelToken } from '../../../../utils/UtilityFunctions';

function FieldVisibilityRuleConfig(props) {
  const {
    ruleUUID,
    onClose,
    onSave,
    externalFieldsDropdownList,
    externalFieldsDropdownData,
    metaData: { moduleId, ruleId, formUUID },
    metaData,
    field,
    moduleType,
    ruleType,
    tableUUID,
    ruleNameGenerate,
    isAssigneeRule,
  } = props;
  const dispatch = useDispatch();
  const [deleteRuleData, setDeleteRuleData] = useState(null);
  const { t } = useTranslation();
  const { MODAL } = FIELD_VISIBILITY_STRINGS(t);
  const { activeRule, activeRuleError, activeRuleLoading } = useSelector((s) => s.VisibilityReducer.fieldVisibilityReducer);
  const { code } = useSelector((s) => s.FormulaBuilderReducer);
  // const [tableUUID] = useState(null);

  // const getMetaData = () => {
  //   const data = {
  //       form_uuid: formUUID,
  //   };
  //   if (moduleType === MODULE_TYPES.FLOW) {
  //       data.flow_id = moduleId;
  //   } else if (moduleType === MODULE_TYPES.DATA_LIST) {
  //       data.data_list_id = moduleId;
  //   }
  //   return data;
  //   };
  // const moduleIdObject = getMetaData();
  // delete moduleIdObject.form_uuid;

  const loadData = (page = 1, search = EMPTY_STRING) => {
    const params = {
        page: page,
        size: 15,
        include_property_picker: 1,
        // ...moduleIdObject,
        ...(getModuleIdByModuleType(metaData, moduleType)),
        sort_by: 1,
        field_list_type: FIELD_LIST_TYPE.DIRECT,
        allowed_field_types: FIELD_VISIBILITY_ALLOWED_FIELD,
        ...(tableUUID ? {
          table_uuid: tableUUID,
          include_table_fields: 1,
        } : {}),
    };
    if (search) params.search = search;
    delete params.step_id;
    delete params.dashboard_id;
    delete params.page_id;

    dispatch(visibilityExternalFieldsThunk(params, FIELD_LIST_TYPE.DIRECT, null, getExternalFields));
  };

  useEffect(() => {
    const params = {
      rule_uuid: ruleUUID,
      ...getModuleIdByModuleType(metaData, moduleType),
    };
    delete params.step_id;
    if (moduleType === MODULE_TYPES.SUMMARY) {
      delete params.dashboard_id;
      delete params.data_list_id;
      delete params.flow_id;
    }
    if (ruleUUID) dispatch(getVisibilityRuleDetailsById(params));
    else {
      const clonedActiveRule = jsUtility.cloneDeep(activeRule);
      clonedActiveRule.ruleExpression = jsUtility.cloneDeep(CONDITION_BUILDER_INITIAL_STATE);
      const uniqueRuleNameCancelToken = new CancelToken();
      dispatch(fieldVisibilityDataChange({ activeRuleLoading: true }));
      const uniqueRuleNameParams = getModuleIdByModuleType(metaData, moduleType, false);
      if (moduleType === MODULE_TYPES.SUMMARY) {
        delete uniqueRuleNameParams.dashboard_id;
        delete uniqueRuleNameParams.data_list_id;
        delete uniqueRuleNameParams.flow_id;
      }
      getUniqueRuleNameApi(
        { name: ruleNameGenerate, rule_type: ruleType, ...uniqueRuleNameParams },
        uniqueRuleNameCancelToken,
      )
        .then((response) => {
          clonedActiveRule.ruleName = response;
          dispatch(setVisibilityActiveRule(clonedActiveRule));
        })
        .catch((e) => {
          console.error('xyz errors', e);
          dispatch(setVisibilityActiveRule(clonedActiveRule));
        })
        .finally(() =>
          dispatch(fieldVisibilityDataChange({ activeRuleLoading: false })),
        );
    }
  }, [ruleUUID]);

  useEffect(() => {
    loadData(1);
  }, [tableUUID]);

  const changeBuilderType = (value) => {
    const clonedActiveRule = jsUtility.cloneDeep(activeRule);
      clonedActiveRule.ruleType = value;
      clonedActiveRule.ruleExpression =
        value === BUILDER_TYPES.CONDITIONAL
          ? CONDITION_BUILDER_INITIAL_STATE
          : {};
    dispatch(setVisibilityActiveRule(clonedActiveRule));
    dispatch(clearFormulaBuilderValues());
  };

  const checkIfRuleContainsField = (conditions) => {
    const isFieldFound = conditions.find((condition) => {
      if (condition?.condition_type === 'direct') {
        return !isEmpty(condition?.l_field);
      } else if (condition?.condition_type === 'expression') {
        return checkIfRuleContainsField(condition?.expression?.conditions);
      }
      return false;
    });
    return isFieldFound;
  };

  const onBuilderChangeHandler = (event, id, value) => {
    let isChanged = false;
    if (activeRule.ruleType === BUILDER_TYPES.CONDITIONAL) {
      isChanged = checkIfRuleContainsField(activeRule?.ruleExpression?.expression?.conditions);
    } else if (activeRule.ruleType === BUILDER_TYPES.EXPRESSION) {
      const change = code ? jsUtility.cloneDeep(code.trim()) : '';
      isChanged = !!change;
    }
    if (isChanged) {
      confirmBuilderChangePopover(() => changeBuilderType(value), t);
    } else {
      changeBuilderType(value);
    }
  };

  const onExpressionUpdate = (expression) => {
    dispatch(setVisibilityRuleExpression({ expression }));
  };

  const onExpressionSearch = (searchText, page = 1) => loadData(page, searchText);

  const onLoadMoreExpressionFields = () => {
    if (externalFieldsDropdownData && externalFieldsDropdownList) {
      const paginationDetails = jsUtility.get(externalFieldsDropdownData, ['pagination_details', 0], {});
      if (paginationDetails.total_count > externalFieldsDropdownList.length) {
        const page = jsUtility.get(paginationDetails, ['page'], 0) + 1;
        loadData(page);
      }
    }
  };

  const onChangeRuleName = (e) => {
    const clonedActiveRule = jsUtility.cloneDeep(activeRule);
    clonedActiveRule.ruleName = e.target.value;
    dispatch(setVisibilityActiveRule(clonedActiveRule));
  };

  const onCancelClicked = () => {
    dispatch(clearVisibilityActiveRule());
    dispatch(setVisibilityActiveRuleError({}));
    dispatch(clearFormulaBuilderValues());
    dispatch(externalFieldsClear());
    onClose();
  };

  const closeAndFetchRuleList = () => {
    onCancelClicked();
    // if (ruleType === RULE_TYPE.VISIBILITY) {
    //   const params = {
    //     page: 1,
    //     size: 15,
    //     rule_type: RULE_TYPE.VISIBILITY,
    //     ...(getModuleIdByModuleType(metaData, moduleType)),
    //     form_uuid: metaData.formUUID,
    //   };
    //   dispatch(getVisibilityRulesThunk(params));
    // }
  };

  const onDeleteClicked = () => {
    if (!ruleId) return;

    const metaData = {
      _id: ruleId,
      current_form_uuid: formUUID,
      flow_id: moduleId,
    };

    setDeleteRuleData(metaData);
  };

  const onSaveClicked = async () => {
    const clonedActiveRule = jsUtility.cloneDeep(activeRule);
    const errorList = validateVisibilityBasicFields(activeRule, false);
    const error = { ...errorList };

    if (clonedActiveRule.ruleType === BUILDER_TYPES.CONDITIONAL) {
      const { has_validation, validated_expression } =
        validateVisibilityRuleCondition(clonedActiveRule.ruleExpression);
      if (has_validation) {
        error.hasValidation = has_validation;
      }
      clonedActiveRule.ruleExpression.expression = validated_expression;
      dispatch(setVisibilityActiveRule(clonedActiveRule));
    } else if (clonedActiveRule.ruleType === BUILDER_TYPES.EXPRESSION) {
      try {
        const validatingCode = replaceNonBreakCharacterToEmpty(code);
        const validationError = getFormulaValidationData(validatingCode);
        if (validationError) {
          error.input = MODAL.FORMULA_REQUIRED;
          error.expression = true;
          dispatch(setVisibilityActiveRuleError(error));
        }
        const postCode = await dispatch(globalFormulaBuilderEvaluateThunk(code));
        if (postCode) clonedActiveRule.ruleExpression.expression = postCode;
      } catch (err) {
        error.expression = true;
      }
    }
    dispatch(setVisibilityActiveRuleError(error));
    if (jsUtility.isEmpty(error)) {
      if (field) clonedActiveRule.selectedFields = [field];
      const postData = constructSaveRuleData(clonedActiveRule, metaData, moduleType, ruleType);
      console.log('xyz postData', postData);
      dispatch(saveRuleThunk(postData, closeAndFetchRuleList, moduleType))
      .then((data) => { onSave?.(data); });
    }
  };

  // Component Varibales
  const getBuilder = () => {
    if (activeRuleLoading) {
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
    switch (activeRule.ruleType) {
      case BUILDER_TYPES.CONDITIONAL:
        return (
          <ConditionBuilder
            id={MODAL.CONDITIONAL_BUILDER_ID}
            rule={activeRule?.ruleExpression?.expression}
            maxNestedLevel={4}
            hasValidation={activeRuleError.hasValidation}
            lstAllFields={externalFieldsDropdownList}
            isLoading={activeRuleLoading}
            onSearchExternalFields={onExpressionSearch}
            onLoadMoreExternalFields={onLoadMoreExpressionFields}
            updateExpressionInReduxFn={onExpressionUpdate}
          />
        );
      case BUILDER_TYPES.EXPRESSION:
        return (
          <FormulaBuilder
            fieldError={activeRuleError}
            taskId={moduleId}
            modalId={MODAL.ID}
            isTaskForm={moduleType === MODULE_TYPES.TASK}
            isDataListForm={
              moduleType === MODULE_TYPES.SUMMARY
                ? !!metaData?.dataListId
                : moduleType === MODULE_TYPES.DATA_LIST
            }
          />
        );
      default:
        break;
    }
    return null;
  };

  const headerContent = (
    <div className={cx(styles.HeaderTitle)}>
      {isAssigneeRule ? MODAL.ASSIGNEE_TITLE : MODAL.TITLE}
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
            : MODAL.CONFIGURATION_TYPE.OPTIONS[activeRule.ruleType]?.label
          }
          <ToggleButton
            isActive={activeRule.ruleType === BUILDER_TYPES.EXPRESSION}
            onChange={() => onBuilderChangeHandler({}, EMPTY_STRING, activeRule.ruleType === BUILDER_TYPES.EXPRESSION ? 0 : 1)}
            label={MODAL.USE_ADVANCED}
            toggleAlign={EButtonIconPosition.RIGHT}
            labelClassName={cx(gClasses.FTwo12BlackV20, gClasses.FontWeight500, gClasses.MR8)}
            disabled={activeRuleLoading}
          />
        </div>
        <div>{getBuilder()}</div>
      </div>
      <div className={cx(styles.FlexItem1, gClasses.MT16)}>
        <TextInput
          value={activeRule.ruleName}
          labelText={MODAL.RULE_NAME}
          onChange={onChangeRuleName}
          errorMessage={activeRuleError.ruleName}
          isLoading={activeRuleLoading}
          required
        />
      </div>
    </div>
  );

  const FooterButtons = (
    <div className={cx(BS.D_FLEX, ruleId ? BS.JC_BETWEEN : BS.JC_END, BS.ALIGN_ITEM_CENTER)}>
      {ruleId && (
        <button
          className={cx(styles.Button, styles.DeleteButton)}
          onClick={onDeleteClicked}
        >
          {MODAL.DELETE_RULE}
        </button>
      )}
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
          successFn={closeAndFetchRuleList}
          errorFn={() => {}}
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
    externalFieldsDropdownData: state.VisibilityReducer.externalFieldReducer.externalFields,
  };
};

export default connect(mapStateToProps)(FieldVisibilityRuleConfig);
