/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import htmlParser from 'html-react-parser';
import cx from 'classnames/bind';
import {
  Chip,
  EChipSize,
  Text,
  TableSortOrder,
  Skeleton,
  Title,
  ETitleSize,
} from '@workhall-pvt-lmt/wh-ui-library';
import { translateFunction } from 'utils/jsUtility';
import { BS } from '../../../../../utils/UIConstants';
import gClasses from '../../../../../scss/Typography.module.scss';
import jsUtility, { formatLocale, formatter, getLocale } from '../../../../../utils/jsUtility';
import { FORM_PARENT_MODULE_TYPES } from '../../../../../utils/constants/form.constant';
import {
  COLOR,
  ENTITY_TYPE,
  ELEMENT_MESSAGE_TYPE,
  FIELDS_QUERY_TO_PASS,
  EDIT_FLOW_TABS,
} from './Flow.strings';
import { getPreviewMessage } from '../../../../report/report_creation/ReportCreation.utils';
import { generateFilterQuery } from '../../../../report/report_creation/FilterQuery.utils';
import { FILE_TYPE, STATUS_CONSTANTS } from '../../../../flow/flow_dashboard/FlowDashboard.string';
import {
  CHANGE_HISTORY,
  EMPTY_STRING,
  FLOW_DASHBOARD_DATE_TIME,
  HYPHEN,
  NA,
  REPORT_DATE_TIME,
} from '../../../../../utils/strings/CommonStrings';
import ReportErrorPreviewIcon from '../../../../../assets/icons/application/ReportErrorPreviewIcon';
import { REPORT_STRINGS } from '../../../../report/Report.strings';
import ReportNoDataIcon from '../../../../../assets/icons/application/ReportNoDataIcon';
import { getUserDisplayGroup } from '../../task_listing/TaskListing.utils';
import { TOOL_TIP_TYPE } from '../../../../../utils/Constants';
import styles from './flow_dashboard/FlowDashboard.module.scss';
import FormIcon from '../../../../../assets/icons/flow/step_configuration/FormIcon';
import AssigneeIcon from '../../../../../assets/icons/flow/step_configuration/AssigneeIcon';
import AddonSettingsIcon from '../../../../../assets/icons/flow/step_configuration/AddonSettingsIcon';
import {
  DATALIST_SYSTEM_FIELD,
  FLOW_SYSTEM_FIELD,
} from '../../../../../utils/constants/systemFields.constant';
import { FIELD_TYPE } from '../../../../../utils/constants/form_fields.constant';
import { getFormattedDateFromUTC } from '../../../../../utils/dateUtils';
import { store } from '../../../../../Store';
import FileIcon from '../../../../../assets/icons/FileIcon';
import LinkField from '../../../../../components/form_components/link_field/LinkField';
import { getFileTypeForIcon } from '../../../../../components/file_upload_drop/FileUploadDropUtils';

const columnsToClub = [
  {
    new_column_name: 'createdByUsersFullName',
    columns: ['usersFirstName', 'usersLastName'],
    seperator: ' ',
  },
];

export const getColumnNamesToDisplayAndOmits = (downloadInputField) => {
  const objColumns = {
    columnNamesToDisplay: {},
    columnsToOmit: [],
  };

  if (
    jsUtility.isEmpty(downloadInputField) &&
    !jsUtility.isArray(downloadInputField)
  ) {
    return objColumns;
  }

  const sortedDownloadFields = downloadInputField
    .filter((downloadField) => downloadField.value)
    .sort((a, b) => a.count - b.count);
  sortedDownloadFields.forEach((dataDimensions) => {
    const { field_type, fieldNames, value, output_key } = dataDimensions;
    const obj = {
      field_type,
      field_name: fieldNames,
    };
    // Selected Data to columnNamesToDisplay and Order Wise
    if (value === 1) {
      objColumns.columnNamesToDisplay[output_key] = obj;
    }
    // Un Select Data To Omitted Columns
    if (value === 0) {
      objColumns.columnsToOmit.push(output_key);
    }
  });

  return objColumns;
};

