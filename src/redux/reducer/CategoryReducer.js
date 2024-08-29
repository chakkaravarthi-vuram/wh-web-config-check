import { CATEGORY_LIST } from '../actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const initialState = {
  isCategoryListLoading: true,
  server_error: {},
  addCategoryText: EMPTY_STRING,
  isCategoryModalOpen: false,
  categoryId: EMPTY_STRING,
  initialCategoryText: EMPTY_STRING,
  categoryCurrentPage: 1,
  categoryDataCountPerPage: 5,
  categoryTotalCount: 0,
  categoryErrorList: {},
  isPaginationLoading: true,
};

export default function CategoryReducer(state = initialState, action) {
    switch (action.type) {
    case CATEGORY_LIST.LIST_DATA:
      return {
        ...state,
        isCategoryListLoading: false,
        common_server_error: null,
        ...action.payload,
      };
    case CATEGORY_LIST.STARTED:
      return {
        ...state,
        // is_data_loading: true,
        isCategoryListLoading: true,
      };
    case CATEGORY_LIST.FAILURE:
      return {
        ...state,
        isCategoryListLoading: false,
        common_server_error: action.payload.common_server_error,
        server_error: action.payload.common_server_error,
      };
    case CATEGORY_LIST.SUCCESS:
      return {
        ...state,
        ...action.payload,
        isCategoryListLoading: false,
        common_server_error: null,
        categoryTotalCount: action.payload.pagination_details[0].total_count,
        categoryCurrentPage: action.payload.pagination_details[0].page,
      };
    case CATEGORY_LIST.ADD:
      return {
        ...state,
        addCategoryText: action.payload,
      };
    case CATEGORY_LIST.TOGGLE_VISIBLE:
      return {
        ...state,
        isCategoryModalOpen: !state.isCategoryModalOpen,
      };
    case CATEGORY_LIST.DATA_CHANGE:
      return {
        ...state,
        categoryId: action.payload,
      };
    case CATEGORY_LIST.CLEAR:
      return {
        ...state,
        addCategoryText: EMPTY_STRING,
        categoryId: EMPTY_STRING,
        initialCategoryText: EMPTY_STRING,
        categoryErrorList: {},
      };
    case CATEGORY_LIST.POST_CANCEL:
      return {
        ...state,
        initialCategoryText: action.payload,
      };
    case CATEGORY_LIST.PAGE_DETAILS:
      return {
        ...state,
        categoryCurrentPage: action.payload.pagination_details[0].page,
        categoryTotalCount: action.payload.pagination_details[0].total_count,
      };
    case CATEGORY_LIST.UPDATE:
      return {
        ...state,
        categoryErrorList: action.payload,
      };
    case CATEGORY_LIST.PAGE_LOAD:
      return {
        ...state,
        isPaginationLoading: false,
      };
    case CATEGORY_LIST.CLEAR_DATA:
      return {
        ...initialState,
      };
    case CATEGORY_LIST.ROW_CHANGE:
      return {
        ...state,
        categoryDataCountPerPage: action.payload,
      };
      default:
        return state;
    }
}
