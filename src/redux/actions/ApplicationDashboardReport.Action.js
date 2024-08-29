import React from 'react';
import { TableSortOrder, Text } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames';
import {
  apiGetDatalistFilters,
  apiGetDatalistValues,
  apiGetFlowFilters,
  apiGetFlowValues,
} from '../../axios/apiService/applicationDashboardReport.apiService';
import gClasses from '../../scss/Typography.module.scss';
import { store } from '../../Store';
import jsUtils, {
  removeDuplicateFromArrayOfObjects,
  translateFunction,
} from '../../utils/jsUtility';
import {
  EMPTY_STRING,
  FLOW_INITIAL_LOADING_TEXT,
  TYPE_STRING,
  USERS,
} from '../../utils/strings/CommonStrings';
import { FILTER_FIELD_STRINGS } from '../../containers/flow/flow_dashboard/FlowDashboard.string';
import {
  TEST_BED_FLOW_STATUS,
} from '../../containers/flow/flow_dashboard/flowDashboardUtils';
import { FIELD_TYPE } from '../../utils/constants/form_fields.constant';
import {
  addAppReport,
  setAppReportLoaderById,
  setDatalistDashboard,
  setDatalistDashboardById,
  setDatalistDashboardLoaderById,
  setFlowDashboard,
  setFlowDashboardById,
  setFlowDashboardLoaderById,
} from '../reducer/ApplicationDashboardReportReducer';
import { initialState } from '../reducer/FlowDashboardReducer';
import {
  getDataListDetailsSuccessAction,
  initState as datalistInitialState,
} from '../reducer/DataListReducer';
import { apiGetFlowDetailsByUUID } from '../../axios/apiService/flowList.apiService';
import { getFlowValuesData } from '../../containers/application/app_components/dashboard/flow/Flow.utils';
import {
  getDataListDetailsByUuid,
  getDataListEntryTaskDetails,
} from '../../axios/apiService/dataList.apiService';
import {
  getCrossFilters,
  getCrossValues,
  getDatalistFilters,
  getDatalistValues,
  getFlowFilters,
  getFlowValues,
  getReportByUUIDApi,
} from '../../axios/apiService/reports.apiService';
import {
  calculateSourceErrors,
  constructCreateReportEditDetails,
} from '../../containers/report/Report.utils';
import {
  generateQueryFromReportResponse,
  getSelectedDimensions,
  getFieldValuesByType,
  getAppliedFilter,
  getSortField,
  getDateFilterData,
  getCurrencyFilterOptionalList,
  getSystemFields,
  getDataFields,
} from '../../containers/report/report_creation/ReportCreation.utils';
import {
  getChartData,
  getChartDataForBreakDown,
  getRollupNumericData,
  getTabularData,
} from '../../containers/report/report_creation/ReportData.utils';
import {
  generateApiErrorsAndHandleCatchBlock,
  setPointerEvent,
  showToastPopover,
  updateAlertPopverStatus,
  updatePostLoader,
} from '../../utils/UtilityFunctions';
import { generateGetServerErrorMessage } from '../../server_validations/ServerValidation';
import { SERVER_ERROR_CODES } from '../../utils/ServerConstants';
import { FIELD_TYPES } from '../../components/form_builder/FormBuilder.strings';
import {
  REPORT_SOURCE_TYPES,
  REPORT_CATEGORY_TYPES,
  AGGREGATE_TYPE,
} from '../../containers/report/Report.strings';
import { getDefaultReportByUUIDApi } from '../../axios/apiService/dashboardConfig.apiService';
import { getClassNameForDataColumn } from '../../containers/shared_container';
import styles from '../../containers/application/app_components/dashboard/flow/flow_dashboard/FlowDashboard.module.scss';
import { getSelectedOperatorByFieldType } from '../../containers/report/report_creation/FilterQuery.utils';
import { FORM_POPOVER_STATUS } from '../../utils/Constants';

export const getDefaultReportByUUIDThunk = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
  getDefaultReportByUUIDApi(params)
    .then((res) => {
      const {
        report: { table_columns, sorting },
        features,
        _id,
      } = res;
      const uuid = params?.data_list_uuid ?? params?.flow_uuid;
      let clonedDatalistDashboard = {};
      let actionFunction = () => {};
      if (!jsUtils.isEmpty(params?.data_list_uuid)) {
        clonedDatalistDashboard = jsUtils.cloneDeep(
          store.getState().ApplicationDashboardReportReducer.datalistDashboard[
            uuid
          ],
        );
        actionFunction = setDatalistDashboardById;
      } else if (!jsUtils.isEmpty(params?.flow_uuid)) {
        clonedDatalistDashboard = jsUtils.cloneDeep(
          store.getState().ApplicationDashboardReportReducer.flowDashboard[
            uuid
          ],
        );
        actionFunction = setFlowDashboardById;
      }
      const tableHeaderData = table_columns.map((data) => {
        const filterData =
          (clonedDatalistDashboard.filter?.inputFieldDetailsForFilter || []).find(
            (field) =>
              [field.fieldUuid, field.query_to_pass].includes(data.field),
          );
        const sort = sorting.find((sort) => sort.field === data.field);
        const headerData = {
          id: filterData?.output_key,
          label: data.label,
          sortBy: filterData?.output_key,
          sortOrder: sort?.order !== -1 ? TableSortOrder.ASC : TableSortOrder.DESC,
          // widthWeight: getWidthWeightForHeaderColumn(data.width),
          component: (
            <Text
              title={data.label}
              className={cx(gClasses.FTwo12BlackV21,
              gClasses.FontWeight500,
              styles.HeaderEllipsis)}
              content={data.label}
            />
          ),
          className: getClassNameForDataColumn(data?.width),
          width: data.width,
          fieldType: filterData?.field_type,
          isDigitFormatted: filterData?.is_digit_formatted,
          output_key: filterData?.output_key,
        };
        if (sort) {
          const sortField = {
            query_to_pass: filterData?.query_to_pass,
            output_key: filterData?.output_key,
            field_type: filterData?.field_type,
            aggregation_type: 'none',
            is_system_field: filterData?.is_system_field,
            order_type: sort.order,
            source_collection_uuid: uuid,
          };
          if (!filterData.is_system_field) {
            sortField.field_uuid = filterData?.fieldUuid;
          }
          clonedDatalistDashboard.filter.order = {};
          clonedDatalistDashboard.filter.order = sortField;
        }
        return headerData;
      });
      clonedDatalistDashboard.filter.headerDimension = jsUtils.cloneDeep(tableHeaderData);
      clonedDatalistDashboard.features = jsUtils.cloneDeep(features);
      clonedDatalistDashboard.dashboardId = _id;
      dispatch(
        actionFunction({
          id: uuid,
          data: clonedDatalistDashboard,
        }),
      );
      resolve(true);
    })
    .catch((err) => {
      console.log('getDefaultReportByUUIDThunk error', err);
      reject(err);
    });
  });

