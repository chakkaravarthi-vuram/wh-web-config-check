import React from 'react';
import PropTypes from 'prop-types';
import FilterFormBuilder from '../filter_form_builder/FilterFormBuilder';

function MoreFiltersNew(props) {
  const {
    filter,
    field,
    onSetFilterAction,
    getReportData,
    index,
    error,
    resetError,
  } = props;

  const getTabElement = () => {
    const {
      fieldType,
      fieldNames,
      fieldValues,
      fieldUpdateValue,
      fieldId,
      field_id,
      selectedOperator,
      fieldUpdateBetweenOne,
      fieldUpdateBetweenTwo,
      isSearch,
      is_logged_in_user,
    } = field;
    const fieldElement = [];

    if (isSearch) {
      fieldElement.push(
        <FilterFormBuilder
          index={index}
          fieldType={fieldType}
          fieldNames={fieldNames}
          fieldValues={fieldValues}
          fieldId={fieldId || field_id}
          fieldUpdateValue={fieldUpdateValue}
          selectedOperator={selectedOperator}
          fieldUpdateBetweenOne={fieldUpdateBetweenOne}
          fieldUpdateBetweenTwo={fieldUpdateBetweenTwo}
          filter={filter}
          onSetFilterAction={onSetFilterAction}
          getReportData={getReportData}
          error={error}
          resetError={resetError}
          is_logged_in_user={is_logged_in_user}
        />,
      );
    }
    return fieldElement;
  };
  return getTabElement();
}

MoreFiltersNew.propTypes = {
  filter: PropTypes.object,
  field: PropTypes.object,
  onSetFilterAction: PropTypes.func,
  getReportData: PropTypes.func,
  index: PropTypes.number,
  error: PropTypes.string,
  resetError: PropTypes.string,
};

export default MoreFiltersNew;
