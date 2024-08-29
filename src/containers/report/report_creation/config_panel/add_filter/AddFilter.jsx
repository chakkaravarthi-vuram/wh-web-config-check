import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import {
  keydownOrKeypessEnterHandle,
  useClickOutsideDetectorForFilters,
} from 'utils/UtilityFunctions';
import PlusIconBlueNew from 'assets/icons/PlusIconBlueNew';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import styles from './AddFilter.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';
import MoreFilterNew from '../../../../../components/dashboard_filter/more_filters/MoreFiltersNew';
import {
  validateCurrentFilter,
  validateFilterValues,
} from '../../../../../components/dashboard_filter/more_filters/MoreFilter.utils';
import jsUtils from '../../../../../utils/jsUtility';
import {
  isEmptyFieldUpdateValue,
  searchFieldsByText,
} from '../../../../../components/dashboard_filter/FilterUtils';
import AppliedFilterNew from './AppliedFilterNew/AppliedFilterNew';
import SystemAndData from '../fields/SystemAndData';
import List from '../fields/List';
import Config from '../fields/Config';
import Table from '../fields/Table';
import {
  getGroupedField,
  getGroupedTableFields,
  getSelectedFieldsByAllSourceFields,
} from '../ConfigPanel.utils';
import Source from '../fields/Source';
import CONFIG_PANEL_STRINGS, { FIELD_TAB_TYPES } from '../ConfigPanel.strings';

