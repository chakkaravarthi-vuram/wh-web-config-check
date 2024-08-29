import jsUtility from '../../../../utils/jsUtility';
import { TASK_TAB_INDEX } from '../../../landing_page/LandingPage.strings';
import { RESULT_TYPE } from '../../Copilot.strings';

const getTaskList = (list) => {
  const arrTaskList = [];
  if (jsUtility.isEmpty(list)) {
    return arrTaskList;
  }

  if (jsUtility.isArray(list) && list.length > 0) {
    list.forEach((listData) => {
      if (!jsUtility.isEmpty(listData)) {
        const { _id, task_name, task_type, task_log_id } = listData;
        if (task_type === TASK_TAB_INDEX.OPEN) {
          const objTask = {
            id: task_log_id ?? _id,
            name: task_name,
            type: RESULT_TYPE.TASK,
          };
          arrTaskList.push(objTask);
        }
      }
    });
  }

  return arrTaskList;
};

export default getTaskList;
