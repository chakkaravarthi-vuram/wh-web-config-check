import { MONTHS } from '../../../../../../utils/strings/CommonStrings';
import { getFullName } from '../../../../../../utils/generatorUtils';

export const AUDIT_VIEW_FORM = (translate) => {
return {
  FIELD_NAME: {
    ID: 'field_name',
    PLACEHOLDER: translate('individual_entry.data_audit.field_name'),
  },
  EDITOR_NAME: {
    ID: 'editor_name',
    PLACEHOLDER: translate('individual_entry.data_audit.editor_name'),
  },
  VERSION_HISTORY: translate('individual_entry.data_audit.version_history'),
  FILTER_BY: translate('individual_entry.data_audit.filter_by'),
};
};

export const AUDIT_CARD_STRINGS = (translate) => {
return {
  EDITED: translate('individual_entry.data_audit.audit_card_strings.edited'),
  FIELDS: translate('individual_entry.data_audit.audit_card_strings.fields'),
  VIEW_DETAILS: translate('individual_entry.data_audit.audit_card_strings.view_details'),
  NO_DATA_TITLE: translate('individual_entry.data_audit.audit_card_strings.no_data_title'),
  NO_DATA_SUBTITLE: translate('individual_entry.data_audit.audit_card_strings.no_data_subtitle'),
};
};

export const formatTime = (data) => {
  let splitValue = data.split(',');
  const time = splitValue[1];
  splitValue = splitValue[0].split(' ');
  const month = MONTHS.filter((value) => {
    if (value.shortMonth === splitValue[1]) {
      return true;
    }
    return false;
  });
  return `${month[0].fullMonth} ${splitValue[0]}, ${time}`;
};
export function customiseAudidlist(data, translate) {
  const temparray = data.pagination_data.map((data) => {
    const temp = {};
    temp.time = data.performed_on.pref_datetime_display;
    temp.fieldCount = Object.keys(data.audit_data).length;
    if (data.source !== 'flow_to_data_list') {
      temp.editorName = `${getFullName(data.performed_by.first_name, data.performed_by.last_name)}`;
    } else {
      temp.editorName = 'System';
      temp.flowId = data.source_details.flow_uuid;
      temp.flowUuid = data.source_details._id;
    }
    temp.editorId = data.performed_by._id;
    temp.actionHistoryId = data._id;
    temp.editedfieds = Object.keys(data.audit_data).map((key) => {
      if (key === 'action') {
        return { fieldname: `(${translate('individual_entry.data_audit.created')})`, type: 'add' };
      } else if (data.audit_data[key].table_name) {
        return { fieldname: data.audit_data[key].table_name, type: 'edit' };
      }
      return {
        fieldname: data.audit_data[key].field_name,
        type: data.audit_data[key].action,
      };
    });
    return temp;
  });
  return temparray;
}
export const constructFieldDropdownList = (data, translate) => {
  const temparray = data.pagination_data.map((data) => {
    const temp = {};
    temp.label = data.field_name;
    temp.value = data.field_uuid;
    return temp;
  });
  temparray.unshift({ label: translate('individual_entry.data_audit.all_fields'), value: '' });
  return temparray;
};
export const constructEditorNameDropdownList = (data, translate) => {
  const temparray = data.users.map((data) => {
    const temp = {};
    temp.label = `${data.first_name} ${data.last_name}`;
    temp.value = data._id;
    return temp;
  });
  temparray.unshift({ label: translate('individual_entry.data_audit.all_editors'), value: '' });
  return temparray;
};
