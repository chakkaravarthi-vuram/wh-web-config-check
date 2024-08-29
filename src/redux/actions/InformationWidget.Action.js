import { apiGetAllFieldsList } from '../../axios/apiService/flow.apiService';
import { updateWidgetDataChange } from '../reducer/InformationWidgetReducer';
import { store } from '../../Store';
import { cloneDeep, get, isObject } from '../../utils/jsUtility';
import { generateGetServerErrorMessage } from '../../server_validations/ServerValidation';

export const getAllFieldsTaskListThunk = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateWidgetDataChange({ isAllFieldsLoading: true }));
    apiGetAllFieldsList(params)
      .then((res) => {
        const { pagination_data, pagination_details } = res;
        if (pagination_data && pagination_details) {
          const widgetData = cloneDeep(
            store.getState().InformationWidgetReducer,
          );
          const fields = [];
          pagination_data.forEach((fieldData) => {
            fields.push({
              ...fieldData,
              value: fieldData.field_uuid,
            });
          });

          const modifiedData = {};

          if (isObject(widgetData?.allFieldsListPaginationDetails)) {
            if (
              widgetData?.allFieldsListPaginationDetails?.page <
              pagination_details[0].page
            ) {
              modifiedData.allFieldsList = [
                ...widgetData.allFieldsList,
                ...fields,
              ];
              modifiedData.allFieldsListPaginationDetails = {
                ...pagination_details[0],
              };
            } else if (pagination_details[0].page === 1) {
              modifiedData.allFieldsList = [...fields];
              modifiedData.allFieldsListPaginationDetails = {
                ...pagination_details[0],
              };
              modifiedData.allFieldsTotalCount = get(
                pagination_details,
                [0, 'total_count'],
                0,
              );
            }
          } else {
            modifiedData.allFieldsList = [...fields];
            modifiedData.allFieldsListPaginationDetails = {
              ...pagination_details[0],
            };
          }

          modifiedData.allFieldsHasMore =
            modifiedData?.allFieldsList?.length <
            modifiedData.allFieldsListPaginationDetails?.total_count;

          modifiedData.allFieldsCurrentPage =
            get(pagination_details, [0, 'page'], 1) + 1;

          dispatch(
            updateWidgetDataChange({
              ...modifiedData,
              isAllFieldsLoading: false,
            }),
          );

          resolve({ resAllFields: modifiedData?.allFieldsList });
        }
      })
      .catch((error) => {
        const errors = generateGetServerErrorMessage(error);
        dispatch(
          updateWidgetDataChange({
            allFieldsListErrorList: errors,
            isAllFieldsLoading: false,
          }),
        );
        reject(error);
      });
  });
