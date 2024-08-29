import { has, isEmpty, findIndex, cloneDeep, compact } from 'utils/jsUtility';

 export const constructMetricFields = (metric_fields) => {
   if (!isEmpty(metric_fields)) {
     const metricFields = metric_fields.map((field) => {
         return {
             ...field,
             existing_data: { ...field },
         };
     });
     return metricFields;
   }
   return [];
};

export const constructAndMapMetricFieldObject = (fieldObject, current_metric_field_uuid, metric_fields, modifiedLabel) => {
    const paramNotNeed = ['validations', 'field_type', 'field_list_type'];
    let metric = { label: modifiedLabel };
   if (!isEmpty(fieldObject)) {
       metric = {
          ...fieldObject,
          label: fieldObject.field_name,
      };
      paramNotNeed.forEach((param) => has(metric, param, false) && delete metric[param]);
    }

        const index = findIndex(metric_fields, { existing_data: { field_uuid: current_metric_field_uuid } });
        if (index >= 0 && !isEmpty(metric_fields[index])) {
        return {
                ...metric_fields[index],
                ...metric,
            };
        }
   return fieldObject;
};

export const getUpdatedMetricFields = (metric_fields, current_metric_field) => {
  if (!isEmpty(metric_fields) && !isEmpty(current_metric_field) && has(current_metric_field, 'existing_data', false)) {
      const index = findIndex(metric_fields, { existing_data: { field_uuid: current_metric_field.existing_data.field_uuid } });
      const metricFields = cloneDeep(metric_fields);
      console.log('getUpdatedMetricFields', current_metric_field, index, current_metric_field.existing_data._id);

      metricFields[index] = current_metric_field;
      return metricFields;
  }
  return metric_fields;
};

export const getUpdatedMetricFieldsForChangeHandler = (metric_fields, current_metric, metric_field_uuid) => {
    if (!isEmpty(metric_fields) && !isEmpty(current_metric)) {
        const index = findIndex(metric_fields, { existing_data: { field_uuid: metric_field_uuid } });
        const metricFields = cloneDeep(metric_fields);
        metricFields[index] = current_metric;
        return metricFields;
    }
    return metric_fields;
  };

export const consolidateMetricFields = (metric_fields) => {
 let consolidatedMetricFields = cloneDeep(metric_fields);
 if (!isEmpty(metric_fields)) {
    consolidatedMetricFields = metric_fields.map((eachMetric) => {
        if (has(eachMetric, ['is_edit'], false)) {
             delete eachMetric.is_edit;
             return {
                 ...eachMetric,
                 ...(eachMetric.existing_data || {}),

             };
         } else if (has(eachMetric, ['is_add'], false)) {
            return null;
         }
         return eachMetric;
    });
 }
 return compact(consolidatedMetricFields);
};
