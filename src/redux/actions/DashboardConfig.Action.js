import {
  getAllDataFieldsApi,
  getDefaultReportByIdApi,
  saveDefaultReportApi,
} from '../../axios/apiService/dashboardConfig.apiService';
import { getDeletedFieldColumnsList } from '../../containers/shared_container/dashboard_config/DashboardConfig.utils';
import {
  dataChange,
  startDashboardConfigLoader,
  stopDashboardConfigLoader,
} from '../../containers/shared_container/dashboard_config/DashboardConfigReducer';
import {
  DATALIST_SYSTEM_FIELD_LIST,
  FLOW_SYSTEM_FIELD_LIST,
} from '../../utils/constants/systemFields.constant';
import jsUtility from '../../utils/jsUtility';

export const getDefaultReportByIdThunk = (params, dispatch, fieldList = []) => {
  dispatch(startDashboardConfigLoader);
  getDefaultReportByIdApi(params)
    .then((res) => {
      const {
        _id,
        features,
        report: { sorting, table_columns },
      } = res;
      const dashboardConfigData = {
        dashboardId: _id,
        columnList: table_columns,
        sorting: sorting[0],
        additionalConfig: features,
        isDataUpdated: false,
      };
      if (jsUtility.isArray(fieldList) && fieldList.length > 0) {
        dashboardConfigData.columnList = getDeletedFieldColumnsList(
          table_columns,
          fieldList,
        );
      }
      dispatch(dataChange(jsUtility.cloneDeep(dashboardConfigData)));
    })
    .catch((err) => {
      console.log('getDefaultReportByIdThunk error', err);
    })
    .finally(() => {
      dispatch(stopDashboardConfigLoader);
    });
};

export const saveDefaultReportThunk = (data, setCancelToken, dispatch) => {
  saveDefaultReportApi(data, setCancelToken)
    .then((res) => {
      const {
        _id,
        features,
        report: { sorting, table_columns },
      } = res;
      const dashboardConfigData = {
        dashboardId: _id,
        columnList: table_columns,
        sorting: sorting[0],
        additionalConfig: features,
        isDataUpdated: false,
      };
      dispatch(dataChange(jsUtility.cloneDeep(dashboardConfigData)));
      console.log('saveDefaultReportThunk res', res);
    })
    .catch((err) => {
      console.log('saveDefaultReportThunk error', err);
    });
};

export const getAllDataFieldThunk = (params, dispatch) =>
  new Promise((resolve) => {
    getAllDataFieldsApi(params)
      .then((res) => {
        const { pagination_data } = res;
        const dataFieldList = pagination_data.map((data) => {
          const field = {
            _id: data.field_uuid,
            field_source: 'entity_field',
            field_name: data.field_name,
            field_type: data.field_type,
          };
          return field;
        });
        dataFieldList[0].groupSourceType = 'data_field';
        let systemFieldList = [];
        if (params.data_list_id) {
          systemFieldList = DATALIST_SYSTEM_FIELD_LIST;
        } else if (params.flow_id) {
          systemFieldList = jsUtility.cloneDeep(FLOW_SYSTEM_FIELD_LIST);
        }
        systemFieldList = systemFieldList.map((data) => {
          const field = {
            _id: data.id,
            field_source: data.field_list_type,
            field_name: data.label,
            field_type: data.field_type,
          };
          return field;
        });
        systemFieldList[0].groupSourceType = 'system_field';
        const fieldList = [...dataFieldList, ...systemFieldList];
        dispatch(dataChange({ fieldList }));
        resolve(fieldList);
      })
      .catch(() => {
        resolve(false);
      });
  });
