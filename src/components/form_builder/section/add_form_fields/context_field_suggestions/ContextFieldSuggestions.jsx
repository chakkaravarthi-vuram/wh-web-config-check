import React, { useEffect, useContext, useState } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { isNull } from 'lodash';

import { useTranslation } from 'react-i18next';
import gClasses from '../../../../../scss/Typography.module.scss';
import { BS } from '../../../../../utils/UIConstants';
import { FLOW_STRINGS } from '../../../../../containers/flow/Flow.strings';
import { FF_DROPDOWN_LIST } from '../../../FormBuilder.strings';
import { fieldSuggestionDataChange } from '../../../../../redux/actions/FieldSuggestion.Action';
import ThemeContext from '../../../../../hoc/ThemeContext';
import styles from './contextFieldSuggestion.module.scss';
import jsUtils from '../../../../../utils/jsUtility';

function ContextFieldSuggestions(props) {
  const { t } = useTranslation();
  const {
    TITLE,
    DESC,
    HIDE,
    UNHIDE,
  } = FLOW_STRINGS(t).CREATE_FLOW.STEPS.STEP.FORMS.FIELD_SUGGESTIONS;
  const { buttonColor } = useContext(ThemeContext);
  const { fieldSuggestionsData } = props;
  const [isSuggestionSelected, setisSuggestionSelected] = useState(false);
const [showFieldSuggestionComponent, setShowFieldSuggestionComponent] = useState(true);
  const {
    show_all_suggestions,
  } = fieldSuggestionsData;
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
  if (!jsUtils.find(fieldSuggestionsData.fieldSuggestionSectionIndex, { fieldSuggestionIndex: sectionIndex })) {
    if (sectionIndex >= 0) {
      fieldSuggestionsData.fieldSuggestionSectionIndex.push({
        fieldSuggestionIndex: sectionIndex,
      });
      fieldSuggestionDataChange(fieldSuggestionsData);
    }
  }

  if (fieldSuggestionsData && fieldSuggestionsData.fieldSuggestionSectionIndex && fieldSuggestionsData.fieldSuggestionSectionIndex[sectionIndex]) {
    if (jsUtils.isUndefined(fieldSuggestionsData.fieldSuggestionSectionIndex[sectionIndex].isShowFieldSuggestion) || (fieldSuggestionsData.fieldSuggestionSectionIndex[sectionIndex].isShowFieldSuggestion)) {
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

  const hideContextFieldSuggestions = () => {
    const { sectionIndex, dispatch } = props;
    setShowFieldSuggestionComponent(!showFieldSuggestionComponent);
    if (fieldSuggestionsData && fieldSuggestionsData.fieldSuggestionSectionIndex) {
      const indexOfObject = fieldSuggestionsData.fieldSuggestionSectionIndex.findIndex((object) => object.fieldSuggestionIndex === sectionIndex);
      if (indexOfObject >= 0) {
      fieldSuggestionsData.fieldSuggestionSectionIndex[indexOfObject].isShowFieldSuggestion = !showFieldSuggestionComponent;
      }
    }
    dispatch(
      fieldSuggestionDataChange(fieldSuggestionsData),
    );
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
      console.log('dataRange', dataRange, show_all_suggestions);
      dataRange =
        suggestions_count < INITIAL_FIELD_COUNT
          ? suggestions_count
          : INITIAL_FIELD_COUNT;
    }

    fieldsLists = fieldSuggestionsData.field_suggestions
      .slice(0, dataRange)
      .map((field, index) => {
        const fieldTitle = FF_DROPDOWN_LIST(t).find(
          (fieldObj) => fieldObj.ID === field.field_type,
        ) || {
          TITLE: 'Add column',
        };

        return (
          <button
            className={cx(
              styles.ContextFieldContainer,
              gClasses.ClickableElement,
              gClasses.CursorPointer,
              gClasses.MB15,
            )}
            onClick={() => setFieldData(index)}
          >
            <div className={cx(gClasses.FOne13GrayV14, styles.LableClass, gClasses.Ellipsis)}>{field.field_name}</div>
            <div className={cx(gClasses.FOne12GrayV6, styles.FieldTypeClass, gClasses.Ellipsis)}>
              {fieldTitle.TITLE}
            </div>
          </button>
        );
      });
    // fieldsLists.push(showMoreButton);
  }

  return (
    showFieldSuggestion &&
     (
      <>
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
          <div
            className={cx(
              gClasses.FTwo14GrayV3,
              gClasses.FontWeight500,
              styles.TitleCalss,
            )}
          >
            {(showFieldSuggestionComponent) ? TITLE : null }
          </div>
          <button
            style={{ color: buttonColor }}
            className={cx(
              gClasses.FOne13,
              gClasses.ClickableElement,
              gClasses.CursorPointer,
              styles.HideTextClass,
            )}
            onClick={hideContextFieldSuggestions}
          >
            {(showFieldSuggestionComponent) ? HIDE : UNHIDE}
          </button>
        </div>
        <div
          className={cx(
            gClasses.FOne13GrayV6,
            gClasses.TextAlignJustify,
            gClasses.MT2,
          )}
        >
          {(showFieldSuggestionComponent) ? DESC : null }
        </div>
        <div className={cx(BS.D_FLEX, BS.FLEX_WRAP_WRAP, gClasses.MB15)}>
          {(showFieldSuggestionComponent) ? fieldsLists : null }
        </div>
      </>
    )
  );
}

const mapStateToProps = (state) => {
  return {
    fieldSuggestionsData: state.FieldSuggestionReducer,
    flowData: state.EditFlowReducer.flowData,
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
)(ContextFieldSuggestions);
ContextFieldSuggestions.defaultProps = {};
ContextFieldSuggestions.propTypes = {};
