import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import {
  keydownOrKeypessEnterHandle,
  useClickOutsideDetectorForFilters,
} from 'utils/UtilityFunctions';
import PlusIconBlueNew from 'assets/icons/PlusIconBlueNew';
import { useDispatch } from 'react-redux';
import styles from '../add_filter/AddFilter.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';
import UserAppliedFilter from './userAppliedFilter/UserAppliedFiter';
import jsUtility from '../../../../../utils/jsUtility';
import { dataChange } from '../../../../../redux/reducer/ReportReducer';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import Source from '../fields/Source';
import SystemAndData from '../fields/SystemAndData';
import List from '../fields/List';
import Table from '../fields/Table';
import {
  getGroupedField,
  getGroupedTableFields,
  getSelectedFieldsByAllSourceFields,
} from '../ConfigPanel.utils';
import CONFIG_PANEL_STRINGS, { FIELD_TAB_TYPES } from '../ConfigPanel.strings';

function UserFilter(props) {
  const { t } = useTranslation();
  const { BUTTONS } = CONFIG_PANEL_STRINGS(t);
  const {
    reportViewUserFilter,
    reportViewUserFilter: { selectedFieldDetailsFromFilter },
    filter,
    onSetFilterAction,
    dataSourceList,
    onGetReportView,
    reports,
  } = props;
  const userFilterWrapperRef = useRef();
  const [isUserFilterOpen, setIsUserFilterOpen] = useState(false);
  const isMultiSource = dataSourceList?.length === 1;
  const initialIndex = isMultiSource
    ? FIELD_TAB_TYPES.SYSTEM_AND_DATA_FIELDS
    : FIELD_TAB_TYPES.SOURCE;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [fieldType, setFieldType] = useState();
  const [selectedDataSource, setSelectedDataSource] = useState(
    dataSourceList?.length === 1 ? dataSourceList[0] : {},
  );
  const [selectedFieldData, setSelectedFieldData] = useState();
  const [systemFields, setSystemFields] = useState([]);
  const [dataFields, setDataFields] = useState([]);
  const [tableFields, setTableFields] = useState([]);
  const [selectedTable, setSelectedTable] = useState(EMPTY_STRING);
  const [selectedTableName, setSelectedTableName] = useState(EMPTY_STRING);
  const filterConfigurationPopUpFlag = useRef(false);
  let currentConfigurationScreen = null;

  const onUserFilterPopUpCloseHandler = () => {
    setIsUserFilterOpen(false);
    setFieldType(EMPTY_STRING);
    setCurrentIndex(initialIndex);
    setSelectedFieldData(EMPTY_STRING);
    setSelectedDataSource(
      dataSourceList?.length === 1 ? dataSourceList[0] : {},
    );
  };
  const discardField = (isClose = true) => {
    const clonedFilter = jsUtility.cloneDeep(filter);

    clonedFilter.inputFieldDetailsForFilter &&
      clonedFilter.inputFieldDetailsForFilter.length > 0 &&
      clonedFilter.inputFieldDetailsForFilter.map((proData) => {
        proData.isAppliedFieldEdit = false;
        return proData;
      });
    clonedFilter.selectedFieldDetailsFromFilter &&
      clonedFilter.selectedFieldDetailsFromFilter.length > 0 &&
      clonedFilter.selectedFieldDetailsFromFilter.map((proData) => {
        proData.isAppliedFieldEdit = false;
        return proData;
      });
    const { inputFieldDetailsForFilter, selectedFieldDetailsFromFilter } =
      clonedFilter;

    const isEqual = jsUtility.isEqual(
      inputFieldDetailsForFilter,
      selectedFieldDetailsFromFilter,
    );
    if (!isEqual) {
      clonedFilter.inputFieldDetailsForFilter = jsUtility.cloneDeep(
        selectedFieldDetailsFromFilter,
      );
    }
    onSetFilterAction(clonedFilter);
    if (isClose) {
      filterConfigurationPopUpFlag.current = true;
      onUserFilterPopUpCloseHandler();
    }
  };
  const dispatch = useDispatch();
  useClickOutsideDetectorForFilters(
    userFilterWrapperRef,
    onUserFilterPopUpCloseHandler,
  );

  useEffect(() => {
    if (!isUserFilterOpen && !filterConfigurationPopUpFlag.current) {
      discardField();
    }
  }, [isUserFilterOpen]);

  useEffect(() => {
    const systemFields = [];
    const dataFields = [];
    const contextUuid = selectedDataSource?.context_uuid;
    const filteredInputFieldsDetailsForFilter =
      getSelectedFieldsByAllSourceFields(
        selectedFieldDetailsFromFilter,
        contextUuid,
      );
    filteredInputFieldsDetailsForFilter?.forEach((data) => {
      const { is_system_field } = data;
      !is_system_field ? dataFields.push(data) : systemFields.push(data);
      if (selectedFieldData && data.output_key === selectedFieldData.output_key) {
        setSelectedFieldData(data);
      }
    });
    const [systemFieldsArr, dataFieldsArr, tableFields] = getGroupedField(
      t,
      systemFields,
      dataFields,
    );
    setSystemFields(systemFieldsArr);
    setDataFields(dataFieldsArr);
    setTableFields(tableFields);
  }, [selectedFieldDetailsFromFilter, selectedDataSource]);

  /** This function handler the userFilter open */
  const onUserFilterOpenHandler = () => {
    if (isUserFilterOpen) return;
    setIsUserFilterOpen(true);
    filterConfigurationPopUpFlag.current = false;
  };
  /** This Function handles field type  change */
  const onFieldTypeChangeHandler = (type) => {
    setFieldType(type);
    setCurrentIndex(FIELD_TAB_TYPES.FIELD_LIST);
  };

  /** Set the selected field in local state */
  const setSelectedField = (field) => {
    setSelectedFieldData(field);
  };
  /** This Function handles data source change */
  const onSelectDataSourceHandler = (dataSource) => {
    setSelectedDataSource(dataSource);
    setCurrentIndex(FIELD_TAB_TYPES.SYSTEM_AND_DATA_FIELDS);
  };

  /** This Function handles the field selection  */
  const onSelectFieldChangeHandler = (data) => {
    setSelectedField(data);
    const clonedFilter = jsUtility.cloneDeep(filter);
    const cloneInputFieldDetailsForFilter = jsUtility.cloneDeep(
      reportViewUserFilter.selectedFieldDetailsFromFilter,
    );
    const cloneReportUserFilterFieldDetails = jsUtility.cloneDeep(
      reportViewUserFilter.inputFieldDetailsForFilter,
    );
    const fieldIndex = cloneReportUserFilterFieldDetails.findIndex(
      (field) => field.output_key === data.output_key,
    );
    if (fieldIndex === -1) {
      const addingInputFieldDetailsForFilter =
        cloneInputFieldDetailsForFilter.find(
          (eachFieldDetails) => data?.output_key === eachFieldDetails.output_key,
        );
      cloneReportUserFilterFieldDetails.push(addingInputFieldDetailsForFilter);
      clonedFilter.inputFieldDetailsForFilter = jsUtility.cloneDeep(
        cloneReportUserFilterFieldDetails,
      );
      const cloneReportViewUserFilter = jsUtility.cloneDeep(clonedFilter);
      dispatch(
        dataChange({
          data: {
            reportViewUserFilter: cloneReportViewUserFilter,
          },
        }),
      );
    }
    filterConfigurationPopUpFlag.current = true;
    onUserFilterPopUpCloseHandler();
  };

  /** This function handles onChange for table field */
  const onTableNameClickHandler = (tableName, tableRefName) => {
    setSelectedTable(`${tableName} ${tableRefName}`);
    setSelectedTableName(tableName);
    setCurrentIndex(FIELD_TAB_TYPES.TABLE_FIELD);
  };

  /** This will set currentScreen  of Filter configuration */
  if (currentIndex === FIELD_TAB_TYPES.SOURCE) {
    currentConfigurationScreen = (
      <Source
        dashboardList={dataSourceList}
        context={selectedDataSource}
        onClickSource={onSelectDataSourceHandler}
      />
    );
  } else if (currentIndex === FIELD_TAB_TYPES.SYSTEM_AND_DATA_FIELDS) {
    const systemFieldCount = systemFields.length;
    const dataFieldCount = dataFields.length;
    currentConfigurationScreen = (
      <SystemAndData
        fieldType={fieldType}
        systemFieldCount={systemFieldCount}
        dataFieldCount={dataFieldCount}
        isBackNeeded={!isMultiSource}
        context={selectedDataSource}
        onClickBackBtn={() => setCurrentIndex(FIELD_TAB_TYPES.SOURCE)}
        onClick={onFieldTypeChangeHandler}
      />
    );
  } else if (currentIndex === FIELD_TAB_TYPES.FIELD_LIST) {
    currentConfigurationScreen = (
      <List
        fieldType={fieldType}
        fieldDisplayNameSelectedValue={selectedFieldData?.fieldNames}
        systemFields={systemFields}
        dataFields={dataFields}
        onClickBackBtn={() =>
          setCurrentIndex(FIELD_TAB_TYPES.SYSTEM_AND_DATA_FIELDS)
        }
        onClickTable={onTableNameClickHandler}
        onClickField={onSelectFieldChangeHandler}
      />
    );
  } else if (currentIndex === FIELD_TAB_TYPES.TABLE_FIELD) {
    const filteredFields = tableFields.filter(
      (f) => selectedTable === `${f.table_name} ${f.table_reference_name}`,
    );
    const groupedFields = getGroupedTableFields(filteredFields, t);
    currentConfigurationScreen = (
      <Table
        tableFields={groupedFields}
        selectedTableName={selectedTableName}
        selectedTable={selectedTable}
        fieldDisplayNameSelectedValue={selectedFieldData?.fieldNames}
        onClickBackBtn={() => setCurrentIndex(FIELD_TAB_TYPES.FIELD_LIST)}
        onClickField={onSelectFieldChangeHandler}
      />
    );
  }

  return (
    <div>
      <div>
        {reportViewUserFilter.inputFieldDetailsForFilter?.map(
          (eachFieldDetails, index) => (
            <UserAppliedFilter
              key={eachFieldDetails.output_key}
              filter={filter}
              reportViewUserFilter={reportViewUserFilter}
              filterFieldDetails={eachFieldDetails}
              onSetFilterAction={onSetFilterAction}
              index={index}
              isUserFilter
              onGetReportView={onGetReportView}
              reports={reports}
            />
          ),
        )}
      </div>

      <div className={gClasses.PositionRelative} ref={userFilterWrapperRef}>
        <button
          className={styles.FilterBtn}
          onKeyDown={(e) =>
            keydownOrKeypessEnterHandle(e) && onUserFilterOpenHandler()
          }
          onClick={onUserFilterOpenHandler}
        >
          <div className={cx(styles.FilterText, gClasses.CenterV)}>
            <PlusIconBlueNew className={gClasses.MR12} />
            {BUTTONS.ADD_FILTER}
          </div>
        </button>
        {isUserFilterOpen && (
          <div className={cx(styles.UserFilterDropdown)}>
            {currentConfigurationScreen}
          </div>
        )}
      </div>
    </div>
  );
}

UserFilter.propTypes = {
  reportViewUserFilter: PropTypes.objectOf({
    selectedFieldDetailsFromFilter: PropTypes.array,
  }),
  filter: PropTypes.object,
  onSetFilterAction: PropTypes.func,
  dataSourceList: PropTypes.array,
  onGetReportView: PropTypes.func,
  reports: PropTypes.object,
};

export default UserFilter;