function AddFilter(props) {
  const { t } = useTranslation();
  const {
    filter: { inputFieldDetailsForFilter },
    filter,
    onSetFilterAction,
    getReportData,
    dashboardList,
  } = props;
  const { BUTTONS } = CONFIG_PANEL_STRINGS(t);
  const addFilterWrapperRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const isSingleSource = dashboardList?.length === 1;
  const initialCurrentIndex = isSingleSource
    ? FIELD_TAB_TYPES.SYSTEM_AND_DATA_FIELDS
    : FIELD_TAB_TYPES.SOURCE;
  const [currentIndex, setCurrentIndex] = useState(initialCurrentIndex);
  const [fieldType, setFieldType] = useState();
  const [selectedDataSource, setSelectedDataSource] = useState(
    isSingleSource ? dashboardList[0] : {},
  );
  const [field, setField] = useState();
  const [systemFields, setSystemFields] = useState([]);
  const [dataFields, setDataFields] = useState([]);
  const [index, setIndex] = useState();
  const [error, setError] = useState();
  const filterConfigurationPopUpFlag = useRef(false);
  let currentComponent = null;
  const [tableFields, setTableFields] = useState([]);
  const [selectedTable, setSelectedTable] = useState(EMPTY_STRING);
  const [selectedTableName, setSelectedTableName] = useState(EMPTY_STRING);

  const onCloseAddFilter = () => {
    setIsOpen(false);
    setFieldType(EMPTY_STRING);
    setCurrentIndex(initialCurrentIndex);
    setField(EMPTY_STRING);
    setSelectedDataSource(isSingleSource ? dashboardList[0] : {});
    setIndex(null);
    setError(null);
  };

  const discardField = (isClose = true) => {
    const clonedFilter = jsUtils.cloneDeep(filter);

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

    const isEqual = jsUtils.isEqual(
      inputFieldDetailsForFilter,
      selectedFieldDetailsFromFilter,
    );
    if (!isEqual) {
      clonedFilter.inputFieldDetailsForFilter = jsUtils.cloneDeep(
        selectedFieldDetailsFromFilter,
      );
    }
    onSetFilterAction(clonedFilter);
    if (isClose) {
      filterConfigurationPopUpFlag.current = true;
      onCloseAddFilter();
    }
    setError(null);
  };

  useClickOutsideDetectorForFilters(addFilterWrapperRef, onCloseAddFilter);

  useEffect(() => {
    if (!isOpen && !filterConfigurationPopUpFlag.current) {
      discardField();
    }
  }, [isOpen]);

  useEffect(() => {
    const systemFields = [];
    const dataFields = [];
    const contextUuid = selectedDataSource?.context_uuid;
    const filteredInputFieldsDetailsForFilter =
      getSelectedFieldsByAllSourceFields(
        inputFieldDetailsForFilter,
        contextUuid,
      );

    filteredInputFieldsDetailsForFilter.forEach((data) => {
      const { is_system_field } = data;
      !is_system_field ? dataFields.push(data) : systemFields.push(data);
      if (field && data.output_key === field.output_key) {
        setField(data);
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
  }, [inputFieldDetailsForFilter, selectedDataSource]);

  const openFilter = () => {
    if (isOpen) return;
    setIsOpen(true);
    filterConfigurationPopUpFlag.current = false;
  };

  const selectFieldType = (type) => {
    setFieldType(type);
    setCurrentIndex(FIELD_TAB_TYPES.FIELD_LIST);
  };

  const selectField = (field) => {
    setCurrentIndex(FIELD_TAB_TYPES.FIELD_CONFIG);
    setField(field);
    setError(null);

    inputFieldDetailsForFilter.forEach((data, idx) => {
      if (data.output_key === field.output_key) setIndex(idx);
    });
  };

  const onSelectChangeFieldHandler = (data) => {
    selectField(data);
  };

  /** This Function handles data source change */
  const onSelectDataSourceHandler = (dataSource) => {
    setSelectedDataSource(dataSource);
    setCurrentIndex(FIELD_TAB_TYPES.SYSTEM_AND_DATA_FIELDS);
  };

  const onClickApplyFilter = () => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    const clonedFilterFlowData = jsUtils.cloneDeep(inputFieldDetailsForFilter);
    const [isFieldValid, errorMessage] = validateCurrentFilter(
      field,
      clonedFilterFlowData,
      t,
    );
    if (isFieldValid) {
      setError(null);
    } else {
      setError(errorMessage);
      return;
    }
    const { updatedFilterFlowData, isValid } = validateFilterValues(
      clonedFilterFlowData,
      t,
    );
    if (isValid) {
      const mapFilterFlowData =
        updatedFilterFlowData &&
        updatedFilterFlowData.length > 0 &&
        updatedFilterFlowData.map((filterProData) => {
          if (isEmptyFieldUpdateValue(filterProData)) {
            filterProData.isAppliedFilter = true;
          } else {
            filterProData.isAppliedFilter = false;
          }
          return filterProData;
        });
      clonedFilter.inputFieldDetailsForFilter = searchFieldsByText(
        jsUtils.cloneDeep(mapFilterFlowData),
        EMPTY_STRING,
      );
      clonedFilter.selectedFieldDetailsFromFilter =
        jsUtils.cloneDeep(mapFilterFlowData);
      getReportData(clonedFilter);
    } else {
      clonedFilter.inputFieldDetailsForFilter = searchFieldsByText(
        jsUtils.cloneDeep(updatedFilterFlowData),
        EMPTY_STRING,
      );
      onSetFilterAction(clonedFilter);
    }
    filterConfigurationPopUpFlag.current = true;
    onCloseAddFilter();
  };

  const onClickMoreFilters = () => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    const { inputFieldDetailsForFilter, selectedFieldDetailsFromFilter } =
      clonedFilter;

    const isEqual = jsUtils.isEqual(
      inputFieldDetailsForFilter,
      selectedFieldDetailsFromFilter,
    );
    if (!isEqual) {
      clonedFilter.inputFieldDetailsForFilter = jsUtils.cloneDeep(
        selectedFieldDetailsFromFilter,
      );
    }

    const mapFilterFlowData = searchFieldsByText(
      inputFieldDetailsForFilter,
      EMPTY_STRING,
    );
    clonedFilter.inputFieldDetailsForFilter = mapFilterFlowData;
    onSetFilterAction(clonedFilter);
    discardField();
  };
  const onTableNameClickHandler = (tableName, tableRefName) => {
    setSelectedTable(`${tableName} ${tableRefName}`);
    setSelectedTableName(tableName);
    setCurrentIndex(FIELD_TAB_TYPES.TABLE_FIELD);
  };

  if (currentIndex === FIELD_TAB_TYPES.SOURCE) {
    currentComponent = (
      <Source
        dashboardList={dashboardList}
        context={selectedDataSource}
        onClickSource={onSelectDataSourceHandler}
      />
    );
  } else if (currentIndex === FIELD_TAB_TYPES.SYSTEM_AND_DATA_FIELDS) {
    const systemFieldCount = systemFields.length;
    const dataFieldCount = dataFields.length;
    currentComponent = (
      <SystemAndData
        fieldType={fieldType}
        systemFieldCount={systemFieldCount}
        dataFieldCount={dataFieldCount}
        isBackNeeded={!isSingleSource}
        context={selectedDataSource}
        onClickBackBtn={() => setCurrentIndex(FIELD_TAB_TYPES.SOURCE)}
        onClick={selectFieldType}
      />
    );
  } else if (currentIndex === FIELD_TAB_TYPES.FIELD_LIST) {
    currentComponent = (
      <List
        fieldType={fieldType}
        fieldDisplayNameSelectedValue={field?.fieldNames}
        systemFields={systemFields}
        dataFields={dataFields}
        onClickBackBtn={() =>
          setCurrentIndex(FIELD_TAB_TYPES.SYSTEM_AND_DATA_FIELDS)
        }
        onClickTable={onTableNameClickHandler}
        onClickField={onSelectChangeFieldHandler}
      />
    );
  } else if (currentIndex === FIELD_TAB_TYPES.FIELD_CONFIG) {
    currentComponent = (
      <Config
        fieldDisplayNameSelectedValue={field?.fieldNames}
        mainContent={
          <MoreFilterNew
            field={field}
            filter={filter}
            onSetFilterAction={onSetFilterAction}
            getReportData={getReportData}
            index={index}
            error={error}
            resetError={() => setError(null)}
            isAddFilter
          />
        }
        onClickBackBtn={() => {
          if (field?.is_table_field) {
            setCurrentIndex(FIELD_TAB_TYPES.TABLE_FIELD);
          } else {
            setCurrentIndex(FIELD_TAB_TYPES.FIELD_LIST);
          }
          discardField(false);
        }}
        onClickApply={onClickApplyFilter}
        onClickDiscard={onClickMoreFilters}
      />
    );
  } else if (currentIndex === FIELD_TAB_TYPES.TABLE_FIELD) {
    const filteredFields = tableFields.filter(
      (f) => selectedTable === `${f.table_name} ${f.table_reference_name}`,
    );
    const groupedFields = getGroupedTableFields(filteredFields, t);
    currentComponent = (
      <Table
        tableFields={groupedFields}
        selectedTableName={selectedTableName}
        selectedTable={selectedTable}
        fieldDisplayNameSelectedValue={field?.fieldNames}
        onClickBackBtn={() => setCurrentIndex(FIELD_TAB_TYPES.FIELD_LIST)}
        onClickField={onSelectChangeFieldHandler}
      />
    );
  }

  return (
    <div>
      <div>
        {inputFieldDetailsForFilter?.map((filterProData, index) =>
          filterProData.isAppliedFilter ? (
            <AppliedFilterNew
              key={filterProData.output_key}
              filter={filter}
              filterProData={filterProData}
              onSetFilterAction={onSetFilterAction}
              getReportData={getReportData}
              index={index}
            />
          ) : null,
        )}
      </div>

      <div className={gClasses.PositionRelative} ref={addFilterWrapperRef}>
        <button
          className={styles.FilterBtn}
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && openFilter()}
          onClick={openFilter}
        >
          <div className={cx(styles.FilterText, gClasses.CenterV)}>
            <PlusIconBlueNew className={gClasses.MR12} />
            {BUTTONS.ADD_FILTER}
          </div>
        </button>
        {isOpen && (
          <div className={cx(styles.FilterDropdown)}>{currentComponent}</div>
        )}
      </div>
    </div>
  );
}

AddFilter.propTypes = {
  filter: PropTypes.objectOf({ inputFieldDetailsForFilter: PropTypes.array }),
  onSetFilterAction: PropTypes.func,
  getReportData: PropTypes.func,
  dashboardList: PropTypes.array,
};

export default AddFilter;
