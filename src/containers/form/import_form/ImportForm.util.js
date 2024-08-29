import { v4 as uuidV4, v4 } from 'uuid';
import { cloneDeep, has, intersection, isEmpty, set, unset } from '../../../utils/jsUtility';
import { IMPORT_ACTION_TYPE, IMPORT_FIELD_TYPES, IMPORT_FORM_STRINGS } from './ImportForm.strings';
import { REQUEST_FIELD_KEYS, REQUEST_SAVE_SECTION, RESPONSE_FIELD_KEYS, RESPONSE_SAVE_FORM } from '../../../utils/constants/form/form.constant';
import { FORM_LAYOUT_TYPE } from '../Form.string';
import { COLUMN_LAYOUT } from '../sections/form_layout/FormLayout.string';
import { constructFlatStructure, constructSinglePath, constructTreeStructure, removeAllEmptyLayoutExcludingLast } from '../sections/form_layout/FormLayout.utils';
import { COMMA, EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { GET_COLUMN_LAYOUT_TEMPLATE, GET_FIELD_LAYOUT_TEMPLATE, GET_ROW_LAYOUT_TEMPLATE } from '../layout/Layout.constant';
import { FIELD_TYPES } from '../sections/field_configuration/FieldConfiguration.strings';
import { normalizer } from '../../../utils/normalizer.utils';
import { removeFieldAndDocIds } from '../../../components/information_widget/InformationWidget.utils';

export const IMPORT_READONLY_FIELD_TYPES = [
  FIELD_TYPES.DATA_LIST_PROPERTY_PICKER,
  FIELD_TYPES.USER_PROPERTY_PICKER,
  FIELD_TYPES.INFORMATION,
];

export const isAllFieldsInSectionSelected = (fields) =>
  Object.values(fields)
    .filter((field) => !field[RESPONSE_FIELD_KEYS.IS_IMPORT_DISABLED])
    .every((field) => field.isImported);

export const isAllFieldsInSectionReadOnly = (fields) =>
  Object.values(fields)
    .filter((field) => !field[RESPONSE_FIELD_KEYS.IS_IMPORT_DISABLED])
    .every((field) => field.isImported && field.isReadOnly);

export const isAllFieldsInSectionEditable = (fields) =>
  Object.values(fields)
    .filter((field) => !field[RESPONSE_FIELD_KEYS.IS_IMPORT_DISABLED])
    .filter((field) => !IMPORT_READONLY_FIELD_TYPES.includes(field[RESPONSE_FIELD_KEYS.FIELD_TYPE]))
    .every((field) => field.isImported && !field.isReadOnly);

export const isAllSectionsSelected = (sections) =>
  sections.every((section) => isAllFieldsInSectionSelected(section.fields));

export const isAllSectionsReadOnly = (sections) =>
  sections.every((section) => isAllFieldsInSectionReadOnly(section.fields));

export const isAllSectionsEditable = (sections) =>
  sections.every((section) => isAllFieldsInSectionEditable(section.fields));

export const isAllFieldSelected = (fields = []) => {
  let isImported = true;
  let isAlreadyImported = true;
  fields.filter((field) => !field[RESPONSE_FIELD_KEYS.IS_IMPORT_DISABLED]).forEach((eachField) => {
    isImported = isImported && eachField?.isImported;
    isAlreadyImported =
      isAlreadyImported && eachField?.[RESPONSE_FIELD_KEYS.IS_IMPORT_DISABLED];
  });
  return { isImported: isImported && !isAlreadyImported, isAlreadyImported };
};

export const isAllTableFieldsOfTableSelected = (fields = {}, tableFieldUUIDs = []) =>
  tableFieldUUIDs.every((uuid) => fields[uuid].isImported);

// select/deselect all fields in a section and return sections[]
export const selectSectionFieldsAndReturnSections = (sections, sectionUUID) => {
  if (isEmpty(sections)) return sections;
  const { FIELD_UUID } = RESPONSE_SAVE_FORM;
  const { SECTION_UUID } = REQUEST_FIELD_KEYS;

  let actionType = null;

  const consolidatedSections = sections?.map((section) => {
    const _section = { ...section };
    if (_section[SECTION_UUID] === sectionUUID) {
      const isSectionSelected = isAllFieldsInSectionSelected(_section.fields);
      actionType = (isSectionSelected) ? IMPORT_ACTION_TYPE.DESELECTED : IMPORT_ACTION_TYPE.SELECTED;
      const fields = {};
      Object.values(cloneDeep(_section.fields))?.forEach((field) => {
        const _field = { ...field };
        if (!_field.isImportDisabled) {
          _field.isImported = !isSectionSelected;
          _field.isReadOnly = _field.isReadOnly || IMPORT_READONLY_FIELD_TYPES.includes(_field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]) || false;
        }
        fields[field[FIELD_UUID]] = _field;
      });
      _section.fields = fields;
    }
    return _section;
  });

  return { sections: consolidatedSections, actionType };
};

