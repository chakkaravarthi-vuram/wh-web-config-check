import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import PropTypes from 'prop-types';
import {
  keydownOrKeypessEnterHandle,
  useClickOutsideDetectorForFilters,
} from 'utils/UtilityFunctions';
import SearchIcon from 'assets/icons/SearchIcon';
import LeftIcon from 'assets/icons/LeftIcon';
import PlusIconBlueNew from 'assets/icons/PlusIconBlueNew';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import { BS } from 'utils/UIConstants';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import styles from './AddFilter.module.scss';
import gClasses from '../../scss/Typography.module.scss';
import MoreFilterNew from './more_filters/MoreFiltersNew';
import { validateCurrentFilter, validateFilterValues } from './more_filters/MoreFilter.utils';
import jsUtils from '../../utils/jsUtility';
import { isEmptyFieldUpdateValue, searchFieldsByText } from './FilterUtils';
import AppliedFilterNew from './AppliedFilterNew';
import FILTER_STRINGS from './Filter.strings';
import { getGroupedField } from '../../containers/report/report_creation/config_panel/ConfigPanel.utils';

function AddFilter(props) {
  const { t } = useTranslation();
  const {
    filter: { inputFieldDetailsForFilter },
    filter,
    onSetFilterAction,
    getReportData,
    isFromDashboard,
    dashboardList,
  } = props;
  const filterBtnRef = useRef();
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(isFromDashboard ? -1 : 0);
  const [fieldType, setFieldType] = useState(EMPTY_STRING);
  const [context, setContext] = useState(null);
  const [field, setField] = useState(EMPTY_STRING);
  const [systemFields, setSystemFields] = useState([]);
  const [dataFields, setDataFields] = useState([]);
  const [search, setSearch] = useState(EMPTY_STRING);
  const [index, setIndex] = useState(null);
  const [error, setError] = useState(null);
  const completedRef = useRef(null);
  let currentComponent = null;

  const close = () => {
    setSearch(EMPTY_STRING);
    setOpen(false);
    setFieldType(EMPTY_STRING);
    setCurrentIndex(isFromDashboard ? -1 : 0);
    setField(EMPTY_STRING);
    setIndex(null);
    setError(null);
  };

  const discardField = (isClose = true) => {
    const clonedFilter = jsUtils.cloneDeep(filter);

    clonedFilter.inputFieldDetailsForFilter?.map((proData) => {
      proData.isAppliedFieldEdit = false;
      return proData;
    });
    clonedFilter.selectedFieldDetailsFromFilter?.map((proData) => {
      proData.isAppliedFieldEdit = false;
      return proData;
    });
    const { inputFieldDetailsForFilter, selectedFieldDetailsFromFilter } = clonedFilter;

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
      completedRef.current = true;
      close();
    }
    setError(null);
  };

  useClickOutsideDetectorForFilters(filterBtnRef, close);

  useEffect(() => {
    if (!open && !completedRef.current) {
      discardField();
    }
  }, [open]);

  useEffect(() => {
    const filteredChartDimensions = [];
    if (context?.context_uuid && isFromDashboard) {
      inputFieldDetailsForFilter.forEach((field) => {
        if (field.contextUuid === context.context_uuid) {
          filteredChartDimensions.push(field);
        }
      });
    }
    const systemFields = [];
    const dataFields = [];
    (isFromDashboard ? filteredChartDimensions : inputFieldDetailsForFilter).forEach(
      (data) => {
        const { is_system_field } = data;
        !is_system_field ? dataFields.push(data) : systemFields.push(data);
        if (field && data.output_key === field.output_key) {
          setField(data);
        }
      },
    );
    const [systemFieldsArr, dataFieldsArr] = getGroupedField(t,
      systemFields,
      dataFields,
    );
    setSystemFields(systemFieldsArr);
    setDataFields(dataFieldsArr);
  }, [inputFieldDetailsForFilter, context]);

  const openFilter = () => {
    if (open) return;
    setOpen(true);
    completedRef.current = false;
  };

  const selectFieldType = (type) => {
    setFieldType(type);
    setCurrentIndex(1);
  };

  const selectField = (field) => {
    setCurrentIndex(2);
    setField(field);
    setError(null);

    inputFieldDetailsForFilter.forEach((data, idx) => {
      if (data.output_key === field.output_key) setIndex(idx);
    });
  };

  const selectContext = (c) => {
    setContext(c);
    setCurrentIndex(0);
  };

  const getFields = () => {
    const fields = fieldType === FILTER_STRINGS(t).SYSTEM_FIELDS ? systemFields : dataFields;
    if (!search) return fields;
    const keyword = search.toLowerCase();
    return fields.filter((fld) =>
      fld.fieldNames.toLowerCase().includes(keyword),
    );
  };

  const onSelectChangeFieldHandler = (data) => {
    selectField(data);
  };

  const onClickApplyFilter = () => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    const clonedFilterFlowData = jsUtils.cloneDeep(inputFieldDetailsForFilter);
    const [isFieldValid, errorMessage] = validateCurrentFilter(field, clonedFilterFlowData, t);
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
      const mapFilterFlowData = updatedFilterFlowData?.map((filterProData) => {
        if (isEmptyFieldUpdateValue(filterProData)) {
          filterProData.isFormField = false;
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
      clonedFilter.selectedFieldDetailsFromFilter = jsUtils.cloneDeep(
        mapFilterFlowData,
      );
      getReportData(clonedFilter);
    } else {
      clonedFilter.inputFieldDetailsForFilter = searchFieldsByText(
        jsUtils.cloneDeep(updatedFilterFlowData),
        EMPTY_STRING,
      );
      onSetFilterAction(clonedFilter);
    }
    completedRef.current = true;
    close();
  };

  const onClickMoreFilters = () => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    const { inputFieldDetailsForFilter, selectedFieldDetailsFromFilter } = clonedFilter;

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

  if (currentIndex === -1) {
    currentComponent = (
      <div className={styles.FieldType}>
        {dashboardList?.map((d) => (
          <button
            key={d.context_uuid}
            className={cx(
              gClasses.ClickableElement,
              styles.FieldTypeItem,
              gClasses.CursorPointer,
              BS.W100,
              { [styles.Selected]: context?.context_uuid === d.context_uuid },
            )}
            onClick={() => selectContext(d)}
          >
            <div
              className={cx(BS.FLOAT_LEFT, styles.Text, gClasses.Ellipsis)}
              title={d.context_name}
            >
              {d.context_name}
            </div>
            <div className={cx(BS.FLOAT_RIGHT, gClasses.CenterV)}>
              <LeftIcon className={gClasses.Rotate180} />
            </div>
          </button>
        ))}
      </div>
    );
  } else if (currentIndex === 0) {
    const systemFieldCount = systemFields.length;
    const dataFieldCount = dataFields.length;
    currentComponent = (
      <>
        {isFromDashboard && (
          <>
            <button
              className={cx(
                gClasses.ClickableElement,
                styles.BackBtn,
                gClasses.MB16,
                gClasses.MT16,
                gClasses.CenterV,
                gClasses.PX16,
              )}
              onClick={() => setCurrentIndex(-1)}
            >
              <LeftIcon className={gClasses.MR10} />
              <div
                className={cx(styles.Text, gClasses.Ellipsis)}
                title={context.context_name}
              >
                {context.context_name}
              </div>
            </button>
            <div className={cx(styles.Divider, gClasses.MB8)} />
          </>
        )}
        <div className={styles.FieldType}>
          <button
            className={cx(
              gClasses.ClickableElement,
              styles.FieldTypeItem,
              gClasses.CursorPointer,
              BS.W100,
              { [styles.Selected]: fieldType === FILTER_STRINGS(t).DATA_FIELDS },
            )}
            onClick={() => selectFieldType(FILTER_STRINGS(t).DATA_FIELDS)}
          >
            <div className={BS.FLOAT_LEFT}>{FILTER_STRINGS(t).DATA_FIELDS}</div>
            <div className={cx(BS.FLOAT_RIGHT, gClasses.CenterV)}>
              <span className={styles.Count}>{`(${dataFieldCount})`}</span>
              <LeftIcon className={gClasses.Rotate180} />
            </div>
          </button>
          <button
            className={cx(
              gClasses.ClickableElement,
              styles.FieldTypeItem,
              gClasses.CursorPointer,
              BS.D_BLOCK,
              BS.W100,
              { [styles.Selected]: fieldType === FILTER_STRINGS(t).SYSTEM_FIELDS },
            )}
            onClick={() => selectFieldType(FILTER_STRINGS(t).SYSTEM_FIELDS)}
          >
            <div className={BS.FLOAT_LEFT}>{FILTER_STRINGS(t).SYSTEM_FIELDS}</div>
            <div className={cx(BS.FLOAT_RIGHT, gClasses.CenterV)}>
              <span className={styles.Count}>{`(${systemFieldCount})`}</span>
              <LeftIcon className={gClasses.Rotate180} />
            </div>
          </button>
        </div>
      </>
    );
  } else if (currentIndex === 1) {
    const fields = getFields();
    const isEmpty = fields.length === 0;
    currentComponent = (
      <div className={cx(styles.FieldList)}>
        <button
          className={cx(
            gClasses.ClickableElement,
            styles.BackBtn,
            gClasses.MB20,
            gClasses.CenterV,
            gClasses.PX16,
          )}
          onClick={() => {
            setCurrentIndex(0);
            setSearch(EMPTY_STRING);
          }}
        >
          <LeftIcon className={gClasses.MR10} />
          {fieldType}
        </button>
        <div className={cx(gClasses.CenterV, gClasses.MB12, gClasses.PX16)}>
          <SearchIcon />
          <input
            className={cx(
              gClasses.ML10,
              gClasses.BorderLessInput,
              gClasses.FS13,
            )}
            placeholder={FILTER_STRINGS(t).SEARCH_FIELD}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </div>
        <div className={cx(styles.Divider, gClasses.MB8)} />
        <div className={styles.FieldListItems}>
          {isEmpty ? (
            <p
              className={cx(
                gClasses.FOne13GrayV38,
                gClasses.TextAlignCenter,
                gClasses.MT8,
                gClasses.MB8,
              )}
            >
              No Results Found!
            </p>
          ) : (
            fields.map((data) => (
              <>
                {data.groupFieldType && (
                  <div className={styles.Category}>{data.groupFieldType}</div>
                )}
                <button
                  key={data.INDEX}
                  className={cx(styles.Option, {
                    [styles.Selected]: data.fieldNames === field?.fieldNames,
                  })}
                  onClick={() => onSelectChangeFieldHandler(data)}
                  onKeyDown={(e) =>
                    keydownOrKeypessEnterHandle(e) &&
                    onSelectChangeFieldHandler(data)
                  }
                >
                  {data.fieldNames}
                </button>
              </>
            ))
          )}
        </div>
      </div>
    );
  } else if (currentIndex === 2) {
    currentComponent = (
      <div className={cx(styles.FieldConfiguration)}>
        <button
          className={cx(
            gClasses.ClickableElement,
            styles.BackBtn,
            gClasses.MB8,
            gClasses.CenterV,
          )}
          onClick={() => {
            discardField(false);
            setCurrentIndex(1);
          }}
        >
          <LeftIcon className={gClasses.MR8} />
          <div
            className={cx(styles.Text, gClasses.Ellipsis)}
            title={field?.fieldNames}
          >
            {field?.fieldNames}
          </div>
        </button>
        <div className={cx(styles.Divider, gClasses.MB16)} />

        <div className={cx(gClasses.PX24, styles.FieldContent)}>
          <MoreFilterNew
            field={field}
            filter={filter}
            onSetFilterAction={onSetFilterAction}
            getReportData={getReportData}
            index={index}
            error={error}
            resetError={() => setError(null)}
          />
        </div>

        <div className={cx(styles.Divider, gClasses.MB16)} />

        <div className={cx(gClasses.RightH, gClasses.PX24)}>
          <Button buttonType={BUTTON_TYPE.LIGHT} onClick={onClickMoreFilters}>
            {FILTER_STRINGS(t).ADD_FILTER_BUTTONS.DISCARD}
          </Button>
          <Button className={gClasses.ML15} onClick={onClickApplyFilter}>
            {FILTER_STRINGS(t).ADD_FILTER_BUTTONS.APPLY}
          </Button>
        </div>
      </div>
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

      <button
        className={cx(styles.FilterBtn, gClasses.CursorPointer)}
        ref={filterBtnRef}
        onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && openFilter()}
        onClick={openFilter}
      >
        <div className={cx(styles.FilterText, gClasses.CenterV)}>
          <PlusIconBlueNew className={gClasses.MR12} />
          {FILTER_STRINGS(t).BUTTONS.ADD_FILTER}
        </div>
        {open && (
          <div className={cx(styles.FilterDropdown)}>{currentComponent}</div>
        )}
      </button>
    </div>
  );
}

AddFilter.propTypes = {
  filter: PropTypes.objectOf({
    inputFieldDetailsForFilter: PropTypes.arrayOf(PropTypes.object),
  }),
  onSetFilterAction: PropTypes.func,
  getReportData: PropTypes.func,
  isFromDashboard: PropTypes.bool,
  dashboardList: PropTypes.arrayOf(PropTypes.object),
};

export default AddFilter;
