import { TASK_LIST_TYPE } from '../../containers/application/app_components/task_listing/TaskList.constants';
import { TASK_TAB_INDEX } from '../../containers/landing_page/LandingPage.strings';

export const getTaskTabIndexFromRouteTab = (tab) => {
    let index = 0;
    switch (tab) {
      case TASK_LIST_TYPE.OPEN: index = TASK_TAB_INDEX.OPEN; break;
      case TASK_LIST_TYPE.ASSIGNED_TO_OTHERS: index = TASK_TAB_INDEX.ASSIGNED_TO_OTHERS; break;
      case TASK_LIST_TYPE.DRAFT_TASKS: index = TASK_TAB_INDEX.DRAFT_TASK; break;
      case TASK_LIST_TYPE.COMPLETED_TASKS: index = TASK_TAB_INDEX.COMPLETED; break;
      case TASK_LIST_TYPE.SNOOZE_TASKS: index = TASK_TAB_INDEX.SNOOZED_TASK; break;
      default: break;
    }
    return index;
};
