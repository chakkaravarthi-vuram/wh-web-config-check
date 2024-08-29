import { hasOwn, reportError } from '../../utils/UtilityFunctions';
import { RESPONSE_FIELD_KEYS } from '../../utils/constants/form/form.constant';
import { constructFieldDataFromApi } from '../../containers/form/form_builder/form_body/FormBody.utils';
import { constructTreeStructure, removeAllEmptyLayouts } from '../../containers/form/sections/form_layout/FormLayout.utils';
import { convertBeToFeKeys } from '../../utils/normalizer.utils';

const validateSaveDataList = (content) => {
  const requiredProps = ['_id', 'data_list_uuid'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate save data list failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

const validateDataListDetailsById = (content) => {
  const requiredProps = ['_id', 'data_list_uuid', 'data_list_name'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(
        `validate get data list details by id failed: ${prop} missing`,
      );
      return null;
    }
    return prop;
  });
  return content;
};
const validateDataListDetailsByUuid = (content) => {
  const requiredProps = ['_id', 'data_list_uuid', 'data_list_name'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(
        `validate get data list details by uuid failed:${prop} missing`,
      );
      return null;
    }
    return prop;
  });
  return content;
};
const validateDataListEntryDetailsById = (content) => {
  const requiredProps = ['form_metadata'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(
        `validate get data list entry details by id failed: ${prop} missing`,
      );
      return null;
    }
    return prop;
  });
  return content;
};

export const normalizeSaveDataList = (untrustedContent) => {
  const content = validateSaveDataList(untrustedContent.data.result.data);
  if (!content) {
    reportError('save data list failed');
    return null;
  }

  return content;
};

export const normalizePublishDataList = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('publish data list failed');
    return null;
  }
  return content;
};

