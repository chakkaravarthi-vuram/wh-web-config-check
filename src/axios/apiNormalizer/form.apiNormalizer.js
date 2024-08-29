import {
  validatePaginationData,
  validatePaginationDetails,
} from '../../utils/apiServiceAndNormalizerUtils';
import { hasOwn, reportError } from '../../utils/UtilityFunctions';
import { get } from '../../utils/jsUtility';
import { REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS } from '../../utils/constants/form/form.constant';
import { FIELD_GROUPING } from '../../containers/form/sections/field_configuration/basic_configuration/BasicConfiguration.utils';
import { FIELD_TYPES } from '../../containers/form/sections/field_configuration/FieldConfiguration.strings';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

export const validateGetFieldDependency = (content) => {
  const requiredProps = ['dependency_list', 'is_blocker'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate get field dependency data failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

export const normalizeGetFieldDependency = (untrustedContent) => {
  const content = validateGetFieldDependency(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalize get field dependency failed');
    return null;
  }
  return content;
};

export const normalizeGetListDependency = (untrustedContent) =>
  untrustedContent.data.result.data;

const validateSaveAction = (content) => {
  const requiredProps = ['_id', 'actions'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate SaveAction failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

const validateSaveFormHeader = (content) => {
  const requiredProps = ['_id', 'flow_id', 'title'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate SaveFormHeader failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

const validateSaveForm = (content) => {
  const requiredProps = [
    '_id',
    'account_id',
    'form_uuid',
    'form_title',
    'form_description',
  ];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate SaveForm failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

export const normalizeSaveAction = (untrustedContent) => {
  const content = validateSaveAction(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalizeSaveAction failed');
    return null;
  }

  return content;
};

export const normalizeDeleteAction = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('normalizeDeleteAction failed');
    return null;
  }
  return content;
};

export const normalizeSaveFormHeader = (untrustedContent) => {
  const content = validateSaveFormHeader(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalizeSaveFormHeader failed');
    return null;
  }

  return content;
};

export const normalizeDeleteField = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('normalizeDeleteField failed');
    return null;
  }

  return content;
};

export const normalizeSaveForm = (untrustedContent) => {
  const content = validateSaveForm(untrustedContent.data.result.data);

  if (!content) {
    reportError('normalizeSaveForm failed');
    return null;
  }

  return content;
};

const validateAddNewCategory = (content) => {
  const requiredProps = ['success'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate AddNewCategory failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

const validateGetDatalistFields = (content) => {
  const requiredProps = ['pagination_data', 'pagination_details'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate GetDatalistFields failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

const validateGetReferenceName = (content) => {
  const requiredProps = ['given_reference_name', 'suggested_reference_name'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate getReferenceName failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

export const normalizeAddNewCategory = (untrustedContent) => {
  const content = validateAddNewCategory(untrustedContent.data);

  if (!content) {
    reportError('normalizeAddNewCategory failed');
    return null;
  }

  return content;
};

export const validateGetFormDetailsApiResponse = (content) => {
  const requiredProps = ['sections'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(
        `validate get form details api response failed: ${prop} missing`,
      );
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

export const normalizeGetFormDetailsApiResponse = (untrustedContent) => {
  const content = validateGetFormDetailsApiResponse(
    untrustedContent.data.result.data,
  );
  if (!content) {
    reportError('normalize get form details api response failed');
    return null;
  }
  return content;
};

export const normalizeGetCategoryApiResponse = (untrustedContent) => {
  return {
    paginationData: validatePaginationData(
      get(untrustedContent, 'data.result.data.pagination_data'),
      ['category_name', '_id'],
      'get category',
    ),
    paginationDetails: validatePaginationDetails(
      get(untrustedContent, 'data.result.data.pagination_details'),
      undefined,
      'get category',
    ),
  };
};

export const normalizeGetDatalistFields = (untrustedContent) => {
  const content = validateGetDatalistFields(
    untrustedContent.data.result.data,
  );
  console.log('getfieldnormalizer', content);
  const modifiedContent = {
    ...content,
    datalistFields: content?.pagination_data?.map((field) => {
      let values = [];
      let choiceValueType = EMPTY_STRING;
        if (field?.field_type === FIELD_TYPES.YES_NO) {
          values = [
            {
              label: 'No',
              value: false,
            },
            {
              label: 'Yes',
              value: true,
            },
          ];
        }
        if (FIELD_GROUPING.SELECTION_FIELDS.includes(field?.field_type)) {
         if (field?.field_type === FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN) {
          values = field?.[REQUEST_FIELD_KEYS.CHOICE_VALUES]?.map((eachValue) => {
            return {
              label: eachValue,
              value: eachValue,
            };
          });
          choiceValueType = field?.[REQUEST_FIELD_KEYS.CHOICE_VALUE_TYPE];
        } else {
          values = field?.[REQUEST_FIELD_KEYS.CHOICE_VALUES];
          choiceValueType = field?.[REQUEST_FIELD_KEYS.CHOICE_VALUE_TYPE];
        }
      }
      return {
        label: field?.field_name,
        value: field?.field_uuid,
        [RESPONSE_FIELD_KEYS.FIELD_TYPE]: field?.field_type,
      ...(field?.data_list_details) ? {
        [RESPONSE_FIELD_KEYS.DATA_LIST_DETAILS]: {
          [RESPONSE_FIELD_KEYS.DATA_LIST_ID]: field?.data_list_details?.data_list_id,
          [RESPONSE_FIELD_KEYS.DATA_LIST_UUID]: field?.data_list_details?.data_list_uuid,
        } } :
        null,
      ...(FIELD_GROUPING.SELECTION_FIELDS.includes(field?.field_type) || field?.field_type === FIELD_TYPES.YES_NO) ? {
        [RESPONSE_FIELD_KEYS.VALUES]: values || [],
        [RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE]: choiceValueType,
      } : null,
      };
    }) || [],
    datalistFieldsPaginationDetails: {
      page: content?.pagination_details?.[0]?.page || 1,
      totalCount: content?.pagination_details?.[0]?.total_count || 0,
    },
  };
  return modifiedContent;
};

export const normalizeGetReferenceName = (untrustedContent) => {
  const content = validateGetReferenceName(
    untrustedContent.data.result.data,
  );

  const modifiedContent = {
    referenceName: content.suggested_reference_name,
  };
  return modifiedContent;
};
