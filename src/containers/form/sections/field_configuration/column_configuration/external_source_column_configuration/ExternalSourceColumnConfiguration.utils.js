import { REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS } from '../../../../../../utils/constants/form/form.constant';
import { isEmpty, set } from '../../../../../../utils/jsUtility';

export const processDataRules = (rules) => {
    const modifiedRules = rules?.map((eachRule) => {
        const ruleFields = [];
        console.log('modifiedRulesmodifiedRules', rules, eachRule);
        eachRule?.rule?.output_format?.forEach((eachField) => {
            console.log('modifiedRulesmodifiedRules loop', eachField);
            // if ((eachField.type === FIELD_LIST_TYPE.TABLE) || (eachField.type === OUTPUT_FORMAT_KEY_TYPES.OBJECT)) {
                const tableColumns = [];
                if (eachField?.column_mapping) {
                    for (let i = 0; i < eachField?.column_mapping?.length; i += 2) {
                        tableColumns.push([
                            {
                                label: eachField?.column_mapping?.[i]?.name,
                                value: eachField?.column_mapping?.[i]?.uuid,
                                type: eachField?.column_mapping?.[i]?.type,
                                choice_value_type: eachField?.column_mapping?.[i]?.choice_value_type,
                            },
                            eachField?.column_mapping?.[i + 1] && {
                                label: eachField?.column_mapping?.[i + 1]?.name,
                                value: eachField?.column_mapping?.[i + 1]?.uuid,
                                type: eachField?.column_mapping?.[i + 1]?.type,
                                choice_value_type: eachField?.column_mapping?.[i + 1]?.choice_value_type,
                            },
                        ]);
                    }
                }
                ruleFields.push({
                    label: eachField.name,
                    value: eachField.uuid,
                    type: eachField?.type,
                    choice_value_type: eachField?.choice_value_type,
                    columns: tableColumns,
                    isTableField: !isEmpty(tableColumns),

                });
            // }
        });
        const directFields = [];
        for (let i = 0; i < ruleFields.length; i += 2) {
            console.log('ruleFieldsruleFieldsruleFields', eachRule, ruleFields, i);
            if (!ruleFields[i]?.isTableField || !ruleFields[i + 1]?.isTableField) {
                const fields = [];
                !ruleFields[i]?.isTableField && fields.push(
                     {
                        label: ruleFields?.[i]?.label,
                        value: ruleFields?.[i]?.value,
                        type: ruleFields?.[i]?.type,
                        choice_value_type: ruleFields?.[i]?.choice_value_type,
                    });
                !ruleFields[i + 1]?.isTableField && fields.push(
                    {
                       label: ruleFields?.[i + 1]?.label,
                       value: ruleFields?.[i + 1]?.value,
                       type: ruleFields?.[i + 1]?.type,
                       choice_value_type: ruleFields?.[i + 1]?.choice_value_type,
                   });
                   !isEmpty(fields) && directFields.push(fields);
            }
        }
        const tables = ruleFields?.filter((eachField) => eachField?.isTableField);
        return {
            label: eachRule.rule_name,
            value: eachRule.rule_uuid,
            tables: tables,
            directFields: directFields,
        };
    });
    console.log('modifiedRulesmodifiedRulesfinale', modifiedRules);
    return modifiedRules;
};

export const deconstructDataRules = (rules) => {
    const ruleList = rules.map((eachRule) => {
        const rule = {
            label: eachRule.rule_name,
            value: eachRule.rule_uuid,
        };
        const fields = [];
        eachRule?.rule?.output_format.forEach((eachField) => {
            if (eachField.column_mapping) {
                eachField.column_mapping.forEach((eachColumn) => {
                    const field = {
                        label: `${eachField.name}.${eachColumn.name}`,
                        value: `${eachField.uuid}.${eachColumn.uuid}`,
                        type: eachColumn?.type,
                        choice_value_type: eachColumn?.choice_value_type,
                        table_uuid: eachColumn.uuid,
                    };
                    fields.push(field);
                });
            } else {
                const field = {
                    label: eachField.name,
                    value: eachField.uuid,
                    type: eachField?.type,
                    choice_value_type: eachField?.choice_value_type,
                };
                fields.push(field);
            }
        });

        rule.fields = fields;
        return rule;
    });

    return ruleList;
};

