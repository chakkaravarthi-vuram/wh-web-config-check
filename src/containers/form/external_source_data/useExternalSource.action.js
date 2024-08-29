import { cloneDeep, get, isObject, set, has } from 'utils/jsUtility';
import { externalSourceDataChange } from './useExternalSource';
import { generateGetServerErrorMessage } from '../../../server_validations/ServerValidation';
import {
  EMPTY_STRING,
  SERVER_ERROR_MESSAGES,
  SOMEONE_IS_EDITING,
  SOMEONE_IS_EDITING_ERROR,
} from '../../../utils/strings/CommonStrings';
import {
  deleteDataRuleApi,
  getRuleDetailsByIdApi,
  saveDataListQueryRuleApi,
  saveIntegrationRuleApi,
} from '../../../axios/apiService/externalDataSource.apiService';
import { constructStateData } from './ExternalSource.utils';
import { getIntegrationConnectorApi } from '../../../axios/apiService/Integration.apiService';
import {
  ERROR_TYPE_EXIST_ERROR,
  ERROR_TYPE_STRING_GUID_ERROR,
  SOMEONE_EDITING,
} from '../../../utils/ServerValidationUtils';
import {
  showToastPopover,
  somethingWentWrongErrorToast,
  updateEditConfirmPopOverStatus,
  updatePostLoader,
} from '../../../utils/UtilityFunctions';
import { FORM_POPOVER_STATUS } from '../../../utils/Constants';
import { isEmpty, isNaN, translateFunction } from '../../../utils/jsUtility';
import { getFormattedDateFromUTC } from '../../../utils/dateUtils';
import { getCurrentUserId } from '../../../utils/userUtils';
import { store } from '../../../Store';
import { FIELD_IDS, POST_DATA_KEYS } from './ExternalSource.constants';
import { ERROR_MESSAGES } from './ExternalSource.strings';
import { DEPENDENCY_ERRORS } from '../../../components/dependency_handler/DependencyHandler.constants';

const updateSomeoneIsEditingPopover = (errorMessage) => {
  const { flowData } = store.getState().EditFlowReducer;

  const { time, isMoreThanHoursLimit } = getFormattedDateFromUTC(
    errorMessage.edited_on,
    SOMEONE_IS_EDITING,
  );
  const isCurrentUser = getCurrentUserId() === errorMessage.user_id;
  let editSubtitle = null;
  if (isCurrentUser) {
    editSubtitle = SOMEONE_IS_EDITING_ERROR.SAME_USER;
  } else {
    editSubtitle = `${errorMessage.full_name} (${errorMessage.email}) ${SOMEONE_IS_EDITING_ERROR.DIFFERENT_USER}`;
  }

  const content = SOMEONE_IS_EDITING_ERROR.EXTERNAL_SOURCE;
  const params = {
    flow_id: flowData.flow_id,
    flow_uuid: flowData.flow_uuid,
  };

  updateEditConfirmPopOverStatus({
    title: content.TITLE,
    subTitle: editSubtitle,
    secondSubTitle: isCurrentUser
      ? EMPTY_STRING
      : `${SOMEONE_IS_EDITING_ERROR.DESCRIPTION_LABEL} ${time}`,
    status: FORM_POPOVER_STATUS.SERVER_ERROR,
    isVisible: false,
    isEditConfirmVisible: true,
    type: content.TYPE,
    enableDirectEditing: isCurrentUser && isMoreThanHoursLimit,
    params,
  });
};