export const getDownloadQuery = (
  queryData,
  inputFieldDetailsForFilter,
  entity_name,
  downloadInputField,
  entity_type = ENTITY_TYPE.FLOW,
  entity_total_count = 0,
) => {
  if (
    jsUtility.isEmpty(queryData) &&
    jsUtility.isEmpty(inputFieldDetailsForFilter) &&
    jsUtility.isEmpty(downloadInputField)
  ) {
    return queryData;
  }

  // Doc Type
  queryData.doc_type = 1; // XLSX

  // Entity name Flow or Datalist Name.
  queryData.entity_name = entity_name;

  // Entity Type Flow or Datalist.
  queryData.entity_type = entity_type;

  // Total Count Added.
  queryData.entity_total_count = entity_total_count;

  // Get Columns
  const objColumns = getColumnNamesToDisplayAndOmits(downloadInputField);

  // Omitted Columns Added
  queryData.column_config = {};
  queryData.column_config.columns_to_omit = [];

  // Column names to display Added and ORDER Wise Download.
  queryData.column_config.column_names_to_display =
    objColumns.columnNamesToDisplay;

  // Yes Or No Added
  queryData.column_config.boolean_value = 'string';

  // Columns to club Added
  const clonedColumnsToClub = jsUtility.cloneDeep(columnsToClub);
  if (
    entity_type === ENTITY_TYPE.DATALIST &&
    clonedColumnsToClub &&
    clonedColumnsToClub.length > 0
  ) {
    clonedColumnsToClub[0].new_column_name = 'usersFullName';
  }
  queryData.column_config.columns_to_club = clonedColumnsToClub;

  return queryData;
};

export const clearDownloadInputField = (downloadInputField) => {
  if (
    !jsUtility.isEmpty(downloadInputField) &&
    jsUtility.isArray(downloadInputField) &&
    downloadInputField.length > 0
  ) {
    return downloadInputField.map((downloadField) => {
      downloadField.value = false;
      downloadField.count = null;
      return downloadField;
    });
  }
  return downloadInputField;
};