const validateGetAllDataListUpdate = (content) => {
  const requiredProps = ['data_list', 'data_list_count'];
  const missingDataList = requiredProps.filter((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate get all data list data failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (missingDataList.length > 0) return null;
  return content;
};

const validateGetAllDataList = (content) => {
  let requiredProps = ['pagination_details', 'pagination_data'];
  let missingDataList = requiredProps.filter((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate get all data list data failed: ${prop} missing`);
      return true;
    }
    return false;
  });

  if (missingDataList.length > 0) return null;
  // check list data

  requiredProps = ['_id'];
  missingDataList = content.pagination_data.some((data) => {
    const list = requiredProps.filter((reqProp) => {
      if (!Object.prototype.hasOwnProperty.call(data, reqProp)) {
        reportError(`validate get all data list failed: ${reqProp} missing`);
        return true;
      }
      return false;
    });
    if (list.length > 0) return true;
    return false;
  });

  if (missingDataList > 0) return null;
  // check pagination details
  requiredProps = ['page', 'size', 'total_count'];
  missingDataList = requiredProps.some((prop) => {
    if (
      !Object.prototype.hasOwnProperty.call(content.pagination_details[0], prop)
    ) {
      reportError(`validate get all data list failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (missingDataList.length > 0) return null;

  return content;
};

const validateSaveRule = (content) => {
  const requiredProps = ['_id', 'rule'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate SaveRule failed: ${prop} missing`);
      return null;
    }
    return prop;
  });

  return content;
};

export const normalizeSaveRule = (untrustedContent) => {
  const validateData = validateSaveRule(untrustedContent);
  if (!validateData) {
    reportError('normalize SaveRule failed');
    return null;
  }
  return validateData;
};

export const normalizeGetAllDataList = (untrustedContent) => {
  const content = validateGetAllDataList(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalize get all data list Data failed');
    return null;
  }
  return content;
};

export const normalizeGetAllDataListUpdate = (untrustedContent) => {
  const content = validateGetAllDataListUpdate(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalize get all data list Data failed');
    return null;
  }
  return content;
};

export const normalizeGetAllViewDataList = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('normalize get all view data List failed');
    return null;
  }

  const modifiedContent = {
    ...content,
    dataList: content?.pagination_data || [],
    dataListPaginationDetails: {
      page: content?.pagination_details?.[0]?.page || 1,
      totalCount: content?.pagination_details?.[0]?.total_count || 0,
    },
  };
  return modifiedContent;
};

export const normalizeDataListDetailsById = (untrustedContent) => {
  const content = validateDataListDetailsById(
    untrustedContent.data.result.data,
  );
  if (!content) {
    reportError('normalize data list details by id failed');
    return null;
  }
  return content;
};

export const normalizeDataListDetailsByUuid = (untrustedContent) => {
  const content = validateDataListDetailsByUuid(
    untrustedContent.data.result.data,
  );
  if (!content) {
    reportError('normalize data list details by uuid failed');
    return null;
  }
  const modifiedContent = {
    ...content,
    [RESPONSE_FIELD_KEYS.DATA_LIST_ID]: content?._id,
    [RESPONSE_FIELD_KEYS.DATA_LIST_UUID]: content?.data_list_uuid,
  };
  return modifiedContent;
};

export const normalizeDataListEntryDetailsById = (untrustedContent) => {
  const content = validateDataListEntryDetailsById(
    untrustedContent.data.result.data,
  );
  if (!content) {
    reportError('normalize data list entry details failed');
    return null;
  }

  let fields = {};
  const modifiedContent = {
    ...content,
    sections: content?.form_metadata?.sections?.map((section) => {
      fields = { ...fields, ...constructFieldDataFromApi(section?.field_metadata || {}, section?.section_uuid) };
      return {
        ...section,
        layout: removeAllEmptyLayouts(constructTreeStructure(section?.contents)),
      };
    }),
    fields: fields,
  };

  console.log('getEntryNOrmalizer', content, modifiedContent);

  return modifiedContent;
};

export const normalizeFormDetailsByDataListId = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError(`normalize ${content} form details data failed`);
    return null;
  }

  let fields = {};
  const modifiedContent = {
    ...content,
    sections: content?.sections?.map((section) => {
      fields = { ...fields, ...constructFieldDataFromApi(section?.field_metadata || {}, section?.section_uuid) };
      return {
        ...section,
        layout: constructTreeStructure(section?.contents),
      };
    }),
    fields: fields,
  };

  return modifiedContent;
};

export const normalizeDeleteDataList = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('delete data list failed');
    return null;
  }
  return content;
};

export const normalizeDiscardDataList = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('discard data list failed');
    return null;
  }
  return content;
};

export const normalizeSubmitDataListEntry = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('submit data list entry failed');
    return null;
  }
  return content;
};

export const normalizeSubmitBulkDataListEntry = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  return content;
};

export const normalizeAddNewNotes = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('add new note fixed');
    return null;
  }
  return content;
};

export const normalizeAddNewRemainder = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('add new remainder fixed');
    return null;
  }
  return content;
};

const validatePaginationData = (paginationData) => {
  const requiredProps = [
    '_id',
    'task_metadata_uuid',
    'task_name',
    'assigned_to',
    'due_date',
  ];
  requiredProps.forEach((prop) => {
    if (!hasOwn(paginationData, prop)) {
      reportError(`pagination data failed : ${prop} missing`);
      return null;
    }
    return prop;
  });
  return paginationData;
};

export const normalizeDataListEntryTaskDetails = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  const paginationData = content.pagination_data;
  if (paginationData.length === 0) {
    return content;
  }
  validatePaginationData(paginationData[0]);

  if (!content) {
    reportError('data list entry task details failed');
    return null;
  }
  return content;
};

export const normalizeTruncateAllDataList = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('delete data list failed');
    return null;
  }
  return content;
};

export const normalizeDatalistBasicInfo = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('DatalistBasicInfo API failed');
    return null;
  }
  return convertBeToFeKeys(content);
};

export const normalizeDatalistSummaryInfo = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('Datalist Summary API failed');
    return null;
  }
  return convertBeToFeKeys(content, { data_list_uuid: 'dataListUUID' }, [], ['users', 'teams']);
};

export const normalizeDatalistSecurityInfo = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('Datalist security API failed');
    return null;
  }
  return convertBeToFeKeys(content, {}, [], ['users', 'teams', 'security_policies', 'policy_fields']);
};

export const normalizeDatalistAddOnInfo = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('Datalist AddOn API failed');
    return null;
  }
  return convertBeToFeKeys(content);
};

export const normalizeSaveDataListResponse = (untrustedContent) => {
  const content = validateSaveDataList(untrustedContent.data.result.data);
  if (!content) {
    reportError('Datalist Save API failed');
    return null;
  }
  return convertBeToFeKeys(content, {}, [], ['users', 'teams', 'security_policies', 'translation_availability', 'form_metadata', 'policy_fields', 'trigger_details']);
};

export const normalizeGetDataListResponse = (untrustedContent) => {
  const content = validateSaveDataList(untrustedContent.data.result.data);
  if (!content) {
    reportError('Datalist getDraft API failed');
    return null;
  }
  return convertBeToFeKeys(content, {}, [], ['users', 'teams', 'security_policies', 'translation_availability', 'policy_fields', 'trigger_details']);
};

export default normalizeSaveDataList;
