import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import { FORM_TYPE } from './Form.string';
import FormBuilder from './form_builder/FormBuilder';
import EditableForm from './editable_form/EditableForm';
import ImportForm from './import_form/ImportForm';
import ReadOnlyForm from './read_only_form/ReadOnlyForm';
import useFrom, { SAMPLE_SECTION_DATA } from './useForm';
import { MODULE_TYPES } from '../../utils/Constants';
import DndWrapper from '../../components/dnd_wrapper/DndWrapper';
import ReadOnlyFormBuilder from './form_builder/ReadOnlyFormBuilder';

function Form(props) {
    const {
        metaData = {}, // Module Specific Meta Data
        formType = FORM_TYPE.CREATION_FORM, // FORM_TYPE
        sections = SAMPLE_SECTION_DATA, //  All Sections
        fields = {},
        activeFormData = {}, // Editable, Readonly - Form Filling Data
        informationFieldFormContent = {}, // Editable, Readonly - Information Field Form Filling Data
        documentDetails = {}, // Editable, Readonly - Form Filling Data
        formMetaData = {}, // Editable (dependentFields, buttonVisibility,formVisibility)

        onFormConfigUpdate = () => null, // Creation - (sections) => {}
        onFormFillUpdate = () => null, // Editable - (updatedFormData = {}) => {}
        onValidateField = () => null, // Editable

        // Header, Footer
        getFormHeader = () => null,
        getFormFooter = () => null,
        moduleType = MODULE_TYPES.FLOW,
        saveField = null,
        errorList = {},
        dataListAuditfields,
        showSectionName,
        dynamicValidation,
        userProfileData = {},
        showAllFields,
        isAuditView = false,
        disableVisibility, // Only for ReadOnly
    } = props;

    const {
        sections: localSections,
        fields: localFields,
        activeFormData: localActiveFormData,
        activeField,
        activeLayout,
        validationMessage,
        documentDetails: localDocumentDetails,
        formMetaData: localFormMetaData,
        dispatch,
    } = useFrom({ activeFormData, sections, fields, documentDetails, formMetaData }, onFormConfigUpdate, onFormFillUpdate);
    const getForm = () => {
        let form = null;

        switch (formType) {
         case FORM_TYPE.CREATION_FORM:
                form = (<FormBuilder
                           metaData={{ ...metaData, showSectionName: showSectionName }}
                           activeField={activeField}
                           activeLayout={activeLayout}
                           sections={localSections}
                           fields={localFields}
                           dispatch={dispatch}
                           validationMessage={{ ...validationMessage, ...errorList }}
                            getFormHeader={getFormHeader}
                            getFormFooter={getFormFooter}
                            moduleType={moduleType}
                            saveField={saveField}
                            userProfileData={userProfileData}
                />);
                break;
          case FORM_TYPE.READ_ONLY_CREATION_FORM:
                form = (<ReadOnlyFormBuilder
                           metaData={{ ...metaData, showSectionName: showSectionName }}
                           activeField={activeField}
                           sections={sections}
                           fields={fields}
                           dispatch={dispatch}
                           validationMessage={{ ...validationMessage, ...errorList }}
                            getFormHeader={getFormHeader}
                            getFormFooter={getFormFooter}
                            moduleType={moduleType}
                            saveField={saveField}
                            userProfileData={userProfileData}
                />);
                break;
         case FORM_TYPE.EDITABLE_FORM:
                form = (<EditableForm
                         metaData={{ ...metaData, showSectionName: showSectionName }}
                         moduleType={moduleType}
                         sections={localSections}
                         fields={localFields}
                         formData={localActiveFormData}
                         informationFieldFormContent={informationFieldFormContent}
                         formVisibility={localFormMetaData.formVisibility}
                         documentDetails={localDocumentDetails}
                         formMetaData={localFormMetaData}
                         validationMessage={{ ...validationMessage, ...errorList }}
                         onValidateField={onValidateField}
                         onFormFillUpdate={onFormFillUpdate}
                         dispatch={dispatch}
                         dynamicValidation={dynamicValidation}
                         userProfileData={userProfileData}
                />);
                break;
         case FORM_TYPE.IMPORT_FROM:
                form = (<ImportForm
                            allFields={fields}
                            metaData={metaData}
                            onCloseClick={() => {}}
                            dispatch={dispatch}
                />);
                break;
         case FORM_TYPE.READONLY_FORM:
                form = (<ReadOnlyForm
                            metaData={{ ...metaData, showSectionName: showSectionName }}
                            formVisibility={localFormMetaData.formVisibility}
                            sections={localSections}
                            fields={localFields}
                            formData={localActiveFormData}
                            informationFieldFormContent={informationFieldFormContent}
                            dispatch={dispatch}
                            dataListAuditfields={dataListAuditfields}
                            showAllFields={showAllFields}
                            isAuditView={isAuditView}
                            disableVisibility={disableVisibility}
                            moduleType={moduleType}
                />);
                break;
         default: break;
        }
        return form;
    };

    return (
      <div id={formType} className={gClasses.H100}>
        <DndWrapper id={formType}>{getForm()}</DndWrapper>
      </div>
    );
}

export default Form;