export const getAppFlowFilterQuery = (
  flowData,
  limit_data = 5,
  skip_data = 0,
  entityType = ENTITY_TYPE.FLOW,
  isDatalist = false,
  isDownload = false,
) => {
  const {
    filter,
    lstPaginationData,
    filter: { order, headerDimension, inputFieldDetailsForFilter },
  } = flowData;

  let queryData = {
    report_config: {
      is_chart: false,
    },
    query_config: {
      selected_fields: { report_fields: [] },
      selected_filters: [],
      sort_fields: [],
    },
    additional_config: {
      is_skip_null_values: false,
    },
  };

  if (
    !isDownload &&
    !jsUtility.isEmpty(inputFieldDetailsForFilter) &&
    jsUtility.isArray(inputFieldDetailsForFilter) &&
    inputFieldDetailsForFilter.length > 0 &&
    headerDimension.length > 0
  ) {
    const cloneTableHeaderList = jsUtility.cloneDeep(headerDimension);
    if (
      cloneTableHeaderList.findIndex((data) =>
        [DATALIST_SYSTEM_FIELD.ID.id, FLOW_SYSTEM_FIELD.ID.id].includes(
          data.field ?? data.id,
        ),
      ) === -1
    ) {
      cloneTableHeaderList.push({
        id: isDatalist ? DATALIST_SYSTEM_FIELD.ID.id : FLOW_SYSTEM_FIELD.ID.id,
      });
    }
    cloneTableHeaderList.forEach((field) => {
      const fieldData = inputFieldDetailsForFilter.find((data) =>
        [data.output_key].includes(field.id),
      );
      if (fieldData) {
        const {
          field_uuid,
          query_to_pass,
          output_key,
          field_type,
          aggregation_type,
          is_system_field = false,
          source_collection_uuid,
          // is_metric_field = false,
        } = fieldData;
        const objReportFields = {
          field_uuid,
          query_to_pass,
          output_key,
          field_type,
          aggregation_type,
          is_system_field,
          source_collection_uuid,
          skip_null_values: false,
        };
        queryData.query_config.selected_fields.report_fields.push(
          objReportFields,
        );
      }
    });
  }

  // Sorting
  if (!isDownload && !jsUtility.isEmpty(order)) {
    queryData.query_config.sort_fields.push(order);
  }

  if (!isDownload) {
    queryData.query_config.limit_data = limit_data;
    queryData.query_config.skip_data = skip_data;
  }

  // Download Data Added.
  if (isDownload) {
    // Query for selected fields report_fields
    const { downloadInputField } = filter;
    const selectedDownloadFields = downloadInputField
      .filter((downloadField) => downloadField.value)
      .sort((a, b) => a.count - b.count);
    if (
      !jsUtility.isEmpty(inputFieldDetailsForFilter) &&
      jsUtility.isArray(inputFieldDetailsForFilter) &&
      inputFieldDetailsForFilter.length > 0 &&
      !jsUtility.isEmpty(selectedDownloadFields) &&
      jsUtility.isArray(selectedDownloadFields) &&
      selectedDownloadFields.length > 0
    ) {
      inputFieldDetailsForFilter.forEach((fieldData) => {
        const {
          field_uuid,
          query_to_pass,
          output_key,
          field_type,
          aggregation_type,
          is_system_field = false,
          source_collection_uuid,
        } = fieldData;
        const objReportFields = {
          field_uuid,
          query_to_pass,
          output_key,
          field_type,
          aggregation_type,
          is_system_field,
          source_collection_uuid,
          skip_null_values: false,
        };
        if (
          [
            FIELDS_QUERY_TO_PASS.SYSTEM_IDENTIFIER,
            FIELDS_QUERY_TO_PASS.DATA_LIST_IDENTIFIER,
          ].includes(output_key)
        ) {
          queryData.query_config.selected_fields.report_fields.push(
            objReportFields,
          );
        } else {
          const selectedFieldIndex = selectedDownloadFields.findIndex(
            (downloadField) => output_key === downloadField.output_key,
          );
          if (selectedFieldIndex > -1) {
            queryData.query_config.selected_fields.report_fields.push(
              objReportFields,
            );
          }
        }
      });
    }

    // Sorting
    const clonedSelectedReportFields = jsUtility.cloneDeep(
      queryData.query_config.selected_fields.report_fields,
    );
    if (
      !jsUtility.isEmpty(clonedSelectedReportFields) &&
      jsUtility.isArray(clonedSelectedReportFields) &&
      clonedSelectedReportFields.length > 0
    ) {
      const {
        query_to_pass,
        output_key,
        field_type,
        aggregation_type,
        is_system_field,
        source_collection_uuid,
      } = clonedSelectedReportFields[0];
      const objOrder = {
        query_to_pass,
        output_key,
        field_type,
        aggregation_type,
        is_system_field,
        source_collection_uuid,
        order_type: -1,
      };
      queryData.query_config.sort_fields.push(objOrder);
    }

    // Get Total Count
    const { pagination_details = [] } = lstPaginationData;
    const { total_count = 0 } =
      pagination_details &&
      pagination_details.length > 0 &&
      pagination_details[0];

    const entityName =
      entityType === ENTITY_TYPE.FLOW
        ? flowData.flow_name
        : flowData.data_list_name;

    const downloadQuery = getDownloadQuery(
      queryData,
      inputFieldDetailsForFilter,
      entityName,
      downloadInputField,
      entityType,
      total_count,
    );
    queryData = { ...queryData, ...downloadQuery };
  }

  // get selected filters.
  const { selected_filters } = generateFilterQuery(filter);
  queryData.query_config.selected_filters =
    jsUtility.cloneDeep(selected_filters);

  return queryData;
};

export const getFlowValuesData = (
  lstDashboardDataLists,
  pagination_data,
  pagination_details,
  headerDimension,
) => {
  const arrPaginationData = [];
  if (pagination_data && pagination_data.length > 0) {
    pagination_data.forEach((paginationData) => {
      const objPaginationData = {};
      if (lstDashboardDataLists) {
        objPaginationData.instance_id = paginationData.instance_id;
        if (headerDimension.length > 0) {
          headerDimension.forEach((headerData) => {
            objPaginationData[headerData.id] = paginationData[headerData.id];
          });
        }
      }
      objPaginationData.entryId = paginationData.entry_id;
      arrPaginationData.push(objPaginationData);
    });
    lstDashboardDataLists.pagination_data = arrPaginationData;
  } else {
    lstDashboardDataLists.pagination_data = [];
  }
  if (lstDashboardDataLists.pagination_details && pagination_details) {
    lstDashboardDataLists.pagination_details[0].total_count =
      pagination_details.total_count || 0;
  }
  return lstDashboardDataLists;
};

