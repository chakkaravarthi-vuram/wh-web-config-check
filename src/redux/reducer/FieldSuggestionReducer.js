import { FIELD_SUGGESTION } from '../actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const initialState = {
  field_suggestions: [],
  error_list: [],
  server_error: [],
  common_server_error: EMPTY_STRING,
  is_data_loading: false,
  selected_field_index: null,
  show_all_suggestions: false,
  show_field_suggestion_component: true,
  fieldSuggestionSectionIndex: [],
};

export default function FieldSuggestionReducer(state = initialState, action) {
  switch (action.type) {
    case FIELD_SUGGESTION.STARTED:
      return {
        ...initialState,
        is_data_loading: true,
      };
    case FIELD_SUGGESTION.SUCCESS:
      return {
        ...state,
        is_data_loading: false,
        common_server_error: null,
        field_suggestions: action.payload,
      };

    case FIELD_SUGGESTION.FAILURE:
      return {
        ...state,
        is_data_loading: false,
        common_server_error: action.payload,
      };
    case FIELD_SUGGESTION.CANCEL:
      return {
        ...state,
        is_data_loading: false,
      };
    case FIELD_SUGGESTION.DATA_CHANGE:
      return {
        ...state,
        ...action.payload,
      };
    case FIELD_SUGGESTION.CLEAR:
      return initialState;
    default:
      return state;
  }
}
