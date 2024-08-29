import React from 'react';
import PropTypes from 'prop-types';
import { ETitleHeadingLevel, Title } from '@workhall-pvt-lmt/wh-ui-library';
import styles from '../Filter.module.scss';
import FilterFormBuilder from '../filter_form_builder/FilterFormBuilder';
import { isEmpty } from '../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { FILTER_OPTION_VALUES } from '../Filter.strings';

function MoreFilters(props) {
  const {
    selectedFilterOption,
    filter,
    filter: { inputFieldDetailsForFilter },
    onSetFilterAction,
  } = props;

  const getTabElement = () =>
    inputFieldDetailsForFilter?.map((filterProData, index) => {
      if (
        (selectedFilterOption === FILTER_OPTION_VALUES.APPLIED &&
          !filterProData.isAppliedFilter) ||
        (selectedFilterOption === FILTER_OPTION_VALUES.ADD_NEW &&
          filterProData.isAppliedFilter)
      ) {
        return null;
      }
      const {
        fieldType,
        fieldNames,
        fieldValues,
        fieldUpdateValue,
        fieldUuid,
        selectedOperator,
        fieldUpdateBetweenOne,
        fieldUpdateBetweenTwo,
        isSectionTitle = false,
        sectionTitle,
        isSearch,
        field_id = EMPTY_STRING,
        is_logged_in_user,
        error,
      } = filterProData;
      let { fieldId } = filterProData;
      const fieldElement = [];
      fieldId = isEmpty(fieldId) ? field_id : fieldId;

      if (isSectionTitle) {
        fieldElement.push(
          <Title
            id={`${sectionTitle}_section`}
            className={styles.FilterFieldTitle}
            headingLevel={ETitleHeadingLevel.h2}
            content={sectionTitle}
          />,
        );
      }
      if (isSearch) {
        fieldElement.push(
          <FilterFormBuilder
            index={index}
            fieldType={fieldType}
            fieldNames={fieldNames}
            fieldValues={fieldValues}
            fieldUuid={fieldUuid}
            fieldId={fieldId}
            fieldUpdateValue={fieldUpdateValue}
            selectedOperator={selectedOperator}
            fieldUpdateBetweenOne={fieldUpdateBetweenOne}
            fieldUpdateBetweenTwo={fieldUpdateBetweenTwo}
            filter={filter}
            onSetFilterAction={onSetFilterAction}
            is_logged_in_user={is_logged_in_user}
            error={error}
          />,
        );
      }

      return fieldElement;
    });
  return <div className={styles.MoreFilterContainer}>{getTabElement()}</div>;
}

MoreFilters.propTypes = {
  selectedFilterOption: PropTypes.string,
  filter: PropTypes.objectOf({
    inputFieldDetailsForFilter: PropTypes.arrayOf(PropTypes.object),
  }),
  onSetFilterAction: PropTypes.func,
};

export default MoreFilters;