export const getStatusDetailsByKey = (status, t) => {
  let statusName = status;
  let statusClass = {
    textColor: EMPTY_STRING,
    backgroundColor: EMPTY_STRING,
  };
  switch (status) {
    case STATUS_CONSTANTS(t).IN_PROGRESS.KEY:
    case 'inprogress':
      statusName = STATUS_CONSTANTS(t).IN_PROGRESS.NAME;
      statusClass = {
        textColor: COLOR.BLUE_100,
        backgroundColor: COLOR.BLUE_10,
      };
      break;
    case STATUS_CONSTANTS(t).COMPLETED.KEY:
    case 'completed':
      statusName = STATUS_CONSTANTS(t).COMPLETED.NAME;
      statusClass = {
        textColor: COLOR.GREEN_100,
        backgroundColor: COLOR.GREEN_10,
      };
      break;
    case STATUS_CONSTANTS(t).CANCELLED.KEY:
    case 'cancelled':
      statusName = STATUS_CONSTANTS(t).CANCELLED.NAME;
      statusClass = {
        textColor: COLOR.RED_100,
        backgroundColor: COLOR.RED_10,
      };
      break;
    default:
      break;
  }
  return { statusName, statusClass };
};

const constructUserTeamPickerDataAndStepNameFromOpenWith = (openWithData) => {
  const objUserTeamPicker = {
    users: [],
    teams: [],
    stepName: EMPTY_STRING,
  };
  if (
    jsUtility.isEmpty(openWithData) &&
    jsUtility.isArray(openWithData) &&
    openWithData.length === 0
  ) {
    return objUserTeamPicker;
  }

  if (openWithData) {
    openWithData.forEach((owData, index) => {
      const { step_name = EMPTY_STRING, user_teams } = owData;
      // Step Name
      if (step_name) {
        if (index === 0) {
          objUserTeamPicker.stepName += step_name;
        } else {
          objUserTeamPicker.stepName += `, ${step_name}`;
        }
      }

      // User&Teams
      if (
        !jsUtility.isEmpty(user_teams) &&
        jsUtility.isArray(user_teams) &&
        user_teams.length > 0
      ) {
        user_teams.forEach((userTeamData) => {
          const { type, value, username } = userTeamData;
          if (value && username) {
            const objUserTeam = {
              _id: value,
              team_name: username,
              first_name: username,
              last_name: EMPTY_STRING,
              profile_pic: EMPTY_STRING,
            };
            if (type === TOOL_TIP_TYPE.USER) {
              objUserTeamPicker.users.push(objUserTeam);
            } else {
              objUserTeamPicker.teams.push(objUserTeam);
            }
          }
        });
      }
    });
  }
  return objUserTeamPicker;
};

const elementOpenWith = (openWithData, showCreateTask = false) => {
  if (
    !jsUtility.isEmpty(openWithData) &&
    jsUtility.isArray(openWithData) &&
    openWithData.length > 0
  ) {
    const usersTeamsData =
      constructUserTeamPickerDataAndStepNameFromOpenWith(openWithData);
    const { stepName } = usersTeamsData;

    return (
      <div className={cx(gClasses.CenterV)}>
        <div>
          <div className={cx(BS.D_FLEX)}>
            {usersTeamsData.users.length > 0 || usersTeamsData.teams.length > 0
              ? getUserDisplayGroup(usersTeamsData, showCreateTask)
              : '-'}
          </div>

          {stepName && (
            <div
              title={stepName}
              className={cx(BS.D_FLEX, gClasses.FTwo11GrayV53)}
            >
              {stepName}
            </div>
          )}
        </div>
      </div>
    );
  }
  return <div>{HYPHEN}</div>;
};

export const defaultFlowColumnsID = {
  STATUS: 'status',
  OPEN_WITH: 'open_with',
  CURRENT_ACTIVE_TASK_OWNERS: 'current_active_task_owners',
};

