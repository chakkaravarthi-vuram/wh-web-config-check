import { FORM_POPOVER_STATUS } from '../../utils/Constants';

export const ML_MODELS = {
  TEXT_SENTIMENT_ANALYSIS: 'TP_LLM_CTSA',
};

export const MODEL_LIST_CONSTANTS = {
    TABLE: {
        ID: 'model_list',
        DATA_FIELD: {
            MODEL_NAME: 'model_name',
            MODEL_CODE: 'model_code',
            MODEL_DEC: 'model_description',
            MODEL_USED_IN: 'model_used_in',
        },
    },
};

export const MODEL_DETAIL_TAB_INDEX_CONSTANTS = {
    MODEL_DETAILS: 1,
    TRY_IT_YOURSELF: 2,
    MODEL_USED_IN: 3,
  };

  export const MODEL_DETAIL_RESULT_TAB_INDEX_CONSTANTS = {
    FORMATTED_DATA: 1,
    RAW_DATA: 2,
  };

export const VIEW_LABELS = {
    ML_Models: 'ML Models',
  };

export const ML_MODEL_INPUT_TYPE = {
  FILE_UPLOAD: {
    ID: 'file_upload',
    LABEL: 'File',
    PLACEHOLDER: 'Drag and drop files here or Choose File',
  },
};

export const ML_MODEL_DESC_ELLIPSIS_CHARS = {
  MAX: 170,
};

export const ML_MODEL_LANGUAGE_SUPPORTED_ELLIPSIS_CHARS = {
  MAX: 50,
};

export const IMAGE_UPLOAD_EXTENSION = '.png,.jpg,.jpeg,.JPG,.PNG,.JPEG,.pdf';

export const GET_ML_MODEL_REPONSE_STRING = {
    FAILURE: {
      title: 'Error',
      status: FORM_POPOVER_STATUS.SERVER_ERROR,
      isVisible: true,
    },
};

export const FIELD_TYPE = {
  SINGLE_LINE: 'singleline',
  PARAGRAPH: 'paragraph',
  NUMBER: 'number',
  DATE: 'date',
  DATETIME: 'datetime',
  TIME: 'time',
  USERS: 'users',
  TEAMS: 'teams',
  FILE_UPLOAD: 'fileupload',
};

export const SENTIMENT_ANALYSIS_OUTPUT = {
  POSITIVE: 'positive',
  NEGATIVE: 'negative',
  NEUTRAL: 'neutral',
};
