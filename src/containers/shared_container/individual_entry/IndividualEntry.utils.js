import Joi from 'joi';
import { validate } from '../../../utils/UtilityFunctions';
import jsUtility from '../../../utils/jsUtility';
import {
  CANCEL_INSTANCE_STRINGS,
  INDIVIDUAL_ENTRY_TAB_TYPES,
} from './IndividualEntry.strings';
import { constructInformationFieldFormContent } from '../../landing_page/my_tasks/task_content/TaskContent.utils';
import {
  constructTreeStructure,
  getSummaryFieldDataByMetaData,
} from '../../form/sections/form_layout/FormLayout.utils';
import { normalizer } from '../../../utils/normalizer.utils';
import { constructActiveFormDataFromResponse } from '../../form/editable_form/EditableForm.utils';
import {
  REQUEST_FIELD_KEYS,
  RESPONSE_FIELD_KEYS,
} from '../../../utils/constants/form/form.constant';
import {
  FIELD_TYPE,
  PROPERTY_PICKER_ARRAY,
} from '../../../utils/constants/form.constant';

export const getEntryIdFromUrl = (path) => {
  const arrPathName = path ? path.split('/') : null;
  let pathData = jsUtility.get(arrPathName, [3]);
  ['Reports'].every((blockListsData) => {
    if (pathData && pathData.includes(blockListsData)) {
      pathData = null;
      return false;
    }
    return true;
  });
  return pathData;
};

export const getSavePageDetails = (pageDetails, dashboardId, order, isEdit) => {
  const pageData = jsUtility.cloneDeep(pageDetails);
  const apiData = {
    name: pageData?.pageName,
    order: order,
    // same_as_entity_form: false,
  };
  if (!isEdit) {
    apiData.type = 'custom';
    apiData.dashboard_id = dashboardId;
  } else {
    apiData.type = pageDetails?.pageType;
  }
  const security = {
    is_inherit_from_parent: !pageData?.allowCustomViewers,
  };
  if (!security.is_inherit_from_parent) {
    security.viewers = { users: [], teams: [] };
    security.viewers.users = (pageData?.pageViewers?.users || [])?.map(
      (eachUser) => eachUser._id,
    );
    security.viewers.teams = (pageData?.pageViewers?.teams || [])?.map(
      (eachTeam) => eachTeam._id,
    );
    if (jsUtility.isEmpty(security?.viewers?.teams)) {
      delete security.viewers.teams;
    }
    if (jsUtility.isEmpty(security?.viewers?.users)) {
      delete security.viewers.users;
    }
  }
  apiData.security = security;
  return apiData;
};

export const getTabOptionsData = (tabApiData) => {
  const customPages = tabApiData.filter(
    (data) => data.type === INDIVIDUAL_ENTRY_TAB_TYPES.PAGE_BUILDER,
  );
  const tabData = tabApiData?.map((tab, index) => {
    return {
      value: tab?._id,
      labelText: tab?.name,
      order: tab?.order,
      uuid: tab?.page_uuid,
      tabIndex: tab?._id,
      isInherit: tab?.security?.is_inherit_from_parent,
      viewers: tab?.security?.viewers,
      type: tab?.type,
      index: index,
      disableDelete:
        tab?.type !== INDIVIDUAL_ENTRY_TAB_TYPES.PAGE_BUILDER ||
        customPages?.length === 1,
    };
  });
  const sortedTabData = tabData.sort((tab1, tab2) => tab1.order - tab2.order);
  return sortedTabData;
};

export const getReorderPageData = (tabOptions, dashboardId) => {
  const reorderDetails = {
    dashboard_id: dashboardId,
  };
  const orderData = tabOptions?.map((tab) => {
    return {
      page_id: tab?.value,
      order: tab?.order,
    };
  });
  reorderDetails.page_details = orderData;
  return reorderDetails;
};

export const getSystemPagesFormAllPages = (tabPages) => {
  const allPages = jsUtility.cloneDeep(tabPages);
  const systemPages = [];
  allPages?.forEach((page) => {
    if (page?.type !== 'custom') {
      systemPages.push(page?.type);
    }
  });
  return systemPages;
};

export const validateCancelInstance = (cancelInstance, t) => {
  const CANCEL_INSTANCE = CANCEL_INSTANCE_STRINGS(t);
  return validate(
    { comments: cancelInstance.comments.trim() },
    Joi.object({
      comments: Joi.string()
        .min(1)
        .max(2000)
        .required()
        .label(t(CANCEL_INSTANCE.REASON)),
    }),
  );
};