// Flow

export const getFlowDetailsByUUID = (flow_uuid, isTestBed) => (dispatch) =>
  new Promise((resolve, reject) => {
    apiGetFlowDetailsByUUID({
      flow_uuid,
      is_test_bed: isTestBed ? 1 : 0,
    })
      .then((res) => {
        if (res) {
          const {
            flow_color,
            flow_name,
            flow_short_code,
            _id,
            custom_identifier,
            flow_description,
            translation_data = {},
            document_url_details,
            owners,
            published_by,
            published_on,
            status,
            parent_uuid,
            published_as_test_bed,
            admins,
            can_reassign,
            show_initiate,
          } = res;

          const clonedInitialFlowDashboardData =
            jsUtils.cloneDeep(initialState);
          const returnData = {
            ...clonedInitialFlowDashboardData,
            flow_uuid,
            flow_id: _id,
            flow_color,
            flow_name,
            flow_short_code,
            flow_description,
            translation_data,
            isTestBed: status === TEST_BED_FLOW_STATUS,
            published_as_test_bed,
            parent_uuid,
            owners,
            published_by,
            published_on,
            admins,
            canReassign: can_reassign,
            custom_identifier,
            document_url_details,
            show_initiate,
          };
          const clonedFlowDashboard = jsUtils.cloneDeep(
            store.getState().ApplicationDashboardReportReducer.flowDashboard,
          );
          clonedFlowDashboard[flow_uuid] = returnData;
          dispatch(setFlowDashboard(clonedFlowDashboard));

          resolve(_id);
        }
      })
      .catch((err) => {
        if (err?.response?.data?.errors) {
          const arrErrors = err?.response?.data?.errors;
          if (arrErrors && arrErrors.length > 0) {
            const clonedFlowDashboard = jsUtils.cloneDeep(
              store.getState().ApplicationDashboardReportReducer.flowDashboard,
            );
            clonedFlowDashboard[flow_uuid] = {
              errors: arrErrors[0],
            };
            dispatch(setFlowDashboard(clonedFlowDashboard));
          }
        }
        reject();
      });
  });

