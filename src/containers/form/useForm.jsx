import { useReducer } from 'react';
import { cloneDeep, get, set, isEmpty, unset, isNumber } from '../../utils/jsUtility';
import { FIELD_ACTION, FORM_ACTIONS, FORM_LAYOUT_TYPE, ROW_IDENTIFIER } from './Form.string';
import { RESPONSE_FIELD_KEYS } from '../../utils/constants/form/form.constant';
import { COLUMN_LAYOUT } from './sections/form_layout/FormLayout.string';
import { FIELD_TYPES } from './sections/field_configuration/FieldConfiguration.strings';

export const SAMPLE_SECTION_DATA = [
    {
      is_section_show_when_rule: false,
      section_name: 'Old Basic Details',
      section_order: 1,
      section_uuid: '001',
      no_of_columns: COLUMN_LAYOUT.THREE,
      layout: [
        {
            node_uuid: 'row_0',
            type: 'row',
            parent_node_uuid: 'root',
            order: 1,
            children: [
              {
                node_uuid: 'column_01',
                parent_node_uuid: 'row_0',
                type: 'column',
                maxLimit: 1,
                order: 1,
                children: [
                  {
                    parent_node_uuid: 'column_01',
                    type: 'field',
                    field_uuid: 'field_link',
                    order: 1,
                    children: [],
                  },
                ],
              },
              {
                node_uuid: 'column_02',
                parent_node_uuid: 'row_0',
                type: 'column',
                maxLimit: 1,
                order: 2,
                children: [
                  {
                    parent_node_uuid: 'column_02',
                    type: 'field',
                    field_uuid: 'field_currency',
                    order: 1,
                    children: [],
                  },
                ],
              },
              {
                node_uuid: 'column_03',
                parent_node_uuid: 'row_0',
                type: 'column',
                maxLimit: 1,
                order: 3,
                children: [
                  {
                    parent_node_uuid: 'column_03',
                    type: 'field',
                    field_uuid: 'field_scanner',
                    order: 1,
                    children: [],
                  },
                ],
              },
            ],
        },
        {
            node_uuid: 'row_1',
            type: 'row',
            parent_node_uuid: 'root',
            order: 2,
            children: [
              {
                node_uuid: 'column_11',
                parent_node_uuid: 'row_1',
                type: 'column',
                maxLimit: 1,
                order: 1,
                children: [
                  {
                    parent_node_uuid: 'column_11',
                    type: 'field',
                    field_uuid: 'field_single',
                    order: 1,
                    children: [],
                  },
                ],
              },
              {
                node_uuid: 'column_12',
                parent_node_uuid: 'row_1',
                type: 'column',
                maxLimit: 1,
                order: 2,
                children: [
                  {
                    parent_node_uuid: 'column_12',
                    type: 'field',
                    field_uuid: 'field_number',
                    order: 1,
                    children: [],
                  },
                ],
              },
              {
                node_uuid: 'column_13',
                parent_node_uuid: 'row_1',
                type: 'column',
                maxLimit: 1,
                order: 3,
                children: [
                  {
                    parent_node_uuid: 'column_13',
                    type: 'field',
                    field_uuid: 'field_date',
                    order: 1,
                    children: [],
                  },
                ],
              },
            ],
        },
      ],
    },
    {
        is_section_show_when_rule: false,
        section_name: 'New Basic Details',
        section_order: 2,
        section_uuid: '002',
        no_of_columns: COLUMN_LAYOUT.THREE,
        layout: [],
      },
];

export const SAMPLE_ACTIVE_FORM_DATA = () => {
  const formData = {
    field_single: null,
    field_number: null,
    field_paragraph: null,
    field_email: null,
    field_yes_or_no: null,
    field_checkbox: null,
    field_radio: null,
    field_dropdown: null,
    field_CSD: null,
    field_date: null,
    field_date_time: null,
    field_user_selector: null,
    field_data_list_selector: null,
    field_file_upload: null,
    field_phone_number: null,
    field_currency: null,
    field_link: null,
    field_information: null,
  };
  return formData;
};