const getMetricDataByType = (
  type,
  metricData,
  nA = NA,
  isStats = false,
  isDigitFormatted = false,
) => {
  let strData;
  switch (type) {
    case FIELD_TYPE.BOOLEAN:
    case FIELD_TYPE.YES_NO:
      strData = metricData || nA;
      break;
    case FIELD_TYPE.DATE:
      {
        const getDate =
          getFormattedDateFromUTC(metricData, CHANGE_HISTORY) ||
          nA;
        strData = getDate === 'Invalid date' ? nA : getDate || nA;
      }
      break;
    case FIELD_TYPE.DATETIME:
      {
        const getDateTime =
          getFormattedDateFromUTC(metricData, FLOW_DASHBOARD_DATE_TIME) || nA;
        strData = getDateTime === 'Invalid date' ? nA : getDateTime || nA;
      }
      break;
    case 'initiatedOn':
      {
        const initiatedOn =
          getFormattedDateFromUTC(metricData, REPORT_DATE_TIME) || nA;
        strData = initiatedOn === 'Invalid date' ? nA : initiatedOn;
      }
      break;
    case FIELD_TYPE.CHECKBOX:
      if (!jsUtility.isEmpty(metricData)) {
        if (jsUtility.isArray(metricData)) {
          strData = metricData.join(', ') || nA;
        } else {
          strData = metricData.toString();
        }
      } else {
        strData = nA;
      }
      break;
    case FIELD_TYPE.USER_TEAM_PICKER:
    case FIELD_TYPE.DATA_LIST:
      if (!jsUtility.isEmpty(metricData)) {
        if (jsUtility.isArray(metricData)) {
          strData = metricData.flat(Infinity).join(', ') || nA;
        } else {
          strData = metricData.toString();
        }
      } else {
        strData = nA;
      }
      break;
    case FIELD_TYPE.PARAGRAPH:
    case FIELD_TYPE.SINGLE_LINE:
      strData = metricData || nA;
      break;
    case FIELD_TYPE.INFORMATION:
      strData = (
        <span className={gClasses.WordBreakBreakWord}>
          {metricData && htmlParser(metricData)}
        </span>
      );
      break;
    case FIELD_TYPE.NUMBER:
      {
        const formattedMetricData =
          !jsUtility.isEmpty(metricData) || metricData === 0
            ? jsUtility.round(parseFloat(metricData), 2) || 0
            : nA;
        const accountLocale = formatLocale(
          store.getState().RoleReducer.acc_locale,
        );
        const numberValue =
          jsUtility.isNumber(formattedMetricData) && isDigitFormatted
            ? formatter(formattedMetricData, accountLocale)
            : formattedMetricData;
        strData = numberValue;
      }
      break;
    case FIELD_TYPE.CURRENCY:
      if (isStats) {
        strData = jsUtility.round(metricData, 2) || 0;
      } else if (metricData) {
        const number = jsUtility.round(metricData.replace(/[^\d.-]/g, ''), 2);
        const currencyCode = metricData.replace(/[^a-z]/gi, '');
        strData = `${currencyCode} ${formatter(
          number,
          getLocale(currencyCode),
        )}`;
      } else {
        strData = nA;
      }
      break;
    case FIELD_TYPE.FILE_UPLOAD:
      if (
        !jsUtility.isEmpty(metricData) &&
        jsUtility.isArray(metricData) &&
        metricData.length > 0
      ) {
        if (jsUtility.has(metricData[0], 'signedurl')) {
          const countOfUploadData = metricData.length - 1;
          const { signedurl, filetype } = metricData[0];
          const fileTypeNum = getFileTypeForIcon(filetype);
          if (fileTypeNum === FILE_TYPE.IMAGE) {
            strData = (
              <div>
                <div>
                  <img
                    className={cx(
                      styles.DashboardImage,
                      gClasses.FloatL,
                      gClasses.MR5,
                    )}
                    src={signedurl}
                    alt={signedurl}
                  />
                </div>
                {countOfUploadData > 0 && (
                  <button
                    className={cx(styles.MoreButton, gClasses.FontWeight500)}
                  >
                    {`+${countOfUploadData}`}
                  </button>
                )}
              </div>
            );
          } else if (fileTypeNum === FILE_TYPE.VIDEO) {
            strData = (
              <div>
                <div>
                  <video
                    className={cx(
                      styles.DashboardImage,
                      gClasses.FloatL,
                      gClasses.MR5,
                    )}
                    src={`${signedurl}#t=5`}
                    alt={EMPTY_STRING}
                  />
                </div>
                {countOfUploadData > 0 && (
                  <button
                    className={cx(styles.MoreButton, gClasses.FontWeight500)}
                  >
                    {`+${countOfUploadData}`}
                  </button>
                )}
              </div>
            );
          } else {
            strData = (
              <>
                <div className={cx(styles.DashboardImage, gClasses.FloatL)}>
                  <FileIcon className={styles.DashboardImage} />
                </div>
                {countOfUploadData > 0 && (
                  <button
                    className={cx(styles.MoreButton, gClasses.FontWeight500)}
                  >
                    {`+${countOfUploadData}`}
                  </button>
                )}
              </>
            );
          }
        }
      }
      break;
    case FIELD_TYPE.LINK:
      if (
        !jsUtility.isEmpty(metricData) &&
        jsUtility.isArray(metricData) &&
        metricData.length > 0 &&
        metricData[0]
      ) {
        strData = (
          <LinkField
            links={metricData}
            hideLabel
            isNameWithHyperlink
            readOnly
          />
        );
      } else {
        strData = nA;
      }
      break;
    default:
      strData = metricData || nA;
      break;
  }
  return strData;
};

