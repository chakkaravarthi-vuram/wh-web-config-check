import { isEmpty, get, set, groupBy, uniqBy, uniq } from 'utils/jsUtility';
import { FIELD_TYPES } from '../../../../../components/form_builder/FormBuilder.strings';
import {
  REQUEST_FIELD_KEYS,
  RESPONSE_FIELD_KEYS,
} from './GenerateDocument.constants';
import { cloneDeep } from '../../../../../utils/jsUtility';
import { FIELD_LIST_TYPE } from '../../../../../utils/constants/form.constant';
import { DEFAULT_STEP_STATUS } from '../../../EditFlow.constants';
import { DOCUMENT_TYPES, EMPTY_STRING, ENTITY } from '../../../../../utils/strings/CommonStrings';
import { getFieldLabelWithRefName } from '../../../../../utils/UtilityFunctions';
import { extractHTMLFromString } from '../../configurations/document_generation/DocumentGeneration.utils';
// import { getCurrentSystemField } from './general/document_template/DocumentTemplate.utils';

export const getAllTablesFromSections = (allTableFields, resAllFields) => {
  let tableUuidList = [];
  const tableList = [];
  if (!allTableFields || isEmpty(allTableFields)) {
    return tableList;
  }

  tableUuidList = groupBy(allTableFields, (table) => table.tableUuid);
  if (!isEmpty(tableUuidList)) {
    Object.keys(tableUuidList).forEach((tableUuid) => {
      const currentTable = resAllFields?.find((eachTable = {}) => eachTable?.fieldUuid === tableUuid);

      if (tableUuidList[tableUuid] && tableUuidList[tableUuid][0]) {
        tableList.push({
          label: currentTable?.label,
          value: tableUuid,
          tableUuid: tableUuid,
          tableName: currentTable?.label,
          fieldUuid: currentTable?.fieldUuid,
          fieldListType: FIELD_LIST_TYPE.TABLE,
          fields: uniqBy(tableUuidList[tableUuid], (field) => field.fieldUuid),
        });
      }
    });
  }

  return tableList;
};

export const isFileUploadField = (field) => {
  if (isEmpty(field)) return false;

  if (field.fieldType === FIELD_TYPES.FILE_UPLOAD) {
    return true;
  }
  if (
    field.fieldType === FIELD_TYPES.USER_PROPERTY_PICKER ||
    field.fieldType === FIELD_TYPES.DATA_LIST_PROPERTY_PICKER
  ) {
    if (
      get(field, ['propertyPickerDetails', 'referenceFieldType'], null) ===
      FIELD_TYPES.FILE_UPLOAD
    ) {
      return true;
    }
    return false;
  }
  return false;
};

export const getImageRemovedDocId = ({
  documentBody,
  documentHeader,
  documentFooter,
  imageDocIds,
}) => {
  const imageRemovedDocId = [];

  imageDocIds?.forEach((eachImageId) => {
    try {
      const documentElement = extractHTMLFromString(documentBody);
      const headerElement = extractHTMLFromString(documentHeader);
      const footerElement = extractHTMLFromString(documentFooter);

      const documentImageTag = documentElement?.querySelector(`[data-image-id="${eachImageId}"]`);
      const headerImageTag = headerElement?.querySelector(`[data-image-id="${eachImageId}"]`);
      const footerImageTag = footerElement?.querySelector(`[data-image-id="${eachImageId}"]`);

      console.log({ documentImageTag, headerImageTag, footerImageTag });
      if (!documentImageTag && !headerImageTag && !footerImageTag) {
        imageRemovedDocId.push(eachImageId);
      }
    } catch (e) {
      console.log(e);
    }
  });

  return imageRemovedDocId;
};

