import Joi from 'joi';
import { removeFieldAndDocIds } from '../../../../components/information_widget/InformationWidget.utils';
import { FIELD_LIST_TYPE, FIELD_TYPE } from '../../../../utils/constants/form.constant';
import {
  REQUEST_FIELD_KEYS,
  RESPONSE_FIELD_KEYS,
} from '../../../../utils/constants/form/form.constant';
import {
  isEmpty,
  cloneDeep,
  translateFunction,
  isBoolean,
} from '../../../../utils/jsUtility';
import { validate } from '../../../../utils/UtilityFunctions';
import { layoutSectionSchema } from '../../../../validation/form/form.validation.schema';
import { BUTTON_LINK_TYPE } from '../../../form/sections/field_configuration/FieldConfiguration.constants';
import { getSectionFieldsFromLayout } from '../../../form/sections/form_layout/FormLayout.utils';
import { formatValidationMessages } from '../../../task/task/Task.utils';
import { SUMMARY_FIELD_LIST_TYPES, VALUE_CONFIG_TYPE } from './Summary.constants';
import { convertBeToFeKeys } from '../../../../utils/normalizer.utils';
import { RULE_TYPE } from '../../../../utils/constants/rule/rule.constant';
import { MULTIPLE_ENTRY_TYPES } from '../../../form/external_source_data/ExternalSource.constants';
import { store } from '../../../../Store';