export const getAllPaginationList = ({
  params,
  dispatch,
  setCancelToken,
  currentApiState,
  stateKeys = {},
  apiFunc = () => {},
  t = translateFunction,
}) =>
  new Promise((resolve, reject) => {
    dispatch(
      externalSourceDataChange({
        [stateKeys?.loading]: true,
      }),
    );
    apiFunc(params, setCancelToken)
      .then((res) => {
        const { pagination_data, pagination_details } = res;
        if (pagination_data && pagination_details) {
          const listData = cloneDeep(currentApiState);

          const list = [];
          pagination_data.forEach((eachRow) => {
            list.push({
              ...eachRow,
              label: get(eachRow, stateKeys?.eachRowLabel, EMPTY_STRING),
              value: get(eachRow, stateKeys?.eachRowValue, EMPTY_STRING),
            });
          });

          const modifiedData = {};

          if (isObject(get(listData, stateKeys?.paginationDetails))) {
            if (
              get(listData, [stateKeys?.paginationDetails, 'page']) <
              pagination_details[0].page
            ) {
              set(
                modifiedData,
                [stateKeys?.list],
                [...get(listData, [stateKeys?.list], {}), ...list],
              );

              set(modifiedData, [stateKeys?.paginationDetails], {
                ...pagination_details[0],
              });
            } else if (pagination_details[0].page === 1) {
              set(modifiedData, [stateKeys?.list], [...list]);
              set(modifiedData, [stateKeys?.paginationDetails], {
                ...pagination_details[0],
              });
              set(
                modifiedData,
                [stateKeys?.totalCount],
                get(pagination_details, [0, 'total_count'], 0),
              );
            }
          } else {
            set(modifiedData, [stateKeys?.list], [...list]);
            set(modifiedData, [stateKeys?.paginationDetails], {
              ...pagination_details[0],
            });
          }

          set(
            modifiedData,
            [stateKeys?.hasMore],
            get(modifiedData, [stateKeys?.list], [])?.length <
              get(modifiedData, [stateKeys?.paginationDetails], {})
                ?.total_count,
          );

          set(
            modifiedData,
            [stateKeys?.currentPage],
            get(pagination_details, [0, 'page'], 1) + 1,
          );

          dispatch(
            externalSourceDataChange({
              ...modifiedData,
              [stateKeys?.loading]: false,
            }),
          );

          resolve(res, { resList: get(modifiedData, [stateKeys?.list], []) });
        }
      })
      .catch((error) => {
        if (has(error, ['code']) && error.code === 'ERR_CANCELED') return;

        const errors = generateGetServerErrorMessage(error);
        dispatch(
          externalSourceDataChange({
            [stateKeys?.errorList]: errors,
            [stateKeys?.loading]: false,
          }),
        );
        showToastPopover(
          t('error_popover_status.somthing_went_wrong'),
          t('error_popover_status.refresh_try_again'),
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
        reject(error);
      });
  });

export const getSingleIntegrationConnector = ({
  params,
  dispatch,
  setCancelToken,
  t = translateFunction,
}) =>
  new Promise((resolve, reject) => {
    dispatch(
      externalSourceDataChange({
        isLoadingIntegrationDetail: true,
      }),
    );
    getIntegrationConnectorApi(params, setCancelToken)
      .then((response) => {
        dispatch(
          externalSourceDataChange({
            selectedConnector: response,
            selectedEvent: get(response, ['events', 0], {}),
          }),
        );
        resolve({
          selectedConnector: response,
          selectedEvent: get(response, ['events', 0], {}),
        });
      })
      .catch((error) => {
        const errorList = error?.response?.data?.errors || [];
        switch (errorList?.[0]?.type) {
          case ERROR_TYPE_STRING_GUID_ERROR:
            showToastPopover(
              t(SERVER_ERROR_MESSAGES.ERROR_TYPE_STRING_GUID_ERROR.TITLE),
              EMPTY_STRING,
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
            break;
          default:
            showToastPopover(
              t('error_popover_status.somthing_went_wrong'),
              t('error_popover_status.refresh_try_again'),
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
            break;
        }
        dispatch(
          externalSourceDataChange({
            isErrorInIntegrationDetail: true,
            isLoadingIntegrationDetail: false,
          }),
        );
        reject(error);
      });
  });

export const saveIntegrationRule = ({
  data,
  callback,
  dispatch,
  t = translateFunction,
}) =>
  new Promise((resolve, reject) => {
    updatePostLoader(true);
    saveIntegrationRuleApi(data)
      .then((res) => {
        updatePostLoader(false);
        if (callback) callback();
        resolve(res);
      })
      .catch((error) => {
        updatePostLoader(false);
        const err = error?.response?.data?.errors?.[0] || {};
        if (error?.response?.data?.errors?.[0]?.type === SOMEONE_EDITING) {
          updateSomeoneIsEditingPopover(
            error.response.data.errors[0].message,
            data?.connector_uuid,
          );
        } else if (error?.response?.data?.errors?.[0]?.type === ERROR_TYPE_EXIST_ERROR && error?.response?.data?.errors?.[0]?.field === POST_DATA_KEYS.SOURCE_NAME) {
          dispatch(
            externalSourceDataChange({
              errorList: {
                [FIELD_IDS.SOURCE_NAME]: ERROR_MESSAGES.NAME_EXIST,
              },
            }),
          );
          showToastPopover(
            ERROR_MESSAGES.NAME_EXIST,
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        } else if (err.type === 'cyclicDependency') {
          somethingWentWrongErrorToast(
            t('error_popover_status.cyclic_dependency'),
            t('error_popover_status.cannot_set_rule'),
          );
        } else {
          somethingWentWrongErrorToast(
            t('error_popover_status.somthing_went_wrong'),
            t('error_popover_status.refresh_try_again'),
          );
        }

        reject(error);
      });
  });

export const saveDataListRule = ({ data, dispatch, state, callback, t = translateFunction }) =>
  new Promise((resolve, reject) => {
    updatePostLoader(true);
    saveDataListQueryRuleApi(data)
      .then((res) => {
        updatePostLoader(false);
        if (callback) callback();
        resolve(res);
      })
      .catch((error) => {
        updatePostLoader(false);
        const err = error?.response?.data?.errors?.[0] || {};
        if (err?.type === SOMEONE_EDITING) {
          updateSomeoneIsEditingPopover(
            error.response.data.errors[0].message,
            data?.connector_uuid,
          );
        } else if (err?.type === ERROR_TYPE_EXIST_ERROR && err?.field === POST_DATA_KEYS.SOURCE_NAME) {
          dispatch(
            externalSourceDataChange({
              errorList: {
                [FIELD_IDS.SOURCE_NAME]: ERROR_MESSAGES.NAME_EXIST,
              },
            }),
          );
          showToastPopover(
            ERROR_MESSAGES.NAME_EXIST,
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        } else if (err.type === 'cyclicDependency') {
          somethingWentWrongErrorToast(
            t('error_popover_status.cyclic_dependency'),
            t('error_popover_status.cannot_set_rule'),
          );
          const filterIndex = err.field?.split?.('.')[4];
          if (!isNaN(filterIndex)) {
            const filter = state.filter?.filter((f) => !f.is_deleted);
            const errorKey = `${FIELD_IDS.FILTER},${Number(filterIndex)},field`;
            dispatch(
              externalSourceDataChange({
                errorList: { [errorKey]: t('error_popover_status.field_filter_cyclic_dependency') },
                filter,
              }),
            );
          }
        } else {
          somethingWentWrongErrorToast(
            t('error_popover_status.somthing_went_wrong'),
            t('error_popover_status.refresh_try_again'),
          );
        }
        reject(error);
      });
  });

export const deleteDataRule = ({ data, dispatch, callback, t = translateFunction }) =>
  new Promise((resolve, reject) => {
    updatePostLoader(true);
    deleteDataRuleApi(data)
      .then((res) => {
        showToastPopover('External source rule Deleted Successfully', EMPTY_STRING, FORM_POPOVER_STATUS.DELETE, true);
        updatePostLoader(false);
        if (callback) callback();
        resolve(res);
      })
      .catch((error) => {
        updatePostLoader(false);
        if (error?.response?.data?.errors?.[0]?.type === SOMEONE_EDITING) {
          updateSomeoneIsEditingPopover(
            error.response.data.errors[0].message,
            data?.connector_uuid,
          );
        } else if (error?.response?.data?.errors?.[0]?.type === DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.RULE_DEPENDENCY) {
            const dependency = error?.response?.data?.errors?.[0]?.message;

            if (
              !isEmpty(dependency.dependency_list)
            ) {
              updatePostLoader(false);
              dispatch(
                  externalSourceDataChange({
                  dependencyData: dependency,
                  dependencyType: DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.RULE_DEPENDENCY,
                  dependencyName: DEPENDENCY_ERRORS.EXTERNAL_SOURCE,
                  showFieldDependencyDialog: {
                    isVisible: true,
                  },
                }),
              );
            }
        } else {
          showToastPopover(
            t('error_popover_status.somthing_went_wrong'),
            t('error_popover_status.refresh_try_again'),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        }
        reject(error);
      });
  });

export const getRuleDetailsById = ({
  ruleId,
  extraParams = {},
  isFromFlow = false,
  dispatch,
  t = translateFunction,
  dispatchFunction = () => {},
}) =>
  new Promise((resolve, reject) => {
    updatePostLoader(true);
    getRuleDetailsByIdApi(ruleId, extraParams)
      .then((res) => {
        updatePostLoader(false);
        constructStateData(res, isFromFlow, dispatch, dispatchFunction);
        dispatch(
          externalSourceDataChange({
            isRuleDetailsLoading: false,
          }),
        );
        resolve(res);
      })
      .catch((error) => {
        updatePostLoader(false);
        dispatch(
          externalSourceDataChange({
            isRuleDetailsLoading: false,
          }),
        );
        showToastPopover(
          t('error_popover_status.somthing_went_wrong'),
          t('error_popover_status.refresh_try_again'),
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
        reject(error);
      });
  });