export const getTableData = (
  pagination_data,
  headerDimension,
  type,
  t,
  showCreateTask,
) => {
  const tblData = [];
  if (
    pagination_data &&
    jsUtility.isArray(pagination_data) &&
    pagination_data.length > 0 &&
    headerDimension &&
    jsUtility.isArray(headerDimension) &&
    headerDimension.length > 0
  ) {
    pagination_data.forEach((rowData) => {
      const objRowData = {};
      if (type === FORM_PARENT_MODULE_TYPES.FLOW) {
        objRowData.id = rowData?.instance_id;
      } else objRowData.id = rowData?.entryId;
      const component = [];
      headerDimension.forEach((columnData) => {
        const { id, fieldType, isDigitFormatted } = columnData;
        const value = getMetricDataByType(
          fieldType,
          rowData[id],
          NA,
          false,
          isDigitFormatted,
        );
        let element = null;
        switch (id) {
          case defaultFlowColumnsID.STATUS:
            {
              const { statusName, statusClass } = getStatusDetailsByKey(
                value,
                t,
              );
              element = (
                <Chip
                  text={statusName}
                  textColor={statusClass.textColor}
                  backgroundColor={statusClass.backgroundColor}
                  size={EChipSize.sm}
                  className="whitespace-nowrap"
                />
              );
            }
            break;
          case defaultFlowColumnsID.OPEN_WITH:
            {
              const openWithData = rowData[id] || [];
              element = elementOpenWith(openWithData, showCreateTask);
            }
            break;
          case defaultFlowColumnsID.CURRENT_ACTIVE_TASK_OWNERS:
            {
              const currentActiveTaskOwners = rowData[id] || [];
              const taskOwnerNames = [];
              currentActiveTaskOwners?.forEach((user) => {
                if (!jsUtility.isEmpty(user?.username)) {
                  taskOwnerNames.push(user?.username);
                }
              });
              element = taskOwnerNames.join(', ') || NA;
            }
            break;
          default:
            element = (
              <Text
                content={value}
                className={
                  columnData?.width === 'auto' && value?.length > 63
                    ? styles.TextWrapExtend
                    : styles.TextWrapClass
                }
                title={value}
              />
            );
            break;
        }
        component.push(<div className={columnData?.className}>{element}</div>);
      });
      objRowData.component = component;
      tblData.push(objRowData);
    });
  }
  return tblData;
};

