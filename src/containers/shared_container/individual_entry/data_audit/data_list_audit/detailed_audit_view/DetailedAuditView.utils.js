import jsUtils from '../../../../../../utils/jsUtility';

export function constructAuditfields(data) {
  const tempArray = [];
  Object.keys(data.audit_data).forEach((key) => {
    if (jsUtils.isObject(data.audit_data[key]) && 'table_name' in data.audit_data[key]) {
      let addedRows = 0;
      const tabelUuid = key;
      const tabelData = data.audit_data[tabelUuid].table_data;
      tabelData.forEach((eachRow) => {
        if (Object.keys(eachRow).length === 2 || 'row_index' in eachRow) {
          let fieldUuid = null;
          if (eachRow.fieldUuid) {
            fieldUuid = eachRow.fieldUuid;
          }
          const rowId = eachRow.row_id;
          const actionType = eachRow.action;
          const activeRowData = data.active_form_content[tabelUuid];
          activeRowData.forEach((rowVal, index) => {
            if (rowVal._id === rowId) {
              tempArray.push({
                tabelUuid: tabelUuid,
                rowIndex: index,
                actionType: actionType,
                fieldUuid: fieldUuid,
              });
            } else if (rowVal === 0) {
              tempArray.push({
                tabelUuid: tabelUuid,
                rowIndex: index,
                actionType: actionType,
                fieldUuid: fieldUuid,
              });
            }
            return null;
          });
        } else if (Object.keys(eachRow).length === 1) {
          addedRows++;
        }
        return null;
      });
      const activeRowData = data.active_form_content[tabelUuid];
      let length = activeRowData.length - 1;
      for (let i = addedRows; i > 0; i--) {
        tempArray.push({
          tabelUuid: tabelUuid,
          rowIndex: length,
          actionType: 'add',
        });
        length--;
      }
    }
    return null;
  });
  return tempArray;
}
export const constructTabelFieldEditedList = (data) => {
  const tempArray = [];
  Object.keys(data.audit_data).forEach((key) => {
    const fieldUuid = key;
    if (jsUtils.isObject(data.audit_data[fieldUuid]) && 'table_data' in data.audit_data[fieldUuid]) {
      const tabelUuid = key;
      const tabelData = data.audit_data[tabelUuid].table_data;
      tabelData.forEach((eachRow) => {
        if (Object.keys(eachRow).length !== 2 && !('row_index' in eachRow)) {
          let temobj = eachRow;
          temobj = { ...temobj, tableUuid: tabelUuid };
          tempArray.push(temobj);
        }
        return null;
      });
    }
    return null;
  });
  return tempArray;
};
export const constructDeletedRow = (auditData, activeForm) => {
  const tempArray = [];
  if (auditData.action === 'create') {
    return;
  }
  Object.keys(auditData).forEach((key) => {
    if ('table_name' in auditData[key]) {
      const tabelUuid = key;
      const tabelData = auditData[tabelUuid].table_data;
      tabelData.forEach((eachRow) => {
        if ('row_index' in eachRow) {
          tempArray.push({ tabelUuid: key, rowIndex: eachRow.row_index });
        }
        return null;
      });
    }
    return null;
  });
  tempArray.forEach((data) => {
    activeForm[data.tabelUuid].splice(data.rowIndex, {});
    return null;
  });
};

export const DETAILED_AUDIT_VIEW_STRINGS = (translate) => {
return {
  BACK_TO_DATA_AUDIT: translate('individual_entry.data_audit.detailed_audit_view_strings.back_to_data_audit'),
  EDITED: translate('individual_entry.data_audit.detailed_audit_view_strings.edited'),
  FIELDS_ON: translate('individual_entry.data_audit.detailed_audit_view_strings.fields_on'),
  ADDED: translate('individual_entry.data_audit.detailed_audit_view_strings.added'),
  DELETED: translate('individual_entry.data_audit.detailed_audit_view_strings.deleted'),
};
};