export const getDashboardPageApiData = (fieldData, options = {}) => {
  const { fields = {} } = options;
  const componentAndField = {
    section_uuid: fieldData[RESPONSE_FIELD_KEYS.SECTION_UUID],
    node_uuid: '',
    parent_node_uuid: '',
    name: fieldData[RESPONSE_FIELD_KEYS.FIELD_NAME],
    // label_position: '',
    field_type: fieldData[RESPONSE_FIELD_KEYS.FIELD_TYPE],
    field_list_type: fieldData[RESPONSE_FIELD_KEYS.FIELD_LIST_TYPES],
    order: 1,
    // addition config
    // align: 'left/right/center',
    // value_config: {
    //   type: 'external_data/calculated_rule/field/static',
    //   value: '', // rule uuid / field uuid / static
    //   child_data: '', // child uuid
    //   inherit_from_parent: false,
    // },
  };

  // addition config
  if (!isEmpty(fieldData[RESPONSE_FIELD_KEYS.HELP_TEXT])) {
    componentAndField.help_text = fieldData[RESPONSE_FIELD_KEYS.HELP_TEXT];
  }
  if (!isEmpty(fieldData[RESPONSE_FIELD_KEYS.INSTRUCTION])) {
    componentAndField.instructions = fieldData[RESPONSE_FIELD_KEYS.INSTRUCTION];
  }
  if (!isEmpty(fieldData[RESPONSE_FIELD_KEYS.RULE_UUID])) {
    componentAndField.visibility_rule =
      fieldData[RESPONSE_FIELD_KEYS.RULE_UUID];
  }
  if (isBoolean(fieldData[RESPONSE_FIELD_KEYS.HIDE_FIELD_IF_NULL])) {
    componentAndField.hide_field_if_null = fieldData[RESPONSE_FIELD_KEYS.HIDE_FIELD_IF_NULL];
  }

  // components
  if (fieldData.fieldType === FIELD_TYPE.RICH_TEXT) {
    componentAndField.information_content = {
      editor_template:
        fieldData[RESPONSE_FIELD_KEYS.INFORMATION_CONTENT][
          RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE
        ],
      rendering_template:
        fieldData[RESPONSE_FIELD_KEYS.INFORMATION_CONTENT][
          RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE
        ],
    };
    componentAndField.bg_color =
      fieldData[RESPONSE_FIELD_KEYS.BACKGROUND_COLOR];
    // componentAndField.information_data = {
    //   field_uuids: [],
    //   doc_ids: [],
    //   rules: [],
    // };

    componentAndField.information_data = {};
    const initialFields =
      fieldData?.[RESPONSE_FIELD_KEYS.INFORMATION_DATA]?.[
        RESPONSE_FIELD_KEYS.INSERTED_FIELDS
      ];
    const initialDocs = fieldData?.[RESPONSE_FIELD_KEYS.INFORMATION_DATA]?.[
      RESPONSE_FIELD_KEYS.INSERTED_DOCUMENT_DETAILS
    ]?.map((eachDoc) => eachDoc?.file_metadata?.[0]?._id);

    const { filteredFieldUuids, filteredDocIds, rawHtml, renderedTemplate } =
      removeFieldAndDocIds({
        data: fieldData?.[RESPONSE_FIELD_KEYS.INFORMATION_CONTENT]?.[
          RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE
        ],
        fieldUuids: initialFields,
        docIds: initialDocs,
        iscomponentAndField: true,
      });

    componentAndField[REQUEST_FIELD_KEYS.INFORMATION_CONTENT] = {
      [REQUEST_FIELD_KEYS.EDITOR_TEMPLATE]: rawHtml,
      [REQUEST_FIELD_KEYS.RENDERING_TEMPLATE]: renderedTemplate,
    };

    if (!isEmpty(filteredFieldUuids)) {
      componentAndField.information_data.field_uuids = filteredFieldUuids;
    }
    if (!isEmpty(filteredDocIds)) {
      componentAndField.information_data.doc_ids = filteredDocIds;
      const uploadedDocMetadata = [];
      fieldData?.[RESPONSE_FIELD_KEYS.INFORMATION_DATA]?.[
        RESPONSE_FIELD_KEYS.INSERTED_DOCUMENT_DETAILS
      ]?.forEach((eachDocument) => {
        if (filteredDocIds.includes(eachDocument?.file_metadata?.[0]?._id)) {
          uploadedDocMetadata.push({
            type: eachDocument?.file_metadata?.[0]?.type,
            upload_signed_url:
              eachDocument?.file_metadata?.[0]?.upload_signed_url?.s3_key,
            document_id: eachDocument?.file_metadata?.[0]?._id,
          });
        }
      });
      if (fieldData?.isImageChange) {
      componentAndField.document_details = {
        entity:
          fieldData?.[RESPONSE_FIELD_KEYS.INFORMATION_DATA]?.[
            RESPONSE_FIELD_KEYS.INSERTED_DOCUMENT_DETAILS
          ]?.[0]?.entity,
        entity_id:
          fieldData?.[RESPONSE_FIELD_KEYS.INFORMATION_DATA]?.[
            RESPONSE_FIELD_KEYS.INSERTED_DOCUMENT_DETAILS
          ]?.[0]?.entity_id,
        ref_uuid:
          fieldData?.[RESPONSE_FIELD_KEYS.INFORMATION_DATA]?.[
            RESPONSE_FIELD_KEYS.INSERTED_DOCUMENT_DETAILS
          ]?.[0]?.ref_uuid,
        uploaded_doc_metadata: uploadedDocMetadata,
      };
      }
    }
    componentAndField.field_list_type = SUMMARY_FIELD_LIST_TYPES.DIRECT;
    delete componentAndField.name;
  } else if (fieldData.fieldType === FIELD_TYPE.BUTTON_LINK) {
    componentAndField.button_config = {
      button_type: fieldData.buttonActionType,
      style: fieldData.buttonStyle,
    };
    if (fieldData.buttonActionType === BUTTON_LINK_TYPE.START_SUB_FLOW) {
      componentAndField.button_config.trigger_uuid = fieldData.triggerUUID;
    } else if (
      fieldData.buttonActionType === BUTTON_LINK_TYPE.INTERNAL_EXTERNAL_LINK
    ) {
      componentAndField.button_config.link_url = fieldData.linkURL;
    }
    componentAndField.name = fieldData?.buttonName;
    componentAndField.field_list_type = SUMMARY_FIELD_LIST_TYPES.DIRECT;
  } else if (fieldData.fieldType === FIELD_TYPE.IMAGE) {
    componentAndField.value_config = {
      type: VALUE_CONFIG_TYPE.STATIC,
      doc_id: fieldData.imageId,
    };
    if (fieldData?.isImageChange) {
      componentAndField.document_details = fieldData?.documentDetails;
    }
    componentAndField.field_list_type = SUMMARY_FIELD_LIST_TYPES.DIRECT;
    delete componentAndField.name;
  }

  // User defined fields
  if (fieldData[RESPONSE_FIELD_KEYS.FIELD_SOURCE_TYPE] === VALUE_CONFIG_TYPE.USER_DEFINED_FIELD) {
    componentAndField.value_config = {
      type: VALUE_CONFIG_TYPE.USER_DEFINED_FIELD,
      value: fieldData[RESPONSE_FIELD_KEYS.SELECTED_FIELD_UUID],
    };

    if (fieldData[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.TABLE) {
      componentAndField.table_child_auto_fill =
        fieldData[RESPONSE_FIELD_KEYS.TABLE_CHILD_DATA];
    }

    if (
      [
        FIELD_TYPE.DATA_LIST,
        FIELD_TYPE.DATA_LIST_PROPERTY_PICKER,
        FIELD_TYPE.USER_TEAM_PICKER,
        FIELD_TYPE.USER_PROPERTY_PICKER,
      ].includes(fieldData.fieldType)
    ) {
      componentAndField.show_property = !!fieldData?.showProperty;
      if (componentAndField.show_property) {
        componentAndField.field_type = fieldData.datalistPickerFieldType;
        componentAndField.value_config.child_data =
          fieldData?.dataListPickerFieldUUID;
        componentAndField.name = fieldData?.datalistPickerFieldName;
      }
      if (
        [
          FIELD_TYPE.DATA_LIST_PROPERTY_PICKER,
          FIELD_TYPE.USER_PROPERTY_PICKER,
        ].includes(fieldData.fieldType)
      ) {
        componentAndField.value_config.value = fieldData.datalistPickerUUID;
      }
    }

    if (fieldData[RESPONSE_FIELD_KEYS.FIELD_LIST_TYPES] === SUMMARY_FIELD_LIST_TYPES.TABLE) {
      componentAndField.value_config = {
        type: VALUE_CONFIG_TYPE.USER_DEFINED_FIELD,
        inherit_from_parent: true,
        child_data: fieldData[RESPONSE_FIELD_KEYS.SELECTED_FIELD_UUID],
      };

      if (
        [
          FIELD_TYPE.DATA_LIST,
          FIELD_TYPE.DATA_LIST_PROPERTY_PICKER,
          FIELD_TYPE.USER_TEAM_PICKER,
          FIELD_TYPE.USER_PROPERTY_PICKER,
        ].includes(fieldData.fieldType)
      ) {
        componentAndField.show_property = !!fieldData?.showProperty;
        if (componentAndField.show_property) {
          componentAndField.field_type = fieldData.datalistPickerFieldType;
          componentAndField.value_config.child_data =
            fieldData?.dataListPickerFieldUUID;
          componentAndField.name = fieldData?.datalistPickerFieldName;
        }
        if (
          [
            FIELD_TYPE.DATA_LIST_PROPERTY_PICKER,
            FIELD_TYPE.USER_PROPERTY_PICKER,
          ].includes(fieldData.fieldType)
        ) {
          componentAndField.value_config.value = fieldData.datalistPickerUUID;
        }
      }
    }
  }

  // System fields
  if (fieldData[RESPONSE_FIELD_KEYS.FIELD_SOURCE_TYPE] === VALUE_CONFIG_TYPE.SYSTEM_FIELD) {
    componentAndField.value_config = {
      type: VALUE_CONFIG_TYPE.SYSTEM_FIELD,
      value: fieldData[RESPONSE_FIELD_KEYS.SELECTED_FIELD_UUID],
    };
    componentAndField.field_list_type = SUMMARY_FIELD_LIST_TYPES.DIRECT;
  }

  // External Rule Fields
  if (fieldData[RESPONSE_FIELD_KEYS.FIELD_SOURCE_TYPE] === VALUE_CONFIG_TYPE.EXTERNAL_DATA) {
    const selectedExternalRuleUUID = fieldData[RESPONSE_FIELD_KEYS.SELECTED_EXTERNAL_RULE_UUID];
    const selectedFieldUUID = fieldData[RESPONSE_FIELD_KEYS.SELECTED_FIELD_UUID];

    componentAndField.value_config = {
      type: VALUE_CONFIG_TYPE.EXTERNAL_DATA,
      value: selectedExternalRuleUUID,
    };

    if (fieldData[RESPONSE_FIELD_KEYS.SELECTED_FIELD_UUID]) {
      componentAndField.value_config.child_data = selectedFieldUUID;
    }

    if (fieldData[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.TABLE) {
      if (fieldData.isMultipleEntry && !selectedFieldUUID) {
        const externalRules = store.getState()?.IndividualEntryReducer?.pageBuilder?.externalRules || [];
        const externalFields = externalRules.find((r) => r.ruleUUID === selectedExternalRuleUUID)?.fields || [];
        const fieldTableUUIDMap = {};
        const childFieldUUIDMap = {};

        externalFields.forEach((field) => {
          if (field.fieldType === FIELD_TYPE.TABLE) {
            field.columnMapping?.forEach((column) => {
              fieldTableUUIDMap[column.fieldUUID] = column.tableUUID;
            });
          }
        });

        if (fieldData.fieldUUID) { // if its not the initial save, then attach the child_field_uuid
          Object.values(fields).forEach((field) => {
            const _selectedFieldUUID = field[RESPONSE_FIELD_KEYS.SELECTED_FIELD_UUID];
            if (_selectedFieldUUID) {
              childFieldUUIDMap[_selectedFieldUUID] = field.fieldUUID;
            }
          });
        }

        componentAndField.table_child_auto_fill = fieldData[RESPONSE_FIELD_KEYS.TABLE_CHILD_DATA]?.map((val) => {
          const tableUUID = fieldTableUUIDMap[val.child_data];
          const childData = tableUUID ? `${tableUUID}.${val.child_data}` : val.child_data;
          const tableChildAutoFill = { child_data: childData };
          if (childFieldUUIDMap[childData]) { // attach child_field_uuid
            tableChildAutoFill.child_field_uuid = childFieldUUIDMap[childData];
          }
          return tableChildAutoFill;
        });
      } else {
        componentAndField.table_child_auto_fill = fieldData[RESPONSE_FIELD_KEYS.TABLE_CHILD_DATA];
      }
    }

    if (fieldData[RESPONSE_FIELD_KEYS.FIELD_LIST_TYPES] === SUMMARY_FIELD_LIST_TYPES.TABLE) {
      componentAndField.value_config.inherit_from_parent = true;
      delete componentAndField.value_config.value;
    }
    componentAndField.field_list_type = FIELD_LIST_TYPE.DIRECT;
  }

  // table
  if (!isEmpty(fieldData[RESPONSE_FIELD_KEYS.TABLE_UUID])) {
    componentAndField.table_uuid = fieldData[RESPONSE_FIELD_KEYS.TABLE_UUID];
    componentAndField.field_list_type = FIELD_LIST_TYPE.TABLE;
  }

  // edit
  if (!isEmpty(fieldData[RESPONSE_FIELD_KEYS.FIELD_UUID])) {
    componentAndField.field_uuid = fieldData[RESPONSE_FIELD_KEYS.FIELD_UUID];
    componentAndField._id = fieldData[RESPONSE_FIELD_KEYS.FIELD_ID];
    componentAndField.node_uuid = fieldData[RESPONSE_FIELD_KEYS.NODE_UUID];
  }
  return componentAndField;
};

export const validateFormDetails = (
  formSections = [],
  t = translateFunction,
) => {
  const sectionsData = cloneDeep(formSections);
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
      Joi.object().keys({
        sections: layoutSectionSchema(t),
      }),
    ),
    cloneDeep(flattenedSectionWithFields),
  );
};

