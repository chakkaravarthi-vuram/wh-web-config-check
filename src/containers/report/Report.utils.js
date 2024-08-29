import React from 'react';
import { Chip, EChipSize, Text } from '@workhall-pvt-lmt/wh-ui-library';
import jsUtility, { translateFunction } from '../../utils/jsUtility';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { REPORT_SOURCE_TYPES, REPORT_STRINGS } from './Report.strings';
import { isBasicUserMode, routeNavigate } from '../../utils/UtilityFunctions';
import {
  APP,
  CREATE_REPORT,
  EDIT_REPORT,
  REPORT_INSTANCE_VIEWER,
  VIEW_REPORT,
} from '../../urls/RouteConstants';
import { ROUTE_METHOD } from '../../utils/Constants';
import {
  defaultFlowColumnsID,
  getStatusDetailsByKey,
} from '../application/app_components/dashboard/flow/Flow.utils';

export const generateList = (value = {}, isFlowOrDataList = 3) => {
  if (isFlowOrDataList === 1) {
    return {
      label: value?.flow_name,
      value: `${value?._id} ${value?.flow_uuid}`,
      isCheck: false,
    };
  } else if (isFlowOrDataList === 2) {
    return {
      label: value?.data_list_name,
      value: `${value?._id} ${value?.data_list_uuid}`,
      isCheck: false,
    };
  } else {
    return {
      label: value?.field_name,
      value: `${value?._id} ${value?.field_uuid} ${value?.field_list_type}`,
      isCheck: false,
    };
  }
};

const constructMapFieldData = (data) => {
  const temp = {};
  const [id, uuid, type] = data.split(' ');
  temp.field_id = id;
  temp.field_uuid = uuid;
  temp.field_type = type;
  return temp;
};

export const constructSourceData = (state) => {
  const primarySource = {};
  const secondarySource = {};
  const tempSourceList = [];
  const mapConfig = [];
  const [id, uuid] = state.primaryDataSource.split(' ');
  primarySource.source_id = id;
  primarySource.source_uuid = uuid;
  primarySource.source_order = 1;
  primarySource.map_config = [];
  primarySource.source_type = state?.primarySourceType;
  if (state?.secondaryDataSource) {
    const [id, uuid] = state.secondaryDataSource.split(' ');
    secondarySource.source_id = id;
    secondarySource.source_uuid = uuid;
    secondarySource.source_order = 2;
    secondarySource.source_type = state?.secondaryDataSourceType;
    secondarySource.map_config = [];
    mapConfig.push({
      local_field_details: constructMapFieldData(state?.primaryField),
      foreign_source_details: {
        source_id: id,
        source_uuid: uuid,
        source_type: state?.secondaryDataSourceType,
        ...constructMapFieldData(state?.secondaryField),
      },
    });
    primarySource.map_config = mapConfig;
  }
  tempSourceList.push(primarySource);
  !jsUtility.isEmpty(secondarySource) && tempSourceList.push(secondarySource);

  return tempSourceList;
};

export const constructReportData = (state, source_Data) => {
  const temp = {};
  temp.report_category = state?.reportCategory;
  temp.report_type =
    source_Data.length === 1
      ? state?.primarySourceType
      : REPORT_SOURCE_TYPES.CROSS_FLOW_DATALIST;
  return temp;
};

export const constructCreateReportEditDetails = (apiData) => {
  const result = {};
  result.reportCategory = apiData?.report_config?.report_type;
  apiData.forEach((sourceData) => {
    if (sourceData?.source_order === 1) {
      result.primaryDataSource = `${sourceData?.source_id} ${sourceData?.source_uuid}`;
      result.primaryDataSourceName = sourceData?.source_name;
      result.primarySourceType = sourceData?.source_type;
      if (!jsUtility.isEmpty(sourceData?.map_config)) {
        const primaryFieldDataFromApi =
          sourceData?.map_config[0]?.local_field_details;
        const secondaryFieldDataFromApi =
          sourceData?.map_config[0]?.foreign_source_details;
        result.primaryField = `${primaryFieldDataFromApi?.field_id} ${primaryFieldDataFromApi?.field_uuid} ${primaryFieldDataFromApi?.field_type}`;
        result.primaryFieldName = primaryFieldDataFromApi?.field_name;
        result.secondaryField = `${secondaryFieldDataFromApi?.field_id} ${secondaryFieldDataFromApi?.field_uuid} ${secondaryFieldDataFromApi?.field_type}`;
        result.secondaryFieldName = secondaryFieldDataFromApi?.field_name;
      }
    } else if (sourceData?.source_order === 2) {
      result.secondaryDataSource = `${sourceData?.source_id} ${sourceData?.source_uuid}`;
      result.secondaryDataSourceName = sourceData?.source_name;
      result.secondaryDataSourceType = sourceData?.source_type;
    }
  });
  return result;
};