// select/deselect all field in all section and return sections[]
export const selectAllFormFieldsAndReturnSections = (sections, importType) => {
  if (isEmpty(sections)) return sections;

  let actionType = IMPORT_ACTION_TYPE.SELECTED;

  const { FIELD_UUID } = RESPONSE_SAVE_FORM;
  const isAllReadOnly = isAllSectionsReadOnly(sections);
  const isAllEditable = isAllSectionsEditable(sections);
  let isReadOnly = importType === IMPORT_FIELD_TYPES.READONLY;
  let isImported = true;

  if (importType === IMPORT_FIELD_TYPES.READONLY && isAllReadOnly) {
    isReadOnly = false;
    isImported = false;
    actionType = IMPORT_ACTION_TYPE.DESELECTED;
  } else if (importType === IMPORT_FIELD_TYPES.EDITABLE && isAllEditable) {
    isReadOnly = true;
    isImported = false;
    actionType = IMPORT_ACTION_TYPE.DESELECTED;
  }

  const consolidateSections = sections?.map((section) => {
    const _section = { ...section };
    const fields = {};
    Object.values(cloneDeep(_section.fields))?.forEach((field) => {
      const _field = { ...field };
      if (!_field.isImportDisabled) {
        _field.isImported = isImported;
        _field.isReadOnly = IMPORT_READONLY_FIELD_TYPES.includes(_field[RESPONSE_FIELD_KEYS.FIELD_TYPE]) || isReadOnly;
      }
      fields[field[FIELD_UUID]] = _field;
    });

    _section.fields = fields;
    return _section;
  });

  return { sections: consolidateSections, actionType };
};

// Set ReadOnly or Editable to a single field.
export const changeFieldImportTypeAndReturnSections = (
  sections,
  sectionUUID,
  fieldUUID,
  isReadOnly,
) => {
  if (isEmpty(sections)) return sections;
  const { SECTION_UUID } = REQUEST_FIELD_KEYS;
  return sections?.map((section) => {
    if (section[SECTION_UUID] === sectionUUID) {
      const _field = cloneDeep(section.fields[fieldUUID]);
      if (!isEmpty(_field)) {
        _field.isReadOnly = isReadOnly;
        section.fields[fieldUUID] = _field;
      }
    }
    return section;
  });
};

// Select Field by marking isImport as true.
export const selectFieldAndReturnSections = (
  sections,
  sectionUUID,
  fieldUUID,
  tableUUID,
  tableFieldUUIDs,
) => {
  const { SECTION_UUID } = REQUEST_FIELD_KEYS;

  // if table select all checkbox is clicked
  if (tableUUID && !fieldUUID) {
    return sections?.map((section) => {
      const _section = cloneDeep(section);
      if (_section[SECTION_UUID] === sectionUUID) {
        const allTableFieldsSelected = isAllTableFieldsOfTableSelected(_section.fields, tableFieldUUIDs);
        tableFieldUUIDs.forEach((uuid) => {
          _section.fields[uuid].isImported = !allTableFieldsSelected;
          _section.fields[uuid].isReadOnly = _section.fields[uuid].isReadOnly || IMPORT_READONLY_FIELD_TYPES.includes(_section.fields[uuid]?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]) || false;
        });
        // update isImported in Table as well
        _section.fields[tableUUID].isImported = !allTableFieldsSelected;
      }
      return _section;
    });
  }

  if (isEmpty(sections)) return sections;
  return sections?.map((section) => {
    const _section = { ...section };
    if (_section[SECTION_UUID] === sectionUUID) {
      const _field = cloneDeep(_section.fields[fieldUUID]);
      if (!isEmpty(_field)) {
        if (_field.isImported) {
          delete _field.isImported;
        } else {
          _field.isImported = true;
          _field.isReadOnly = _field.isReadOnly || IMPORT_READONLY_FIELD_TYPES.includes(_field[RESPONSE_FIELD_KEYS.FIELD_TYPE]) || false;
        }
        _section.fields[fieldUUID] = _field;
      }
    }
    return _section;
  });
};

