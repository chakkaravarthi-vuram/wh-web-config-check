import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { FLOW_CONFIG_STRINGS, FLOW_STRINGS, STEP_CARD_STRINGS, SuggestionTabs } from 'containers/edit_flow/EditFlow.strings';
import { fieldSuggestionDataChange } from 'redux/actions/FieldSuggestion.Action';
import { createTaskSetState } from 'redux/reducer/CreateTaskReducer';
import {
  toggleStepInfo,
  updateFlowDataChange,
  updateFlowStateChange,
} from 'redux/reducer/EditFlowReducer';
import {
  ADD_FORM_FIELD_SOURCE,
  GET_SECTION_INITIAL_DATA,
  SECTION_KEYS,
} from 'utils/constants/form.constant';
import * as formBuilderUtils from 'utils/formUtils';
import jsUtility, { cloneDeep, isEmpty, find, isNull, isUndefined } from 'utils/jsUtility';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import gClasses from 'scss/Typography.module.scss';
import DoubleArrowIcon from 'assets/icons/flow/DoubleArrowIcon';
import { BS } from 'utils/UIConstants';
import Tab, { TAB_TYPE } from 'components/tab/Tab';
import NoFormFieldIcon from 'assets/icons/parallel_flow/NoFormFieldIcon';
// import fieldSuggestions from './TempUtils';
import { ADDITIONAL_CONFIG_STATIC_INFO, STATIC_INFO_TITLE_STRINGS, STEP_CONFIG_STATIC_INFO } from '../../StepConfiguration.utils';
import styles from './StepInfo.module.scss';

