import React, { useState, useEffect } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import Tab, { TAB_TYPE } from 'components/tab/Tab';
import jsUtility, { find, isEmpty, isNull, isUndefined } from 'utils/jsUtility';
import { SuggestionTabs } from 'containers/edit_flow/EditFlow.strings';
import gClasses from 'scss/Typography.module.scss';
import { fieldSuggestionDataChange } from 'redux/actions/FieldSuggestion.Action';
import NoFormFieldIcon from 'assets/icons/parallel_flow/NoFormFieldIcon';
import { BS } from 'utils/UIConstants';
import { useTranslation } from 'react-i18next';
import styles from './DesignFormInfo.module.scss';

function DesignFormInfo(props) {
  const { fieldSuggestionsData, isNavOpen } = props;
  const {
    show_all_suggestions,
    is_data_loading,
  } = fieldSuggestionsData;
  const { t } = useTranslation();
  const [isSuggestionSelected, setisSuggestionSelected] = useState(false);
  const [, setShowFieldSuggestionComponent] = useState(true);

  useEffect(() => {
    const { getInputId, fieldSuggestionsData } = props;
    const { selected_field_index } = fieldSuggestionsData;

    if (!isNull(selected_field_index) && isSuggestionSelected) {
      getInputId(
        fieldSuggestionsData.field_suggestions[selected_field_index].field_type,
      );
      setisSuggestionSelected(false);
    }
  }, [fieldSuggestionsData, isSuggestionSelected]);

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

  const setFieldData = async (index) => {
    const { dispatch } = props;
    dispatch(fieldSuggestionDataChange({ selected_field_index: index }));
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
            styles.ContextFieldContainer,
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

  const noDataFound = (
    <div className={cx(styles.NoDataFound, gClasses.CenterVH)}>
      <div>
        <div className={gClasses.CenterH}>
          <NoFormFieldIcon />
        </div>
        <div className={cx(gClasses.ModalHeader, BS.TEXT_CENTER, gClasses.MT10)}>
          No Field Suggestions Found
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className={styles.Header}>
        <div className={gClasses.ModalHeader}>
          Add Form Field
        </div>
        <Tab className={gClasses.MT10} tabIList={SuggestionTabs(t)} type={TAB_TYPE.TYPE_5} selectedIndex={SuggestionTabs(t)[0].INDEX} />
      </div>
      {!is_data_loading && (
        !isEmpty(fieldsLists) ? (
          <div className={styles.FieldCards}>
            {fieldsLists}
          </div>)
        : noDataFound
      )}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    isNavOpen: state.NavBarReducer.isNavOpen,
    fieldSuggestionsData: state.FieldSuggestionReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DesignFormInfo);
