import { store } from '../../Store';
import { getAllViewDataList } from '../../axios/apiService/dataList.apiService';
import { apiGetAllFieldsList } from '../../axios/apiService/flow.apiService';
import { getAllFlows } from '../../axios/apiService/flowList.apiService';
import {
  getCrossFilters,
  getDatalistFilters,
  getFlowFilters,
  getCrossValues,
  getDatalistValues,
  getFlowValues,
  getReportByUUIDApi,
  publishReportApi,
  deleteReportByIdApi,
} from '../../axios/apiService/reports.apiService';
import {
  generateQueryFromReportResponse,
  getAppliedFilter,
  getCurrencyFilterOptionalList,
  getDataFields,
  getDateFilterData,
  getSelectedDimensions,
  getSortField,
  getSystemFields,
} from '../../containers/report/report_creation/ReportCreation.utils';
import { getInputFieldsFromDrillDownOutputKey } from '../../containers/report/report_creation/ReportQuery.utils';
import {
  getChartData,
  getChartDataForBreakDown,
  getRollupNumericData,
  getTabularData,
} from '../../containers/report/report_creation/ReportData.utils';
import { showToastPopover } from '../../utils/UtilityFunctions';
import {
  FLOW_INITIAL_LOADING_TEXT,
  VALIDATION_ERROR_TYPES,
  EMPTY_STRING,
} from '../../utils/strings/CommonStrings';
import {
  generateList,
  constructCreateReportEditDetails,
  calculateSourceErrors,
} from '../../containers/report/Report.utils';
import jsUtility from '../../utils/jsUtility';
import { getAllReportsApi } from '../../axios/apiService/applicationDashboardReport.apiService';
import {
  dataChange,
  setReportListing,
  startChartsLoading,
  startReportConfigLoader,
  startReportListingLoader,
  stopChartsLoading,
  stopReportConfigLoader,
  stopReportListingLoader,
} from '../reducer/ReportReducer';
import { constructUsersOrTeams } from '../../containers/report/report_list/ReportList.utils';
import { DIRECT_FIELD_LIST_TYPE } from '../../utils/ValidationConstants';
import { FORM_POPOVER_STATUS } from '../../utils/Constants';
import { clearAlertPopOverStatusAction } from './Actions';
import {
  REPORT_SOURCE_TYPES,
  LIST_API_TYPE,
  DROPDOWN_TYPES,
  REPORT_CATEGORY_TYPES,
  REPORT_VISUALIZATION_TYPES,
  NOT_EXIST_FIELDS,
  REPORT_STRINGS,
  DASHBOARD_FIELDS,
} from '../../containers/report/Report.strings';
import { FIELD_TYPES } from '../../components/form_builder/FormBuilder.strings';
import { addAppReport } from '../reducer/ApplicationDashboardReportReducer';
import { getDefaultReportByUUIDApi } from '../../axios/apiService/dashboardConfig.apiService';