export const getSelectedFields = (sections) => {
  const selectedFields = [];
  sections?.forEach((section) => {
    Object.values(section.fields).forEach((field) => {
      if (field.isImported) selectedFields.push({ ...field });
    });
  });

  return selectedFields;
};

export const generateNewLayoutFromExistingLayout = (layout = []) => {
  if (isEmpty(layout)) return [];

  return layout.map((eachlayout) => {
       eachlayout.children = generateNewLayoutFromExistingLayout(eachlayout?.children || []);
       eachlayout[REQUEST_FIELD_KEYS.NODE_UUID] = uuidV4();
       return eachlayout;
  });
};

export const setLayoutForSelectedFields = (selectedFields = [], cols = COLUMN_LAYOUT.TWO) => {
  const { FIELD_UUID } = RESPONSE_SAVE_FORM;
  const layout = [];
  const rows = Math.ceil(selectedFields.length / cols);
  let fieldIndex = 0;

  for (let i = 0; i < rows; i++) {
    const rowLayout = {
      node_uuid: v4(),
      type: FORM_LAYOUT_TYPE.ROW,
      parent_node_uuid: 'root',
      order: i + 1,
      children: [],
    };

    for (let j = 0; j < cols; j++) {
      const colLayout = {
        node_uuid: v4(),
        parent_node_uuid: rowLayout.uuid,
        type: FORM_LAYOUT_TYPE.COLUMN,
        maxLimit: 1,
        order: j + 1,
        children: [],
      };

      if (selectedFields[fieldIndex]) {
        const fieldLayout = {
          parent_node_uuid: colLayout.node_uuid,
          type: FORM_LAYOUT_TYPE.FIELD,
          field_uuid: selectedFields[fieldIndex][FIELD_UUID],
          order: 1,
          children: [],
        };
        colLayout.children.push(fieldLayout);
      }

      fieldIndex++;
      rowLayout.children.push(colLayout);
    }

    layout.push(rowLayout);
  }

  return layout;
};

export const setCoordinatesForSelectedFields = (selectedFields, existingFields = [], cols = 2) => {
    let i = 0;
    let row = 0; // y
    let col = 0; // x

    existingFields?.forEach((field) => {
      const { coordinates } = field;
      if (coordinates.y + coordinates.h >= row) row = coordinates.y + coordinates.h;
      if (coordinates.i > i) i = coordinates.i;
    });

    return selectedFields?.map((field) => {
      ++i;
      const _field = cloneDeep(field);
      _field[RESPONSE_FIELD_KEYS.FIELD_UUID] = uuidV4();
      _field.coordinates.i = i.toString();
      _field.coordinates.x = col;
      _field.coordinates.y = row;
      if ((col + _field.coordinates.w || 1) < cols) {
        // place field in same row, next col
        col = col + _field.coordinates.w || 1;
      } else {
        // place field in new row
        row += _field.coordinates.h || 1;
        col = 0;
      }
      return _field;
    });
};

export const getSelectedSections = (sections) => {
  const selectedSections = [];

  sections.forEach((section) => {
    const isSelected = Object.values(section?.fields).every(
      (f) => !f[RESPONSE_FIELD_KEYS.IS_IMPORT_DISABLED] && f.isImported,
    );
    if (isSelected) selectedSections.push(section);
  });

  return selectedSections;
};

export const constructSectionPostData = (section = {}, order = 1) => {
  const layout = constructFlatStructure(section?.layout, '');
  return {
      [REQUEST_SAVE_SECTION.SECTION_UUID]: section[REQUEST_SAVE_SECTION.SECTION_UUID] || undefined,
      [REQUEST_SAVE_SECTION.SECTION_ORDER]: order,
      [REQUEST_SAVE_SECTION.IS_SECTION_SHOW_WHEN_RULE]: section?.is_section_show_when_rule,
      [REQUEST_SAVE_SECTION.SECTION_NAME]: section?.section_name,
      [REQUEST_SAVE_SECTION.NO_OF_COLUMNS]: section?.no_of_columns,
      [REQUEST_SAVE_SECTION.CONTENTS]: layout,
   };
};

