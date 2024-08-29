import React from 'react';
import PropTypes from 'prop-types';
import FormBuilder from 'components/form_builder/FormBuilder';
import { FORM_TYPES } from '../../../../../utils/constants/form.constant';

function Form(props) {
  const {
    active_task_details: { active_form_content, form_metadata: { sections } = {} },
    onChangeHandler,
    stateData,
    isCompletedForm,
    onDeleteFileClick,
    onRetryFileUploadClick,
    onTableAddOrDeleteRowClick,
    isReadOnlyForm,
    formVisibility,
    parentModuleType,
    userDetails,
    dataListAuditfields,
    auditedTabelRows,
    isAuditView,
    tabelfieldEditedList,

  } = props;
  return (
    <FormBuilder
      parentModuleType={parentModuleType}
      sections={sections || []}
      formType={FORM_TYPES.EDITABLE_FORM}
      onChangeHandler={onChangeHandler}
      stateData={stateData}
      activeFormContent={active_form_content}
      isCompletedForm={isCompletedForm}
      onDeleteFileClick={onDeleteFileClick}
      onRetryFileUploadClick={onRetryFileUploadClick}
      onTableAddOrDeleteRowClick={onTableAddOrDeleteRowClick}
      isReadOnlyForm={isReadOnlyForm}
      formVisibility={formVisibility}
      error_list={stateData.error_list}
      userDetails={userDetails}
      dataListAuditfields={dataListAuditfields}
      auditedTabelRows={auditedTabelRows}
      isAuditView={isAuditView}
      tabelfieldEditedList={tabelfieldEditedList}
    />
  );
}
export default Form;

Form.defaultProps = { stateData: {} };
Form.propTypes = {
  onChangeHandler: PropTypes.func.isRequired,
  stateData: PropTypes.objectOf(PropTypes.any),
};
