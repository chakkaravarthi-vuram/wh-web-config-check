import { translateFunction } from 'utils/jsUtility';
// import {
//   PUBLISHED_REPORT_LIST,
// } from '../../urls/RouteConstants';
// import { FIELD_TYPES } from '../../components/form_builder/FormBuilder.strings';
// import { TYPE_STRING } from '../../utils/strings/CommonStrings';

export const ML_MODEL_STRINGS = (t = translateFunction) => {
  return {
    TITLE: t('ml_model_integration.ml_models'),
    SHOWING: t('ml_model_integration.showing'),
    MODELS: t('ml_model_integration.ml_models_showing'),
    MODEL_LIST: {
      TBL_COL_MODEL_NAME: t('ml_model_integration.ml_model_list.tbl_col_model_name'),
      TBL_COL_MODEL_DESC: t('ml_model_integration.ml_model_list.tbl_col_model_desc'),
      TBL_COL_MODEL_USED_IN: t('ml_model_integration.ml_model_list.tbl_col_model_used_in'),
      NO_MODEL_FOUND: t('ml_model_integration.ml_model_list.no_model_found'),
      CANT_DISPLAY_LIST: t('ml_model_integration.ml_model_list.cant_display_list'),
      COULD_NOT_LOAD: t('ml_model_integration.ml_model_list.could_not_load'),
    },
    EMPTY_LIST_STRINGS: {
      NO_MATCHES_FOUND: t('ml_model_integration.empty_list_strings.no_matches_found'),
      TRY_ANOTHER_TERM: t('ml_model_integration.empty_list_strings.try_another_term'),
    },
    LIST_TITLE: {
      SHOWING: t('ml_model_integration.list_title.showing'),
      MODELS: t('ml_model_integration.list_title.models'),
    },
    MODEL_DETAILS: {
      VIEW_LESS: t('ml_model_integration.model_details.view_less'),
      VIEW_MORE: t('ml_model_integration.model_details.view_more'),
      TRY_WITH_YOUR_OWN_DATA: t('ml_model_integration.model_details.try_with_your_own_data'),
      BUTTON_TEXTS: {
        CLEAR: t('ml_model_integration.buttons.clear'),
        TRY_IT: t('ml_model_integration.buttons.try_it'),
      },
      MODEL_CARD: {
        MODEL_CARD_DETAILS: t('ml_model_integration.model_details.model_card.model_card_details'),
        LANGUAGES_SUPPORTED: t('ml_model_integration.model_details.model_card.languages_supported'),
        OUTPUT_LABLES: t('ml_model_integration.model_details.model_card.output_lables'),
        SUPPORTED_FORMATS: t('ml_model_integration.model_details.model_card.supported_formats'),
        MODEL_RELEASE_DATE: t('ml_model_integration.model_details.model_card.model_release_date'),
        BEST_PRACTICES_LIMITATIONS: t('ml_model_integration.model_details.model_card.best_practices_limitations'),
        BEST_PRACTICES: t('ml_model_integration.model_details.model_card.best_practices'),
      },
      VALIDATION_ACCURACY: t('ml_model_integration.model_details.validation_accuracy'),
      TAB: {
        OPTIONS: [
          {
            labelText: t('ml_model_integration.model_details.tab_header.model_details'),
            value: 1,
            tabIndex: 1,
          },
          {
            labelText: t('ml_model_integration.model_details.tab_header.try_it_yourself'),
            value: 2,
            tabIndex: 2,
          },
          {
            labelText: t('ml_model_integration.model_details.tab_header.model_used_in'),
            value: 3,
            tabIndex: 3,
          },
        ],
      },
      RESULT_TAB: {
        RESULT: t('ml_model_integration.model_details.tab_result.results'),
        OPTIONS: [
          {
            labelText: t('ml_model_integration.model_details.tab_result.formatted_data'),
            value: 1,
            tabIndex: 1,
          },
          {
            labelText: t('ml_model_integration.model_details.tab_result.raw_data'),
            value: 2,
            tabIndex: 2,
          },
        ],
      },
      PLACE_HOLDERS: {
        TYPE_YOUR_TEXT_HERE: t('ml_model_integration.model_details.place_holders.type_your_text_here'),
      },
    },
  };
};