export const updateSectionsWithResponseData = (responseSections = []) => {
    const importedFields = [];

    const consolidatedSection = responseSections.map((section) => {
      const fields = Array.isArray(section?.field_metadata) ? section?.field_metadata : [];
      importedFields.push(...fields);
      return {
        ...section,
        layout: constructTreeStructure(section.contents),
      };
    });

    const { fields = [] } = normalizer({ fields: importedFields }, REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS);
    const importedFieldsObject = {};
    fields.forEach((eachField = {}) => {
      if (eachField?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.INFORMATION) {
        const { rawHtml, renderedTemplate } = removeFieldAndDocIds({ data: eachField?.[RESPONSE_FIELD_KEYS.INFORMATION_CONTENT]?.[RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE], isPostData: false });
        eachField[RESPONSE_FIELD_KEYS.INFORMATION_CONTENT] = {
            [RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE]: rawHtml,
            [RESPONSE_FIELD_KEYS.RENDERING_TEMPLATE]: renderedTemplate,
        };
      }

      importedFieldsObject[eachField?.[RESPONSE_FIELD_KEYS.FIELD_UUID]] = eachField;
    });

     return { consolidatedSections: consolidatedSection, importedFields: importedFieldsObject };
};

const UNIQUE_SEPARATOR = '#';
const DIRECT_FIELD_STRUCTURE = () => cloneDeep({ path: null, fieldUUID: null });
const TABLE_FIELD_STRUCTURE = () => cloneDeep({ path: null, fieldUUID: null, columns: {} });

export const internalFieldSelector = (selectedFields, sectionUUID, tableUUID, fieldUUID, path, tableFieldUUIDs) => {
       const clonedData = cloneDeep(selectedFields);
       const keys = Object.keys(clonedData);
       const isTableField = !!tableUUID;
       const localPath = `${sectionUUID}${UNIQUE_SEPARATOR}${path}`;

       if (!isTableField) {
          if (keys.includes(localPath)) unset(clonedData, [localPath]);
          else set(clonedData, [localPath], { ...DIRECT_FIELD_STRUCTURE(), fieldUUID: fieldUUID, path: localPath });
       } else {
          const isSelectAllColumnsClicked = !fieldUUID;
          const tablePath = localPath.substring(0,
            (localPath.lastIndexOf(FORM_LAYOUT_TYPE.TABLE) + FORM_LAYOUT_TYPE.TABLE.length),
          );
          if (keys.includes(tablePath) && !isSelectAllColumnsClicked) {
              const table = clonedData[tablePath];
              const tableColumns = table.columns;
              const tableColumnKeys = Object.keys(tableColumns);

              // Column Insert and Remove
              if (tableColumnKeys.includes(localPath)) unset(tableColumns, [localPath]);
              else set(tableColumns, [localPath], { ...DIRECT_FIELD_STRUCTURE(), fieldUUID: fieldUUID, path: localPath });

               // if column empty - remove OR update columns.
              if (isEmpty(tableColumns)) unset(clonedData, [tablePath]);
              else set(clonedData, [tablePath], { ...table, columns: tableColumns });
          } else if (tablePath !== localPath && !isSelectAllColumnsClicked) {
            const table = { ...TABLE_FIELD_STRUCTURE(), fieldUUID: tableUUID, path: tablePath };
            table.columns[localPath] = cloneDeep({ ...DIRECT_FIELD_STRUCTURE(), fieldUUID: fieldUUID, path: localPath });
            set(clonedData, [tablePath], { ...table });
          } else {
            const table = clonedData[tablePath] || TABLE_FIELD_STRUCTURE();
            table.fieldUUID = tableUUID;
            table.path = tablePath;
            let tableColumns = table.columns;
            const tableColumnKeys = Object.keys(tableColumns);
            if (tableColumnKeys.length === tableFieldUUIDs.length) {
              if (tableColumnKeys.length === 0) {
                // select all
                tableColumns = {};
                tableFieldUUIDs.forEach((uuid, idx) => {
                  const tableFieldPath = `${tablePath},${idx}_${FORM_LAYOUT_TYPE.FIELD}`;
                  set(tableColumns, [tableFieldPath], { ...DIRECT_FIELD_STRUCTURE(), fieldUUID: uuid, path: tableFieldPath });
                });
              } else {
                // deselect all
                tableColumns = {};
              }
            } else {
              // select all
                tableColumns = {};
                tableFieldUUIDs.forEach((uuid, idx) => {
                  const tableFieldPath = `${tablePath},${idx}_${FORM_LAYOUT_TYPE.FIELD}`;
                  set(tableColumns, [tableFieldPath], { ...DIRECT_FIELD_STRUCTURE(), fieldUUID: uuid, path: tableFieldPath });
                });
            }

            if (isEmpty(tableColumns)) unset(clonedData, [tablePath]);
            else set(clonedData, [tablePath], { ...table, columns: tableColumns });
          }
       }
       return clonedData;
};