export const getReportValuesThunk =
  (source, query, source_type, _chartSelectedDimensions) => (dispatch) => {
    const _source =
      source_type === REPORT_SOURCE_TYPES.CROSS_FLOW_DATALIST
        ? { source_config: source }
        : source[0].source_uuid;

    dispatch(startChartsLoading());
    let fetchMethod;
    if (source_type === REPORT_SOURCE_TYPES.FLOW) {
      fetchMethod = getFlowValues;
    } else if (source_type === REPORT_SOURCE_TYPES.DATALIST) {
      fetchMethod = getDatalistValues;
    } else if (source_type === REPORT_SOURCE_TYPES.CROSS_FLOW_DATALIST) {
      fetchMethod = getCrossValues;
    }

    fetchMethod(query, _source)
      .then((res) => {
        const { data } = res.data.result;
        const {
          pagination_details,
          manipulation_data,
          quick_filter_data = {},
        } = data;
        let { pagination_data } = data;

        const { reports, reportConfig } = jsUtility.cloneDeep(
          store.getState().ReportReducer,
        );
        let { currencyFilterList, selectedCurrencyFilter } =
          jsUtility.cloneDeep(store.getState().ReportReducer);
        const { selectedFieldsFromReport: selectedDimensions } = reports;
        const selectedFieldsFromReport =
          _chartSelectedDimensions || selectedDimensions;
        let dayFilterData;
        let monthFilterData;
        let yearFilterData;
        const selectedXAxisFields =
          query?.query_config?.selected_fields?.x_axis || [];
        const dateFilterData =
          getDateFilterData(quick_filter_data, selectedXAxisFields) || {};
        const selectedXAxisField = selectedXAxisFields?.[0] || {};
        if (
          selectedXAxisField?.field_type === FIELD_TYPES.CURRENCY &&
          jsUtility.isEmpty(currencyFilterList)
        ) {
          currencyFilterList = getCurrencyFilterOptionalList(
            quick_filter_data,
            selectedXAxisField,
          );
          selectedCurrencyFilter = selectedCurrencyFilter ?? currencyFilterList[0]?.value ?? null;
          const currencyFilterOutPutKey = `${selectedXAxisField?.output_key}_type`;
          pagination_data = pagination_data.filter(
            (data) => data[currencyFilterOutPutKey] === selectedCurrencyFilter,
          );
        }
        if (!jsUtility.isEmpty(dateFilterData)) {
          dayFilterData = dateFilterData.day;
          monthFilterData = dateFilterData.month;
          yearFilterData = dateFilterData.year;
        } else {
          dayFilterData = null;
          monthFilterData = null;

          yearFilterData = null;
        }
        if (pagination_details) {
          reports.paginationDetails = pagination_details;
        }

        switch (reportConfig.report_Data.report_category) {
          case REPORT_CATEGORY_TYPES.TABLE_ROLLUP:
          case REPORT_CATEGORY_TYPES.TABLE_NON_ROLLUP:
            {
              const {
                label: chartLabel,
                data: chartData,
                isCurrencyTypeSameFormat,
              } = getTabularData(
                pagination_data,
                selectedFieldsFromReport,
                manipulation_data?.show_total || {},
              );
              reports.chartLabel = jsUtility.cloneDeep(chartLabel);
              reports.chartData = jsUtility.cloneDeep(chartData);
              reports.isCurrencyTypeSameFormat = isCurrencyTypeSameFormat;
              if (isCurrencyTypeSameFormat) {
                reports.additionalConfiguration.isShowTotal = false;
              }
            }
            break;
          case REPORT_CATEGORY_TYPES.CHART:
            if (reports.is_break_down) {
              const { label, data } = getChartDataForBreakDown(
                pagination_data,
                selectedFieldsFromReport,
              );
              reports.chartLabel = jsUtility.cloneDeep(label);
              reports.chartData = jsUtility.cloneDeep(data);
            } else {
              const { label, data } = getChartData(
                pagination_data,
                selectedFieldsFromReport,
              );
              reports.chartLabel = jsUtility.cloneDeep(label);
              reports.chartData = jsUtility.cloneDeep(data);
            }
            reports.paginationDataForDrillDown =
              jsUtility.cloneDeep(pagination_data);
            break;
          case REPORT_CATEGORY_TYPES.NUMERIC_ROLLUP: {
            const { label, data } = getRollupNumericData(
              pagination_data,
              selectedFieldsFromReport,
            );
            reports.chartLabel = jsUtility.cloneDeep(label);
            reports.chartData = jsUtility.cloneDeep(data);
            break;
          }
          default:
            break;
        }
        dispatch(
          dataChange({
            data: {
              reports,
              dayFilterData,
              monthFilterData,
              yearFilterData,
              selectedCurrencyFilter,
              currencyFilterList,
            },
          }),
        );
      })
      .catch((err) => {
        if (
          jsUtility.get(err, 'response.data.errors.0.type') ===
            VALIDATION_ERROR_TYPES.NOT_EXIST &&
          NOT_EXIST_FIELDS.includes(
            jsUtility.get(err, 'response.data.errors.0.field'),
          )
        ) {
          dispatch(dataChange({ data: { errorList: { not_exist: true } } }));
        }
        if (jsUtility.has(err, ['code']) && err.code === 'ERR_CANCELED') return;
        if (
          jsUtility.get(err, 'response.data.errors.0.type') ===
          FLOW_INITIAL_LOADING_TEXT.TYPE
        ) {
          showToastPopover(
            jsUtility.get(err, 'response.data.errors.0.message'),
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          const { errorList } = jsUtility.cloneDeep(
            store.getState().ReportReducer,
          );
          errorList.dataLoadingError = true;
          dispatch(dataChange({ data: { errorList } }));
        }
      })
      .finally(() => dispatch(stopChartsLoading()));
  };

export const getReportDrillDownValuesThunk =
  (
    source,
    query,
    source_type,
    report_uuid = EMPTY_STRING,
    drillDownFilterData = EMPTY_STRING,
  ) =>
  (dispatch) => {
    const _source =
      source_type === REPORT_SOURCE_TYPES.CROSS_FLOW_DATALIST
        ? { source_config: source }
        : source[0].source_uuid;

    dispatch(startChartsLoading());
    let fetchMethod;
    if (source_type === REPORT_SOURCE_TYPES.FLOW) {
      fetchMethod = getFlowValues;
    } else if (source_type === REPORT_SOURCE_TYPES.DATALIST) {
      fetchMethod = getDatalistValues;
    } else if (source_type === REPORT_SOURCE_TYPES.CROSS_FLOW_DATALIST) {
      fetchMethod = getCrossValues;
    }

    fetchMethod(query, _source)
      .then((res) => {
        const { data } = res.data.result;
        const { pagination_data } = data;

        let reportsState;
        if (report_uuid) {
          reportsState = jsUtility.cloneDeep(
            store.getState().ApplicationDashboardReportReducer.appReports[
              report_uuid
            ],
          );
        } else {
          reportsState = jsUtility.cloneDeep(store.getState().ReportReducer);
        }
        const {
          reports,
          reports: {
            inputFieldsForReport,
            drillDownOutputKeys,
            selectedFieldsFromReport,
          },
        } = reportsState;
        let filteredInputFields = [];
        if (source_type === REPORT_SOURCE_TYPES.CROSS_FLOW_DATALIST) {
          const xAndYWiseList = jsUtility.sortBy(
            jsUtility.cloneDeep(selectedFieldsFromReport),
            (e) => e.axis,
          );
          filteredInputFields = jsUtility.cloneDeep(xAndYWiseList);
        } else {
          filteredInputFields = getInputFieldsFromDrillDownOutputKey(
            inputFieldsForReport,
            drillDownOutputKeys,
          );
        }
        const { label: chartLabel, data: chartData } = getTabularData(
          pagination_data,
          filteredInputFields,
          {},
          true,
        );
        reports.reportDrillDownTitle = jsUtility.cloneDeep(drillDownFilterData);
        reports.reportDrillDownLabel = jsUtility.cloneDeep(chartLabel);
        reports.reportDrillDownData = jsUtility.cloneDeep(chartData);
        if (report_uuid) {
          dispatch(
            addAppReport({
              data: { reports },
              id: report_uuid,
            }),
          );
        } else {
          dispatch(
            dataChange({
              data: {
                reports,
              },
            }),
          );
        }
      })
      .catch((err) => {
        if (
          jsUtility.get(err, 'response.data.errors.0.type') ===
            VALIDATION_ERROR_TYPES.NOT_EXIST &&
          NOT_EXIST_FIELDS.includes(
            jsUtility.get(err, 'response.data.errors.0.field'),
          )
        ) {
          dispatch(dataChange({ data: { errorList: { not_exist: true } } }));
        }
        if (jsUtility.has(err, ['code']) && err.code === 'ERR_CANCELED') return;
        if (
          jsUtility.get(err, 'response.data.errors.0.type') ===
          FLOW_INITIAL_LOADING_TEXT.TYPE
        ) {
          showToastPopover(
            jsUtility.get(err, 'response.data.errors.0.message'),
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          const { errorList } = jsUtility.cloneDeep(
            store.getState().ReportReducer,
          );
          errorList.dataLoadingError = true;
          dispatch(dataChange({ data: { errorList } }));
        }
      })
      .finally(() => dispatch(stopChartsLoading()));
  };

export const getReportFiltersThunk =
  (source, source_type, report) => (dispatch) => {
    const _source =
      source_type === REPORT_SOURCE_TYPES.CROSS_FLOW_DATALIST
        ? { source_config: source }
        : source[0].source_uuid;

    dispatch(startChartsLoading());
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
            data_list_name,
            flow_uuid,
            flow_name,
            source_order = 0,
          } = context;
          const contextId = _id;
          sourceList.push({
            context_id: contextId,
            context_uuid: data_list_uuid || flow_uuid,
            context_name: data_list_name || flow_name,
            source_order,
          });

          const systemFields = getSystemFields(system_fields_list, contextId);
          const dataFields = getDataFields(
            flow_fields || datalist_fields,
            contextId,
          );
          inputFieldDetailsForFilter.push(...systemFields, ...dataFields);
        });

        sourceList.sort((s1, s2) =>
          s1.source_order > s2.source_order ? 1 : -1,
        );
        const { reports, filter, reportConfig: { report_Data: { report_category } } } = store.getState().ReportReducer;
        const clonedReports = jsUtility.cloneDeep(reports);
        const clonedFilter = jsUtility.cloneDeep(filter);
        clonedReports.inputFieldsForReport = inputFieldDetailsForFilter;
        clonedFilter.inputFieldDetailsForFilter = jsUtility.cloneDeep(
          inputFieldDetailsForFilter,
        );
        clonedFilter.selectedFieldDetailsFromFilter = jsUtility.cloneDeep(
          inputFieldDetailsForFilter,
        );
        let reportViewUserFilter = jsUtility.cloneDeep(
          store.getState()?.ReportReducer?.reportViewUserFilter,
        );
        reportViewUserFilter.selectedFieldDetailsFromFilter =
          jsUtility.cloneDeep(clonedFilter.selectedFieldDetailsFromFilter);
        const userFilter = jsUtility.cloneDeep(clonedFilter);
        if (report) {
          const { report_metadata } = report;
          reportViewUserFilter = jsUtility.cloneDeep(clonedFilter);
          const selectedFieldsFromReport = getSelectedDimensions(
            jsUtility.cloneDeep(inputFieldDetailsForFilter),
            report,
          );
          if (!jsUtility.isEmpty(selectedFieldsFromReport)) {
            selectedFieldsFromReport?.forEach((dimension) => {
              if (
                dimension?.axis === 'x' &&
                !jsUtility.isEmpty(dimension?.range)
              ) {
                clonedReports.chartSelectedRange = dimension?.range;
                clonedReports.isRangeSelected = true;
              }
            });
          }
          const selectedFieldDetailsFromFilter = getAppliedFilter(
            jsUtility.cloneDeep(inputFieldDetailsForFilter),
            report,
          );
          const userAppliedFilterFlowData = getAppliedFilter(
            jsUtility.cloneDeep(inputFieldDetailsForFilter),
            report,
            true,
          );
          const sort = getSortField(
            jsUtility.cloneDeep(selectedFieldsFromReport),
            report_metadata,
          );

          clonedReports.additionalConfiguration = {
            ...clonedReports.additionalConfiguration,
            ...sort,
          };
          clonedReports.selectedFieldsFromReport = jsUtility.cloneDeep(
            selectedFieldsFromReport,
          );
          clonedFilter.inputFieldDetailsForFilter = jsUtility.cloneDeep(
            selectedFieldDetailsFromFilter,
          );
          clonedFilter.selectedFieldDetailsFromFilter = jsUtility.cloneDeep(
            selectedFieldDetailsFromFilter,
          );

          let isThereADeletedField = false;
          clonedReports.selectedFieldsFromReport.forEach((field) => {
            if (field.isFieldDeleted) {
              isThereADeletedField = true;
              clonedReports.isLoading = false;
            }
          });

          if (!isThereADeletedField) {
            const query = generateQueryFromReportResponse(report_metadata);
            dispatch(
              getReportValuesThunk(
                source,
                query,
                source_type,
                selectedFieldsFromReport,
              ),
            );
          }
          userFilter.inputFieldDetailsForFilter = jsUtility.cloneDeep(
            userAppliedFilterFlowData,
          );
          userFilter.selectedFieldDetailsFromFilter = jsUtility.cloneDeep(
            userAppliedFilterFlowData,
          );
          const filterAppliedField = userAppliedFilterFlowData
            ?.filter((data) => data?.isAppliedFilter === true)
            .map((data) => {
              data.isAppliedFilter = false;
              return data;
            });
          reportViewUserFilter.inputFieldDetailsForFilter = filterAppliedField;
          reportViewUserFilter.selectedFieldDetailsFromFilter =
            userAppliedFilterFlowData;
        }

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
          if (!jsUtility.isEmpty(defaultReportParams)) {
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

        const clonedData = jsUtility.cloneDeep({
          reports: clonedReports,
          filter: clonedFilter,
          sourceList,
          userFilter: userFilter,
          reportViewUserFilter,
        });

        dispatch(
          dataChange({
            data: clonedData,
          }),
        );
      })
      .catch((err) => {
        const [error] = err?.response?.data?.errors || [];
        const { ERRORS } = REPORT_STRINGS();
        if (error?.type === 'invalid_access') {
          showToastPopover(
            ERRORS.INVALID_ACCESS_TITLE,
            ERRORS.INVALID_ACCESS_TEXT,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          dispatch(clearAlertPopOverStatusAction());
          const { errorList } = jsUtility.cloneDeep(
            store.getState().ReportReducer,
          );
          errorList.invalidAccess = true;
          dispatch(dataChange({ data: { errorList } }));
        }
        dispatch(stopChartsLoading());
      })
      .finally(() => !report && dispatch(stopChartsLoading()));
  };