const setDatalistPickerChoiceValueObj = (field, section) => {
  field[RESPONSE_FIELD_KEYS.CHOICE_VALUE_OBJ] = {};
  const displayFields =
    field?.[RESPONSE_FIELD_KEYS.DATA_LIST_DETAILS]?.[
      RESPONSE_FIELD_KEYS.DISPLAY_FIELDS
    ] || [];
  displayFields.forEach((uuid) => {
    const displayField = section?.field_metadata?.find(
      (eachField) => eachField?.[REQUEST_FIELD_KEYS.FIELD_UUID] === uuid,
    );
    if (displayField) {
      const choiceValues = jsUtility.get(
        displayField,
        [REQUEST_FIELD_KEYS.CHOICE_VALUES],
        [],
      );
      const choiceObj = {};
      choiceValues.forEach((c) => {
        choiceObj[c.value.toString()] = c.label;
      });
      if (!jsUtility.isEmpty(choiceObj)) {
        field[RESPONSE_FIELD_KEYS.CHOICE_VALUE_OBJ][uuid] = choiceObj;
      }
    }
  });
};

export const getFormDetails = (
  activeTaskDetails,
  documentUrlDetails,
  isSummary = false,
  isUserMode = false,
) => {
  if (jsUtility.isEmpty(activeTaskDetails)) return {};
  const {
    form_metadata = {},
    active_form_content = {},
    document_url_details = {},
  } = activeTaskDetails;

  const { infoFieldFormState } = constructInformationFieldFormContent({
    sections: form_metadata?.sections,
    activeFormContent: active_form_content,
    documentUrlDetails: document_url_details,
  });

  const activeTask = { informationFieldFormContent: infoFieldFormState };
  activeTask.fields = {};
  activeTask.activeFormData = {};
  activeTask.formVisibility = form_metadata?.fields?.form_visibility || {};
  activeTask.formMetaData = {
    dependentFields: form_metadata?.fields?.dependent_fields || [],
    formVisibility: form_metadata?.fields?.form_visibility || {},
  };
  activeTask.documentURLDetails = documentUrlDetails;
  activeTask.sections = (form_metadata?.sections || []).map((section) => {
    const clonedSection = jsUtility.cloneDeep(section);
    clonedSection.layout = constructTreeStructure(section.contents); // removeAllEmptyLayouts
    section.field_metadata.forEach((f) => {
      if (isSummary) {
        const field = getSummaryFieldDataByMetaData(
          f,
          activeTaskDetails.trigger_details,
          isUserMode,
        );
        activeTask.fields[field[RESPONSE_FIELD_KEYS.FIELD_UUID]] = field;
      } else {
        const field = normalizer(f, REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS);
        const fieldUUID = field[RESPONSE_FIELD_KEYS.FIELD_UUID];

        if (
          PROPERTY_PICKER_ARRAY.includes(
            field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE],
          )
        ) {
          const referenceFieldType =
            field?.[RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS]?.[
              RESPONSE_FIELD_KEYS.REFERENCE_FIELD_TYPE
            ];
          if (
            [
              FIELD_TYPE.DROPDOWN,
              FIELD_TYPE.RADIO_GROUP,
              FIELD_TYPE.CHECKBOX,
            ].includes(referenceFieldType)
          ) {
            section?.field_metadata?.forEach((eachField) => {
              if (
                eachField?.[REQUEST_FIELD_KEYS.FIELD_UUID] ===
                field?.[RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS]?.[
                  RESPONSE_FIELD_KEYS.REFERENCE_FIELD_UUID
                ]
              ) {
                field[RESPONSE_FIELD_KEYS.CHOICE_VALUES] =
                  eachField?.[REQUEST_FIELD_KEYS.CHOICE_VALUES];
              }
            });
          }
        }

        if (field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.DATA_LIST) {
          setDatalistPickerChoiceValueObj(field, section);
        }

        activeTask.fields[fieldUUID] = field;
      }
    });
    return clonedSection;
  });

  activeTask.activeFormData = constructActiveFormDataFromResponse(
    active_form_content,
    activeTask.fields,
    { documentDetails: documentUrlDetails },
  );

  return activeTask;
};
