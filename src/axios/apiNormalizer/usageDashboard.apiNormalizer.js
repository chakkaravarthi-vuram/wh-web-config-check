import { cloneDeep } from 'utils/jsUtility';
import { reportError } from '../../utils/UtilityFunctions';

export const normalizeUsageSummary = (untrustedContent) => {
  const rawData = cloneDeep(untrustedContent.data.result.data);
  const dataTobeValidate = cloneDeep(untrustedContent.data.result.data);
  let validatedData = true;

  if (!dataTobeValidate.flow_count && !dataTobeValidate.flow_count_billing_month && !dataTobeValidate.datalist_count && !dataTobeValidate.datalist_count_billing_month && !dataTobeValidate.adhoc_task_count && !dataTobeValidate.adhoc_task_count_billing_month) validatedData = false;

  if (!validatedData) {
    reportError('Usage Summary data is Invalid');
    return null;
  }
  return [rawData.flow_count, rawData.flow_count_billing_month, rawData.datalist_count, rawData.datalist_count_billing_month, rawData.adhoc_task_count, rawData.adhoc_task_count_billing_month];
};

export const normalizeUsersData = (untrustedContent) => {
  const rawData = cloneDeep(untrustedContent.data.result.data);
  const dataTobeValidate = cloneDeep(untrustedContent.data.result.data);
  let validatedData = true;

  if (!dataTobeValidate.top_active_users && !dataTobeValidate.top_active_developers && !dataTobeValidate.active_users_count) validatedData = false;
  else {
    const requiredProps = [
      'full_name',
      'email',
      'count',
    ];
    validatedData = dataTobeValidate.top_active_users.every((element) =>
      requiredProps.every((prop) => {
        if (!Object.prototype.hasOwnProperty.call(element, prop)) {
          return false;
        }
        return true;
      }));
  }

  if (!validatedData) {
    reportError('Users Summary data is Invalid');
    return null;
  }
  return [rawData.active_users_count, rawData.top_active_users, rawData.top_active_developers];
};

export const normalizeFlowList = (untrustedContent) => {
  const rawData = cloneDeep(untrustedContent.data.result.data);
  const dataTobeValidate = cloneDeep(untrustedContent.data.result.data);
  let validatedData = true;

  if (!dataTobeValidate.most_used_flows) validatedData = false;
  else {
    const requiredProps = [
      'flow_name',
      'inprogress_count',
      'completed_count',
    ];
    validatedData = dataTobeValidate.most_used_flows.every((element) =>
      requiredProps.every((prop) => {
        if (!Object.prototype.hasOwnProperty.call(element, prop)) {
          return false;
        }
        return true;
      }));
  }

  if (!validatedData) {
    reportError('Flow List data is Invalid');
    return null;
  }
  return rawData.most_used_flows;
};

export const normalizeTaskFlowList = (untrustedContent) => {
  const rawData = cloneDeep(untrustedContent.data.result.data);
  const dataTobeValidate = cloneDeep(untrustedContent.data.result.data);
  let validatedData = true;

  if (!dataTobeValidate.open_tasks_flows) validatedData = false;
  else {
    const requiredProps = [
      'flow_name',
      'task_name',
      'count',
    ];
    validatedData = dataTobeValidate.open_tasks_flows.every((element) =>
      requiredProps.every((prop) => {
        if (!Object.prototype.hasOwnProperty.call(element, prop)) {
          return false;
        }
        return true;
      }));
  }

  if (!validatedData) {
    reportError('Task Flow List data is Invalid');
    return null;
  }
  return rawData.open_tasks_flows;
};

export const normalizeUserTaskList = (untrustedContent) => {
  const rawData = cloneDeep(untrustedContent.data.result.data);
  const dataTobeValidate = cloneDeep(untrustedContent.data.result.data);
  let validatedData = true;

  if (!dataTobeValidate.open_tasks_user_flows) validatedData = false;
  else {
    const requiredProps = [
      'flow_name',
      'task_name',
      'username',
      'count',
    ];
    validatedData = dataTobeValidate.open_tasks_user_flows.every((element) =>
      requiredProps.every((prop) => {
        if (!Object.prototype.hasOwnProperty.call(element, prop)) {
          return false;
        }
        return true;
      }));
  }

  if (!validatedData) {
    reportError('User Task List data is Invalid');
    return null;
  }
  return rawData.open_tasks_user_flows;
};

export default normalizeFlowList;