export const getOptionalList =
  (ApiType, params, dropDownType) => (dispatch) => {
    let respectiveApiThunk = null;
    switch (ApiType) {
      case LIST_API_TYPE.FLOW:
        respectiveApiThunk = getAllFlows;
        break;
      case LIST_API_TYPE.DATA_LIST:
        respectiveApiThunk = getAllViewDataList;
        break;
      case LIST_API_TYPE.FIELD_LIST:
        respectiveApiThunk = apiGetAllFieldsList;
        params.allowed_field_types = DASHBOARD_FIELDS;
        params.field_list_type = DIRECT_FIELD_LIST_TYPE;
        break;
      default:
        break;
    }
    dispatch(dataChange({ data: { isListLoading: true } }));
    respectiveApiThunk(params)
      .then((res) => {
        if (res) {
          const { pagination_data = [] } = res;
          const arrResOptions = [];
          pagination_data.forEach((pData) => {
            arrResOptions.push(generateList(pData, ApiType));
          });

          const updatedData = { isListLoading: false };
          switch (dropDownType) {
            case DROPDOWN_TYPES.PRIMARY_SOURCE:
              updatedData.primaryDataSourceOptionList = arrResOptions;
              break;
            case DROPDOWN_TYPES.SECONDARY_SOURCE:
              updatedData.secondaryDataSourceOptionList = arrResOptions;

              break;
            case DROPDOWN_TYPES.PRIMARY_FIELD:
              updatedData.primaryFieldOptionList = arrResOptions;
              break;
            case DROPDOWN_TYPES.SECONDARY_FIELD:
              updatedData.secondaryFieldOptionList = arrResOptions;
              break;
            default:
              break;
          }
          dispatch(dataChange({ data: updatedData }));
        }
      })
      .catch((err) => {
        console.log('ERROR getReportValuesThunk', err);
      });
  };

