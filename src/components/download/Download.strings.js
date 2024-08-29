import { BACKEND_BASE_URL } from 'urls/ApiUrls';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';

const getDownloadString = (isFlow) => {
  return {
    TITLE: 'downloads.title',
    SUB_TITLE: isFlow ? 'downloads.flow_sub_title' : 'downloads.datalist_sub_title',
    SELECT_FIELD: {
      TITLE: 'downloads.select_field.title',
      ALL: 'downloads.select_field.all',
    },
    BUTTONS: {
      CANCEL: {
        LABEL: 'downloads.buttons.cancel_label',
        ID: 'cancel',
      },
      DOWNLOAD: {
        LABEL: 'downloads.buttons.download_label',
        ID: 'download',
      },
    },
  };
};

export const DOWNLOAD_WINDOW_STRINGS = {
  TITLE: 'downloads.download_window_strings.title',
  ID: 'DownloadWindow',
  DOWNLOAD_CLOSE_COMMON_COMPONENT_CLASS: 'downloadCloseCommonComponentClass',
  MAXIMIZE: 'downloads.download_window_strings.maximize',
  MINIMIZE: 'downloads.download_window_strings.minimize',
  CLOSE: 'downloads.download_window_strings.close',
  STATUS: {
    CREATED: 'created',
    ACCESSED: 'accessed',
    DELETED: 'failed',
  },
  COLUMN: 'downloads.download_window_strings.column',
  NO_DOWNLOADS: 'downloads.download_window_strings.no_downloads',
  DOC_TYPE: {
    getDocTypeByType: (type) => {
      let docType;
      switch (type) {
        case DOWNLOAD_WINDOW_STRINGS.DOC_TYPE.flow_generated_doc:
          docType = DOWNLOAD_WINDOW_STRINGS.DOC_TYPE.FLOW;
          break;
        case DOWNLOAD_WINDOW_STRINGS.DOC_TYPE.data_list_generated_doc:
          docType = DOWNLOAD_WINDOW_STRINGS.DOC_TYPE.DATALIST;
          break;
        case DOWNLOAD_WINDOW_STRINGS.DOC_TYPE.task_generated_doc:
          docType = DOWNLOAD_WINDOW_STRINGS.DOC_TYPE.TASK;
          break;
        default:
          break;
      }
      return docType;
    },
    FLOW: 'downloads.flow',
    DATALIST: 'downloads.datalist',
    TASK: 'downloads.task',
    flow_generated_doc: 'flow_generated_doc',
    data_list_generated_doc: 'data_list_generated_doc',
    task_generated_doc: 'task_generated_doc',
  },
  ACTIVITY: {
    ID: 'DownloadActivityWindow',
    DOWNLOAD_ACTIVITY_CLOSE_COMMON_COMPONENT_CLASS:
      'downloadActivityCloseCommonComponentClass',
    PREPARING_DOWNLOAD: 'downloads.activity.preparing_download',
    DOWNLOADED: 'downloads.activity.downloaded',
    DOWNLOAD_FAILED: 'downloads.activity.download_failed',
    ALREADY_IN_PROGRESS: 'downloads.activity.already_in_progress',
    TYPE: { FLOW_OR_DATALIST: 'flowOrDatalist', TASK: 'task' },
    getActivityTitleByStatus: (status) => {
      let strStatus;
      switch (status) {
        case DOWNLOAD_WINDOW_STRINGS.STATUS.CREATED:
          strStatus = DOWNLOAD_WINDOW_STRINGS.ACTIVITY.PREPARING_DOWNLOAD;
          break;
        case DOWNLOAD_WINDOW_STRINGS.STATUS.ACCESSED:
          strStatus = DOWNLOAD_WINDOW_STRINGS.ACTIVITY.DOWNLOADED;
          break;
        case DOWNLOAD_WINDOW_STRINGS.STATUS.DELETED:
          strStatus = DOWNLOAD_WINDOW_STRINGS.ACTIVITY.DOWNLOAD_FAILED;
          break;
        default:
          break;
      }
      return strStatus;
    },
  },
};

export const getDownloadUrl = (id) => {
  if (!id) {
    return EMPTY_STRING;
  }
  return `${BACKEND_BASE_URL}/dms/display/?id=${id}&is_download=true`;
};

export default getDownloadString;