export const getFlowFiltersActionThunk =
  (flow_uuid, cancelToken, t = translateFunction) =>
  (dispatch) =>
    new Promise((resolve) => {
      apiGetFlowFilters(flow_uuid, cancelToken)
        .then((res) => {
          const clonedFlowDashboard = jsUtils.cloneDeep(
            store.getState().ApplicationDashboardReportReducer.flowDashboard[
              flow_uuid
            ],
          );

          const { system_fields_list, flow_fields } = res;

          const inputFieldDetailsForFilter = [];
          // System Filter Data
          if (system_fields_list && system_fields_list.length > 0) {
            system_fields_list.forEach((fieldParamsData, index) => {
              if (!jsUtils.isEmpty(fieldParamsData)) {
                const {
                  label,
                  field_type,
                  output_key,
                  lowercase_suffix,
                  filter_data,
                  choice_labels,
                  fieldType,
                } = fieldParamsData;

                const selectedOperator = getSelectedOperatorByFieldType(
                  fieldType,
                );

                const choiceLabels = {};
                filter_data?.forEach?.((f) => {
                  choiceLabels[f] = f;
                });
                const _fieldValues =
                  filter_data || choice_labels
                    ? getFieldValuesByType(
                      fieldType,
                        choiceLabels || choice_labels,
                      )
                    : [];

                const objFilterProData = {
                  ...fieldParamsData,
                  is_system_field: true,
                  fieldType: field_type,
                  fieldNames: label,
                  fieldValues: _fieldValues,
                  dimension_field: output_key,
                  referenceName: EMPTY_STRING,
                  dimension: output_key,
                  fieldUpdateValue: EMPTY_STRING,
                  isAppliedFilter: false,
                  isAppliedFieldEdit: false,

                  selectedOperator,
                  fieldUpdateBetweenOne: EMPTY_STRING,
                  fieldUpdateBetweenTwo: EMPTY_STRING,
                  isFormField: false,

                  INDEX: output_key,
                  TEXT: label,

                  value: output_key,
                  label,

                  isSectionTitle: false,
                  sectionTitle: EMPTY_STRING,

                  isSearch: true,
                  isMeasure: false,
                  measureDimension: EMPTY_STRING,
                  measureLabel: EMPTY_STRING,
                  has_lowercase: lowercase_suffix,
                  tableUuid: EMPTY_STRING,
                  isDataReferenceField: false,
                  isDataField: false,
                };
                // Section Title Added
                if (index === 0) {
                  jsUtils.set(objFilterProData, ['isSectionTitle'], true);
                  jsUtils.set(
                    objFilterProData,
                    ['sectionTitle'],
                    FILTER_FIELD_STRINGS(t).SYSTEM_FIELD,
                  );
                }
                // Flow Filter Data Added
                inputFieldDetailsForFilter.push(objFilterProData);
              }
            });
          }

          flow_fields &&
            flow_fields.length > 0 &&
            flow_fields.forEach((flowFilterParams, index) => {
              const {
                field_name,
                field_id,
                field_type,
                field_uuid,
                aggregation_type = AGGREGATE_TYPE.NONE,
                choice_labels,
                output_key,
                reference_name,
              } = flowFilterParams;
              let { label } = flowFilterParams;
              label =
                field_name !== reference_name
                  ? `${field_name} (Ref: ${reference_name})`
                  : field_name;
              const fieldValues = getFieldValuesByType(
                field_type,
                choice_labels,
              );
              const selectedOperator =
                getSelectedOperatorByFieldType(field_type);
              const objFilterProData = {
                ...flowFilterParams,
                is_system_field: false,
                aggregation_type,
                fieldType: field_type,
                fieldNames: label,
                fieldValues,
                dimension_field: output_key,
                referenceName: EMPTY_STRING,
                dimension: output_key,
                fieldUpdateValue: EMPTY_STRING,
                isAppliedFilter: false,
                isAppliedFieldEdit: false,

                fieldUuid: field_uuid,
                fieldId: field_id,
                formId: EMPTY_STRING,
                selectedOperator,
                fieldUpdateBetweenOne: EMPTY_STRING,
                fieldUpdateBetweenTwo: EMPTY_STRING,
                isFormField: false,

                INDEX: output_key,
                TEXT: field_name,

                value: output_key,
                label,

                isSectionTitle: false,
                sectionTitle: EMPTY_STRING,

                isSearch: true,

                isMeasure: false,
                measureDimension: EMPTY_STRING,
                measureLabel: EMPTY_STRING,
                isDataField: true,
              };

              // Section Title Added
              if (index === 0) {
                objFilterProData.isSectionTitle = true;
                objFilterProData.sectionTitle =
                  FILTER_FIELD_STRINGS(t).FLOW_FIELD;
              }

              // Flow Filter Data Added
              inputFieldDetailsForFilter.push(objFilterProData);
            });

          // Added Download Dimension
          const clonedFilterProData = jsUtils.cloneDeep(
            inputFieldDetailsForFilter,
          );
          const downloadInputField = clonedFilterProData?.filter(
            (fieldData) => {
              if (
                fieldData.fieldType !== FIELD_TYPE.INFORMATION &&
                fieldData.fieldType !== TYPE_STRING &&
                !fieldData.is_table_field
              ) {
                fieldData.value = 0;

                return fieldData;
              }
              return false;
            },
          );

          clonedFlowDashboard.filter.downloadInputField = downloadInputField;
          const { download_select_all = [] } = clonedFlowDashboard.filter;
          if (download_select_all.length > 0 && download_select_all[0].value) {
            download_select_all[0].value = 0;
            clonedFlowDashboard.filter.download_select_all =
              download_select_all;
          }

          if (
            inputFieldDetailsForFilter &&
            inputFieldDetailsForFilter.length > 0
          ) {
            clonedFlowDashboard.filter.inputFieldDetailsForFilter =
              inputFieldDetailsForFilter;
            clonedFlowDashboard.filter.selectedFieldDetailsFromFilter =
              inputFieldDetailsForFilter;
          }

          dispatch(
            setFlowDashboardById({ id: flow_uuid, data: clonedFlowDashboard }),
          );
          resolve(clonedFlowDashboard);
        })
        .catch((err) => {
          if (jsUtils.has(err, ['code']) && err.code === 'ERR_CANCELED') return;
          resolve(false);
        });
    });

export const getFlowValuesActionThunk =
  (flow_uuid, queryData, searchText, flowData, cancelToken) => (dispatch) =>
    new Promise((resolve) => {
      dispatch(
        setFlowDashboardLoaderById({ id: flowData.flow_uuid, data: true }),
      );
      apiGetFlowValues(flow_uuid, queryData, searchText, cancelToken)
        .then((res) => {
          if (res) {
            const { pagination_data, pagination_details } = res;
            const clonedFlowData = jsUtils.cloneDeep(flowData);
            const {
              flow_uuid,
              lstPaginationData,
              filter: { headerDimension },
            } = clonedFlowData;
            clonedFlowData.lstPaginationData = getFlowValuesData(
              jsUtils.cloneDeep(lstPaginationData),
              pagination_data,
              pagination_details,
              headerDimension,
            );
            clonedFlowData.isLoading = false;
            dispatch(
              setFlowDashboardById({
                id: flow_uuid,
                data: clonedFlowData,
              }),
            );
            resolve(clonedFlowData);
          }
        })
        .catch((err) => {
          if (jsUtils.has(err, ['code']) && err.code === 'ERR_CANCELED') return;
          dispatch(
            setFlowDashboardLoaderById({
              id: flowData.flow_uuid,
              data: false,
            }),
          );
          resolve(false);
        });
    });

// Data Lists

