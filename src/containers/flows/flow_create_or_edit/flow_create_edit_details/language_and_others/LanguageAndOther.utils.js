import { validate } from '../../../../../utils/UtilityFunctions';
import { cloneDeep, compact, isEmpty } from '../../../../../utils/jsUtility';
import { flowAddOnSchema } from '../../FlowCreateEdit.schema';

export const constructSaveFlowForAddOn = (state) => {
    const { addOn } = state;
    const postData = {
        flow_short_code: addOn.flowShortCode,
        technical_reference_name: addOn.technicalReferenceName,
        is_system_identifier: addOn.isSystemIdentifier || false,
    };

    if (!addOn.isSystemIdentifier) {
        postData.custom_identifier = addOn.customIdentifier?.value;
    }

    if (addOn?.category?.value) {
        postData.category_id = addOn.category.value;
    }
    postData.task_identifier = compact(addOn.taskIdentifier?.map?.((f) => f.value) || []);
    if (isEmpty(postData.task_identifier)) postData.task_identifier = null;

    return postData;
};

export const deconstructFlowAddOnData = (data) => {
    const addOn = cloneDeep(data);
    delete addOn.fieldMetadata;
    delete addOn?.categoryName;

    if (data.customIdentifier) {
        addOn.customIdentifier = {
          label: data.customIdentifier?.fieldName,
          value: data.customIdentifier?.fieldUUID,
        };
    }

    if (data?.categoryId) {
        addOn.category = {
            label: data?.categoryName,
            value: data.categoryId,
        };
    }

    if (data.taskIdentifier) {
        addOn.taskIdentifier = data.taskIdentifier.map((ti) => {
          return {
            label: ti.fieldName,
            value: ti?.fieldUUID,
          };
        });
    }

    return addOn;
};

export const validateFlowAddOn = (data, t) => {
    const addOn = cloneDeep(data);
    console.log('addx', addOn);
    // comments - do we really need to delete these keys from the object?
    delete addOn.id;
    delete addOn.publishedAsTestBed;
    delete addOn.translationStatus;
    delete addOn.stepStatuses;
    delete addOn.errorList;
    delete addOn?.categoryId;
    delete addOn.translationData;
    delete addOn?.translationAvailability;
    delete addOn?.translation_status;

    if (addOn.isSystemIdentifier) delete addOn.customIdentifier;
    else addOn.customIdentifier = addOn.customIdentifier?.value;

    addOn.taskIdentifier = compact(addOn.taskIdentifier?.map?.((f) => f.value) || []);
    if (isEmpty(addOn.taskIdentifier)) delete addOn.taskIdentifier;

    return validate(addOn, flowAddOnSchema(t));
};