export const constructDocumentGenerationPostData = (stateData = {}, isAddOnConfig = false) => {
  const postData = {};

  set(
    postData,
    REQUEST_FIELD_KEYS.STEP_UUID,
    stateData?.[RESPONSE_FIELD_KEYS.STEP_UUID],
  );

  set(
    postData,
    REQUEST_FIELD_KEYS.ID,
    stateData?.[RESPONSE_FIELD_KEYS.ID],
  );

  set(
    postData,
    REQUEST_FIELD_KEYS.FLOW_ID,
    stateData?.[RESPONSE_FIELD_KEYS.FLOW_ID],
  );

  const documentConfigurationData = {};

  if (!isAddOnConfig) {
    set(
      postData,
      REQUEST_FIELD_KEYS.STEP_STATUS,
      stateData?.[RESPONSE_FIELD_KEYS.STEP_STATUS],
    );

    set(
      postData,
      REQUEST_FIELD_KEYS.STEP_NAME,
      stateData?.[RESPONSE_FIELD_KEYS.STEP_NAME],
    );

    set(
      postData,
      REQUEST_FIELD_KEYS.STEP_TYPE,
      stateData?.[RESPONSE_FIELD_KEYS.STEP_TYPE],
    );

    set(
      postData,
      REQUEST_FIELD_KEYS.STEP_ORDER,
      stateData?.[RESPONSE_FIELD_KEYS.STEP_ORDER],
    );
  } else {
    documentConfigurationData.action_uuid = stateData?.documentGenerationActions?.actionUuid;
  }

  if (stateData?.[RESPONSE_FIELD_KEYS.DOCUMENT_GENERATION_UUID]) {
    set(
      documentConfigurationData,
      [REQUEST_FIELD_KEYS.DOCUMENT_GENERATION_UUID],
      stateData?.[RESPONSE_FIELD_KEYS.DOCUMENT_GENERATION_UUID],
    );
  }

const system_fields = [];
const form_fields = [];
stateData?.selectedFields?.forEach((field) => {
  if (field.type === 'system') {
    system_fields.push(field.value);
  } else {
    form_fields.push(field.value);
  }
});

const dataFields = {};
if (!isEmpty(system_fields)) {
  dataFields.system_fields = uniq(system_fields);
}
if (!isEmpty(form_fields)) {
  dataFields.form_fields = uniq(form_fields);
}

  if (!isEmpty(dataFields)) {
    set(
      documentConfigurationData,
      [REQUEST_FIELD_KEYS.DATA_FIELDS],
      dataFields,
    );
  }

  set(
    documentConfigurationData,
    [REQUEST_FIELD_KEYS.DOCUMENT_FIELD_NAME],
    stateData?.[RESPONSE_FIELD_KEYS.DOCUMENT_FIELD_NAME],
  );

  set(
    documentConfigurationData,
    [REQUEST_FIELD_KEYS.DOCUMENT_FIELD_UUID],
    stateData?.[RESPONSE_FIELD_KEYS.DOCUMENT_FIELD_UUID],
  );

  if (stateData?.documentNameUuid) {
    set(
      documentConfigurationData,
      [REQUEST_FIELD_KEYS.DOCUMENT_NAME_UUID],
      stateData?.[RESPONSE_FIELD_KEYS.DOCUMENT_NAME_UUID],
    );
  } else {
    set(
      documentConfigurationData,
      [REQUEST_FIELD_KEYS.FILE_NAME],
      stateData?.[RESPONSE_FIELD_KEYS.FILE_NAME],
    );
  }

  set(
    documentConfigurationData,
    [REQUEST_FIELD_KEYS.TEMPLATE_DOC_ID],
    stateData?.[RESPONSE_FIELD_KEYS.TEMPLATE_DOC_ID],
  );

  if (stateData?.[RESPONSE_FIELD_KEYS.ALLOW_HEADER]) {
    const showInPages = get(
      stateData?.headerDocument,
      [RESPONSE_FIELD_KEYS.HEADER_CONFIG, RESPONSE_FIELD_KEYS.SHOW_IN_PAGES],
      null,
    );

    if (!isEmpty(showInPages)) {
      set(
        documentConfigurationData,
        [
          REQUEST_FIELD_KEYS.HEADER_DOCUMENT,
          REQUEST_FIELD_KEYS.HEADER_CONFIG,
          REQUEST_FIELD_KEYS.SHOW_IN_PAGES,
        ],
        showInPages,
      );
    }

    const showPageNumber = get(
      stateData?.headerDocument,
      [RESPONSE_FIELD_KEYS.HEADER_CONFIG, RESPONSE_FIELD_KEYS.SHOW_PAGE_NUMBER],
      null,
    );

    const headerDocId = get(
      stateData?.headerDocument,
      ['_id'],
      EMPTY_STRING,
    );

    if (!isEmpty(showPageNumber)) {
      set(
        documentConfigurationData,
        [
          REQUEST_FIELD_KEYS.HEADER_DOCUMENT,
          REQUEST_FIELD_KEYS.HEADER_CONFIG,
          REQUEST_FIELD_KEYS.SHOW_PAGE_NUMBER,
        ],
        showPageNumber,
      );
    }

    set(
      documentConfigurationData,
      [
        REQUEST_FIELD_KEYS.HEADER_DOCUMENT,
        REQUEST_FIELD_KEYS.HEADER_CONFIG,
        REQUEST_FIELD_KEYS.SHOW_PAGE_NUMBER,
      ],
      showPageNumber,
    );

    set(
      documentConfigurationData,
      [REQUEST_FIELD_KEYS.HEADER_DOCUMENT, REQUEST_FIELD_KEYS.ID],
      headerDocId,
    );
  }

  if (stateData?.[RESPONSE_FIELD_KEYS.ALLOW_FOOTER]) {
    console.log('cisrtuc', stateData);
    const showInPages = get(
      stateData?.footerDocument,
      [RESPONSE_FIELD_KEYS.FOOTER_CONFIG, RESPONSE_FIELD_KEYS.SHOW_IN_PAGES],
      null,
    );

    if (!isEmpty(showInPages)) {
      set(
        documentConfigurationData,
        [
          REQUEST_FIELD_KEYS.FOOTER_DOCUMENT,
          REQUEST_FIELD_KEYS.FOOTER_CONFIG,
          REQUEST_FIELD_KEYS.SHOW_IN_PAGES,
        ],
        showInPages,
      );
    }

    const showPageNumber = get(
      stateData?.footerDocument,
      [RESPONSE_FIELD_KEYS.FOOTER_CONFIG, RESPONSE_FIELD_KEYS.SHOW_PAGE_NUMBER],
      null,
    );

    const footerDocId = get(
      stateData?.footerDocument,
      ['_id'],
      EMPTY_STRING,
    );

    if (!isEmpty(showPageNumber)) {
      set(
        documentConfigurationData,
        [
          REQUEST_FIELD_KEYS.FOOTER_DOCUMENT,
          REQUEST_FIELD_KEYS.FOOTER_CONFIG,
          REQUEST_FIELD_KEYS.SHOW_PAGE_NUMBER,
        ],
        showPageNumber,
      );
    }

    set(
      documentConfigurationData,
      [
        REQUEST_FIELD_KEYS.FOOTER_DOCUMENT,
        REQUEST_FIELD_KEYS.FOOTER_CONFIG,
        REQUEST_FIELD_KEYS.SHOW_PAGE_NUMBER,
      ],
      showPageNumber,
    );

    set(
      documentConfigurationData,
      [REQUEST_FIELD_KEYS.FOOTER_DOCUMENT, REQUEST_FIELD_KEYS.ID],
      footerDocId,
    );
  }

  if (!isEmpty(stateData?.allDocuments)) {
    const images = stateData.imageDocIds || [];
    const documentDetails = {
      entity: ENTITY.FLOW_STEPS,
      ref_uuid: stateData?.refUuid,
      entity_id: stateData?.[RESPONSE_FIELD_KEYS.ID],
      uploaded_doc_metadata: (stateData?.allDocuments || [])?.map((eachDoc) => {
        if (eachDoc.type === DOCUMENT_TYPES.STEP_STATIC_IMAGES) images.push(eachDoc._id);
        return {
          upload_signed_url: eachDoc?.upload_signed_url?.s3_key,
          type: eachDoc.type,
          document_id: eachDoc._id,
        };
      }),
    };

    const imageRemovedDocId = getImageRemovedDocId({
      documentBody: stateData?.[RESPONSE_FIELD_KEYS.DOCUMENT_BODY],
      documentHeader: stateData?.[RESPONSE_FIELD_KEYS.DOCUMENT_HEADER],
      documentFooter: stateData?.[RESPONSE_FIELD_KEYS.DOCUMENT_FOOTER],
      imageDocIds: images,
    });
    const removedDocList = [...(stateData[RESPONSE_FIELD_KEYS.REMOVED_DOC_LIST] || []), ...imageRemovedDocId];
    if (!isEmpty(removedDocList)) {
      documentDetails.removed_doc_list = removedDocList;
    }
    documentDetails.uploaded_doc_metadata = documentDetails.uploaded_doc_metadata?.filter((eachDoc) => !documentDetails.removed_doc_list?.includes(eachDoc?.document_id));

    postData.document_details = documentDetails;
    const filteredImageDocId = images?.filter((eachImageId) => !documentDetails.removed_doc_list?.includes(eachImageId));

    if (!isEmpty(filteredImageDocId)) {
      set(
        documentConfigurationData,
        ['image_doc_ids'],
        filteredImageDocId,
      );
    }
  }
  set(
    postData,
    [REQUEST_FIELD_KEYS.DOCUMENT_GENERATION],
    isAddOnConfig ? documentConfigurationData : [documentConfigurationData],
  );

  return postData;
};

