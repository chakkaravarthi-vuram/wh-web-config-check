import { MONTHS } from '../../../../../../../utils/strings/CommonStrings';
import { getFullName } from '../../../../../../../utils/generatorUtils';

export const AUDIT_VIEW_FORM = (translate) => {
return {
  FIELD_NAME: {
    ID: 'field_name',
    PLACEHOLDER: translate('datalist.view_datalist.audit_view.field_name'),
  },
  EDITOR_NAME: {
    ID: 'editor_name',
    PLACEHOLDER: translate('datalist.view_datalist.audit_view.editor_name'),
  },
  VERSION_HISTORY: translate('datalist.view_datalist.audit_view.version_history'),
  FILTER_BY: translate('datalist.view_datalist.audit_view.filter_by'),
};
};

export const AUDIT_CARD_STRINGS = (translate) => {
return {
  EDITED: translate('datalist.view_datalist.audit_view.audit_card_strings.edited'),
  FIELDS: translate('datalist.view_datalist.audit_view.audit_card_strings.fields'),
  VIEW_DETAILS: translate('datalist.view_datalist.audit_view.audit_card_strings.view_details'),
  NO_DATA_TITLE: translate('datalist.view_datalist.audit_view.audit_card_strings.no_data_title'),
  NO_DATA_SUBTITLE: translate('datalist.view_datalist.audit_view.audit_card_strings.no_data_subtitle'),
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
    temp.time = formatTime(data.performed_on.pref_datetime_display);
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
        return { fieldname: `(${translate('datalist.view_datalist.audit_view.created')})`, type: 'add' };
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
  temparray.unshift({ label: translate('datalist.view_datalist.audit_view.all_fields'), value: '' });
  return temparray;
};
export const constructEditorNameDropdownList = (data, translate) => {
  const temparray = data.users.map((data) => {
    const temp = {};
    temp.label = `${data.first_name} ${data.last_name}`;
    temp.value = data._id;
    return temp;
  });
  temparray.unshift({ label: translate('datalist.view_datalist.audit_view.all_editors'), value: '' });
  return temparray;
};