export const getDatalistDetailsByUUIDActionThunk =
  (datalist_uuid, linkComp = false) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      getDataListDetailsByUuid({
        data_list_uuid: datalist_uuid,
      })
        .then((res) => {
          if (res) {
            const {
              _id,
              data_list_name,
              data_list_short_code,
              data_list_description = EMPTY_STRING,
              can_add_datalist_entry,
              can_edit_datalist,
              is_system_identifier,
              can_reassign,
              is_owner,
              isOwner,
              template_document,
              document_url_details,
              technical_reference_name,
            } = res;

            const clonedInitialDatalistDashboardData =
              jsUtils.cloneDeep(datalistInitialState);
            const returnData = {
              ...clonedInitialDatalistDashboardData,
              datalist_uuid,
              datalist_id: _id,
              data_list_name,
              data_list_short_code,
              data_list_description,
              can_edit_datalist,
              can_add_datalist_entry,
              is_system_identifier,
              can_reassign: can_reassign,
              isOwner: is_owner || isOwner,
              template_document,
              document_url_details,
              technical_reference_name,
            };
            const clonedDatalistDashboard = jsUtils.cloneDeep(
              store.getState().ApplicationDashboardReportReducer
                .datalistDashboard,
            );
            clonedDatalistDashboard[datalist_uuid] = returnData;
            if (linkComp) dispatch(getDataListDetailsSuccessAction(res));
            else dispatch(setDatalistDashboard(clonedDatalistDashboard));

            can_add_datalist_entry || !linkComp ? resolve(_id) : resolve(false);
          }
        })
        .catch((err) => {
          if (err?.response?.data?.errors) {
            const arrErrors = err?.response?.data?.errors;
            if (arrErrors && arrErrors.length > 0) {
              const clonedDatalistDashboard = jsUtils.cloneDeep(
                store.getState().ApplicationDashboardReportReducer
                  .datalistDashboard,
              );
              clonedDatalistDashboard[datalist_uuid] = {
                errors: arrErrors[0],
              };
              if (
                linkComp &&
                err?.response?.status === SERVER_ERROR_CODES.UNAUTHORIZED &&
                (err?.response?.data?.errors?.[0]?.is_role ||
                  err?.response?.data?.errors[0].is_token_expired)
              ) {
                if (err?.response?.data?.errors?.[0]?.is_role) {
                  updateAlertPopverStatus(USERS.ROLE_CHANGED_ALERT);
                  reject(err);
                }
                if (err?.response?.data?.errors?.[0]?.is_token_expired) {
                  reject(err);
                }
              }
              if (!linkComp) {
                dispatch(setDatalistDashboard(clonedDatalistDashboard));
              }
            }
          }
          reject();
        });
    });

export const getDatalistFiltersActionThunk =
  (datalist_uuid, t = translateFunction) =>
  (dispatch) =>
    new Promise((resolve) => {
      apiGetDatalistFilters(datalist_uuid)
        .then((res) => {
          const clonedDatalistDashboard = jsUtils.cloneDeep(
            store.getState().ApplicationDashboardReportReducer
              .datalistDashboard[datalist_uuid],
          );

          const { system_fields_list, datalist_fields } = res;

          const inputFieldDetailsForFilter = [];
          // System Filter Data
          if (system_fields_list && system_fields_list.length > 0) {
            system_fields_list.forEach((fieldParamsData, index) => {
              if (!jsUtils.isEmpty(fieldParamsData)) {
                const {
                  label,
                  field_type,
                  output_key,
                  lowercase_suffix,
                  is_logged_in_user,
                } = fieldParamsData;

                const selectedOperator =
                  getSelectedOperatorByFieldType(field_type);
                const objFilterProData = {
                  ...fieldParamsData,
                  is_system_field: true,
                  fieldType: field_type,
                  fieldNames: label,
                  fieldValues: [],
                  dimension_field: output_key,
                  referenceName: EMPTY_STRING,
                  dimension: output_key,
                  fieldUpdateValue: EMPTY_STRING,
                  isAppliedFilter: false,
                  isAppliedFieldEdit: false,

                  selectedOperator,
                  fieldUpdateBetweenOne: EMPTY_STRING,
                  fieldUpdateBetweenTwo: EMPTY_STRING,
                  isFormField: false,

                  INDEX: output_key,
                  TEXT: label,

                  value: output_key,
                  label,

                  isSectionTitle: false,
                  sectionTitle: EMPTY_STRING,

                  isSearch: true,
                  isMeasure: false,
                  measureDimension: EMPTY_STRING,
                  measureLabel: EMPTY_STRING,
                  has_lowercase: lowercase_suffix,
                  tableUuid: EMPTY_STRING,
                  isDataReferenceField: false,
                  isDataField: false,
                  is_logged_in_user,
                };
                // Section Title Added
                if (index === 0) {
                  objFilterProData.isSectionTitle = true;
                  objFilterProData.sectionTitle =
                    FILTER_FIELD_STRINGS(t).SYSTEM_FIELD;
                }
                // Flow Filter Data Added
                inputFieldDetailsForFilter.push(objFilterProData);
              }
            });
          }

          datalist_fields &&
            datalist_fields.length > 0 &&
            datalist_fields.forEach((flowFilterParams, index) => {
              const {
                field_name,
                field_id,
                field_type,
                field_uuid,
                aggregation_type = AGGREGATE_TYPE.NONE,
                choice_labels,
                output_key,
                reference_name,
                is_logged_in_user,
              } = flowFilterParams;
              let { label } = flowFilterParams;
              label =
                field_name !== reference_name
                  ? `${field_name} (Ref: ${reference_name})`
                  : field_name;
              const fieldValues = getFieldValuesByType(
                field_type,
                choice_labels,
              );
              const selectedOperator =
                getSelectedOperatorByFieldType(field_type);
              const objFilterProData = {
                ...flowFilterParams,
                is_system_field: false,
                aggregation_type,
                fieldType: field_type,
                fieldNames: label,
                fieldValues,
                dimension_field: output_key,
                referenceName: EMPTY_STRING,
                dimension: output_key,
                fieldUpdateValue: EMPTY_STRING,
                isAppliedFilter: false,
                isAppliedFieldEdit: false,

                fieldUuid: field_uuid,
                fieldId: field_id,
                formId: EMPTY_STRING,
                selectedOperator,
                fieldUpdateBetweenOne: EMPTY_STRING,
                fieldUpdateBetweenTwo: EMPTY_STRING,
                isFormField: false,

                INDEX: output_key,
                TEXT: field_name,

                value: output_key,
                label,

                isSectionTitle: false,
                sectionTitle: EMPTY_STRING,

                isSearch: true,
                isMeasure: false,
                measureDimension: EMPTY_STRING,
                measureLabel: EMPTY_STRING,
                isDataField: true,
                is_logged_in_user,
              };

              // Section Title Added
              if (index === 0) {
                objFilterProData.isSectionTitle = true;
                objFilterProData.sectionTitle =
                  FILTER_FIELD_STRINGS(t).DATA_LIST_FIELD;
              }

              // Flow Filter Data Added
              inputFieldDetailsForFilter.push(objFilterProData);
            });

          // Added Download Dimension
          const downloadInputField = jsUtils.cloneDeep(
            inputFieldDetailsForFilter,
          );
          const filteredDownloadDimension = downloadInputField.filter(
            (dDimension) => {
              if (
                dDimension.fieldType !== FIELD_TYPE.INFORMATION &&
                dDimension.fieldType !== TYPE_STRING &&
                !dDimension.is_table_field
              ) {
                dDimension.value = 0;

                return dDimension;
              }
              return false;
            },
          );

          clonedDatalistDashboard.filter.downloadInputField =
            filteredDownloadDimension;
          const { download_select_all = [] } = clonedDatalistDashboard.filter;
          if (download_select_all.length > 0 && download_select_all[0].value) {
            download_select_all[0].value = 0;
            clonedDatalistDashboard.filter.download_select_all =
              download_select_all;
          }

          if (
            inputFieldDetailsForFilter &&
            inputFieldDetailsForFilter.length > 0
          ) {
            clonedDatalistDashboard.filter.inputFieldDetailsForFilter =
              inputFieldDetailsForFilter;
            clonedDatalistDashboard.filter.selectedFieldDetailsFromFilter =
              inputFieldDetailsForFilter;
          }

          dispatch(
            setDatalistDashboardById({
              id: datalist_uuid,
              data: clonedDatalistDashboard,
            }),
          );
          resolve(clonedDatalistDashboard);
        })
        .catch((err) => {
          if (jsUtils.has(err, ['code']) && err.code === 'ERR_CANCELED') return;
          resolve(false);
        });
    });

