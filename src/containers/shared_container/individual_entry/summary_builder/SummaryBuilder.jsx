import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidV4 } from 'uuid';
import { useDispatch } from 'react-redux';
import {
  getAllDataFieldThunk,
  saveDashboardPageComponentOrFieldThunk,
  saveDashboardPageTableComponentOrTableFieldThunk,
} from '../../../../redux/actions/IndividualEntry.Action';
import { translate } from '../../../../language/config';
import { isEmpty, has, cloneDeep, get } from '../../../../utils/jsUtility';
import { MODULE_TYPES } from '../../../../utils/Constants';
import { FORM_TYPE } from '../../../form/Form.string';
import Form from '../../../form/Form';
import {
  INDIVIDUAL_ENTRY_MODE,
  INDIVIDUAL_ENTRY_TYPE,
} from '../IndividualEntry.strings';
import { getParentNodeUuidFromTree } from '../../../form/sections/form_layout/FormLayout.utils';
import { FIELD_TYPE } from '../../../../utils/constants/form.constant';
import { REQUEST_SAVE_FORM } from '../../../../utils/constants/form/form.constant';
import { validateFormDetails } from './SummaryBuilder.utils';
import { dataChange } from '../../../../redux/reducer/IndividualEntryReducer';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';

function SummaryBuilder(props) {
  const {
    mode,
    metaData: { moduleId, moduleUuid, instanceId },
    type,
    pageMetaData,
    pageIndex,
    formErrorList,
    dashboardErrors,
  } = props;

  const { dashboard_id, _id, formUUID } = pageMetaData;

  const isReadOnly = [
    INDIVIDUAL_ENTRY_MODE.READ_ONLY_MODE,
    INDIVIDUAL_ENTRY_MODE.INSTANCE_MODE,
    INDIVIDUAL_ENTRY_MODE.REPORT_INSTANCE_MODE,
  ].includes(mode);
  const formType = isReadOnly
    ? FORM_TYPE.READONLY_FORM
    : FORM_TYPE.CREATION_FORM;
  const metaDataParams = {
    formUUID: formUUID,
    moduleId: moduleId,
    pageId: _id,
    dashboardId: dashboard_id,
    isSummaryField: true,
  };
  if (
    [
      INDIVIDUAL_ENTRY_MODE.INSTANCE_MODE,
      INDIVIDUAL_ENTRY_MODE.REPORT_INSTANCE_MODE,
    ].includes(mode)
  ) {
    metaDataParams.instanceId = instanceId;
  }
  if (type === INDIVIDUAL_ENTRY_TYPE.DATA_LIST) {
    metaDataParams.dataListId = moduleId;
    metaDataParams.dataListUUID = moduleUuid;
  } else if (type === INDIVIDUAL_ENTRY_TYPE.FLOW) {
    metaDataParams.flowId = moduleId;
    metaDataParams.flowUUID = moduleUuid;
  }
  const dispatch = useDispatch();

  useEffect(() => {
    if (mode === INDIVIDUAL_ENTRY_MODE.DEVELOP_MODE) {
      const params = {};
      if (type === INDIVIDUAL_ENTRY_TYPE.DATA_LIST) {
        params.data_list_id = moduleId;
      } else if (type === INDIVIDUAL_ENTRY_TYPE.FLOW) {
        params.flow_id = moduleId;
      }
      dispatch(
        getAllDataFieldThunk({
          page: 1,
          size: 1000,
          field_list_type: 'direct',
          sort_by: 1,
          include_property_picker: 1,
          include_tables: 1,
          ...params,
        }),
      );
    }
  }, []);

  const updateSections = (
    sections,
    validateSection = false,
    sectionUUID = EMPTY_STRING,
  ) => {
    let { errorList } = cloneDeep(pageMetaData);
    let error = {};
    if (validateSection) {
      if (sectionUUID && errorList) {
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
    } else {
      error = validateFormDetails?.(cloneDeep(sections));
      errorList = {};
    }
    dispatch(
      dataChange({
        pageMetadata: {
          ...pageMetaData,
          formMetadata: {
            ...pageMetaData.formMetadata,
            sections: sections,
          },
          errorList: { ...errorList, ...error },
        },
      }),
    );
  };

  const saveField = (
    _actionType,
    postData,
    path,
    _sectionUUID,
    sectionData,
    onSuccess,
    // onError,
  ) => {
    const { parentNodeUuid } = getParentNodeUuidFromTree(sectionData, path);
    const fieldNoteUuid = postData?.node_uuid || uuidV4();
    postData.dashboard_id = dashboard_id;
    postData.page_id = _id;
    postData.form_uuid = formUUID;
    postData.parent_node_uuid = parentNodeUuid;
    postData.node_uuid = fieldNoteUuid;
    if (type === INDIVIDUAL_ENTRY_TYPE.FLOW) {
      postData.flow_id = moduleId;
    } else if (type === INDIVIDUAL_ENTRY_TYPE.DATA_LIST) {
      postData.data_list_id = moduleId;
    }

    if (postData.field_type === FIELD_TYPE.TABLE) {
      dispatch(saveDashboardPageTableComponentOrTableFieldThunk(postData)).then(
        (res) => {
          const fieldData = {
            _id: res._id,
            field_uuid: res.field_uuid,
            child_fields: res.child_fields,
          };
          onSuccess(fieldData, fieldNoteUuid);
          dispatch(
            dataChange({
              isInitialCustomSummary: false,
            }),
          );
        },
      );
    } else {
      dispatch(saveDashboardPageComponentOrFieldThunk(postData)).then((res) => {
        const fieldData = {
          _id: res._id,
          field_uuid: res.field_uuid,
        };
        onSuccess(fieldData, fieldNoteUuid);
        dispatch(
          dataChange({
            isInitialCustomSummary: false,
          }),
        );
      });
    }
  };

  const formProps = {
    sections: {},
    fields: {},
    activeFormData: {},
    formMetaData: {},
  };

  if (
    [
      INDIVIDUAL_ENTRY_MODE.READ_ONLY_MODE,
      INDIVIDUAL_ENTRY_MODE.INSTANCE_MODE,
      INDIVIDUAL_ENTRY_MODE.REPORT_INSTANCE_MODE,
    ].includes(mode)
  ) {
    formProps.sections = pageMetaData.sections;
    formProps.fields = pageMetaData.fields;
    formProps.activeFormData = pageMetaData.activeFormData;
    formProps.formMetaData = pageMetaData.formMetaData;
    formProps.informationFieldFormContent =
      pageMetaData.informationFieldFormContent;
  } else {
    formProps.sections = pageMetaData?.formMetadata?.sections;
    formProps.fields = pageMetaData?.formMetadata?.fields;
    const getFormErrors = () => {
      const errorsForm = {};
      formErrorList?.forEach((errorObj) => {
        const key = errorObj?.field?.split('.');
        if (!isEmpty(key) && Number(key[2]) === Number(pageIndex)) {
          if (has(key, 5) && has(key, 7)) {
            if (formProps?.sections?.[key[5]]?.contents?.[key[7]]) {
              const errorField =
                formProps?.sections?.[key[5]]?.contents?.[key[7]];
              errorsForm[errorField.field_uuid] = errorObj.indexes;
            }
          } else if (has(key, 5) && formProps?.sections?.[key[5]]) {
            const errorField = formProps?.sections?.[key[5]];
            if (errorObj.type === 'array.hasUnknown') {
              errorsForm[errorField.section_uuid] = translate(
                'flow_config_strings.errors.section_atleast_one_field',
              );
            } else {
              errorsForm[errorField.section_uuid] = errorObj.indexes;
            }
          }
        }
      });
      return errorsForm;
    };
    formProps.errorList = {
      ...pageMetaData.errorList,
      ...getFormErrors(),
      ...dashboardErrors?.sectionError,
    };
  }

  return (
    <Form
      moduleType={MODULE_TYPES.SUMMARY}
      metaData={metaDataParams}
      formType={formType}
      sections={formProps.sections}
      fields={formProps.fields}
      activeFormData={formProps.activeFormData}
      formMetaData={formProps.formMetaData}
      saveField={saveField}
      onFormConfigUpdate={updateSections}
      onFormFillUpdate={() => {}}
      errorList={formProps?.errorList || {}}
      showSectionName
      isAuditView={INDIVIDUAL_ENTRY_MODE.READ_ONLY_MODE === mode}
      informationFieldFormContent={formProps?.informationFieldFormContent}
    />
  );
}

SummaryBuilder.propTypes = {
  mode: PropTypes.string,
  metaData: PropTypes.object,
  type: PropTypes.string,
  pageMetaData: PropTypes.object,
  pageIndex: PropTypes.number,
  formErrorList: PropTypes.array,
  dashboardErrors: PropTypes.object,
};

export default SummaryBuilder;
