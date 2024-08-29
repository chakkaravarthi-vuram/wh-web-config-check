import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { validateExpressionAndUpdateField } from 'components/query_builder/QueryBuilder.utils';
import { globalFormulaBuilderEvaluateThunk } from 'redux/actions/FormulaBuilder.Actions';
import { FORMULA_BUILDER } from 'components/formula_builder/FormulaBuilder.strings';
import { checkForDefaultValueValidation } from 'utils/rule_engine/RuleEngine.utils';
import { BASIC_DETAILS } from 'containers/flow/flow_dashboard/task/Task.strings';
import { DateValidationOptionListId } from 'containers/task/task/Task.strings';
import { store } from 'Store';
import { VALIDATION_CONSTANT } from 'utils/constants/validation.constant';
import { rangeContainsZero } from 'components/form_builder/field_config/FieldConfig.utils';
import jsUtils from '../utils/jsUtility';
import {
  DEFAULT_RULE_KEYS,
  FIELD_KEYS,
  FIELD_LIST_KEYS,
  // FIELD_LIST_TYPE,
  FORM_FIELD_CONFIG_ACTIONS,
  FORM_FIELD_CONFIG_TYPES,
  SECTION_KEYS,
  VISIBILITY_CONFIG_CHANGE,
  FIELD_TYPE,
} from '../utils/constants/form.constant';
import {
  addTeamOrUserToTask,
  getTaskDetailsAPIData,
  getTaskDetailsValidateData,
  getUpdatedAssigneesList,
  removeTeamOrUserFromTask,
  setDefaultValueForField,
  setOtherConfigDataForField,
  setValidationConfigForField,
  setValuesForField,
  setUserSelectorDefaultValueConfig,
 } from '../containers/task/task/Task.utils';
import {
  addNewFormFieldAndGetUpdatedFieldList,
  closeFieldOrFieldListConfigAndGetUpdatedFieldList,
  isSectionNameChanged,
} from '../utils/formUtils';
import { FIELD_CONFIG, FIELD_CONFIGS } from '../components/form_builder/FormBuilder.strings';
import {
  dueDateSchema,
  taskDetailsValidateSchema,
  taskDetailsValidateSchemaWithOneSection,
  TASK_DESCRIPTION_SCHEMA,
  TASK_NAME_SCHEMA,
} from '../containers/task/task/Task.validation.schema';
import {
  validate } from '../utils/UtilityFunctions';
// import { FORM_POPOVER_STATUS } from '../utils/Constants';
// import { TASK_STRINGS } from '../containers/task/task/Task.strings';
// import { getFieldValueFromState } from '../redux/selectors/CreateTask.selector';
import { getTaskAssigneeSuggestion } from '../axios/apiService/taskAssigneeSuggestion.apiService';
import {
  createTaskSetState,
  assigneeSuggestionApiStarted,
} from '../redux/reducer/CreateTaskReducer';