export const getDatalistValuesActionThunk =
  (data_list_uuid, queryData, searchText, datalistData, cancelToken) =>
  (dispatch) =>
    new Promise((resolve) => {
      dispatch(
        setDatalistDashboardLoaderById({
          id: datalistData.datalist_uuid,
          data: true,
        }),
      );
      apiGetDatalistValues(data_list_uuid, queryData, searchText, cancelToken)
        .then((res) => {
          if (res) {
            const { pagination_data, pagination_details } = res;
            const clonedDatalistData = jsUtils.cloneDeep(datalistData);
            const {
              datalist_uuid,
              lstPaginationData,
              filter: { headerDimension },
            } = clonedDatalistData;
            clonedDatalistData.lstPaginationData = getFlowValuesData(
              jsUtils.cloneDeep(lstPaginationData),
              pagination_data,
              pagination_details,
              headerDimension,
            );
            clonedDatalistData.isLoading = false;
            dispatch(
              setDatalistDashboardById({
                id: datalist_uuid,
                data: clonedDatalistData,
              }),
            );
            resolve(clonedDatalistData);
          }
        })
        .catch((err) => {
          if (jsUtils.has(err, ['code']) && err.code === 'ERR_CANCELED') return;
          dispatch(
            setDatalistDashboardLoaderById({
              id: datalistData.datalist_uuid,
              data: false,
            }),
          );
          resolve(false);
        });
    });