const sortObjectbyFieldPathOrder = (object = {}) => {
  if (isEmpty(object)) return object;

  const entries = Object.entries(object);

  const sortedData = entries.sort((entryA, entryB) => {
    const a = entryA[0];
    const b = entryB[0];

    const [container1, column1, field1] = a
      .split(UNIQUE_SEPARATOR)[1]
      .split(',')
      .map((item) => item.split('_')[0])
      .map((item) => parseInt(item, 10));

    const [container2, column2, field2] = b
      .split(UNIQUE_SEPARATOR)[1]
      .split(',')
      .map((item) => item.split('_')[0])
      .map((item) => parseInt(item, 10));

    if (container1 !== container2) {
      return container1 - container2;
    } else if (column1 !== column2) {
      return column1 - column2;
    } else {
      return field1 - field2;
    }
  });

  return Object.fromEntries(sortedData);
};

export const arrangeFieldBasedOnLayoutOrder = (selectedFields = {}) => {
  const clonedData = cloneDeep(selectedFields);

  const values = Object.values(clonedData);

  const allTableFields = values.filter((eachTable) => has(eachTable, ['columns'], false));

  const tablePaths = [];

  allTableFields.forEach((eachTable) => {
      const clonedTable = cloneDeep(eachTable);
      clonedTable.columns = sortObjectbyFieldPathOrder(eachTable?.columns);
      clonedData[clonedTable?.path] = clonedTable;
      tablePaths.push(clonedTable?.path);
  });

  const soretedFields = sortObjectbyFieldPathOrder(clonedData);

  return { soretedFields, tablePaths };
};

export const selectSections = (sections = []) => {
  const pathObject = {};
  let fields = {};
  sections.forEach((s) => { fields = { ...fields, ...s.fields }; });

  const getObjectForEachLayout = (layout = [], path = EMPTY_STRING, sectionUUID = null, tablePath = null) => layout.map(
    (eachLayout, idk) => {
    const currentPath = path ? [path, constructSinglePath(idk, eachLayout?.type)].join(COMMA) : constructSinglePath(idk, eachLayout?.type);
    let tPath = null;
    if ([FORM_LAYOUT_TYPE.FIELD, FORM_LAYOUT_TYPE.TABLE].includes(eachLayout?.type)) {
        const field = fields[eachLayout.field_uuid];
        if (field && !field[RESPONSE_FIELD_KEYS.IS_IMPORT_DISABLED]) {
          if (eachLayout?.type === FORM_LAYOUT_TYPE.TABLE) {
            pathObject[`${sectionUUID}#${currentPath}`] = { ...TABLE_FIELD_STRUCTURE(), path: currentPath, fieldUUID: eachLayout?.field_uuid };
              tPath = `${sectionUUID}#${currentPath}`;
          } else if (tablePath) {
                pathObject[tablePath].columns[`${sectionUUID}#${currentPath}`] = { ...DIRECT_FIELD_STRUCTURE(), path: currentPath, fieldUUID: eachLayout?.field_uuid };
              } else {
                pathObject[`${sectionUUID}#${currentPath}`] = { ...DIRECT_FIELD_STRUCTURE(), path: currentPath, fieldUUID: eachLayout?.field_uuid };
              }
        }
    }
    eachLayout.children = getObjectForEachLayout(eachLayout.children, currentPath, sectionUUID, tPath);
    return eachLayout;
    },
  );
  sections.forEach((eachSection) => getObjectForEachLayout(eachSection?.layout, undefined, eachSection?.section_uuid, null));
  return pathObject;
};