export const formatGenerateDocumentData = (apiData) => {
  const documentGenerationDetails = cloneDeep(apiData)?.document_generation?.[0];
  const fieldDetails = cloneDeep(apiData)?.field_details;
  const data = {
    flowId: apiData?.flow_id,
    stepUuid: apiData?.step_uuid,
    stepId: apiData?._id,
    stepName: apiData?.step_name,
    stepOrder: apiData?.step_order,
    stepStatus: apiData?.step_status || DEFAULT_STEP_STATUS,
    stepType: apiData?.step_type,
    documentGenerationUuid: apiData?.document_generation?.[0]?.document_generation_uuid,
    imageDocIds: documentGenerationDetails?.image_doc_ids,
    removedDocList: [],
  };

  if (documentGenerationDetails) {
    data[RESPONSE_FIELD_KEYS.TEMPLATE_DOC_ID] = documentGenerationDetails?.template_doc_id;
    data.documentFieldUuid = documentGenerationDetails?.document_field_uuid;
    data[RESPONSE_FIELD_KEYS.DOCUMENT_FIELD_NAME] = getFieldLabelWithRefName(documentGenerationDetails?.document_field_name, documentGenerationDetails?.document_reference_name);
    const fileNameField = fieldDetails?.find((eachField) => eachField?.field_uuid === documentGenerationDetails?.[REQUEST_FIELD_KEYS.DOCUMENT_NAME_UUID]);
    data.fileName = documentGenerationDetails?.file_name || fileNameField?.label || fileNameField?.field_name;
    data[RESPONSE_FIELD_KEYS.DOCUMENT_NAME_UUID] = documentGenerationDetails?.[REQUEST_FIELD_KEYS.DOCUMENT_NAME_UUID];
    if (documentGenerationDetails?.data_fields) {
      data[RESPONSE_FIELD_KEYS.DATA_FIELDS] = {
        form_fields: documentGenerationDetails?.data_fields?.form_fields || [],
        system_fields: documentGenerationDetails?.data_fields?.system_fields || [],
      };
    }
    if (documentGenerationDetails?.[REQUEST_FIELD_KEYS.HEADER_DOCUMENT]) {
      data[RESPONSE_FIELD_KEYS.ALLOW_HEADER] = true;
      data[RESPONSE_FIELD_KEYS.HEADER_DOCUMENT] = {
        _id: documentGenerationDetails?.[REQUEST_FIELD_KEYS.HEADER_DOCUMENT]?._id,
        [RESPONSE_FIELD_KEYS.HEADER_CONFIG]: {
          [RESPONSE_FIELD_KEYS.SHOW_IN_PAGES]: documentGenerationDetails?.[REQUEST_FIELD_KEYS.HEADER_DOCUMENT]?.[REQUEST_FIELD_KEYS?.HEADER_CONFIG]?.[REQUEST_FIELD_KEYS.SHOW_IN_PAGES] || EMPTY_STRING,
          [RESPONSE_FIELD_KEYS.SHOW_PAGE_NUMBER]: documentGenerationDetails?.[REQUEST_FIELD_KEYS.HEADER_DOCUMENT]?.[REQUEST_FIELD_KEYS?.HEADER_CONFIG]?.[REQUEST_FIELD_KEYS.SHOW_PAGE_NUMBER] || false,
        },
      };
    }

    if (documentGenerationDetails?.[REQUEST_FIELD_KEYS.FOOTER_DOCUMENT]) {
      data[RESPONSE_FIELD_KEYS.ALLOW_FOOTER] = true;
      data[RESPONSE_FIELD_KEYS.FOOTER_DOCUMENT] = {
        _id: documentGenerationDetails?.[REQUEST_FIELD_KEYS.FOOTER_DOCUMENT]?._id,
        [RESPONSE_FIELD_KEYS.FOOTER_CONFIG]: {
          [RESPONSE_FIELD_KEYS.SHOW_IN_PAGES]: documentGenerationDetails?.[REQUEST_FIELD_KEYS.FOOTER_DOCUMENT]?.[REQUEST_FIELD_KEYS?.FOOTER_CONFIG]?.[REQUEST_FIELD_KEYS.SHOW_IN_PAGES] || EMPTY_STRING,
          [RESPONSE_FIELD_KEYS.SHOW_PAGE_NUMBER]: documentGenerationDetails?.[REQUEST_FIELD_KEYS.FOOTER_DOCUMENT]?.[REQUEST_FIELD_KEYS?.FOOTER_CONFIG]?.[REQUEST_FIELD_KEYS.SHOW_PAGE_NUMBER] || false,
        },
      };
    }

    if (documentGenerationDetails?.action_uuid) {
      data.documentGenerationActions = {
        actionUuid: documentGenerationDetails?.action_uuid,
      };
      data.selectedActionLabels = documentGenerationDetails?.action_uuid?.map((eachActionUuid) =>
      apiData?.actions?.find((eachAction) => eachAction.value === eachActionUuid)?.label);
    }
  }
  return data;
};

