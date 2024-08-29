import jsUtility, { cloneDeep } from '../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import DASHBOARD_CONFIG_STRINGS, {
  FIELD_WIDTH,
  TAB_VALUES,
} from './DashboardConfig.strings';
import styles from './DashboardConfig.module.scss';

export const getDashboardTabOptions = (allRequestName, t) => [
  {
    labelText: allRequestName,
    value: TAB_VALUES.ALL_REQUEST,
    tabIndex: TAB_VALUES.ALL_REQUEST,
  },
  {
    labelText: DASHBOARD_CONFIG_STRINGS(t).PREVIEW.TAB.TASKS,
    value: TAB_VALUES.TASKS,
    tabIndex: TAB_VALUES.TASKS,
  },
];

export const getTaskTableHeaders = (t) => [
  {
    id: 'record_id',
    label: DASHBOARD_CONFIG_STRINGS(t).PREVIEW.TASK_TABLE_HEADER.RECORD_ID,
    widthWeight: 1,
  },
  {
    id: 'task_name',
    label: DASHBOARD_CONFIG_STRINGS(t).PREVIEW.TASK_TABLE_HEADER.TASK_NAME,
    widthWeight: 2,
  },
  {
    id: 'open_with',
    label: DASHBOARD_CONFIG_STRINGS(t).PREVIEW.TASK_TABLE_HEADER.OPEN_WITH,
    widthWeight: 1,
  },
  {
    id: 'pending_since',
    label: DASHBOARD_CONFIG_STRINGS(t).PREVIEW.TASK_TABLE_HEADER.PENDING_SINCE,
    widthWeight: 1,
  },
];

export const getDeletedFieldColumnsList = (columnList, fieldList) => {
  if (
    jsUtility.isArray(columnList) &&
    columnList.length > 0 &&
    jsUtility.isArray(fieldList) &&
    fieldList.length > 0
  ) {
    return columnList.map((data) => {
      const column = cloneDeep(data);
      const objColumn = jsUtility.find(fieldList, { _id: column?.field });
      if (jsUtility.isEmpty(objColumn)) {
        column.isDeletedField = true;
      }
      return column;
    });
  }
  return [];
};

export const getClassNameForDataColumn = (fieldWidth) => {
  let stylesClassName = EMPTY_STRING;
  switch (fieldWidth) {
    case FIELD_WIDTH.SMALL:
      stylesClassName = styles.ColumnWidthSmall;
      break;
    case FIELD_WIDTH.MEDIUM:
      stylesClassName = styles.ColumnWidthMedium;
      break;
    case FIELD_WIDTH.LARGE:
      stylesClassName = styles.ColumnWidthLarge;
      break;
    default:
      break;
  }
  return stylesClassName;
};
