import React from 'react';
import cx from 'classnames/bind';
import InfiniteScroll from 'react-infinite-scroller';
import Skeleton from 'react-loading-skeleton';
import { isArray } from 'lodash';
import { NO_DATA_FOUND_TEXT } from 'utils/strings/CommonStrings';
import styles from './FieldSuggestions.module.scss';
import { EXISTING_TABLE_FIELD_ID, FORM_STRINGS } from '../../../FormBuilder.strings';
import { BS } from '../../../../../utils/UIConstants';
import gClasses from '../../../../../scss/Typography.module.scss';
import Input from '../../../../form_components/input/Input';
import { FIELD_LIST_TYPE } from '../../../../../utils/constants/form.constant';

function FieldSuggestions(props) {
  const { FIELD_SUGGESTION } = FORM_STRINGS;
  const {
    onLoadMore,
    suggestionDetails,
    onSuggestionTextChange,
    addFormFieldsDropdownId,
    isTableFields,
    sectionIndex,
    onAddExistingFieldToSection,
  } = props;

  const onSuggestionTextChangeEvent = (event) => {
    onSuggestionTextChange(addFormFieldsDropdownId, event.target.value);
  };

  let suggestionLists = null;
  let noDataView = null;

  if (suggestionDetails && isArray(suggestionDetails.fieldList) && suggestionDetails.fieldList.length > 0) {
    suggestionLists = suggestionDetails.fieldList;
  } else if (
    suggestionDetails
    && !suggestionDetails.isDataLoading
    && suggestionDetails.fieldList
    && suggestionDetails.fieldList.length === 0
  ) {
    noDataView =
    <div className={cx(gClasses.FTwo12GrayV2, styles.FieldContainer, gClasses.CenterVH)}>
      {NO_DATA_FOUND_TEXT}
    </div>;
  } else {
    suggestionLists = new Array(10).fill(1);
  }

  const fieldsList = isArray(suggestionLists)
    && suggestionLists.map((field) => (
      <button
        className={cx(styles.FieldContainer, gClasses.ClickableElement, gClasses.CursorPointer, BS.W100)}
        onClick={() => (addFormFieldsDropdownId === EXISTING_TABLE_FIELD_ID && field.is_table && !isTableFields
          ? onAddExistingFieldToSection(FIELD_LIST_TYPE.TABLE, field.table_uuid, sectionIndex)
          : onAddExistingFieldToSection(FIELD_LIST_TYPE.DIRECT, field._id, sectionIndex))}
      >
        <div className={cx(gClasses.FTwo13BlackV6, gClasses.FontWeight500, gClasses.MinHeight18, gClasses.MinWidth50)}>
          {suggestionDetails.isDataLoading ? (
            <Skeleton />
          ) : addFormFieldsDropdownId === EXISTING_TABLE_FIELD_ID && !isTableFields ? (
            field.table_reference_name
          ) : (
            field.reference_name
          )}
        </div>
        <div className={cx(gClasses.FOne12BlackV7, gClasses.MinHeight16, gClasses.MinWidth75)}>
          {suggestionDetails.isDataLoading ? (
            <Skeleton />
          ) : addFormFieldsDropdownId === EXISTING_TABLE_FIELD_ID && !isTableFields ? null : (
            field.field_type
          )}
        </div>
      </button>
    ));
  return (
    <div className={cx(styles.Container, BS.D_FLEX, BS.FLEX_COLUMN)}>
      <div className={cx(styles.Header)}>
        <div className={cx(gClasses.Italics, gClasses.FOne12GrayV9, gClasses.MB10)}>
          {'Choose a field to import' || FIELD_SUGGESTION.COPY_FROM_EXISTING}
        </div>
        <div className={cx(gClasses.FOne10GrayV2, gClasses.MB10)}>If the chosen field got any value in any of the previous steps, it will be visible to the user</div>
        <Input
          placeholder={FIELD_SUGGESTION.SEARCH_INPUT.PLACEHOLDER}
          onChangeHandler={onSuggestionTextChangeEvent}
          value={suggestionDetails.search}
          hideLabel
          hideMessage
        />
      </div>
      <div className={cx(gClasses.ScrollBar, gClasses.Flex1, gClasses.OverflowYAuto)}>
        <InfiniteScroll
          pageStart={0}
          loadMore={() => onLoadMore(addFormFieldsDropdownId, suggestionDetails.search, true)}
          hasMore={suggestionDetails.hasMore}
          useWindow={false}
          // threshold={150}
          initialLoad={false}
        >
          {fieldsList}
          {noDataView}
        </InfiniteScroll>
      </div>
    </div>
  );
}
export default FieldSuggestions;
FieldSuggestions.defaultProps = {};
FieldSuggestions.propTypes = {};
