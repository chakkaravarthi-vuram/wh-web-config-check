import React from 'react';
import { v4 as uuidV4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { cloneDeep, get, isEmpty, set } from '../../../../../utils/jsUtility';
import { REQUEST_SAVE_FORM } from '../../../../../utils/constants/form/form.constant';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { getParentNodeUuidFromTree, getSectionFieldsFromLayout } from '../../../../form/sections/form_layout/FormLayout.utils';
import { FIELD_ACTION_TYPE, FORM_TYPE } from '../../../../form/Form.string';
import { MODULE_TYPES } from '../../../../../utils/Constants';
import Form from '../../../../form/Form';
import { getUserProfileData, validate } from '../../../../../utils/UtilityFunctions';
import { saveField } from '../../../../../axios/apiService/createTask.apiService';
import { saveTable } from '../../../../../axios/apiService/form.apiService';
import { formatValidationMessages } from '../../../../task/task/Task.utils';
import { datalistFormValidationSchema } from '../../../../flow/create_data_list/CreateDataList.validation.schema';
import { DL_ACTIONS } from '../../useDatalistReducer';
import style from '../../DatalistsCreateEdit.module.scss';

function DatalistCreateEditCaptureData(props) {
  const {
    metaData,
    formData,
    onDataChangeHandler,
    formErrors,
  } = props;
  const { t } = useTranslation();

  const updateFormData = (data) => {
    onDataChangeHandler({ ...formData, ...data }, DL_ACTIONS.FORM_DATA_CHANGE);
  };

  const validateFormDetails = (updatedSections = []) => {
    const clonedState = cloneDeep(formData);
    const sections = cloneDeep(clonedState.sections);
    const sectionsData = !isEmpty(updatedSections)
      ? cloneDeep(updatedSections)
      : cloneDeep(sections);
    const flattenedSectionWithFields = [];
    sectionsData?.forEach((eachSection) => {
      const sectionFields = [];
      eachSection?.layout?.forEach((eachLayout) => {
        const fields = getSectionFieldsFromLayout(eachLayout);
        sectionFields.push(...fields);
      });
      flattenedSectionWithFields.push({
        section_name: eachSection?.section_name,
        section_order: eachSection?.section_order,
        section_uuid: eachSection?.section_uuid,
        is_section_show_when_rule: eachSection?.is_section_show_when_rule,
        fields: sectionFields,
      });
    });
    return formatValidationMessages(
      validate(
        { sections: flattenedSectionWithFields },
        datalistFormValidationSchema(t),
      ),
      cloneDeep(flattenedSectionWithFields),
    );
  };

  const updateSections = (sections, validateSection = false, sectionUUID = EMPTY_STRING) => {
    let { errorList } = cloneDeep(formData);
    let error = {};
    if (validateSection) {
      if (sectionUUID) {
        let sectionHasError = false;
        Object.keys(errorList)?.forEach((key) => {
          if (key === `${sectionUUID},${REQUEST_SAVE_FORM.SECTION_NAME}`) {
            sectionHasError = true;
            delete errorList[
              `${sectionUUID},${REQUEST_SAVE_FORM.SECTION_NAME}`
            ];
          }
        });
        if (sectionHasError) {
          const sectionIndex = sections.findIndex(
            (eachSection) => eachSection.section_uuid === sectionUUID,
          );
          if (sectionIndex > -1) {
            error = validateFormDetails?.([
              cloneDeep(get(sections, [sectionIndex], {})),
            ]);
          }
        }
      } else {
        error = validateFormDetails?.(cloneDeep(sections));
        errorList = {};
      }
    }
    updateFormData({
      sections: sections,
      errorList: { ...errorList, ...error },
    });
  };

  const validatePostSaveField = (sectionData, sectionUUID) => {
    const { errorList, sections } = cloneDeep(formData);
    const sectionIndex = sections.findIndex(
      (eachSection) => eachSection.section_uuid === sectionUUID,
    );
    if (sectionIndex > -1) {
      set(sections, [sectionIndex], {
        ...get(sections, [sectionIndex], {}),
        ...(sectionData || {}),
      });
    }
    const sectionList = [
      cloneDeep({
        ...get(sections, [sectionIndex], {}),
        ...(sectionData || {}),
      }),
    ];
    const error = validateFormDetails?.(sectionList);
    if (errorList) {
      Object.keys(errorList)?.forEach((key) => {
        if (key.includes(sectionUUID)) delete errorList[key];
      });
      updateFormData({ errorList: { ...errorList, ...error } });
    }
  };

  const saveFieldHandler = (data, path, sectionUUID, sectionData, onSuccess, onError) => {
    if (sectionData) {
      const { parentNodeUuid, fieldOrder } = getParentNodeUuidFromTree(
        sectionData,
        path,
      );
      const fieldNodeUuid = data?.node_uuid || uuidV4();
      const postData = {
        ...data,
        data_list_id: metaData.moduleId,
        form_uuid: metaData.formUUID,
        node_uuid: fieldNodeUuid,
        parent_node_uuid: parentNodeUuid,
        section_uuid: sectionUUID,
        is_field_show_when_rule: data.is_field_show_when_rule || false,
        is_save: false,
        order: fieldOrder,
        validations: data.validations || {},
      };
      saveField(postData)
        .then((res) => {
          onSuccess?.(res, fieldNodeUuid, validatePostSaveField);
        })
        .catch((err) => {
          onError?.(err);
        });
    }
  };

  const saveTableHandler = (data, path, sectionUUID, sectionData, onSuccess, onError) => {
    const metadata = {
      data_list_id: metaData.moduleId,
      form_uuid: metaData.formUUID,
      section_uuid: sectionUUID,
    };
    if (!isEmpty(sectionData)) {
      const { parentNodeUuid } = getParentNodeUuidFromTree(sectionData, path);
      const nodeUUID = data?.node_uuid || uuidV4();
      const postData = {
        ...data,
        ...metadata,
        parent_node_uuid: parentNodeUuid,
        node_uuid: nodeUUID,
      };
      saveTable(postData)
        .then((res) => onSuccess?.(res, nodeUUID, validatePostSaveField))
        .catch((err) => onError?.(err));
    }
  };

  const onSaveField = (type, data, path, sectionUUID, sectionData, onSuccess, onError) => {
    switch (type) {
      case FIELD_ACTION_TYPE.FIELD:
        saveFieldHandler(data, path, sectionUUID, sectionData, onSuccess, onError);
        break;
      case FIELD_ACTION_TYPE.TABLE:
        saveTableHandler(data, path, sectionUUID, sectionData, onSuccess, onError);
        break;
      default:
        break;
    }
  };

  return (
    <div className={style.DataListFormContainer}>
      <Form
        moduleType={MODULE_TYPES.DATA_LIST}
        saveField={onSaveField}
        formType={FORM_TYPE.CREATION_FORM}
        metaData={{
          formUUID: metaData.formUUID,
          moduleId: metaData.moduleId,
        }}
        sections={formData.sections || []}
        fields={formData.fields}
        onFormConfigUpdate={updateSections}
        errorList={{ ...formErrors, ...formData.errorList }}
        showSectionName={formData.showSectionName || false}
        userProfileData={getUserProfileData()}
      />
    </div>
  );
}

export default DatalistCreateEditCaptureData;

DatalistCreateEditCaptureData.propTypes = {
  metaData: PropTypes.object,
  formData: PropTypes.object,
  onDataChangeHandler: PropTypes.func,
  formErrors: PropTypes.object,
};