export const getReportByUUIDThunk = (uuid) => (dispatch) => {
  dispatch(startReportConfigLoader());
  dispatch(startChartsLoading());
  getReportByUUIDApi(uuid)
    .then((res) => {
      const { report_metadata, error_metadata, document_url_details } =
        res.data.result.data;
      const { reportConfig, reports } = jsUtility.cloneDeep(
        store.getState().ReportReducer,
      );
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
        is_editable,
      } = report_metadata;
      reportConfig.name = report_name;
      reportConfig.description = report_description;
      reportConfig._id = _id;
      reportConfig.uuid = report_uuid;
      reportConfig.admins = constructUsersOrTeams(owners);
      reportConfig.viewers = constructUsersOrTeams(viewers);
      reportConfig.source_Data = source_config;
      reportConfig.report_Data = report_config;
      reportConfig.query_config = query_config;
      reportConfig.error_metadata = error_metadata;
      reportConfig.document_url_details = document_url_details;
      reportConfig.visualizationType = report_config.visualization_type;
      reportConfig.is_editable = is_editable;
      if (
        query_config?.y_axis?.length === 1 &&
        query_config?.y_axis?.[0]?.is_breakdown
      ) {
        reportConfig.visualizationType = REPORT_VISUALIZATION_TYPES.STACKED;
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
      apiBasicDetails.reportCategory = report_config?.report_type;

      const errorList = calculateSourceErrors(apiBasicDetails, error_metadata);

      dispatch(
        dataChange({
          data: {
            reportConfig,
            reports,
            ...constructCreateReportEditDetails(source_config),
            apiBasicDetails,
            reportCategory: report_config?.report_category,
            errorList,
          },
        }),
      );
      dispatch(
        getReportFiltersThunk(source_config, report_config.report_type, {
          report_metadata,
          error_metadata,
        }),
      );
    })
    .catch((err) => {
      console.log('ERROR getReportByIdThunk', err);
    })
    .finally(() => dispatch(stopReportConfigLoader()));
};

