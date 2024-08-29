import { addNewCategoryApiService, getCategoryApiService } from 'axios/apiService/form.apiService';
import { translate } from 'language/config';
import { deleteCategory, updateCategory } from '../../axios/apiService/categoryAdmin.apiService';
import { CATEGORY_LIST } from './ActionConstants';
import { store } from '../../Store';
import { generateGetServerErrorMessage } from '../../server_validations/ServerValidation';
import { showToastPopover, updatePostLoader } from '../../utils/UtilityFunctions';
import { FORM_POPOVER_STATUS } from '../../utils/Constants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

export const categoryListTotal = (list) => {
 return {
    type: CATEGORY_LIST.LIST_DATA,
    payload: { ...list },
};
};

export const categoryApiStarted = () => {
 return {
    type: CATEGORY_LIST.STARTED,
};
};

export const categoryApiFailure = (error) => {
 return {
    type: CATEGORY_LIST.FAILURE,
    payload: error,
};
};

export const categoryPageLoad = () => {
    return {
       type: CATEGORY_LIST.PAGE_LOAD,
   };
   };

export const paginateCategory = (paginate) => {
return {
    type: CATEGORY_LIST.PAGE_DETAILS,
    payload: paginate,
};
};

export const openOrCloseModal = () => {
    return {
       type: CATEGORY_LIST.TOGGLE_VISIBLE,
   };
   };

const categoryApiSuccess = (categoryData) => {
 return {
    type: CATEGORY_LIST.SUCCESS,
    payload: { ...categoryData },
};
};

export const modalCategoryDataClear = () => {
    return {
       type: CATEGORY_LIST.CLEAR,
   };
   };

export const categoryDataThunk = (params, isPageLoading = false) => (dispatch) => {
        if (isPageLoading) {
            dispatch(categoryPageLoad());
        }

        dispatch(categoryApiStarted());
        // getCategoryList(params)
        getCategoryApiService(params)
        .then((response) => {
            if (response) {
                response.pagination_details = response.paginationDetails;
                response.pagination_data = response.paginationData;
                dispatch(categoryApiSuccess(response));
                dispatch(paginateCategory(response));
            } else {
                const err = {
                  response: {
                    status: 500,
                  },
                };
                const errors = generateGetServerErrorMessage(err);
                dispatch(categoryApiFailure(errors));
            }
        });
    };

export const addCategoryText = (categoryText) => {
 return {
    type: CATEGORY_LIST.ADD,
    payload: categoryText,
};
};

export const addCategoryApiThunk = (data, updateError) => (dispatch) => {
    addNewCategoryApiService(data)
    .then((response) => {
        if (response) {
            const {
                categoryCurrentPage, categoryDataCountPerPage,
            } = store.getState().CategoryReducer;
            const paginationData = {
                page: categoryCurrentPage,
                size: categoryDataCountPerPage,
              };
            dispatch(categoryDataThunk(paginationData));
            dispatch(openOrCloseModal());
            dispatch(modalCategoryDataClear());
            updatePostLoader(false);
            showToastPopover(
                translate('error_popover_status.category_added'),
                EMPTY_STRING,
                FORM_POPOVER_STATUS.SUCCESS,
                true,
            );
        } else {
            const err = {
              response: {
                status: 500,
              },
        };
        const errors = generateGetServerErrorMessage(err);
        dispatch(categoryApiFailure(errors));
        }
    })
    .catch((error) => {
        dispatch(categoryApiFailure(error));
        updateError(error);
    });
};

export const updateCategoryApiThunk = (data, updateError) => (dispatch) => {
    updateCategory(data)
    .then((response) => {
        if (response) {
            // dispatch(categoryApiSuccess(response))
            const {
                categoryCurrentPage, categoryDataCountPerPage,
            } = store.getState().CategoryReducer;
            const paginationData = {
                page: categoryCurrentPage,
                size: categoryDataCountPerPage,
              };
            dispatch(categoryDataThunk(paginationData));
            dispatch(openOrCloseModal());
            dispatch(modalCategoryDataClear());
            showToastPopover(
                translate('error_popover_status.category_updated'),
                EMPTY_STRING,
                FORM_POPOVER_STATUS.SUCCESS,
                true,
            );
        } else {
            const err = {
              response: {
                status: 500,
              },
            };
            const errors = generateGetServerErrorMessage(err);
            dispatch(categoryApiFailure(errors));
        }
    })
    .catch((error) => {
        dispatch(categoryApiFailure(error));
        updateError(error);
    });
};

export const categoryIdSave = (categoryId) => {
 return {
    type: CATEGORY_LIST.DATA_CHANGE,
    payload: categoryId,
};
};

export const initialCategoryText = (categoryText) => {
 return {
    type: CATEGORY_LIST.POST_CANCEL,
    payload: categoryText,
};
};

export const deleteCategoryApiThunk = (data) => (dispatch) => {
    deleteCategory(data)
    .then((response) => {
        if (response) {
            // dispatch(categoryApiSuccess(response))
            const {
                categoryCurrentPage, categoryDataCountPerPage,
            } = store.getState().CategoryReducer;
            const paginationData = {
                page: categoryCurrentPage,
                size: categoryDataCountPerPage,
              };
            showToastPopover('Category Deleted Successfully', EMPTY_STRING, FORM_POPOVER_STATUS.DELETE, true);
            dispatch(categoryDataThunk(paginationData));
        } else {
            const err = {
              response: {
                status: 500,
              },
            };
            const errors = generateGetServerErrorMessage(err);
            dispatch(categoryApiFailure(errors));
        }
    });
};

export const validCheck = (valid) => {
 return {
    type: CATEGORY_LIST.UPDATE,
    payload: valid,
};
};

export const categoryClearData = () => {
 return {
    type: CATEGORY_LIST.CLEAR_DATA,
};
};

export const changeCategoryRowsPerPage = (value) => {
 return {
    type: CATEGORY_LIST.ROW_CHANGE,
    payload: value,
};
};