export const deselectSections = (sectionUUIDs = [], selectedFields = {}) => {
    console.log('xyz sectionUUIDs, ', sectionUUIDs, selectedFields);
    if (isEmpty(sectionUUIDs) || isEmpty(selectedFields)) return {};

    const allKeys = Object.keys(selectedFields);

    const deselectedObject = {};

    allKeys.forEach((eachKey) => {
        if (sectionUUIDs.includes(eachKey.split(UNIQUE_SEPARATOR)[0])) {
          deselectedObject[eachKey] = selectedFields[eachKey];
        }
      },
    );

    return deselectedObject;
};

export const sortSections = (selectedField = {}, sectionUUIDOrder = []) => {
   const allFieldKeys = Object.keys(selectedField);
   const sortedSectionsKeys = allFieldKeys.sort((keyA, keyB) => {
      const sectionUUIDA = keyA.split('#')[0];
      const sectionUUIDB = keyB.split('#')[0];
      return sectionUUIDOrder.indexOf(sectionUUIDA) - sectionUUIDOrder.indexOf(sectionUUIDB);
   });
   const sectionBasedfields = {};
   sortedSectionsKeys.forEach((eachKey) => {
     const [sectionUUID] = eachKey.split('#');
     if (sectionBasedfields?.[sectionUUID]) {
      sectionBasedfields[sectionUUID][eachKey] = selectedField[eachKey];
     } else {
      sectionBasedfields[sectionUUID] = {
        [eachKey]: selectedField[eachKey],
      };
     }
   });
   return sectionBasedfields;
};

export const constructColumnsForTable = (selectedFields = {}, parentUUID = null) => {
  const values = Object.values(selectedFields);
  const columns = [];
  const fieldUUIDS = [];

  values.forEach((eachValue, idk) => {
    const field = GET_FIELD_LAYOUT_TEMPLATE(parentUUID, idk + 1, FORM_LAYOUT_TYPE.FIELD);
    columns.push({ ...field, field_uuid: eachValue?.fieldUUID });
    fieldUUIDS.push(eachValue?.fieldUUID);
  });
  return { field_uuids: fieldUUIDS, columns };
};

export const constructLayout = (selectedFields = {}, col = COLUMN_LAYOUT.TWO) => {
  const allKeys = Object.keys(selectedFields);
  const overallLayout = [];
  const fieldUUIDS = [];
  let rowOrder = 1;
  for (let fieldIdk = 0; fieldIdk < allKeys.length;) {
     const rowLayout = GET_ROW_LAYOUT_TEMPLATE();
     rowLayout.order = fieldIdk + 1;
     const columns = [];
     let isTable = has(selectedFields[allKeys[fieldIdk]] || {}, ['columns'], false);
     for (let colIdk = 0; colIdk < (isTable ? 1 : col); colIdk++) {
       const eachColumn = GET_COLUMN_LAYOUT_TEMPLATE(rowLayout?.node_uuid, colIdk + 1);
       const data = selectedFields[allKeys[fieldIdk]];
       isTable = has(data, 'columns', false);
      // if table comes in between in a row, fill the remaining cols of row with empty cols,
      // and continue to next outer loop iteration to insert the table in a new row
       if (isTable && colIdk !== 0) {
        colIdk++;
        columns.push(eachColumn);
        // eslint-disable-next-line no-continue
        continue;
       }
       if (!isEmpty(data)) {
        const field = GET_FIELD_LAYOUT_TEMPLATE(eachColumn?.node_uuid, 1, isTable ? FORM_LAYOUT_TYPE.TABLE : FORM_LAYOUT_TYPE.FIELD);
          if (isTable) {
            const { field_uuids, columns } = constructColumnsForTable(data?.columns, field.node_uuid);
            field.children = columns;
            fieldUUIDS.push(...field_uuids);
          }
         field.field_uuid = data.fieldUUID;
         fieldUUIDS.push(data.fieldUUID);
         eachColumn.children.push(field);
       }
       columns.push(eachColumn);
       fieldIdk++;
     }
     rowLayout.children = columns;
     rowLayout.order = rowOrder++;
     overallLayout.push(rowLayout);
  }
  return { fieldUUIDS, overallLayout };
};