export const publishReportThunk = (data, cb) => () => {
  publishReportApi(data)
    .then(() => {
      cb(data.is_new_report);
    })
    .catch((err) => {
      console.log('xyz ERROR publishReportThunk', err);
      if (jsUtility.has(err, ['code']) && err.code === 'ERR_CANCELED') return;
      const error = jsUtility.get(err, 'response.data.errors.0');
      cb(data.is_new_report, false, error);
    });
};

// Report Lists
export const getAllReportsActionThunk = (params, isLoadMore) => (dispatch) =>
  new Promise((resolve) => {
    if (params.page === 1) {
      dispatch(startReportListingLoader());
    }
    getAllReportsApi(params)
      .then((res) => {
        if (res) {
          const { reportListing } = jsUtility.cloneDeep(
            store.getState().ReportReducer,
          );
          const { pagination_data, pagination_details } = res;
          reportListing.isLoading = false;
          if (isLoadMore) {
            reportListing.reportList = [
              ...reportListing.reportList,
              ...jsUtility.cloneDeep(pagination_data),
            ];
          } else {
            reportListing.reportList = pagination_data;
          }
          reportListing.paginationDetails.page = params.page;
          reportListing.paginationDetails.totalCount =
            pagination_details[0]?.total_count;
          reportListing.hasMore =
            reportListing.paginationDetails.totalCount >
            reportListing.reportList.length;
          dispatch(setReportListing(reportListing));
          resolve(res);
        }
      })
      .catch((err) => {
        dispatch(stopReportListingLoader());
        if (jsUtility.has(err, ['code']) && err.code === 'ERR_CANCELED') return;
        resolve(false);
      });
  });

export const deleteReportByIdThunk = (id, cb) => () =>
  new Promise((resolve) => {
    deleteReportByIdApi(id)
      .then(() => {
        cb?.();
      })
      .catch((err) => {
        if (jsUtility.has(err, ['code']) && err.code === 'ERR_CANCELED') return;
        resolve(false);
      });
  });