function StepInfo(props) {
  const { t } = useTranslation();
  const {
    taskState,
    setState,
    fieldSuggestionsData,
    sections,
    fieldSuggestionDataChange,
    setFlowData,
    setCreateFlowData,
    currentProgressStep,
    isStepInfoVisible,
    toggleFunction,
    isNavOpen,
  } = cloneDeep(props);
  const {
    show_all_suggestions,
    is_data_loading,
  } = fieldSuggestionsData;
  const [isSuggestionSelected, setisSuggestionSelected] = useState(false);
  const [, setShowFieldSuggestionComponent] = useState(true);
  const { STATIC_STEP_INFO } = FLOW_CONFIG_STRINGS;

  useEffect(() => {
    const { fieldSuggestionsData, sectionIndex } = props;
    if (!find(fieldSuggestionsData.fieldSuggestionSectionIndex, { fieldSuggestionIndex: sectionIndex })) {
      if (sectionIndex >= 0) {
        fieldSuggestionsData.fieldSuggestionSectionIndex.push({
          fieldSuggestionIndex: sectionIndex,
        });
        fieldSuggestionDataChange(fieldSuggestionsData);
      }
    }

    if (fieldSuggestionsData && fieldSuggestionsData.fieldSuggestionSectionIndex && fieldSuggestionsData.fieldSuggestionSectionIndex[sectionIndex]) {
      if (isUndefined(fieldSuggestionsData.fieldSuggestionSectionIndex[sectionIndex].isShowFieldSuggestion) || (fieldSuggestionsData.fieldSuggestionSectionIndex[sectionIndex].isShowFieldSuggestion)) {
        setShowFieldSuggestionComponent(true);
      } else {
        setShowFieldSuggestionComponent(false);
      }
    }
  }, []);

  const sectionLength = sections ? sections.length - 1 : 0;
  const { FORMS, BASIC_INFO_AND_ACTORS, CONFIGURATION } = FLOW_STRINGS.STEPS.STEP;

  const onAddFormFieldHandler = (
    addFormFieldSource,
    fieldType,
    sectionIndex,
    fieldListIndex,
    fieldIndex,
  ) => {
    try {
      const currentSectionIndex = sectionIndex >= 0 ? sectionIndex : 0;
      if (isEmpty(sections)) {
        sections.push(GET_SECTION_INITIAL_DATA());
      }
      const initialTaskLabelName = taskState.initialTaskLabel;
      const { field_type_data } = taskState;
      const values =
        field_type_data &&
        field_type_data.data &&
        field_type_data.data.options &&
        field_type_data.data.options.toString();

      const newFieldList =
        formBuilderUtils.addNewFormFieldAndGetUpdatedFieldList(
          fieldSuggestionsData,
          sections,
          addFormFieldSource,
          fieldType,
          currentSectionIndex,
          fieldListIndex,
          fieldIndex,
          undefined,
          initialTaskLabelName,
          values,
        );
      sections[currentSectionIndex] = {
        ...sections[currentSectionIndex],
        [SECTION_KEYS.FIELD_LIST]: newFieldList,
      };
      setFlowData({
        sections,
      });
      // setSection(SECTION_KEYS.FIELD_LIST, newFieldList, sectionIndex);
      fieldSuggestionDataChange({ selected_field_index: null });
      setFlowData({ error_list: {} });
      setCreateFlowData({ server_error: {} });
      setState({
        disableFieldTypeSuggestion: false,
        initialTaskLabel: EMPTY_STRING,
        field_type_data: [],
      });
    } catch (error) {
      console.log(error);
    }
    return null;
  };

  const fieldListIndex = null;
  const fieldsLength = null;
  const iconTitle = isStepInfoVisible ? t(STATIC_STEP_INFO.HIDE_INFO) : t(STATIC_STEP_INFO.SHOW_INFO);

  useEffect(() => {
    const { fieldSuggestionsData } = props;
    const { selected_field_index } = fieldSuggestionsData;

    if (!isNull(selected_field_index) && isSuggestionSelected && currentProgressStep === 1) {
        onAddFormFieldHandler(
          ADD_FORM_FIELD_SOURCE.SECTION,
          fieldSuggestionsData.field_suggestions[selected_field_index].field_type,
          sectionLength,
          fieldListIndex,
          fieldsLength,
        );
      setisSuggestionSelected(false);
    }
  }, [fieldSuggestionsData, isSuggestionSelected, currentProgressStep]);

  const noDataFound = (
    <div className={cx(styles.NoDataFound, gClasses.CenterVH)}>
      <div>
        <div className={gClasses.CenterH}>
          <NoFormFieldIcon />
        </div>
        <div className={cx(gClasses.ModalHeader, BS.TEXT_CENTER, gClasses.MT10)}>
          {STEP_CARD_STRINGS(t).NO_SUGGESTION_FOUND}
        </div>
      </div>
    </div>
  );

  const setFieldData = async (index) => {
    console.log('setfield data');
    fieldSuggestionDataChange({ selected_field_index: index });
    setisSuggestionSelected(true);
  };

  let fieldsLists = null;
  const INITIAL_FIELD_COUNT = 5;
  const showFieldSuggestion =
    fieldSuggestionsData &&
    fieldSuggestionsData.field_suggestions &&
    fieldSuggestionsData.field_suggestions.length > 0;
    if (showFieldSuggestion) {
      const suggestions_count = fieldSuggestionsData.field_suggestions.length;
      let dataRange = suggestions_count;

      if (!show_all_suggestions) {
        dataRange =
          suggestions_count < INITIAL_FIELD_COUNT
            ? suggestions_count
            : INITIAL_FIELD_COUNT;
      }

      fieldsLists = fieldSuggestionsData.field_suggestions
        .slice(0, dataRange)
        .map((field, index) => (
          <button
            className={cx(
              gClasses.ClickableElement,
              gClasses.CursorPointer,
            )}
            onClick={() => setFieldData(index)}
          >
            <div className={cx(styles.FieldContainer, isNavOpen && styles.FieldCardWidth)}>
              <div
              className={cx(styles.FieldLabel, gClasses.Ellipsis)}
              title={field.field_name}
              >
                {field.field_name}
              </div>
              <div className={gClasses.FTwo12GrayV9}>{jsUtility.capitalizeFirstLetter(field.field_type)}</div>
            </div>
          </button>
        ));
    }

  const headerClass = isStepInfoVisible ? styles.Header : styles.MinimizedHeader;
  let headerTitle = null;
  let tabList = null;
  let mainContent = null;
  let stepConfigInfo = null;
  let stepInfoFields = null;

  switch (currentProgressStep) {
    case FORMS.INDEX:
      headerTitle = STEP_CARD_STRINGS(t).ADD_FORM_FIELDS;
      tabList = isStepInfoVisible &&
        <Tab className={gClasses.MT17} tabIList={SuggestionTabs(t)} type={TAB_TYPE.TYPE_5} selectedIndex={SuggestionTabs(t)[0].INDEX} />;

      mainContent = !is_data_loading && (
        !isEmpty(fieldsLists) ? (
          <div className={styles.FieldCards}>
            {fieldsLists}
          </div>)
        : noDataFound
      );
      break;
    case BASIC_INFO_AND_ACTORS.INDEX: {
      headerTitle = t(STATIC_INFO_TITLE_STRINGS.STEP_CONFIG);
      stepInfoFields = STEP_CONFIG_STATIC_INFO(t);
      stepConfigInfo = stepInfoFields.map((field) => (
        <div className={styles.StepInfoField}>
          <div className={cx(gClasses.FieldName, gClasses.MB5)}>
            {field.title}
          </div>
          <div className={gClasses.FTwo13GrayV3}>
            {field.description}
          </div>
        </div>
      ));
      mainContent = (
        <div className={styles.StepConfigInfo}>
          {stepConfigInfo}
        </div>
      );
      break;
    }
    case CONFIGURATION.INDEX: {
      headerTitle = t(STATIC_INFO_TITLE_STRINGS.ADDITIONAL_CONFIG);
      stepInfoFields = ADDITIONAL_CONFIG_STATIC_INFO(t);
      stepConfigInfo = stepInfoFields.map((field) => (
        <div className={styles.StepInfoField}>
          <div className={cx(gClasses.FieldName, gClasses.MB5)}>
            {field.title}
          </div>
          <div className={gClasses.FTwo13GrayV3}>
            {field.description}
          </div>
        </div>
      ));
      mainContent = (
        <div className={styles.StepConfigInfo}>
          {stepConfigInfo}
        </div>
      );
      break;
    }
    default:
      mainContent = <div />;
      break;
  }

  return (
    <>
      <div className={headerClass}>
        <div className={cx(BS.D_FLEX, isStepInfoVisible ? BS.JC_BETWEEN : BS.JC_CENTER, BS.ALIGN_ITEM_CENTER)}>
          {console.log('header titleeee2', headerTitle)}
          {isStepInfoVisible ?
            <div className={gClasses.ModalHeader}>
              {headerTitle}
            </div>
          : null}
          <DoubleArrowIcon onClick={toggleFunction} title={iconTitle} className={cx(styles.ArrowIcon, !isStepInfoVisible && styles.rotate)} />
        </div>
        {tabList}
      </div>
      {isStepInfoVisible ? mainContent
      : null}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    taskState: state.CreateTaskReducer,
    fieldSuggestionsData: state.FieldSuggestionReducer,
    sections: state.EditFlowReducer.flowData.sections,
    isStepInfoVisible: state.EditFlowReducer.isStepInfoVisible,
    isNavOpen: state.NavBarReducer.isNavOpen,
  };
};

const mapDispatchToProps = {
  setState: createTaskSetState,
  fieldSuggestionDataChange: fieldSuggestionDataChange,
  setFlowData: updateFlowDataChange,
  setCreateFlowData: updateFlowStateChange,
  toggleFunction: toggleStepInfo,
};

export default connect(mapStateToProps, mapDispatchToProps)(StepInfo);