function useCreateTask(props, onSaveFormField, taskType, taskId, onTabChangeFromProps) {
  const { t } = useTranslation();
  useEffect(() => () => {
    console.log('taskId', taskId);
    const { clearState } = props;
    // onAddTaskClosed();
    if (clearState) clearState();
  }, []);

  const updateSectionsAndCheckError = (_state) => {
    const { setState, t } = props;
    const state = jsUtils.cloneDeep(_state);
    if (!jsUtils.isEmpty(state.error_list)) {
      if (state.sections.length === 1) {
        state.error_list = validate(
          getTaskDetailsValidateData(state),
          taskDetailsValidateSchemaWithOneSection(t),
        );
      } else {
        state.error_list = validate(
          getTaskDetailsValidateData(state),
          taskDetailsValidateSchema(t),
        );
      }
    }
    setState(state);
  };

  const getErrorMessageForTaskDetails = (error_list, id, value) => {
    if (!jsUtils.isEmpty(error_list) && jsUtils.has(error_list, id)) {
      let schema;
      switch (id) {
        case BASIC_DETAILS.TASK_NAME.ID:
          schema = TASK_NAME_SCHEMA;
          break;
        case BASIC_DETAILS.TASK_DESCRIPTION.ID:
          schema = TASK_DESCRIPTION_SCHEMA;
          break;
        case BASIC_DETAILS.DUE_DATE.ID:
          schema = dueDateSchema();
          break;
          default:
            break;
      }
      const errorData = validate(value, schema);
      console.log(errorData, 'errorData errorData errorData');
      if (!jsUtils.isEmpty(errorData) && errorData[id]) {
        jsUtils.set(error_list, id, errorData[id]);
      } else jsUtils.unset(error_list, id);
    }
    return error_list;
  };

  const teamOrUserSelectHandler = (event) => {
    const { setState, state } = props;
    let { error_list } = jsUtils.cloneDeep(state);
    const assignees = addTeamOrUserToTask(jsUtils.cloneDeep(state), event);
    error_list = getErrorMessageForTaskDetails(error_list, BASIC_DETAILS.ASSIGNE_TO.ID, assignees);
    setState({
      assignees,
      error_list,
    });
  };
  const assigneeListUpdateHandler = (assigneesList) => {
    const { setState, state } = props;
    const assignees = getUpdatedAssigneesList(jsUtils.cloneDeep(state), assigneesList);
    setState({
      assignees,
    });
  };
  const teamOrUserRemoveHandler = (id) => {
    const { setState, state } = props;
    const { is_assign_to_individual_assignees } = state;
    const removed = removeTeamOrUserFromTask(jsUtils.cloneDeep(state), id);
    const data = {
      assignees: removed,
      is_assign_to_individual_assignees,
    };
    if (jsUtils.isEmpty(removed)) data.is_assign_to_individual_assignees = false;
    setState(data);
  };

  const onDueDateChangeHandler = (date) => {
    const { state, setState } = props;
    let { error_list } = jsUtils.cloneDeep(state);
    error_list = getErrorMessageForTaskDetails(error_list, BASIC_DETAILS.DUE_DATE.ID, date);
    setState({
      due_date: date,
      error_list,
    });
  };

  const onLabelBlurHandler = (event, sectionIndex, fieldListIndex, fieldIndex) => {
    const { setField, state: { sections, task_details }, validateReferenceName } = props;
    const referenceNameCheckPostData = {
      task_metadata_id: task_details._id,
      reference_name: event.target.value ? event.target.value.trim() : '',
    };
    const fieldId = jsUtils.get(sections, [sectionIndex, 'field_list', fieldListIndex, 'fields', fieldIndex, FIELD_KEYS.FIELD_ID]);
    if (fieldId) {
      referenceNameCheckPostData._id = fieldId;
    }
    if (!jsUtils.isEmpty(event.target.value)) {
      validateReferenceName(referenceNameCheckPostData, taskType);
    }
    setField(FIELD_KEYS.REFERENCE_NAME, event.target.value, sectionIndex, fieldListIndex, fieldIndex, false, updateSectionsAndCheckError);
  };

  const onTableNameChangeHandler = (event, sectionIndex, fieldListIndex) => {
    const { setFieldList } = props;
    setFieldList(FIELD_LIST_KEYS.TABLE_NAME, event.target.value, sectionIndex, fieldListIndex);
    setFieldList(FIELD_LIST_KEYS.TABLE_REF_NAME, event.target.value, sectionIndex, fieldListIndex);
    setFieldList(FIELD_LIST_KEYS.IS_TABLE_LABEL_EDITED, true, sectionIndex, fieldListIndex);
  };

  const onTableReferenceNameChangeHandler = (event, sectionIndex, fieldListIndex) => {
    const { setFieldList } = props;
    setFieldList(FIELD_LIST_KEYS.TABLE_REF_NAME, event.target.value, sectionIndex, fieldListIndex);
  };

  const onTableNameBlurHandler = (event, sectionIndex, fieldListIndex) => {
    const { setFieldList, state: { sections, task_details }, validateReferenceName } = props;
    const referenceNameCheckPostData = {
      task_metadata_id: task_details._id,
      reference_name: event.target.value ? event.target.value.trim() : '',
    };
    const fieldList = jsUtils.get(sections, [sectionIndex, 'field_list', fieldListIndex]);
    if (fieldList && !jsUtils.isEmpty(event.target.value)) {
      validateReferenceName?.(referenceNameCheckPostData);
    }
    setFieldList(FIELD_LIST_KEYS.TABLE_REF_NAME, event.target.value, sectionIndex, fieldListIndex, false, updateSectionsAndCheckError);
  };

  const onFieldListShowWhenRuleChangeHandler = (event, sectionIndex, fieldListIndex) => {
    const { setFieldList } = props;
    setFieldList(FIELD_LIST_KEYS.IS_FIELD_LIST_SHOW_WHEN_RULE, null, sectionIndex, fieldListIndex, true);
  };

  const onLabelChangeHandler = (event, sectionIndex, fieldListIndex, fieldIndex) => {
    const { setField, setErrorList, error_list } = props;
    if (jsUtils.has(error_list, `sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},${FIELD_KEYS.REFERENCE_NAME}`) || jsUtils.has(error_list, `sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},${FIELD_KEYS.FIELD_NAME}`) || jsUtils.has(error_list, 'reference_name')) {
      const errorList = { ...error_list };
      jsUtils.unset(errorList, 'reference_name');
      jsUtils.unset(errorList, `sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},${FIELD_KEYS.REFERENCE_NAME}`);
      jsUtils.unset(errorList, `sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},${FIELD_KEYS.FIELD_NAME}`);
      setErrorList(errorList);
    }
    setField(FIELD_KEYS.FIELD_NAME, event.target.value, sectionIndex, fieldListIndex, fieldIndex);
    setField(FIELD_KEYS.REFERENCE_NAME, event.target.value, sectionIndex, fieldListIndex, fieldIndex);
    setField(FIELD_KEYS.IS_LABEL_EDITED, true, sectionIndex, fieldListIndex, fieldIndex);
  };

  const onDataListPropertyPickerChangeHandler = (
    event,
    sectionIndex,
    fieldListIndex,
    fieldIndex,
  ) => {
    const { setField } = props;
     setField(
       FIELD_KEYS.PROPERTY_PICKER_DETAILS,
       event.target.value,
       sectionIndex,
       fieldListIndex,
       fieldIndex,
     );
  };

  const onDataListChangeHandler = (event, sectionIndex, fieldListIndex, fieldIndex, t) => {
    const { state: { sections }, setField, setDataListSelectorErrorList } = props;
    setField(FIELD_KEYS.DATA_LIST, event.target.value, sectionIndex, fieldListIndex, fieldIndex);
    if (jsUtils.has(event, ['target', 'index'])) {
      const { datalist_selector_error_list } = jsUtils.cloneDeep(store.getState().CreateTaskReducer);
      const errorList = jsUtils.cloneDeep(datalist_selector_error_list);
      if (errorList[event.target.index]) delete errorList[event.target.index];
      console.log('deletederrorlsit', errorList);
      setDataListSelectorErrorList(errorList);
    }
    console.log('event.target.valueevent.target.value', event.target.value);
    if (event.target.clearFilter) {
      const validationEvent =
      {
        target:
        { id: FIELD_CONFIG(t).VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.ID,
            value: [],
        },
      };
      const field = setValidationConfigForField(
        sections,
        sectionIndex,
        fieldListIndex,
        fieldIndex,
        validationEvent,
        false, // isTable param
      );
    setField(
      FIELD_KEYS.VALIDATIONS,
      field[FIELD_KEYS.VALIDATIONS],
      sectionIndex,
      fieldListIndex,
      fieldIndex,
      false,
      updateSectionsAndCheckError,
    );
    }
  };

  const onSetDataListSelectorErrorList = (index = -1, errorMessage = t(VALIDATION_CONSTANT.DATA_LIST_SELECTOR_FIELDS_DELETED)) => {
    const { setDataListSelectorErrorList } = props;
    const { datalist_selector_error_list } = jsUtils.cloneDeep(store.getState().CreateTaskReducer);
    let errorList = jsUtils.cloneDeep(datalist_selector_error_list);
    if (index !== -1) {
      errorList[index] = errorMessage;
    } else {
      errorList = {};
    }
    console.log('indexindexindexindexindexindexindexindexindexindexindexindexccccccccc', index, errorList, datalist_selector_error_list);
    setDataListSelectorErrorList(errorList);
  };

  const onSetDataListPropertyPickerErrorList = () => {
    onSetDataListSelectorErrorList(0, t(VALIDATION_CONSTANT.DATA_LIST_PROPERTY_PICKER_FIELD_DELETED));
  };

  const onLookupFieldChangeHandler = (event, sectionIndex, fieldListIndex, fieldIndex) => {
    console.log('onLookupFieldChangeHandler', event.target.value);
    const { setField, setErrorList, error_list, lookUpList } = props;
    if ((error_list && error_list.reference_name) || jsUtils.has(error_list, `sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},${FIELD_KEYS.VALUES}`)) {
      const errorList = { ...error_list };
      jsUtils.unset(errorList, 'reference_name');
      jsUtils.unset(errorList, `sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},${FIELD_KEYS.VALUES}`);
      setErrorList(errorList);
    }
    setField(FIELD_KEYS.SELECT_LOOKUP_FIELD, event.target.value, sectionIndex, fieldListIndex, fieldIndex);
    lookUpList.forEach((value) => {
      if (value.lookup_name === event.target.value) {
        setField(FIELD_KEYS.VALUES, value.lookup_value, sectionIndex, fieldListIndex, fieldIndex);
        setField(FIELD_KEYS.VALUE_META_DATA, { [FIELD_KEYS.CUSTOM_LOOKUP_ID]: value._id }, sectionIndex, fieldListIndex, fieldIndex);
      }
    });
    // setField(FIELD_KEYS.VALUES, lookupValue, sectionIndex, fieldListIndex, fieldIndex);
  };

  const onReferenceNameChangeHandler = (event, sectionIndex, fieldListIndex, fieldIndex) => {
    const { setField, setErrorList, error_list } = props;
    if (error_list && error_list.reference_name) {
      const errorList = { ...error_list };
      jsUtils.unset(errorList, 'reference_name');
      setErrorList(errorList);
    }
    setField(FIELD_KEYS.REFERENCE_NAME, event.target.value, sectionIndex, fieldListIndex, fieldIndex);
  };

  const onRequiredClickHandler = (value, sectionIndex, fieldListIndex, fieldIndex) => {
    const { setField } = props;
    setField(FIELD_KEYS.REQUIRED, null, sectionIndex, fieldListIndex, fieldIndex, true);
  };

  const onReadOnlyClickHandler = (value, sectionIndex, fieldListIndex, fieldIndex) => {
    const { setField } = props;
    setField(FIELD_KEYS.READ_ONLY, null, sectionIndex, fieldListIndex, fieldIndex, true);
    setField(FIELD_KEYS.READ_ONLY_PREVIOUS_STATE, !value, sectionIndex, fieldListIndex, fieldIndex);
  };

  const onDefaultChangeHandler = (event, sectionIndex, fieldListIndex, fieldIndex) => {
    const { state: { sections }, setField, t } = props;
    const field = setDefaultValueForField(
      sections,
      sectionIndex,
      fieldListIndex,
      fieldIndex,
      event,
      t,
    );
    if (field.field_type === FIELD_TYPE.INFORMATION && !field.reference_name && !field.field_name) {
      setField(
        FIELD_KEYS.REFERENCE_NAME,
       'infofield',
        sectionIndex,
        fieldListIndex,
        fieldIndex,
      );
      setField(
        FIELD_KEYS.FIELD_NAME,
       'infofield',
        sectionIndex,
        fieldListIndex,
        fieldIndex,
      );
    }
    setField(FIELD_KEYS.DEFAULT_VALUE, field[FIELD_KEYS.DEFAULT_VALUE], sectionIndex, fieldListIndex, fieldIndex, false, updateSectionsAndCheckError);
  };

  const onUserSelectorDefaultValueChangeHandler = (event, sectionIndex, fieldListIndex, fieldIndex) => {
    const { state: { sections }, setField } = props;
    const field = setUserSelectorDefaultValueConfig(
      sections,
      sectionIndex,
      fieldListIndex,
      fieldIndex,
      event,
    );
    setField(FIELD_KEYS.DEFAULT_VALUE, field[FIELD_KEYS.DEFAULT_VALUE], sectionIndex, fieldListIndex, fieldIndex, false, updateSectionsAndCheckError);
  };

  const onTableValidationConfigChangeHandler = (
    event,
    sectionIndex,
    fieldListIndex,
    fieldIndex,
  ) => {
    const { setFieldListValidation, state: { sections } } = props;
    const field = setValidationConfigForField(
      sections,
      sectionIndex,
      fieldListIndex,
      fieldIndex,
      event,
      true, // isTable param
    );
    console.log('event.target.value onTableValidationConfigChangeHandler', event, field);
    setFieldListValidation(
        event.target.id,
        field,
        sectionIndex,
        fieldListIndex,
        false,
      );
  };

  const onValidationConfigChangeHandler = (event, sectionIndex, fieldListIndex, fieldIndex, t) => {
    const { state: { sections }, setField, setErrorList } = props;
    if (DateValidationOptionListId.includes(jsUtils.get(event, ['target', 'id'], ''))) {
      setErrorList({});
    }
    const field = setValidationConfigForField(
      sections,
      sectionIndex,
      fieldListIndex,
      fieldIndex,
      event,
      false,
      t, // isTable param
    );
    if (event.target.id === 'allowed_maximum' || event.target.id === 'allowed_minimum') {
      if (!rangeContainsZero(field?.validations?.allowed_minimum, field?.validations?.allowed_maximum)) {
        field[FIELD_KEYS.VALIDATIONS] = {
          ...field[FIELD_KEYS.VALIDATIONS],
          dont_allow_zero: true,
        };
      } else delete field[FIELD_KEYS.VALIDATIONS]?.dont_allow_zero;
    }
    setField(FIELD_KEYS.VALIDATIONS, field[FIELD_KEYS.VALIDATIONS], sectionIndex, fieldListIndex, fieldIndex, false, updateSectionsAndCheckError);
  };

  const onAddValues = (event, sectionIndex, fieldListIndex, fieldIndex) => {
    const { state: { sections }, setErrorList, error_list, setEntireField } = props;
    if (jsUtils.has(error_list, `sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},${FIELD_KEYS.VALUES}`)) {
      const errorList = { ...error_list };
      jsUtils.unset(errorList, `sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},${FIELD_KEYS.VALUES}`);
      setErrorList(errorList);
    }
    const newfieldValue = setValuesForField(
      jsUtils.cloneDeep(sections),
      sectionIndex,
      fieldListIndex,
      fieldIndex,
      event.target.value,
    );
    setEntireField(newfieldValue, sectionIndex, fieldListIndex, fieldIndex);
  };

  const onOtherConfigChangeHandler = (event, sectionIndex, fieldListIndex, fieldIndex, t) => {
    const { state: { sections }, setEntireField } = props;
    const field = setOtherConfigDataForField(
      sections,
      sectionIndex,
      fieldListIndex,
      fieldIndex,
      event,
      t,
    );
    setEntireField(field, sectionIndex, fieldListIndex, fieldIndex, updateSectionsAndCheckError);
  };

  const onFieldIsShowWhenRule = (value, sectionIndex, fieldListIndex, fieldIndex, type) => {
    const { setField } = props;
    setField(type, null, sectionIndex, fieldListIndex, fieldIndex, true);
  };

  const onFieldVisibleRule = (value, sectionIndex, fieldListIndex, fieldIndex) => {
    const { setField } = props;
    setField(FIELD_KEYS.IS_VISIBLE, value, sectionIndex, fieldListIndex, fieldIndex, true);
  };

  const onFieldListVisibleChangeHandler = (event, sectionIndex, fieldListIndex) => {
    console.log('onFieldListVisibleChangeHandler', event);
    const { setFieldList } = props;
    setFieldList(FIELD_LIST_KEYS.IS_VISIBLE, event, sectionIndex, fieldListIndex, true);
  };

  const onEditFieldClick = (event, sectionIndex, fieldListIndex, fieldIndex) => {
    const { setField } = props;
    setField(FIELD_KEYS.IS_CONFIG_OPEN, true, sectionIndex, fieldListIndex, fieldIndex);
  };

  const onTableReferenceNameBlurHandler = () => true; // async (event, sectionIndex, fieldListIndex) => {
  //   const { setFieldList, state, dispatch } = props;
  //   const { task_details } = state;
  //   const referenceNameCheckPostData = {
  //     task_metadata_id: task_details._id,
  //     reference_name: event.target.value ? event.target.value.trim() : '',
  //   };
  //   const fieldList = jsUtils.get(state, ['sections', sectionIndex, 'field_list', fieldListIndex]);
  //   // if (fieldList && !jsUtils.isEmpty(event.target.value)) {
  //   //   return dispatch(validateReferenceNameThunk(referenceNameCheckPostData, type, FIELD_LIST_TYPE.TABLE));
  //   // }
  //   return true;
  // };

  const onReferenceNameBlurHandler = async (event, sectionIndex, fieldListIndex, fieldIndex) => {
    const { state, validateReferenceName } = props;
    const { task_details, sections } = state;
    const referenceNameCheckPostData = {
      task_metadata_id: task_details._id,
      reference_name: event.target.value ? event.target.value.trim() : '',
    };
    const fieldId = jsUtils.get(sections, [sectionIndex, 'field_list', fieldListIndex, 'fields', fieldIndex, FIELD_KEYS.FIELD_ID]);
    if (fieldId) {
      referenceNameCheckPostData._id = fieldId;
    }
    if (!jsUtils.isEmpty(event.target.value)) {
      return validateReferenceName(referenceNameCheckPostData, taskType);
    }
    return true;
  };

  const onVisibilityFieldChangeHandler = (event, sectionIndex, fieldListIndex, fieldIndex) => {
    const { setVisibilityFieldValue } = props;
    setVisibilityFieldValue(event.target.id, event.target.value, sectionIndex, fieldListIndex, fieldIndex);
  };

  const onTabChange = async ({ currentIndex, index }, sectionIndex, fieldListIndex, fieldIndex = null) => {
    const { state, setErrorList, datalist_selector_error_list, t } = props;
    if (!jsUtils.isEmpty(datalist_selector_error_list)) return false;
    if (
      [
        FIELD_CONFIGS.BASIC_CONFIG.TAB_INDEX,
        FIELD_CONFIGS.VALIDATION.TAB_INDEX,
        FIELD_CONFIGS.OTHER_SETTINGS.TAB_INDEX,
      ].includes(currentIndex)
    ) {
      const errorList = validate(
        getTaskDetailsValidateData(state),
        state.sections.length === 1 ? taskDetailsValidateSchemaWithOneSection(t) : taskDetailsValidateSchema(t),
      );
      if (!jsUtils.isEmpty(errorList)) {
        setErrorList(errorList);
        return false;
      }
      }

    if (currentIndex === FIELD_CONFIGS.BASIC_CONFIG.TAB_INDEX || currentIndex === FIELD_CONFIGS.VALIDATION.TAB_INDEX) {
      if (jsUtils.isNull(fieldIndex)) {
        const reference_name = jsUtils.get(state, ['sections', sectionIndex, 'field_list', fieldListIndex, 'table_reference_name']);
        const referenceCheck = (event) => onTableReferenceNameBlurHandler(event, sectionIndex, fieldListIndex);
        const status = await referenceCheck({ target: { value: reference_name } });
        if (!status) return false;
      }
    }
    if (currentIndex === FIELD_CONFIGS.OTHER_SETTINGS.TAB_INDEX && fieldIndex !== null) {
      const currentField = jsUtils.get(state, ['sections', sectionIndex, 'field_list', fieldListIndex, 'fields', fieldIndex]);
      const is_advanced_expression = jsUtils.get(
        currentField,
        [FIELD_KEYS.IS_ADVANCED_EXPRESSION],
        false,
        );

      if (currentField[FIELD_KEYS.IS_DEFAULT_VALUE_RULE]) {
        const { setDefaultRuleValue, dispatch } = props;
        jsUtils.unset(currentField, ['draft_default_value', 'errors']);
        const { validation_error: error } = checkForDefaultValueValidation(currentField);
        if (!jsUtils.isEmpty(error)) {
          setDefaultRuleValue(DEFAULT_RULE_KEYS.ERRORS, error, sectionIndex, fieldListIndex, fieldIndex);
          return false;
        }

        let has_error = false;
        if (is_advanced_expression) {
          const formulaCode = jsUtils.get(
            currentField,
            [FIELD_KEYS.DEFAULT_DRAFT_VALUE, DEFAULT_RULE_KEYS.INPUT],
            EMPTY_STRING,
            );
          const { INCORRECT_SYNTAX } = FORMULA_BUILDER(t).VALIDATION.LABEL;
          await dispatch(globalFormulaBuilderEvaluateThunk(formulaCode))
          .then(() => true)
          .catch(({ error }) => {
              if (!jsUtils.isEmpty(error)) {
                has_error = true;
               const serverErrorMessage = jsUtils.get(Object.values(error), [0], EMPTY_STRING);
                const message = serverErrorMessage ? `${INCORRECT_SYNTAX}: ${serverErrorMessage}` : INCORRECT_SYNTAX;
                setDefaultRuleValue(
                  DEFAULT_RULE_KEYS.ERRORS,
                  { [DEFAULT_RULE_KEYS.INPUT]: message },
                  sectionIndex,
                  fieldListIndex,
                  fieldIndex);
              }
            });
          return !has_error;
        }
      }
    }
    if (index === FIELD_CONFIGS.VISIBILITY.TAB_INDEX && !jsUtils.isEmpty(state.task_details)
      && (jsUtils.isEmpty(state.form_details)
        || !state.form_details.sections[sectionIndex]
        || (fieldIndex !== null
          ? !jsUtils.get(state, ['sections', sectionIndex, 'field_list', fieldListIndex, 'fields', fieldIndex, 'field_uuid'])
          : !jsUtils.get(state, ['sections', sectionIndex, 'field_list', fieldListIndex, 'table_uuid'])))) {
      const errorList = validate(
        getTaskDetailsValidateData(state),
        state.sections.length === 1 ? taskDetailsValidateSchemaWithOneSection(t) : taskDetailsValidateSchema(t),
      );
      if (!jsUtils.isEmpty(errorList)) {
        setErrorList(errorList);
        return false;
      }
      if (jsUtils.isEmpty(errorList) && fieldListIndex !== null && fieldIndex === null) {
        const status = onSaveFormField(sectionIndex + 1, fieldListIndex, fieldIndex !== null ? fieldIndex + 1 : null, true);
        if (!status) return false;
      }
    }
    if (currentIndex === FIELD_CONFIGS.VISIBILITY.TAB_INDEX) {
      const { setState } = props;
      const fieldData = fieldIndex !== null ? jsUtils.get(state, ['sections', sectionIndex, 'field_list', fieldListIndex, 'fields', fieldIndex]) : jsUtils.get(state, ['sections', sectionIndex, 'field_list', fieldListIndex]);
      if (fieldIndex !== null ? fieldData[FIELD_KEYS.IS_SHOW_WHEN_RULE] : fieldData[FIELD_LIST_KEYS.IS_FIELD_LIST_SHOW_WHEN_RULE]) {
        const { allSections: validatedSections, has_validation } = validateExpressionAndUpdateField(
                  fieldData,
                  sectionIndex,
                  fieldListIndex,
                  fieldIndex,
                  jsUtils.isNull(fieldIndex),
                  jsUtils.cloneDeep(jsUtils.get(state, ['sections'], [])),
         );
      setState({
        sections: validatedSections,
      });
      if (has_validation) return false;
      }
    }
    return true;
  };

  // Default Rule Value

  const onDefaultValueCalculationTypeHandler = (sectionIndex, fieldListIndex, fieldIndex, value = false) => {
    const { setField } = props;
    // if (!value) value = OTHER_CONFIG_STRINGS.DEFAULT_CALCULATION.TYPE.BASIC;
    setField(FIELD_KEYS.DEFAULT_DRAFT_VALUE, {}, sectionIndex, fieldListIndex, fieldIndex);
    setField(FIELD_KEYS.PREVIOUS_DRAFT_DRAFT_RULE, {}, sectionIndex, fieldListIndex, fieldIndex);
    setField(FIELD_KEYS.IS_ADVANCED_EXPRESSION, value, sectionIndex, fieldListIndex, fieldIndex);
  };

  const onDefaultValueRuleHandler = (sectionIndex, fieldListIndex, fieldIndex) => {
    const { setField, state } = props;
    const { sections } = state;
    setField(FIELD_KEYS.IS_DEFAULT_VALUE_RULE, null, sectionIndex, fieldListIndex, fieldIndex, true);

    let is_advanced_expression = false;
    if (
      [FIELD_TYPE.DATE, FIELD_TYPE.DATETIME].includes(
      jsUtils.get(sections, [sectionIndex, 'field_list', fieldListIndex, 'fields', fieldIndex, 'field_type'], null))
    ) is_advanced_expression = true;
    onDefaultValueCalculationTypeHandler(sectionIndex, fieldListIndex, fieldIndex, is_advanced_expression);
    // const { state, setField } = props;
    // const fieldId = getFieldValueFromState(state, sectionIndex, fieldListIndex, fieldIndex, 'field_id');
    // if (fieldId) {
    //   return setField(FIELD_KEYS.IS_DEFAULT_VALUE_RULE, null, sectionIndex, fieldListIndex, fieldIndex, true);
    // }
    // onSaveFormField(sectionIndex + 1, fieldListIndex, fieldIndex + 1, true).then((status) => {
    //   if (status) {
    //     setField(FIELD_KEYS.IS_DEFAULT_VALUE_RULE, null, sectionIndex, fieldListIndex, fieldIndex, true);
    //     // setField(FIELD_KEYS.IS_CONFIG_OPEN, true, sectionIndex, fieldListIndex, fieldIndex);
    //   } else {
    //     setField(FIELD_KEYS.IS_CONFIG_OPEN, true, sectionIndex, fieldListIndex, fieldIndex);
    //   }
    // });
    // return null;
  };

  const onDefaultRuleAdvanceCodeInputHandler = (sectionIndex, fieldListIndex, fieldIndex, code, isInitial = false) => {
    const { setDefaultRuleValue } = props;
    setDefaultRuleValue(DEFAULT_RULE_KEYS.INPUT, code, sectionIndex, fieldListIndex, fieldIndex, false, isInitial);
  };

  const onDefaultRuleAdvanceCodeErrortHandler = (sectionIndex, fieldListIndex, fieldIndex, error = null) => {
    const { setDefaultRuleValue } = props;
    const errorObj = (error) ? { [DEFAULT_RULE_KEYS.INPUT]: error } : null;
    setDefaultRuleValue(DEFAULT_RULE_KEYS.ERRORS, errorObj, sectionIndex, fieldListIndex, fieldIndex);
  };

  const onDefaultRuleOperatorDropdownHandler = (value, operatorInfo, sectionIndex, fieldListIndex, fieldIndex) => {
    const { setField } = props;
    setField(FIELD_KEYS.DEFAULT_DRAFT_VALUE, { operator: value, operatorInfo }, sectionIndex, fieldListIndex, fieldIndex);
  };

  const onDefaultRuleOperatorInfoHandler = (value, sectionIndex, fieldListIndex, fieldIndex) => {
    const { setDefaultRuleValue } = props;
    setDefaultRuleValue(DEFAULT_RULE_KEYS.OPERATOR_INFO, { ...value }, sectionIndex, fieldListIndex, fieldIndex);
    setDefaultRuleValue(DEFAULT_RULE_KEYS.ERRORS, null, sectionIndex, fieldListIndex, fieldIndex);
  };

  const onDefaultLValueRuleHandler = (fieldList, sectionIndex, fieldListIndex, fieldIndex) => {
    const { setDefaultRuleValue } = props;
    setDefaultRuleValue(DEFAULT_RULE_KEYS.L_VALUE, fieldList, sectionIndex, fieldListIndex, fieldIndex);
    setDefaultRuleValue(DEFAULT_RULE_KEYS.ERRORS, null, sectionIndex, fieldListIndex, fieldIndex);
  };

  const onDefaultRValueRuleHandler = (valueList, sectionIndex, fieldListIndex, fieldIndex) => {
    const { setDefaultRuleValue } = props;
    setDefaultRuleValue(DEFAULT_RULE_KEYS.R_VALUE, valueList, sectionIndex, fieldListIndex, fieldIndex);
    setDefaultRuleValue(DEFAULT_RULE_KEYS.ERRORS, null, sectionIndex, fieldListIndex, fieldIndex);
  };

  const onDefaultExtraOptionsRuleHandler = (extraOptions, sectionIndex, fieldListIndex, fieldIndex, isInitial = false) => {
    const { setDefaultRuleValue } = props;
    setDefaultRuleValue(DEFAULT_RULE_KEYS.EXTRA_OPTIONS, extraOptions, sectionIndex, fieldListIndex, fieldIndex, false, isInitial);
    setDefaultRuleValue(DEFAULT_RULE_KEYS.ERRORS, null, sectionIndex, fieldListIndex, fieldIndex);
  };

  const onAddFormFieldHandler = (addFormFieldSource, fieldType, sectionIndex, fieldListIndex, fieldIndex) => {
    const { setState, setSection, state: { sections, field_type_data }, state } = props;
    const initialTaskLabelName = state.initialTaskLabel;
    const values = field_type_data && field_type_data.data && field_type_data.data.options && field_type_data.data.options.toString();
    const newFieldList = addNewFormFieldAndGetUpdatedFieldList(undefined, sections, addFormFieldSource, fieldType, sectionIndex, fieldListIndex, fieldIndex, undefined, initialTaskLabelName, values);
    setSection(SECTION_KEYS.FIELD_LIST, newFieldList, sectionIndex);
    setState({
      error_list: {},
      // server_error: {},
      disableFieldTypeSuggestion: false,
      initialTaskLabel: EMPTY_STRING,
      field_type_data: [],
    });
  };

  const onTaskDetailsChangeHandler = (event) => {
    const { setState, state } = props;
    let { error_list } = jsUtils.cloneDeep(state);
    error_list = getErrorMessageForTaskDetails(error_list, event.target.id, event.target.value);
    setState({
      [event.target.id]: event.target.value,
      error_list,
    });
  };

  const onTaskTypeChangeHandler = (value) => {
    const { setState } = props;
    setState({
      is_assign_to_individual_assignees: value,
    });
  };

/**
 * @param   {Object}  event object
 * @param   {string}  uuid datalist uuid/ flow uuid
 * @param   {string}  entryId datalist entry id/ flow instance id
 * @param   {string}  parent task/flow/datalist
 */

 const onTaskNameBlurHandler = (event, uuid = null, entryId = null, parent = 'task') => {
  const { dispatch, state } = props;
  const postData = {
    text: `${event.target.value} ${state.task_description}`,
    query_all_users: 1,
    is_team_included: 1,
  };
  if (!jsUtils.isNull(uuid) && !jsUtils.isNull(entryId) && parent !== 'task') {
    if (parent === 'datalist') {
      postData.data_list_uuid = uuid;
      postData.data_list_entry_id = entryId;
    }
    if (parent === 'flow') {
      postData.flow_uuid = uuid;
      postData.instance_id = entryId;
    }
  }
  dispatch(assigneeSuggestionApiStarted());
  getTaskAssigneeSuggestion(postData)
    .then((res) => {
      if (res) {
        dispatch(createTaskSetState({ isAssigneeSuggestionLoading: false, suggestedTaskAssignee: res }));
      }
    }).catch((error) => {
      dispatch(createTaskSetState({ isAssigneeSuggestionLoading: false }));
      console.log('onTaskNameBlurHandler ml api catch block error', error);
    });
};

  const onFormFieldOpenAndCloseHandler = (
action,
configType,
    fieldListType,
    sectionIndex,
    fieldListIndex,
    fieldIndex,
) => {
    const {
      setSection, setField, setFieldList, state: { form_details, sections }, setState, setDataListSelectorErrorList,
    } = props;
    setState({
      isFieldSuggestionEnabled: false,
      disableFieldTypeSuggestion: false,
      initialTaskLabel: EMPTY_STRING,
      field_type_data: [],
      error_list: {},
    });
    if (action === FORM_FIELD_CONFIG_ACTIONS.CLOSE) {
      setDataListSelectorErrorList({});
      const updatedAllFieldList = closeFieldOrFieldListConfigAndGetUpdatedFieldList(
sections,
configType,
fieldListType,
sectionIndex,
fieldListIndex,
fieldIndex,
form_details,
);
      setSection(SECTION_KEYS.FIELD_LIST, updatedAllFieldList, sectionIndex);
    } else if (action === FORM_FIELD_CONFIG_ACTIONS.OPEN) {
      if (configType === FORM_FIELD_CONFIG_TYPES.FIELD) {
        setField(FIELD_KEYS.IS_CONFIG_OPEN, true, sectionIndex, fieldListIndex, fieldIndex);
      } else if (configType === FORM_FIELD_CONFIG_TYPES.FIELD_LIST) {
        setFieldList(FIELD_LIST_KEYS.IS_FIELD_LIST_CONFIG_POPUP_OPEN, true, sectionIndex, fieldListIndex);
      }
    }
  };

  const onAddedSectionTitleChangeHandler = (event, sectionId) => {
    const { setSection } = props;
    setSection(SECTION_KEYS.SECTION_NAME, jsUtils.get(event, 'target.value'), sectionId - 1);
  };

  const setMemberOrTeamSearchValue = (event) => {
    const { setState } = props;
    setState({
      member_team_search_value: event.target.value,
    });
  };

  const setErrorMessage = (errorObject) => {
    const { state, setErrorList } = props;
    const { error_list } = state;
    const mergedErrorList = jsUtils.cleanObject({ ...error_list, ...errorObject });
    if (!jsUtils.isEmpty(mergedErrorList)) setErrorList(mergedErrorList);
  };

  const removeTaskReferenceDocument = (id) => {
    const { setState, removed_doc_list, files } = props;
    const updatedTaskReferenceDocumentList = [];
    setState({ removed_doc_list: [...removed_doc_list, id] });
    files.forEach((file) => {
      console.log('removeTaskReferenceDocument inside', id, file);
      if (file.id !== id) updatedTaskReferenceDocumentList.push(file);
    });
    setState({ files: updatedTaskReferenceDocumentList });
  };

  const onTableValidationControlModalChangeHandler = (isOpen, sectionIndex, fieldListIndex) => {
    const { setFieldList } = props;
    setFieldList(
      FIELD_LIST_KEYS.SHOW_TABLE_VALIDATION_MODAL,
      isOpen,
      sectionIndex,
      fieldListIndex,
    );
  };

  const onFormFieldChangeHandler = (type, event, sectionIndex, fieldListIndex, fieldIndex, t) => {
    const { setState } = props;
    if (type === FIELD_KEYS.FIELD_NAME) {
      console.log('no changes');
    } else {
      setState({
        isFieldSuggestionEnabled: false,
        disableFieldTypeSuggestion: true,
        initialTaskLabel: EMPTY_STRING,
      });
    }
    // const { state } = props;
    switch (type) {
      case FIELD_LIST_KEYS.TABLE_NAME:
        return onTableNameChangeHandler(event, sectionIndex, fieldListIndex);
      case FIELD_LIST_KEYS.TABLE_REF_NAME:
        return onTableReferenceNameChangeHandler(event, sectionIndex, fieldListIndex);
      case FIELD_LIST_KEYS.IS_FIELD_LIST_SHOW_WHEN_RULE:
        return onFieldListShowWhenRuleChangeHandler(event, sectionIndex, fieldListIndex);
      case FIELD_KEYS.FIELD_NAME:
        return onLabelChangeHandler(event, sectionIndex, fieldListIndex, fieldIndex);
      case FIELD_KEYS.SELECT_LOOKUP_FIELD:
        return onLookupFieldChangeHandler(event, sectionIndex, fieldListIndex, fieldIndex);
      case FIELD_KEYS.REFERENCE_NAME:
        return onReferenceNameChangeHandler(event, sectionIndex, fieldListIndex, fieldIndex);
      case FIELD_KEYS.REQUIRED:
        return onRequiredClickHandler(event, sectionIndex, fieldListIndex, fieldIndex);
      case FIELD_KEYS.READ_ONLY:
        return onReadOnlyClickHandler(event, sectionIndex, fieldListIndex, fieldIndex);
      case FIELD_KEYS.DEFAULT_VALUE:
        return onDefaultChangeHandler(event, sectionIndex, fieldListIndex, fieldIndex);
      case FIELD_KEYS.VALIDATIONS:
      case FIELD_LIST_KEYS.VALIDATIONS:
        return !jsUtils.isUndefined(fieldIndex) ?
        onValidationConfigChangeHandler(event, sectionIndex, fieldListIndex, fieldIndex, t) :
        onTableValidationConfigChangeHandler(
          event,
          sectionIndex,
          fieldListIndex,
          fieldIndex,
          true,
        );
      case FIELD_KEYS.VALUES:
        return onAddValues(event, sectionIndex, fieldListIndex, fieldIndex);
      case FIELD_KEYS.OTHER_CONFIG:
        return onOtherConfigChangeHandler(event, sectionIndex, fieldListIndex, fieldIndex, t);
      case FIELD_KEYS.IS_SHOW_WHEN_RULE:
      case FIELD_KEYS.HIDE_FIELD_IF_NULL:
        return onFieldIsShowWhenRule(event, sectionIndex, fieldListIndex, fieldIndex, type);
      case FIELD_KEYS.IS_VISIBLE:
        return jsUtils.isUndefined(fieldIndex) ?
          onFieldListVisibleChangeHandler(event, sectionIndex, fieldListIndex) : onFieldVisibleRule(event, sectionIndex, fieldListIndex, fieldIndex);
      case FORM_FIELD_CONFIG_ACTIONS.EDIT:
        return onEditFieldClick(event, sectionIndex, fieldListIndex, fieldIndex);
      case FORM_FIELD_CONFIG_ACTIONS.TAB_SWITCH:
        if (taskType === 'task') {
          return onTabChangeFromProps(event, sectionIndex, fieldListIndex, fieldIndex);
        } else {
          return onTabChange(event, sectionIndex, fieldListIndex, fieldIndex);
        }
      case FIELD_KEYS.DATA_LIST:
        return onDataListChangeHandler(event, sectionIndex, fieldListIndex, fieldIndex);
      case FIELD_KEYS.DATA_liST_SELECTOR_ERROR:
        return onSetDataListSelectorErrorList(event);
      case VISIBILITY_CONFIG_CHANGE.FIELD:
      case VISIBILITY_CONFIG_CHANGE.FIELD_LIST:
        return onVisibilityFieldChangeHandler(event, sectionIndex, fieldListIndex, fieldIndex);
      case FIELD_KEYS.PROPERTY_PICKER_DETAILS:
          return onDataListPropertyPickerChangeHandler(
            event,
            sectionIndex,
            fieldListIndex,
            fieldIndex,
            );
      case FIELD_KEYS.DATA_LIST_PROPERTY_PICKER_ERROR:
        return onSetDataListPropertyPickerErrorList(event);
      case FIELD_LIST_KEYS.SHOW_TABLE_VALIDATION_MODAL:
        return onTableValidationControlModalChangeHandler(event, sectionIndex, fieldListIndex);
      default:
        return null;
    }
  };

  const saveFormCallback = (sections, form_details) => {
    const { state, saveFormApiCall } = props;
    try {
      if (isSectionNameChanged(sections, form_details)) {
        const formData = {
          data: getTaskDetailsAPIData({
            ...state,
            sections,
            form_details,
          }),
        };
        saveFormApiCall(formData);
      }
    } catch (e) {
      console.log('error', e);
    }
  };

  return {
    onFormFieldChangeHandler,
    onTableNameChangeHandler,
    onTableNameBlurHandler,
    onTableReferenceNameChangeHandler,
    onReferenceNameBlurHandler,
    updateSectionsAndCheckError,
    onDefaultValueRuleHandler,
    onDefaultRuleOperatorDropdownHandler,
    onDefaultRuleOperatorInfoHandler,
    onDefaultLValueRuleHandler,
    onDefaultRValueRuleHandler,
    onDefaultExtraOptionsRuleHandler,
    onLabelBlurHandler,
    onAddFormFieldHandler,
    teamOrUserSelectHandler,
    teamOrUserRemoveHandler,
    assigneeListUpdateHandler,
    onDueDateChangeHandler,
    onAddValues,
    onTaskDetailsChangeHandler,
    onTaskTypeChangeHandler,
    onTaskNameBlurHandler,
    onVisibilityFieldChangeHandler,
    onOtherConfigChangeHandler,
    onValidationConfigChangeHandler,
    onReadOnlyClickHandler,
    onRequiredClickHandler,
    onLabelChangeHandler,
    onLookupFieldChangeHandler,
    onReferenceNameChangeHandler,
    onFormFieldOpenAndCloseHandler,
    onAddedSectionTitleChangeHandler,
    onDefaultChangeHandler,
    setMemberOrTeamSearchValue,
    setErrorMessage,
    onDataListChangeHandler,
    removeTaskReferenceDocument,
    onTableValidationConfigChangeHandler,
    onDataListPropertyPickerChangeHandler,
    onDefaultValueCalculationTypeHandler,
    onDefaultRuleAdvanceCodeInputHandler,
    onDefaultRuleAdvanceCodeErrortHandler,
    saveFormCallback,
    onUserSelectorDefaultValueChangeHandler,
  };
}

export default useCreateTask;