export const getSortDataBySortOrder = (sortBy, sortOrder, flowData) => {
  const clonedFlowData = jsUtility.cloneDeep(flowData);
  const {
    filter: { order, inputFieldDetailsForFilter, headerDimension },
  } = clonedFlowData;
  const sortData = { order, headerDimension };
  if (headerDimension && headerDimension.length > 0) {
    const modifiedHeaderDimension = headerDimension.map((objHeader) => {
      if (objHeader.sortBy === sortBy) {
        const changedSortOrder =
          sortOrder === TableSortOrder.ASC.toString()
            ? TableSortOrder.DESC
            : TableSortOrder.ASC;
        objHeader.sortOrder = changedSortOrder;
      }
      return objHeader;
    });
    sortData.headerDimension = jsUtility.cloneDeep(modifiedHeaderDimension);
  }
  if (order) {
    const objDimension = jsUtility.find(inputFieldDetailsForFilter, {
      output_key: sortBy,
    });
    const {
      query_to_pass,
      output_key,
      fieldType,
      aggregation_type,
      is_system_field,
      source_collection_uuid,
      field_uuid,
    } = objDimension;
    const changedSortOrder =
      sortOrder === TableSortOrder.ASC.toString() ? -1 : 1;
    const modifiedOrder = {
      query_to_pass,
      output_key,
      field_type: fieldType,
      aggregation_type,
      is_system_field,
      order_type: changedSortOrder,
      source_collection_uuid,
    };
    if (!is_system_field) {
      modifiedOrder.field_uuid = field_uuid;
    }
    sortData.order = jsUtility.cloneDeep(modifiedOrder);
  }
  return sortData;
};

export const getElementMessage = (
  elementMessageType = ELEMENT_MESSAGE_TYPE.NO_DATA_FOUND,
  t = translateFunction,
) => {
  const { REPORT_PREVIEW, ERRORS } = REPORT_STRINGS(t);
  let element = null;
  switch (elementMessageType) {
    case ELEMENT_MESSAGE_TYPE.LOADING:
      element = (
        <div className={gClasses.PX30}>
          <Skeleton count={2} width={150} />
          <Skeleton count={3} />
        </div>
      );
      break;
    case ELEMENT_MESSAGE_TYPE.NO_DATA_FOUND:
      element = getPreviewMessage(
        <ReportNoDataIcon />,
        REPORT_PREVIEW.NO_DATA_FOUND,
      );
      break;
    case ELEMENT_MESSAGE_TYPE.INVALID_ACCESS:
      element = getPreviewMessage(
        <ReportErrorPreviewIcon />,
        ERRORS.INVALID_ACCESS_TITLE,
      );
      break;

    default:
      break;
  }
  return element;
};

export const getElementLabelWithMessage = (
  label,
  colorScheme,
  elementMessageType = ELEMENT_MESSAGE_TYPE.NO_DATA_FOUND,
  t = translateFunction,
) => (
  <div
    className={cx(
      BS.FLEX_COLUMN,
      BS.ALIGN_ITEM_CENTER,
      gClasses.Gap8,
      BS.W100,
      BS.H100,
    )}
  >
    <Title
      content={label}
      size={ETitleSize.xs}
      colorScheme={{ ...colorScheme, activeColor: colorScheme?.highlight }}
    />
    {getElementMessage(elementMessageType, t)}
  </div>
);

export const EDIT_FLOW_STEP_TABS = {
  CREATE_FORM: 0,
  SET_ASSIGNEE: 1,
  ADD_ON_CONFIGURATION: 2,
};

export const FLOW_HEADER_TAB_OPTIONS = (t = translateFunction) => [
  {
    labelText: t(EDIT_FLOW_TABS.FORM),
    value: EDIT_FLOW_STEP_TABS.CREATE_FORM,
    tabIndex: EDIT_FLOW_STEP_TABS.CREATE_FORM,
    Icon: FormIcon,
  },
  {
    labelText: t(EDIT_FLOW_TABS.ASSIGNEE),
    value: EDIT_FLOW_STEP_TABS.SET_ASSIGNEE,
    tabIndex: EDIT_FLOW_STEP_TABS.SET_ASSIGNEE,
    Icon: AssigneeIcon,
  },
  {
    labelText: t(EDIT_FLOW_TABS.ADD_ON_CONFIG),
    value: EDIT_FLOW_STEP_TABS.ADD_ON_CONFIGURATION,
    tabIndex: EDIT_FLOW_STEP_TABS.ADD_ON_CONFIGURATION,
    Icon: AddonSettingsIcon,
  },
];