const swapExternalFieldType = (fieldType, ruleType) => {
  if (ruleType !== RULE_TYPE.INTEGRATION_FORM) return fieldType;

  switch (fieldType) {
    case 'text': return FIELD_TYPE.SINGLE_LINE;
    case 'datetime': return FIELD_TYPE.DATETIME;
    case 'number': return FIELD_TYPE.NUMBER;
    case 'boolean': return FIELD_TYPE.YES_NO;
    case 'object': return FIELD_TYPE.TABLE;
    default: return fieldType;
  }
};

const deconstructExternalField = (field, source, fieldListType = FIELD_LIST_TYPE.DIRECT) => {
  const _field = {
    fieldName: field.name,
    fieldType: swapExternalFieldType(field.type, source.ruleType),
    fieldListType,
    fieldUUID: field.uuid,
    ruleUUID: source.ruleUUID,
    ruleType: source.ruleType,
    label: field.name,
    value: field.uuid,
    isMultipleEntry: MULTIPLE_ENTRY_TYPES.includes(source.rule.type),
  };
  return _field;
};

export const deconstructExternalRulesForSummary = (response) => {
  const res = convertBeToFeKeys(response);
  const data = res.paginationData || [];

  const externalRules = data.map((source) => {
    const rule = {
      id: source.id,
      ruleUUID: source.ruleUUID,
      ruleName: source.ruleName,
      ruleType: source.ruleType,
      label: source.ruleName,
      value: source.ruleUUID,
      isMultipleEntry: MULTIPLE_ENTRY_TYPES.includes(source.rule.type),
      fields: [],
    };
    source.rule?.outputFormat.forEach((field) => {
      const _field = deconstructExternalField(field, source);
      if (field.columnMapping) {
        _field.columnMapping = field.columnMapping.map((f) => {
          const column = deconstructExternalField(f, source, FIELD_LIST_TYPE.TABLE);
          column.tableUUID = _field.fieldUUID;
          column.tableName = _field.fieldName;
          return column;
        });
      }
      rule.fields.push(_field);
    });
    return rule;
  });

  return externalRules;
};