export const getExternalSourceData = (fieldData, columns) => {
    const { AUTO_FILL, RULE_DETAILS, SOURCE,
        EXTERNAL_SOURCE_DATA, EXTERNAL_SOURCE_TABLE_COLUMNS,
        EXTERNAL_SOURCE_EXISTING_TABLE_COLUMNS, EXTERNAL_SOURCE_ID,
        EXTERNAL_SOURCE_RULE_NAME, EXTERNAL_SOURCE_RULE_UUID,
        RULE_NAME, RULE_UUID, EXTERNAL_SOURCE_TABLE_UUID, CHILD_DATA,
        IS_EXTERNAL_SOURCE_SAVED_RULE,
    } = RESPONSE_FIELD_KEYS;

const data = {};

// if true = already save , false = newly saved
if (fieldData?.[AUTO_FILL] && !isEmpty(fieldData?.[RULE_DETAILS])) {
    const externalSourceRule = fieldData?.[RULE_DETAILS]?.find((eachRule) => eachRule?.[RULE_UUID] === fieldData?.[AUTO_FILL]?.[SOURCE]);
    if (externalSourceRule) {
        data[EXTERNAL_SOURCE_DATA] = {};
        data[EXTERNAL_SOURCE_DATA][EXTERNAL_SOURCE_RULE_NAME] = externalSourceRule?.[RULE_NAME];
        data[EXTERNAL_SOURCE_DATA][EXTERNAL_SOURCE_RULE_UUID] = externalSourceRule?.[RULE_UUID];
        data[EXTERNAL_SOURCE_DATA][EXTERNAL_SOURCE_TABLE_UUID] = fieldData?.[AUTO_FILL]?.[CHILD_DATA];
        data[EXTERNAL_SOURCE_DATA][EXTERNAL_SOURCE_TABLE_COLUMNS] = [];
        data[EXTERNAL_SOURCE_DATA][EXTERNAL_SOURCE_EXISTING_TABLE_COLUMNS] = [];
        fieldData?.columns?.forEach?.((eachColumn) => {
            if (columns?.find((column) => column?.[RESPONSE_FIELD_KEYS.FIELD_UUID] === eachColumn?.[RESPONSE_FIELD_KEYS.FIELD_UUID])) {
                if ((eachColumn?.[AUTO_FILL]?.type === 'external_data') ||
                    (eachColumn?.form_details?.[0]?.[AUTO_FILL]?.type === 'external_data')) {
                    data[EXTERNAL_SOURCE_DATA][EXTERNAL_SOURCE_TABLE_COLUMNS].push(
                        eachColumn?.[AUTO_FILL]?.childData ||
                        eachColumn?.form_details?.[0]?.[AUTO_FILL]?.childData);
                    data[EXTERNAL_SOURCE_DATA][EXTERNAL_SOURCE_EXISTING_TABLE_COLUMNS].push(
                        eachColumn?.[AUTO_FILL]?.childData ||
                        eachColumn?.form_details?.[0]?.[AUTO_FILL]?.childData);
                }
            }
        });
        columns?.forEach((eachColumn) => {
            if (eachColumn?.[EXTERNAL_SOURCE_ID] &&
            !(data?.[EXTERNAL_SOURCE_DATA]?.[EXTERNAL_SOURCE_TABLE_COLUMNS]?.includes(eachColumn?.[EXTERNAL_SOURCE_ID]))) {
            data[EXTERNAL_SOURCE_DATA][EXTERNAL_SOURCE_TABLE_COLUMNS].push(
                eachColumn?.[EXTERNAL_SOURCE_ID]);
            data[EXTERNAL_SOURCE_DATA][EXTERNAL_SOURCE_EXISTING_TABLE_COLUMNS].push(
                eachColumn?.[EXTERNAL_SOURCE_ID]);
        }
        });
        data[EXTERNAL_SOURCE_DATA][IS_EXTERNAL_SOURCE_SAVED_RULE] = true;
    }
} else if (fieldData?.[EXTERNAL_SOURCE_DATA]) {
    data[EXTERNAL_SOURCE_DATA] = fieldData?.[EXTERNAL_SOURCE_DATA] || {};
    const finalExternalSourceColumns = [];
    const existingExternalSourceColumns = data?.[EXTERNAL_SOURCE_DATA]?.[EXTERNAL_SOURCE_TABLE_COLUMNS] || [];
    columns?.forEach((eachColumn) => {
        if (existingExternalSourceColumns?.includes(eachColumn?.[EXTERNAL_SOURCE_ID])) {
            finalExternalSourceColumns.push(eachColumn?.[EXTERNAL_SOURCE_ID]);
        }
    });
    data[EXTERNAL_SOURCE_DATA][EXTERNAL_SOURCE_EXISTING_TABLE_COLUMNS] = finalExternalSourceColumns;
    data[EXTERNAL_SOURCE_DATA][EXTERNAL_SOURCE_TABLE_COLUMNS] = finalExternalSourceColumns;
}

if (fieldData?.[REQUEST_FIELD_KEYS.AUTO_FILL]) {
 set(data, [
    EXTERNAL_SOURCE_DATA,
    IS_EXTERNAL_SOURCE_SAVED_RULE], true);
}

return data;
};
