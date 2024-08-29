import { cloneDeep, isBoolean } from 'lodash';
import { FIELD_TYPES } from '../../../containers/form/sections/field_configuration/FieldConfiguration.strings';
import { REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS, RESPONSE_VALIDATION_KEYS } from '../../../utils/constants/form/form.constant';
import { isEmpty, get, isFiniteNumber } from '../../../utils/jsUtility';

export const constructColumns = (layout = {}, fields = {}, table = {}) => {
    const columnLayouts = Array.isArray(layout?.children) ? layout?.children : [];
    const sortedLayout = cloneDeep(columnLayouts).sort((a, b) => a.order - b.order);
    const columns = [];
    sortedLayout?.forEach((eachLayout, index) => {
            const field = fields[eachLayout[REQUEST_FIELD_KEYS.FIELD_UUID]];
            const uniqueColUUID = get(table, [RESPONSE_FIELD_KEYS.VALIDATIONS, RESPONSE_VALIDATION_KEYS[FIELD_TYPES.TABLE].UNIQUE_COLUMN_UUID]);

            if (!isEmpty(field)) {
                const constructedField = { ...field };
                constructedField.index = index;
                if (uniqueColUUID) {
                    constructedField.isUniqueCol = field[RESPONSE_FIELD_KEYS.FIELD_UUID] === uniqueColUUID;
                }
                columns.push(constructedField);
            }
    });
    return columns;
};

export const constructTableDataForFieldRender = (field = {}, layout = [], fields = {}) => {
    const constructedField = {
        [RESPONSE_FIELD_KEYS.SECTION_UUID]: field?.[RESPONSE_FIELD_KEYS.SECTION_UUID],
        [RESPONSE_FIELD_KEYS.PATH]: field?.[RESPONSE_FIELD_KEYS.PATH],
        [RESPONSE_FIELD_KEYS.NODE_UUID]: field?.[RESPONSE_FIELD_KEYS.NODE_UUID],
        [RESPONSE_FIELD_KEYS.FIELD_ID]: field?.[RESPONSE_FIELD_KEYS.FIELD_ID],
        [RESPONSE_FIELD_KEYS.FIELD_UUID]: field?.[RESPONSE_FIELD_KEYS.FIELD_UUID],
        [RESPONSE_FIELD_KEYS.FIELD_NAME]: field?.[RESPONSE_FIELD_KEYS.FIELD_NAME],
        [RESPONSE_FIELD_KEYS.FIELD_TYPE]: field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE],
        columns: constructColumns(layout, fields, field),
        [RESPONSE_FIELD_KEYS.VALIDATIONS]: field?.[RESPONSE_FIELD_KEYS.VALIDATIONS],
        ...(field?.[RESPONSE_FIELD_KEYS.AUTO_FILL]) && { [RESPONSE_FIELD_KEYS.AUTO_FILL]: field?.[RESPONSE_FIELD_KEYS.AUTO_FILL] },
        [RESPONSE_FIELD_KEYS.TRANSLATION_DATA]: field?.[RESPONSE_FIELD_KEYS.TRANSLATION_DATA],
        [RESPONSE_FIELD_KEYS.INSTRUCTION]: field?.[RESPONSE_FIELD_KEYS.INSTRUCTION],
        [RESPONSE_FIELD_KEYS.HELPER_TOOLTIP]: field?.[RESPONSE_FIELD_KEYS.HELPER_TOOLTIP],
      };
    return constructedField;
};

export const TABLE_CONTROL_ACCESS = (t) => {
    return {
    REVOKE_ADD_AND_EDIT_INFO: t('form_builder_strings.table_control.revoke_edit_info'),
  };
};

export const isEmptyChecker = (data, value) => {
  const fieldType = data[RESPONSE_FIELD_KEYS.FIELD_TYPE];

  if (fieldType === FIELD_TYPES.USER_TEAM_PICKER) {
    return !!(isEmpty(value?.users) && isEmpty(value?.teams));
  }
  return !isFiniteNumber(value) && !isBoolean(value) && isEmpty(value);
};