export const getAppReportValuesThunk =
  (
    source,
    query,
    source_type,
    selectedFieldsFromReport,
    uuid,
    clonedReportViewUserFilter = {},
    chartsValue = {},
    isQuickFilter = false,
  ) =>
  (dispatch) => {
    const _source =
      source_type === REPORT_SOURCE_TYPES.CROSS_FLOW_DATALIST
        ? { source_config: source }
        : source[0].source_uuid;
    let fetchMethod;
    if (source_type === REPORT_SOURCE_TYPES.FLOW) {
      fetchMethod = getFlowValues;
    } else if (source_type === REPORT_SOURCE_TYPES.DATALIST) {
      fetchMethod = getDatalistValues;
    } else if (source_type === REPORT_SOURCE_TYPES.CROSS_FLOW_DATALIST) {
      fetchMethod = getCrossValues;
    }
    dispatch(setAppReportLoaderById({ data: true, id: uuid }));
    fetchMethod(query, _source)
      .then((res) => {
        const { data } = res.data.result;
        const { pagination_details, quick_filter_data, manipulation_data } =
          data;
        let { pagination_data } = data;

        const { appReports } = jsUtils.cloneDeep(
          store.getState().ApplicationDashboardReportReducer,
        );
        const report = appReports[uuid];
        let {
          reports,
          dayFilterData = EMPTY_STRING,
          monthFilterData = EMPTY_STRING,
          yearFilterData = EMPTY_STRING,
          currencyFilterList = [],
          selectedCurrencyFilter = null,
        } = report;
        const { reportConfig } = report;
        const selectedXAxisFields =
          query?.query_config?.selected_fields?.x_axis || [];
        const dateFilterData =
          getDateFilterData(quick_filter_data, selectedXAxisFields) || {};
        const selectedXAxisField = selectedXAxisFields?.[0] || {};
        if (
          selectedXAxisField?.field_type === FIELD_TYPES.CURRENCY &&
          jsUtils.isEmpty(currencyFilterList)
        ) {
          currencyFilterList = getCurrencyFilterOptionalList(
            quick_filter_data,
            selectedXAxisField,
          );
          selectedCurrencyFilter = currencyFilterList[0]?.value || null;
          const currencyFilterOutPutKey = `${selectedXAxisField?.output_key}_type`;
          pagination_data = pagination_data.filter(
            (data) => data[currencyFilterOutPutKey] === selectedCurrencyFilter,
          );
        }
        if (!jsUtils.isEmpty(dateFilterData)) {
          if (dateFilterData && dateFilterData.day) {
            dayFilterData = dateFilterData.day;
          }
          if (dateFilterData && dateFilterData.month) {
            monthFilterData = dateFilterData.month;
          }
          if (dateFilterData && dateFilterData.year) {
            yearFilterData = dateFilterData.year;
          }
        }

        if (!jsUtils.isEmpty(chartsValue)) {
          reports = chartsValue;
        }

        if (pagination_details) {
          reports.paginationDetails = pagination_details;
        }
        reports.selectedFieldsFromReport = selectedFieldsFromReport;

        switch (reportConfig.report_Data.report_category) {
          case REPORT_CATEGORY_TYPES.TABLE_ROLLUP:
          case REPORT_CATEGORY_TYPES.TABLE_NON_ROLLUP:
            const {
              label: chartLabel,
              data: chartData,
              isCurrencyTypeSameFormat,
            } = getTabularData(
              pagination_data,
              selectedFieldsFromReport,
              manipulation_data?.show_total || {},
            );
            reports.chartLabel = jsUtils.cloneDeep(chartLabel);
            reports.chartData = jsUtils.cloneDeep(chartData);
            reports.isCurrencyTypeSameFormat = isCurrencyTypeSameFormat;
            if (isCurrencyTypeSameFormat) {
              reports.additionalConfiguration.isShowTotal = false;
            }
            break;
          case REPORT_CATEGORY_TYPES.CHART:
            if (reports.is_break_down) {
              const { label, data } = getChartDataForBreakDown(
                pagination_data,
                selectedFieldsFromReport,
              );
              reports.chartLabel = jsUtils.cloneDeep(label);
              reports.chartData = jsUtils.cloneDeep(data);
            } else {
              const { label, data } = getChartData(
                pagination_data,
                selectedFieldsFromReport,
              );
              reports.chartLabel = jsUtils.cloneDeep(label);
              reports.chartData = jsUtils.cloneDeep(data);
            }
            reports.paginationDataForDrillDown =
              jsUtils.cloneDeep(pagination_data);
            break;
          case REPORT_CATEGORY_TYPES.NUMERIC_ROLLUP: {
            const { label, data } = getRollupNumericData(
              pagination_data,
              selectedFieldsFromReport,
            );
            reports.chartLabel = jsUtils.cloneDeep(label);
            reports.chartData = jsUtils.cloneDeep(data);
            break;
          }
          default:
            break;
        }
        reports.isLoading = false;
        const updatedData = {
          reports,
          reportConfig,
          dayFilterData,
          monthFilterData,
          yearFilterData,
          selectedCurrencyFilter,
          currencyFilterList,
        };
        if (isQuickFilter) {
          updatedData.filter = clonedReportViewUserFilter;
        } else {
          updatedData.reportViewUserFilter = clonedReportViewUserFilter;
        }
        dispatch(addAppReport({ data: updatedData, id: uuid }));
      })
      .catch((err) => {
        if (jsUtils.has(err, ['code']) && err.code === 'ERR_CANCELED') return;
        if (
          jsUtils.get(err, 'response.data.errors.0.type') ===
          FLOW_INITIAL_LOADING_TEXT.TYPE
        ) {
          showToastPopover(
            jsUtils.get(err, 'response.data.errors.0.message'),
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          const appReports = {
            reports: { chartData: [], chartLabel: [], isLoading: false },
            reportConfig: {},
            errorList: { dataLoadingError: true },
          };
          dispatch(addAppReport({ data: appReports, id: uuid }));
        }
      });
  };

export const getAppReportFiltersThunk =
  (source, source_type, report, uuid) => (dispatch) => {
    const _source =
      source_type === REPORT_SOURCE_TYPES.CROSS_FLOW_DATALIST
        ? { source_config: source }
        : source[0].source_uuid;

    let fetchMethod;
    if (source_type === REPORT_SOURCE_TYPES.FLOW) {
      fetchMethod = getFlowFilters;
    } else if (source_type === REPORT_SOURCE_TYPES.DATALIST) {
      fetchMethod = getDatalistFilters;
    } else if (source_type === REPORT_SOURCE_TYPES.CROSS_FLOW_DATALIST) {
      fetchMethod = getCrossFilters;
    }

    fetchMethod(_source)
      .then(async (res) => {
        let { data } = res.data.result;
        if (!Array.isArray(data)) {
          data = [{ ...data }];
        }

        const inputFieldDetailsForFilter = [];
        const sourceList = [];
        data.forEach((context) => {
          const {
            system_fields_list,
            flow_fields,
            datalist_fields,
            _id,
            data_list_uuid,
            flow_uuid,
          } = context;
          const contextId = _id;
          sourceList.push({ context_uuid: data_list_uuid || flow_uuid });

          const systemFields = getSystemFields(system_fields_list, contextId);
          const dataFields = getDataFields(
            flow_fields || datalist_fields,
            contextId,
          );
          inputFieldDetailsForFilter.push(...systemFields, ...dataFields);
        });
        const { appReports } = jsUtils.cloneDeep(
          store.getState().ApplicationDashboardReportReducer,
        );
        const { reports, reportConfig: { report_Data: { report_category } } } = appReports[uuid];
        const { filter } = store.getState().ReportReducer;
        const clonedFilter = jsUtils.cloneDeep(filter);
        clonedFilter.inputFieldDetailsForFilter = jsUtils.cloneDeep(
          inputFieldDetailsForFilter,
        );
        clonedFilter.selectedFieldDetailsFromFilter = jsUtils.cloneDeep(
          inputFieldDetailsForFilter,
        );
        const { reportViewUserFilter } = store.getState().ReportReducer;
        const clonedReports = jsUtils.cloneDeep(reports);
        clonedReports.inputFieldsForReport = inputFieldDetailsForFilter;

        const clonedReportViewUserFilter =
          jsUtils.cloneDeep(reportViewUserFilter);
        if (report) {
          const { report_metadata } = report;
          const selectedFieldsFromReport = getSelectedDimensions(
            inputFieldDetailsForFilter,
            report,
          );
          const sort = getSortField(
            jsUtils.cloneDeep(selectedFieldsFromReport),
            report_metadata,
          );
          if (!jsUtils.isEmpty(selectedFieldsFromReport)) {
            selectedFieldsFromReport?.forEach((dimension) => {
              if (
                dimension?.axis === 'x' &&
                !jsUtils.isEmpty(dimension?.range)
              ) {
                clonedReports.chartSelectedRange = dimension?.range;
                clonedReports.isRangeSelected = true;
              }
            });
          }
          const selectedFieldDetailsFromFilter = getAppliedFilter(
            jsUtils.cloneDeep(inputFieldDetailsForFilter),
            report,
          );
          clonedFilter.inputFieldDetailsForFilter = jsUtils.cloneDeep(
            selectedFieldDetailsFromFilter,
          );
          clonedFilter.selectedFieldDetailsFromFilter = jsUtils.cloneDeep(
            selectedFieldDetailsFromFilter,
          );
          const userAppliedFilterFlowData = getAppliedFilter(
            jsUtils.cloneDeep(inputFieldDetailsForFilter),
            report,
            true,
          );
          const filterAppliedField = userAppliedFilterFlowData?.filter(
            (data) => data?.isAppliedFilter === true,
          );
          const inputFieldUserFilter = jsUtils
            .cloneDeep(filterAppliedField)
            .map((field) => {
              field.isAppliedFilter = false;
              return field;
            });
          clonedReports.additionalConfiguration = {
            ...clonedReports.additionalConfiguration,
            ...sort,
          };
          clonedReports.selectedFieldsFromReport = jsUtils.cloneDeep(
            selectedFieldsFromReport,
          );
          clonedReports.filter = clonedFilter;
          clonedReportViewUserFilter.inputFieldDetailsForFilter = inputFieldUserFilter;
          clonedReportViewUserFilter.selectedFieldDetailsFromFilter = filterAppliedField;
          if (
            report_category === REPORT_CATEGORY_TYPES.CHART &&
            source_type !== REPORT_SOURCE_TYPES.CROSS_FLOW_DATALIST
          ) {
            const defaultReportParams = {};
            if (source_type === REPORT_SOURCE_TYPES.FLOW) {
              defaultReportParams.flow_uuid = sourceList?.[0]?.context_uuid;
            } else if (source_type === REPORT_SOURCE_TYPES.DATALIST) {
              defaultReportParams.data_list_uuid =
                sourceList?.[0]?.context_uuid;
            }
            if (!jsUtils.isEmpty(defaultReportParams)) {
              await getDefaultReportByUUIDApi(defaultReportParams).then(
                (res) => {
                  const {
                    report: { table_columns },
                  } = res;
                  clonedReports.drillDownOutputKeys = table_columns;
                },
              );
            }
          }
          const query = generateQueryFromReportResponse(report.report_metadata);
          dispatch(
            getAppReportValuesThunk(
              source,
              query,
              source_type,
              selectedFieldsFromReport,
              uuid,
              clonedReportViewUserFilter,
              clonedReports,
            ),
          );
        }
      })
      .catch((err) => {
        const [error] = err?.response?.data?.errors || [];
        if (error?.type === 'invalid_access') {
          const appReports = {
            reports: { chartData: [], chartLabel: [], isLoading: false },
            reportConfig: {},
            errorList: { invalidAccess: true },
          };
          dispatch(addAppReport({ data: appReports, id: uuid }));
        }
      });
  };

export const getAppReportThunk = (uuid) => (dispatch) => {
  getReportByUUIDApi(uuid)
    .then((res) => {
      const { report_metadata, error_metadata, document_url_details } =
        res.data.result.data;
      const reportConfig = {};
      const { appReports } = jsUtils.cloneDeep(
        store.getState().ApplicationDashboardReportReducer,
      );
      const report = appReports[uuid] || {};
      let reports = {};
      if (!report?.reports) {
        reports = {
          isLoading: false,
          inputFieldsForReport: [],
          selectedFieldsFromReport: [],
          chartDDSelectedDimensionsValue: EMPTY_STRING,
          fieldDisplayNameSelectedValue: EMPTY_STRING,
          chartSelectedRange: [],
          ddMonthYearSelectedValue: EMPTY_STRING,
          skipNullValues: true,
          chartData: [],
          chartLabel: [],
          paginationDetails: { limit_data: 5, skip_data: 0, total_count: 0 },
          additionalConfiguration: {
            isShowTotal: false,
            sortBySelectedFieldValue: EMPTY_STRING,
            sortBySelectedValue: EMPTY_STRING,
          },
          fieldCount: {
            x: 0,
            y: 0,
          },
          report: { error_list: {} },
        };
      } else {
        reports = report.reports;
      }
      const {
        report_name,
        report_description,
        _id,
        additional_config,
        owners,
        viewers,
        report_uuid,
        source_config,
        query_config,
        report_config,
      } = report_metadata;
      reportConfig.name = report_name;
      reportConfig.description = report_description;
      reportConfig._id = _id;
      reportConfig.uuid = report_uuid;
      reportConfig.admins = owners;
      reportConfig.viewers = viewers;
      reportConfig.source_Data = source_config;
      reportConfig.report_Data = report_config;
      reportConfig.visualizationType = report_config.visualization_type;
      reportConfig.query_config = query_config;
      reportConfig.error_metadata = error_metadata;
      reportConfig.document_url_details = document_url_details;
      if (
        query_config?.y_axis?.length === 1 &&
        query_config?.y_axis?.[0]?.is_breakdown
      ) {
        reports.is_break_down = true;
      }
      if (
        query_config?.x_axis?.[0]?.is_multiselect_combination &&
        query_config?.y_axis?.[0]?.is_multiselect_combination
      ) {
        reports.is_unique_combination = true;
      }
      if (report_config.report_category === REPORT_CATEGORY_TYPES.CHART) {
        reports.fieldCount = {
          x: query_config?.x_axis?.length || 0,
          y: query_config?.y_axis?.length || 0,
        };
      }
      reports.additionalConfiguration.isShowTotal =
        additional_config.show_total;
      const apiBasicDetails =
        constructCreateReportEditDetails(source_config) || {};
      const errorList = calculateSourceErrors(apiBasicDetails, error_metadata);
      reports.isLoading = jsUtils.isEmpty(errorList);

      dispatch(
        addAppReport({ data: { reportConfig, reports, errorList }, id: uuid }),
      );
      if (jsUtils.isEmpty(errorList)) {
        dispatch(
          getAppReportFiltersThunk(
            source_config,
            report_config.report_type,
            { report_metadata, error_metadata },
            uuid,
          ),
        );
      }
    })
    .catch((err) => {
      const [error] = err?.response?.data?.errors || [];
      const appReport = {
        reports: { chartData: [], chartLabel: [], isLoading: false },
        reportConfig: {},
        errorList: {},
      };
      if (error?.type === 'invalid_access') {
        appReport.errorList.invalidAccess = true;
      }
      dispatch(addAppReport({ data: appReport, id: uuid }));
    });
};

export const getDataListDashboardSpecificEntryTaskListApi =
  (params, datalistUuid, additionalStateData) => (dispatch) => {
    dispatch(
      setDatalistDashboardById({
        id: datalistUuid,
        data: {
          ...additionalStateData,
          isDataListEntryTaskPageLoading: true,
          isDataListEntryTaskEntriesLoading: true,
        },
      }),
    );
    setPointerEvent(true);
    updatePostLoader(true);
    getDataListEntryTaskDetails(params)
      .then((res) => {
        setPointerEvent(false);
        updatePostLoader(false);
        const clonedAllDatalistEntryTasks = jsUtils.cloneDeep(
          store.getState().ApplicationDashboardReportReducer.datalistDashboard[
            datalistUuid
          ].allDatalistEntryTasks,
        );
        if (!jsUtils.isEmpty(res)) {
          const allTasks = [
            ...(clonedAllDatalistEntryTasks || []),
            ...(res.pagination_data || []),
          ];
          dispatch(
            setDatalistDashboardById({
              id: datalistUuid,
              data: {
                ...additionalStateData,
                allDataListEntryTaskEntries: res.pagination_data,
                allDatalistEntryTasks: removeDuplicateFromArrayOfObjects(
                  allTasks,
                  '_id',
                ),
                dataListEntryTaskCount: res.pagination_details[0].total_count,
                dataListEntryTaskDocumentUrl: res.document_url_details,
                isDataListEntryTaskPageLoading: false,
                isDataListEntryTaskEntriesLoading: false,
              },
            }),
          );
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const error = generateGetServerErrorMessage(err);
          dispatch(
            setDatalistDashboardById({
              id: datalistUuid,
              data: {
                ...additionalStateData,
                isDataListEntryTaskPageLoading: false,
                isDataListEntryTaskEntriesLoading: false,
                common_server_error: error.common_server_error,
              },
            }),
          );
        }
      })
      .catch((err) => {
        if (err && err.code === 'ERR_CANCELED') return;
        const { server_error } = store.getState().DataListReducer;
        const error_data = {
          error: err,
          server_error,
        };
        const apiFailureAction = {
          dispatch,
          action: (errorData) =>
            dispatch(
              setDatalistDashboardById({
                id: datalistUuid,
                data: {
                  isDataListEntryTaskPageLoading: false,
                  isDataListEntryTaskEntriesLoading: false,
                  common_server_error: errorData,
                },
              }),
            ),
        };
        generateApiErrorsAndHandleCatchBlock(
          error_data,
          apiFailureAction,
          false,
          true,
        );
      });
  };