export const constructSingleColumnLayout = (selectedFields = {}) => {
  const allKeys = Object.keys(selectedFields);
  const overallLayout = [];
  const fieldUUIDS = [];
  let rowOrder = 1;
  for (let fieldIdk = 0; fieldIdk < allKeys.length;) {
    if (selectedFields[allKeys[fieldIdk]]?.fieldListType !== 'direct') {
      fieldIdk++;
      // eslint-disable-next-line no-continue
      continue;
    }
     const rowLayout = GET_ROW_LAYOUT_TEMPLATE();
     rowLayout.order = fieldIdk + 1;
     const columns = [];
     const isTable = selectedFields[allKeys[fieldIdk]]?.fieldType === 'table';
     for (let colIdk = 0; colIdk < 1; colIdk++) {
       const eachColumn = GET_COLUMN_LAYOUT_TEMPLATE(rowLayout?.node_uuid, colIdk + 1);
       const data = selectedFields[allKeys[fieldIdk]];
      // if table comes in between in a row, fill the remaining cols of row with empty cols,
      // and continue to next outer loop iteration to insert the table in a new row
       if (isTable && colIdk !== 0) {
        colIdk++;
        columns.push(eachColumn);
        // eslint-disable-next-line no-continue
        continue;
       }
       if (!isEmpty(data)) {
        const field = GET_FIELD_LAYOUT_TEMPLATE(eachColumn?.node_uuid, 1, isTable ? FORM_LAYOUT_TYPE.TABLE : FORM_LAYOUT_TYPE.FIELD);
          if (isTable) {
            const dataColumns = {};
            allKeys.forEach((key) => {
              if (selectedFields[key]?.tableUUID === data.fieldUUID) {
                dataColumns[key] = selectedFields[key];
              }
            });
            const { field_uuids, columns } = constructColumnsForTable(dataColumns, field.node_uuid);
            field.children = columns;
            fieldUUIDS.push(...field_uuids);
          }
         field.field_uuid = data.fieldUUID;
         fieldUUIDS.push(data.fieldUUID);
         eachColumn.children.push(field);
       }
       columns.push(eachColumn);
       fieldIdk++;
     }
     !isTable && columns.push(GET_COLUMN_LAYOUT_TEMPLATE(rowLayout?.node_uuid, 2));
     rowLayout.children = columns;
     rowLayout.order = rowOrder++;
     overallLayout.push(rowLayout);
  }
  return { fieldUUIDS, overallLayout };
};

export const constructImportFormFieldLayout = (
  sortedSectionBasedFields = {},
  selectedSections = [],
  col = COLUMN_LAYOUT.TWO,
  existingSection = {},
  ) => {
    const selectedSectionObject = {};
    const fieldUUIDS = [];
    selectedSections.forEach((eachSection) => {
      selectedSectionObject[eachSection?.section_uuid] = eachSection;
    });

    let allLayout = [...(existingSection?.layout) ? existingSection.layout : []];

    Object.keys(sortedSectionBasedFields).forEach((sectionUUID) => {
        // check if the user is trying to import a table, if so check if that table already exists
        const sectionBasedfields = cloneDeep(sortedSectionBasedFields[sectionUUID]);
        Object.keys(sortedSectionBasedFields[sectionUUID]).forEach((key) => {
          if (key.includes(FORM_LAYOUT_TYPE.TABLE)) {
            const table = sectionBasedfields[key];
            const tableUUID = table.fieldUUID;
            const tableContentObj = existingSection?.contents?.find((c) => c.field_uuid === tableUUID);

            // if Table which user is trying to import already exists,
            // then connect the table Fields to the existing table by attaching node_uuid of existing table as parent_node_uuid of the selected table fields
            if (tableContentObj) {
              const tableNodeUUID = tableContentObj.node_uuid;
              const tableFields = existingSection?.contents.filter((c) => c.parent_node_uuid === tableNodeUUID);
              let order = 0;
              tableFields.forEach((tf) => { if (tf.order > order) order = tf.order; });
              const tableContents = Object.keys(table.columns).map((colKey) => {
                order++;
                const field = {
                  node_uuid: uuidV4(),
                  type: FORM_LAYOUT_TYPE.FIELD,
                  parent_node_uuid: tableNodeUUID,
                  order,
                  field_uuid: table.columns[colKey].fieldUUID,
                };
                fieldUUIDS.push(table.columns[colKey].fieldUUID);
                return field;
              });
              const updatedExistingLayoutContent = [...cloneDeep(existingSection?.contents), ...tableContents];
              allLayout = constructTreeStructure(updatedExistingLayoutContent);
              delete sectionBasedfields[key];
            }
          }
        });

        if (!isEmpty(sectionBasedfields)) {
          const { fieldUUIDS: allFieldUUID, overallLayout } = constructLayout(sectionBasedfields, col);
          fieldUUIDS.push(...allFieldUUID);
          allLayout.push(...overallLayout);
        }
      // }
    });

    allLayout = allLayout.map((eachLayout, idk) => {
      eachLayout.order = idk + 1;
      return eachLayout;
    });

    allLayout = removeAllEmptyLayoutExcludingLast(allLayout);

    return { usedFieldUUIDs: fieldUUIDS, allLayout };
};

