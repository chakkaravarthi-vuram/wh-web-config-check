import React from 'react';
import PropTypes from 'prop-types';
import { FORM_TYPE } from '../Form.string';
import Sections from '../sections/Sections';

function ReadOnlyForm(props) {
  const { formData, informationFieldFormContent, sections, dispatch, fields, dataListAuditfields, metaData, showAllFields,
    formVisibility, isAuditView = false, disableVisibility = false, moduleType } = props;

    const defaultOnFieldDataChange = () => {};
    const formType = FORM_TYPE.READONLY_FORM;

  return (
    <Sections
      metaData={metaData}
      formData={formData}
      informationFieldFormContent={informationFieldFormContent}
      sections={sections}
      fields={fields}
      dispatch={dispatch}
      formVisibility={formVisibility}
      formType={formType}
      validationMessage={{}}
      onFieldDataChange={defaultOnFieldDataChange}
      dataListAuditfields={dataListAuditfields}
      showAllFields={showAllFields}
      isAuditView={isAuditView}
      disableVisibilityForReadOnlyForm={disableVisibility}
      moduleType={moduleType}
    />
  );
}

export default ReadOnlyForm;

ReadOnlyForm.propTypes = {
  formData: PropTypes.object,
  informationFieldFormContent: PropTypes.object,
  sections: PropTypes.array,
  dispatch: PropTypes.func,
  fields: PropTypes.object,
  dataListAuditfields: PropTypes.object,
  metaData: PropTypes.object,
  showAllFields: PropTypes.bool,
  formVisibility: PropTypes.object,
  isAuditView: PropTypes.bool,
  disableVisibility: PropTypes.bool,
};