export const getDocumentGenerationValidationData = (stepData, isAddOnConfig = false) => {
  const documentBody = get(
    stepData,
    [RESPONSE_FIELD_KEYS.DOCUMENT_BODY],
    null,
  );

  const documentHeader = get(
    stepData,
    [RESPONSE_FIELD_KEYS.DOCUMENT_HEADER],
    null,
  );

  const documentFooter = get(
    stepData,
    [RESPONSE_FIELD_KEYS.DOCUMENT_FOOTER],
    null,
  );
  const data = {
    [RESPONSE_FIELD_KEYS.DOCUMENT_BODY]:
      documentBody === ('<p></p>\n' || '<p><br></p>') ? '' : documentBody,
    [RESPONSE_FIELD_KEYS.FILE_NAME]: get(stepData, [RESPONSE_FIELD_KEYS.FILE_NAME], EMPTY_STRING),
    [RESPONSE_FIELD_KEYS.DOCUMENT_FIELD_NAME]: get(stepData, [RESPONSE_FIELD_KEYS.DOCUMENT_FIELD_NAME], null),
    [RESPONSE_FIELD_KEYS.ALLOW_HEADER]: get(stepData, [RESPONSE_FIELD_KEYS.ALLOW_HEADER], false),
    [RESPONSE_FIELD_KEYS.ALLOW_FOOTER]: get(stepData, [RESPONSE_FIELD_KEYS.ALLOW_FOOTER], false),
  };
  if (data?.[RESPONSE_FIELD_KEYS.ALLOW_HEADER]) {
    data[RESPONSE_FIELD_KEYS.DOCUMENT_HEADER] =
    (documentHeader === ('<p></p>\n' || '<p><br></p>') ? '' : documentHeader);
  }

  if (data?.[RESPONSE_FIELD_KEYS.ALLOW_FOOTER]) {
    data[RESPONSE_FIELD_KEYS.DOCUMENT_FOOTER] =
    (documentFooter === ('<p></p>\n' || '<p><br></p>') ? '' : documentFooter);
  }

  if (isAddOnConfig) {
    data.actionUuid = stepData?.documentGenerationActions?.actionUuid;
  }

  return data;
};

export const getDocumentFieldDetails = (value, fieldsMenuList) => {
  // const field = fieldsMenuList?.[0]?.subMenuItems?.find((field) => field.value === value);
  // if (field) return field;
  // return getCurrentSystemField({ fieldUuid: value, systemFields: fieldsMenuList?.[1]?.subMenuItems });
  let selectedField = null;
  selectedField = fieldsMenuList?.find((field) => field.value === value);
  return selectedField;
};