export const getReportValidationData = (state) => {
  return {
    primaryDataSource: state?.primaryDataSource,
    secondaryDataSource: state?.secondaryDataSource,
    primaryField: state?.primaryField,
    secondaryField: state?.secondaryField,
    isAddOneMore: state?.isAddOneMore,
  };
};

export const calculateSourceErrors = (source, error_metadata) => {
  const { ERRORS } = REPORT_STRINGS();
  const { deleted_source_uuid, deleted_field_uuid } = error_metadata;
  const errorList = {};
  const [, primaryUuid] = source.primaryDataSource?.split(' ') || [];
  const [, secondaryUuid] = source.secondaryDataSource?.split(' ') || [];

  // Source Deleted
  deleted_source_uuid.forEach((uuid) => {
    if (primaryUuid === uuid) {
      errorList.primaryDataSource = ERRORS.SOURCE_DELETED;
    } else if (secondaryUuid === uuid) {
      errorList.secondaryDataSource = ERRORS.SOURCE_DELETED;
    }
  });

  // Field Deleted
  if (deleted_field_uuid.length > 0) {
    const [, primaryFieldUuid] = source.primaryField?.split(' ') || [];
    const [, secondaryFieldUuid] = source.secondaryField?.split(' ') || [];
    deleted_field_uuid.forEach((uuid) => {
      if (primaryFieldUuid === uuid) {
        errorList.fieldDeleted = true;
        errorList.primaryField = ERRORS.SOURCE_MAP_DELETED;
      } else if (secondaryFieldUuid === uuid) {
        errorList.fieldDeleted = true;
        errorList.secondaryField = ERRORS.SOURCE_MAP_DELETED;
      }
    });
  }

  return errorList;
};

export const getTableChartData = (
  chartData,
  chartLabel = [],
  t = translateFunction,
) => {
  const clonedChartData = jsUtility.cloneDeep(chartData);
  const tableChartData = [];
  if (!jsUtility.isArray(clonedChartData)) {
    return tableChartData;
  }

  clonedChartData?.forEach((rowData, index) => {
    const objRowData = { id: rowData?.id || index };
    const component = [];
    if (jsUtility.has(rowData, 'value') && jsUtility.isArray(rowData.value)) {
      rowData.value.forEach((value, index) => {
        let columnID = null;
        if (
          !jsUtility.isEmpty(chartLabel) &&
          jsUtility.isArray(chartLabel) &&
          chartLabel.length > index
        ) {
          columnID = chartLabel[index].id;
        }
        let element = null;
        if (columnID === defaultFlowColumnsID.STATUS) {
          const { statusName, statusClass } = getStatusDetailsByKey(value, t);
          element = (
            <Chip
              text={statusName}
              textColor={statusClass.textColor}
              backgroundColor={statusClass.backgroundColor}
              size={EChipSize.sm}
              className="whitespace-nowrap"
            />
          );
        } else {
          element = <Text content={value} className="whitespace-nowrap" />;
        }

        component.push(element);
      });
    }
    objRowData.component = component;
    tableChartData.push(objRowData);
  });
  return tableChartData;
};

export const closeReportAppModelRouting = (history) => {
  if (isBasicUserMode(history)) {
    const pathname = jsUtility.get(
      history,
      ['location', 'pathname'],
      EMPTY_STRING,
    );
    if (!jsUtility.isEmpty(pathname)) {
      const splitPathname = pathname.split('/');
      const index = splitPathname.findIndex(
        (eachPath) => eachPath === APP.replaceAll('/', ''),
      );
      if (index > -1) {
        splitPathname.splice(index + 3);
        const flowSplitPathName = splitPathname.join('/');
        routeNavigate(
          history,
          ROUTE_METHOD.PUSH,
          flowSplitPathName,
          null,
          null,
          true,
        );
      }
    }
  }
};

export const closeReportTableInstanceRouting = (history) => {
  if (!isBasicUserMode(history)) {
    const pathname = jsUtility.get(
      history,
      ['location', 'pathname'],
      EMPTY_STRING,
    );
    if (!jsUtility.isEmpty(pathname)) {
      const splitPathname = pathname.split('/');
      if (
        splitPathname.includes(EDIT_REPORT) ||
        splitPathname.includes(CREATE_REPORT)
      ) {
        const index = splitPathname.findIndex(
          (eachPath) => eachPath === REPORT_INSTANCE_VIEWER.replace('/', ''),
        );
        if (index > -1) {
          splitPathname.splice(index);
          const reportInstanceSplitPathName = splitPathname.join('/');
          routeNavigate(
            history,
            ROUTE_METHOD.PUSH,
            reportInstanceSplitPathName,
            null,
            null,
            true,
          );
        }
      } else {
        const viewIndex = splitPathname.findIndex(
          (eachPath) => eachPath === VIEW_REPORT,
        );
        splitPathname.splice(viewIndex + 2);
        const reportInstanceSplitPathName = splitPathname.join('/');
        routeNavigate(
          history,
          ROUTE_METHOD.PUSH,
          reportInstanceSplitPathName,
          null,
          null,
          true,
        );
      }
    }
  }
};