const INITIAL_STATE = {
    fields: {},
    sections: [],
    activeField: {},
    activeFormData: {},
    validationMessage: {},
    documentDetails: {},
    formMetaData: {},
    activeLayout: {},
};

const reducer = (state, action, onFormConfigUpdate, onFormFillUpdate) => {
  switch (action.type) {
    case FORM_ACTIONS.SAVE_FIELD: {
        const { field, sectionUUID } = action?.payload || {};
        const fields = cloneDeep(state?.fields);
        const fieldUUID = field[RESPONSE_FIELD_KEYS.FIELD_UUID];

        fields[fieldUUID] = field;
        onFormConfigUpdate?.(state.sections, false, sectionUUID, fields); // 2nd param is isValidate - to indicate if section data should be validated
        return { ...state, fields: fields, ...field.activeExternalSourceData && { activeField: field } };
    }
    case FORM_ACTIONS.SAVE_FIELD_LIST: {
      const { fields = {}, sectionUUID } = action?.payload || {};
      const existingFields = cloneDeep(state)?.fields || {};

      const updatedFields = { ...existingFields, ...fields };
      onFormConfigUpdate?.(state.sections, false, sectionUUID, updatedFields); // 2nd param is isValidate - to indicate if section data should be validated

      return { ...state, fields: updatedFields };
  }
    case FORM_ACTIONS.DELETE_FIELD: {
        const { fieldUUID } = action?.payload || {};
        const fields = cloneDeep(state?.fields);
        const removedField = fields[fieldUUID];

        if (removedField?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.TABLE) {
          // delete table fields as well
          const tableUUID = removedField[RESPONSE_FIELD_KEYS.FIELD_UUID];
          const fieldUUIDs = Object.keys(fields);
          fieldUUIDs.forEach((uuid) => {
            const field = fields[uuid];
            if (field[RESPONSE_FIELD_KEYS.TABLE_UUID] === tableUUID) {
              delete fields[field[RESPONSE_FIELD_KEYS.FIELD_UUID]];
            }
          });
        }

        unset(fields, [fieldUUID]);

        return { ...state, fields: fields };
    }
    case FORM_ACTIONS.BULK_UPLOAD_FIELDS: {
      const { fields = {} } = state;
      const newFields = action.payload?.fields || {};

      const consolidatedFields = { ...fields, ...newFields };
      onFormConfigUpdate?.(state.sections, false, '', consolidatedFields);
      return { ...state, fields: consolidatedFields };
    }
    case FORM_ACTIONS.ADD_SECTION: {
      const { sectionData } = action?.payload || {};
      let sections = cloneDeep(state?.sections);
      if (isEmpty(sections)) {
          sections = [sectionData];
      } else {
          sections.push(sectionData);
      }

      onFormConfigUpdate?.(sections);
      return { ...state, sections: sections };
    }
    case FORM_ACTIONS.UPDATE_LAYOUT_IN_SECTION: {
      const { sectionUUID, layout = [] } = action?.payload || {};
      const sectionData = cloneDeep(state?.sections);
      const sectionIndex = sectionData.findIndex((eachSection) => eachSection.section_uuid === sectionUUID);
      if (sectionIndex > -1) {
        set(sectionData, [sectionIndex, 'layout'], layout);
      }
      return { ...state, sections: sectionData };
    }
    case FORM_ACTIONS.UPDATE_SECTION: {
      const { sectionData, sectionUUID } = action?.payload || {};

      const sections = cloneDeep(state?.sections);
      const sectionIndex = sections.findIndex((eachSection) => eachSection.section_uuid === sectionUUID);
      if (sectionIndex > -1) {
          set(sections, [sectionIndex], {
              ...get(sections, [sectionIndex], {}),
              section_name: !isEmpty(sections?.[sectionIndex]?.section_name) ? sections?.[sectionIndex]?.section_name : null,
              ...(sectionData || {}),
          });
      }
      onFormConfigUpdate?.(sections);
      return { ...state, sections: sections };
    }
    case FORM_ACTIONS.UPDATE_SECTION_NAME: {
      const { sectionName, sectionUUID } = action?.payload || {};

      const sections = cloneDeep(state?.sections);
      const sectionIndex = sections.findIndex((eachSection) => eachSection.section_uuid === sectionUUID);
      if (sectionIndex > -1) {
          set(sections, [sectionIndex], {
              ...get(sections, [sectionIndex], {}),
              section_name: sectionName,
          });
      }
      onFormConfigUpdate?.(sections, true, sectionUUID); // 2nd param is isValidate - to indicate if section data should be validated
      return { ...state, sections: sections };
    }
    case FORM_ACTIONS.UPDATE_SECTIONS: {
      const { sections } = action?.payload || {};
      onFormConfigUpdate?.(sections);
      return { ...state, sections };
    }
    case FORM_ACTIONS.DELETE_SECTION: {
      const { sectionUUID } = action?.payload || {};
      const sections = cloneDeep(state?.sections);
      const fields = cloneDeep(state?.fields);
      if (isEmpty(sections)) return state;

      const sectionIndex = sections.findIndex((eachSection) => eachSection.section_uuid === sectionUUID);
      if (sectionIndex > -1) {
        // recursively traverse the layout and delete fields which are present in that section
        const recursiveDelete = (layout) => {
          if (isEmpty(layout)) return;

          layout.children?.forEach((child) => recursiveDelete(child));
          if (layout.type === FORM_LAYOUT_TYPE.FIELD || layout.type === FORM_LAYOUT_TYPE.TABLE) {
            delete fields[layout?.field_uuid];
          }
        };

        const removedSection = sections[sectionIndex];
        removedSection.layout.forEach((layout) => recursiveDelete(layout));

        // remove section and update section order
        sections.splice(sectionIndex, 1);
        for (let i = 0; i < sections.length; i++) {
          sections[i].section_order = i + 1;
        }
      }

      onFormConfigUpdate?.(sections, false); // 2nd param is isValidate - to indicate if section data should be validated
      return { ...state, sections, fields };
    }
    case FORM_ACTIONS.IMPORT_FORM_FIELD: {
        const { layouts, sectionUUID } = cloneDeep(action?.payload) || {};
        const sections = cloneDeep(state?.sections);
        const sectionIndex = sections.findIndex((eachSection) => eachSection.section_uuid === sectionUUID);
        if (sectionIndex > -1) {
            sections[sectionIndex].layouts?.push?.(...layouts);
        }

    onFormConfigUpdate?.(sections);
    return { ...state, sections: sections };
    }
    case FORM_ACTIONS.IMPORT_SECTION: {
    const { sections: _sections } = cloneDeep(action?.payload) || {};
    const sections = cloneDeep(state?.sections);
    sections.push(..._sections);
    onFormConfigUpdate?.(sections);
    return { ...state, sections: sections };
    }
    case FORM_ACTIONS.ACTIVE_FIELD_DATA_CHANGE: {
      const { fieldData = {} } = action?.payload || {};
      if (isEmpty(fieldData)) return state;

      return { ...state, activeField: fieldData };
    }
    case FORM_ACTIONS.UPDATE_ACTIVE_FIELD: {
      const { data = {} } = action?.payload || {};
      if (isEmpty(data)) return state;

      return { ...state, activeField: { ...(state?.activeField || {}), ...data } };
    }
    case FORM_ACTIONS.ACTIVE_FIELD_COLUMN_DATA_CHANGE: {
      const { fieldData = {} } = action?.payload || {};
      if (isEmpty(state?.activeField) || isEmpty(fieldData)) return state;

      return { ...state, activeField: { ...(state?.activeField), activeColumn: fieldData } };
    }
    case FORM_ACTIONS.ACTIVE_FIELD_EXTERNAL_SOURCE_DATA_CHANGE: {
      const { data = {} } = action?.payload || {};
      if (isEmpty(state?.activeField) || isEmpty(data)) return state;

      return { ...state, activeField: { ...(state?.activeField), activeExternalSourceData: data } };
    }
    case FORM_ACTIONS.ACTIVE_FIELD_CLEAR: {
      return { ...state, activeField: {} };
    }
    case FORM_ACTIONS.ACTIVE_COLUMN_CLEAR: {
      const activeField = state?.activeField;
      delete activeField?.activeColumn;

      return { ...state, activeField };
    }
    case FORM_ACTIONS.ACTIVE_EXTERNAL_SOURCE_CLEAR: {
      const activeField = cloneDeep(state?.activeField);
      // activeField[FORM_ACTIONS.EXTERNAL_SOURCE_DATA] = activeField?.activeExternalSourceData?.externalSourceData;
      delete activeField?.activeExternalSourceData;

      return { ...state, activeField };
    }
    case FORM_ACTIONS.ACTIVE_FIELD_ERROR_LIST: {
      const { error = {} } = action?.payload || {};
      const activeField = get(state, ['activeField'], {});
      const activeColumn = get(activeField, ['activeColumn'], {});
      const activeExternalSourceColumn = get(activeField, ['activeExternalSourceData'], {});
      if (!isEmpty(activeColumn)) {
        activeColumn.errorList = error;
        activeField.activeColumn = activeColumn;
      } else if (!isEmpty(activeExternalSourceColumn)) {
        activeExternalSourceColumn.errorList = error;
        activeField.activeExternalSourceData = activeExternalSourceColumn;
      } else {
        activeField.errorList = error;
      }

      return { ...state, activeField };
    }
    case FORM_ACTIONS.ACTIVE_FORM_DATA_CHANGE: {
      const { fieldUUID, value, options = {} } = action?.payload || {};
      const tableUUID = options?.tableUUID;
      const clonedState = cloneDeep(state);
      console.log('check delete row 3', value, tableUUID || fieldUUID);
      let updatedState = clonedState;
      if (options?.tableAction) { // Occurs for table field actions - add and remove
        updatedState = (options?.tableAction !== FIELD_ACTION.TABLE_REMOVE_ROW) ?
        clonedState : {
          ...clonedState,
          activeFormData: {
            ...(clonedState?.activeFormData || {}),
            [tableUUID || fieldUUID]: value,
          },
        };
      } else { // Occurs for other fields
        updatedState = {
          ...clonedState,
          activeFormData: {
            ...(clonedState?.activeFormData || {}),
            [tableUUID || fieldUUID]: value,
          },
        };
      }
      const { getFormFieldUpdates } = options;
      const tableUtility = {
        tableAction: options?.tableAction,
        [ROW_IDENTIFIER.TEMP_ROW_UUID]: options?.[ROW_IDENTIFIER.TEMP_ROW_UUID],
      };
      console.log('check delete row 4', updatedState.activeFormData);
      getFormFieldUpdates(state.fields[fieldUUID], updatedState.activeFormData, tableUtility);
      onFormFillUpdate(updatedState?.activeFormData, options);
      return updatedState;
    }
    case FORM_ACTIONS.FILE_UPLOAD_FIELD_DATA_CHANGE: {
      const { fieldUUID, file, options = {}, calculateDynamicValidation } = action?.payload || {};
      const { document, removeIndex, getFormFieldUpdates, tableUUID, rowIndex, errorList = {}, removedFileId } = options;
      const clonedState = cloneDeep(state);
      let files = clonedState.activeFormData[fieldUUID] || [];
      if (tableUUID) {
        files = get(clonedState.activeFormData, [tableUUID, rowIndex, fieldUUID], []) || [];
      }
      let documentDetails = clonedState.documentDetails || {};
      if (isNumber(removeIndex)) {
        let documents = cloneDeep(documentDetails)?.uploaded_doc_metadata;
        files = files.slice(0, removeIndex).concat(files.slice(removeIndex + 1));
        const removedDocumentDetailIndex = documentDetails?.uploaded_doc_metadata?.findIndex((eachDocument) => {
          let files = cloneDeep(state)?.activeFormData?.[fieldUUID] || [];
          if (tableUUID) {
            files = get(cloneDeep(state)?.activeFormData, [tableUUID, rowIndex, fieldUUID], []) || [];
          }
          return files?.[removeIndex] === eachDocument?._id;
        });
        if (removedDocumentDetailIndex > -1) {
          documents = documents.slice(0, removedDocumentDetailIndex).concat(documents.slice(removedDocumentDetailIndex + 1));
        }
        documentDetails = {
          ...documentDetails,
          uploaded_doc_metadata: documents,
        };
      } else {
        files.push(file);
        documentDetails = {
          entity: documentDetails.entity || document.entity,
          entity_id: documentDetails.entity_id || document.entity_id,
          ref_uuid: documentDetails.ref_uuid || document.ref_uuid,
          uploaded_doc_metadata: [...(documentDetails.uploaded_doc_metadata || []), document],
        };
      }

      if (tableUUID) {
        set(clonedState.activeFormData, `${tableUUID}[${rowIndex}].${fieldUUID}`, files);
      } else {
        clonedState.activeFormData[fieldUUID] = files;
      }

      const updatedState = {
        ...clonedState,
        activeFormData: {
          ...clonedState.activeFormData,
        },
        documentDetails,
      };
      const tableUtility = {
        tableAction: options?.tableAction,
        [ROW_IDENTIFIER.TEMP_ROW_UUID]: options?.[ROW_IDENTIFIER.TEMP_ROW_UUID],
      };
      const dataForDynamicValidation = tableUUID ? clonedState.activeFormData[tableUUID] : files;
      const errors = { ...errorList, ...calculateDynamicValidation?.(dataForDynamicValidation) || {} };
      getFormFieldUpdates(state.fields[fieldUUID], updatedState.activeFormData, tableUtility);
      onFormFillUpdate(updatedState?.activeFormData, { documentDetails, errorList: errors, removedFileId: removedFileId });
      return updatedState;
    }

    case FORM_ACTIONS.FORM_DATA_UPDATE: {
      const { activeFormData } = action?.payload || {};

      const clonedState = cloneDeep(state);
      const updatedState = {
        ...clonedState,
        activeFormData,
      };
      return updatedState;
    }

    case FORM_ACTIONS.FORM_DATA_CHANGE: {
      const data = action?.payload || {};

      const clonedState = cloneDeep(state);
      const updatedState = {
        ...clonedState,
        ...data,
      };
      return updatedState;
    }

    case FORM_ACTIONS.COMMON_STATE_UPDATER: {
      const { executableFunc = null } = action?.payload || {};
      executableFunc?.(state);
      break;
    }

    case FORM_ACTIONS.VALIDATION_MESSAGE_DATA_CHANGE: {
      const validationMessage = action?.payload || {};
      const clonedState = cloneDeep(state);

      onFormFillUpdate(clonedState?.activeFormData, { validationMessage });

      const updatedState = {
        ...clonedState,
        validationMessage,
      };
      return updatedState;
    }

    case FORM_ACTIONS.ACTIVE_LAYOUT_DATA_CHANGE: {
      const activeLayout = action?.payload || {};
      if (isEmpty(activeLayout)) return state;

      return { ...state, activeLayout };
    }

    case FORM_ACTIONS.UPDATE_ACTIVE_LAYOUT: {
      const data = action?.payload || {};
      if (isEmpty(data)) return state;

      return { ...state, activeLayout: { ...(state?.activeLayout || {}), ...data } };
    }

    case FORM_ACTIONS.ACTIVE_LAYOUT_CLEAR: {
      return { ...state, activeLayout: {} };
    }

    default: return state;
  }
   return state;
};

const useFrom = (initialState = {}, onFormConfigUpdate, onFormFillUpdate) => {
    const [state, dispatcher] = useReducer(
        (state, action) => reducer(state, action, onFormConfigUpdate, onFormFillUpdate),
        { ...INITIAL_STATE, ...initialState });

    const dispatch = (type, data) => {
         dispatcher({ type, payload: data });
    };

    return {
        sections: state.sections,
        fields: state.fields,
        activeField: state.activeField,
        activeLayout: state.activeLayout,
        activeFormData: state.activeFormData,
        validationMessage: state.validationMessage,
        documentDetails: state.documentDetails,
        formMetaData: state.formMetaData,
        dispatch,
    };
};

export default useFrom;