export const constructImportSectionsLayout = (
  sortedSectionBasedFields = {},
  allSections = [],
  selectedSections = [],
) => {
  const clonedSections = cloneDeep(allSections);
  const allSectionsObject = {};
  const fieldUUIDS = [];

  clonedSections.forEach((eachSection) => {
    allSectionsObject[eachSection?.section_uuid] = eachSection;
  });

  const selectedSectionUUID = selectedSections.map((section) => section?.section_uuid);

  let sections = [];

  Object.keys(sortedSectionBasedFields).forEach((sectionUUID) => {
    const section = allSectionsObject[sectionUUID];
    if (selectedSectionUUID.includes(sectionUUID)) {
      sections.push(section);
      fieldUUIDS.push(...Object.keys(section?.fields));
    } else {
      const { fieldUUIDS: allFieldUUID, overallLayout } = constructLayout(sortedSectionBasedFields[sectionUUID], section?.no_of_columns || COLUMN_LAYOUT.TWO);
      section.layout = overallLayout;
      fieldUUIDS.push(...allFieldUUID);
      sections.push(section);
    }
  });

  sections = sections.map((eachSection, idk) => {
    eachSection.section_order = idk + 1;
    return eachSection;
  });

  return { usedFieldUUIDs: fieldUUIDS, sections };
};

export const getSelectedFieldObject = (sections = [], fieldUUIDS = []) => {
  const selectedFields = {};
  sections.forEach((eachSection) => {
    const fields = eachSection?.fields || [];
    const allFieldUUID = Object.keys(fields);
    const selectedFieldUUIDS = intersection(allFieldUUID, fieldUUIDS);
    selectedFieldUUIDS.forEach((eachFieldUUID) => {
      selectedFields[eachFieldUUID] = fields[eachFieldUUID];
      selectedFields[eachFieldUUID][RESPONSE_FIELD_KEYS.FORM_COUNT] = 2;
      selectedFields[eachFieldUUID][RESPONSE_FIELD_KEYS.READ_ONLY] = fields[eachFieldUUID].isReadOnly;
    });
  });
  return selectedFields;
};

export const getExistingFieldUUIDFromSections = (sections = []) => {
  const fieldUUIDS = [];

  sections.forEach((eachSection) => {
    const fields = eachSection?.field_metadata || [];
    fields?.forEach((field) => {
      if (field?.field_type !== FIELD_TYPES.TABLE) fieldUUIDS.push(field?.field_uuid || field?.fieldUUID);
    });
  });
  return fieldUUIDS;
};

export const validateImportForm = (selectedFields) => {
  const { IMPORT_FORM } = IMPORT_FORM_STRINGS();
  const error = { title: '', subtitle: '' };
  const validations = {};
  const hasError = false;

  if (isEmpty(selectedFields)) {
    return {
      hasError: true,
      error: {
        title: IMPORT_FORM.ERRORS.NO_FIELDS_SELECTED,
        subtitle: IMPORT_FORM.ERRORS.SELECT_FIELD,
      },
    };
  }

  return { hasError, error, validations };
};
