import React, { useContext, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import {
  ETitleHeadingLevel,
  ETitleSize,
  Title,
  CheckboxGroup,
  Text,
  Input,
  SingleDropdown,
  TextInput,
  Popper,
  EPopperPlacements,
} from '@workhall-pvt-lmt/wh-ui-library';
import PlusIconBlueNew from 'assets/icons/PlusIconBlueNew';
import gClasses from 'scss/Typography.module.scss';
import DndWrapper from '../../../../components/dnd_wrapper/DndWrapper';
import SelectedColumns from './selected_column/SelectedColumns';
import DASHBOARD_CONFIG_STRINGS, {
  FIELD_WIDTH,
} from '../DashboardConfig.strings';
import styles from './ConfigPanel.module.scss';
import SearchIcon from '../../../../assets/icons/SearchIcon';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import {
  keydownOrKeypessEnterHandle,
  useClickOutsideDetector,
} from '../../../../utils/UtilityFunctions';
import jsUtility from '../../../../utils/jsUtility';
import TableColumnConfig from './table_column_config/TableColumnConfig';
import {
  dataChange,
  useDashboardConfigProvider,
} from '../DashboardConfigReducer';
import CheckListIcon from '../../../../assets/icons/form_fields/CorrectIconV2';
import ThemeContext from '../../../../hoc/ThemeContext';

function ConfigPanel(props) {
  const { onSave } = props;
  const { t } = useTranslation();
  const { colorSchemeDefault } = useContext(ThemeContext);
  const { state, dispatch } = useDashboardConfigProvider();
  const { columnList, sorting, additionalConfig, fieldList, errorList } = state;
  const setErrorList = (errorList) => {
    dispatch(dataChange({ errorList }));
  };
  const [isOpenAddColumn, setIsOpenAddColumn] = useState(false);
  const [search, setSearch] = useState(EMPTY_STRING);
  const [editModelIndex, setEditModelIndex] = useState(null);
  const addPopperRef = useRef();
  const addColumnRef = useRef();
  const {
    CONFIG_PANEL: {
      FIELDS: { TABLE_COLUMNS, SORTING, ADDITIONAL_CONFIG },
    },
  } = DASHBOARD_CONFIG_STRINGS(t);

  const onCloseAddColumn = () => {
    setIsOpenAddColumn(false);
    setSearch(EMPTY_STRING);
  };

  useClickOutsideDetector(addColumnRef, onCloseAddColumn, [isOpenAddColumn]);

  const setColumnList = (columnList, errors = errorList) => {
    dispatch(
      dataChange({ columnList, errorList: errors, isDataUpdated: true }),
    );
  };
  const setSorting = (sorting, errors = errorList) => {
    dispatch(dataChange({ sorting, errorList: errors, isDataUpdated: true }));
  };
  const setAdditionalConfig = (additionalConfig) => {
    dispatch(dataChange({ additionalConfig, isDataUpdated: true }));
  };

  const onCloseEditModelField = () => {
    setEditModelIndex(null);
  };

  const getFields = () => {
    if (jsUtility.isEmpty(search)) return fieldList;
    const keyword = search?.toLowerCase();
    const filteredFields = fieldList.filter((field) =>
      field.field_name?.toLowerCase().includes(keyword),
    );
    return filteredFields;
  };

  const fields = getFields();

  const onChangeSortBy = (value, fieldSource = null, columnLists = null) => {
    const cloneSorting = jsUtility.cloneDeep(sorting);
    const cloneColumnList = jsUtility.cloneDeep(columnLists ?? columnList);
    let cloneFieldSource = fieldSource;
    if (jsUtility.isEmpty(cloneFieldSource)) {
      const selectedFieldColumn = cloneColumnList.find(
        (column) => column.field === value,
      );
      cloneFieldSource = selectedFieldColumn?.field_source ?? '';
    }
    cloneSorting.field_source = cloneFieldSource;
    cloneSorting.field = value ?? '';
    const cloneErrorList = jsUtility.cloneDeep(errorList);
    delete cloneErrorList['report,sorting,0,field'];
    delete cloneErrorList['report,sorting,0,field_source'];
    setSorting(cloneSorting, cloneErrorList);
    onSave({ sorting: cloneSorting, columnList: cloneColumnList });
  };

  const onSelectColumn = (data) => {
    const newFieldData = jsUtility.cloneDeep(data);
    const newColumnData = {
      field_source: newFieldData.field_source,
      field: newFieldData._id,
      label: newFieldData.field_name,
      width: FIELD_WIDTH.AUTO,
    };
    const cloneSelectedField = jsUtility.cloneDeep(columnList);
    cloneSelectedField.push(newColumnData);
    const cloneErrorList = jsUtility.cloneDeep(errorList);
    delete cloneErrorList['report,table_columns'];
    setColumnList(cloneSelectedField, cloneErrorList);
    if (jsUtility.isEmpty(sorting.field)) {
      onChangeSortBy(
        newColumnData.field,
        newColumnData.field_source,
        cloneSelectedField,
      );
    } else {
      onSave({ columnList: cloneSelectedField });
    }
  };

  const onChangeAdditionalConfig = (value) => {
    const cloneAdditionConfig = jsUtility.cloneDeep(additionalConfig);
    cloneAdditionConfig[value] = !cloneAdditionConfig[value];
    if (cloneAdditionConfig[value]) {
      if (ADDITIONAL_CONFIG.ENABLE_TASK.VALUE === value) {
        cloneAdditionConfig[ADDITIONAL_CONFIG.ENABLE_TASK.ID] = 'Add Request';
      } else if (ADDITIONAL_CONFIG.ENABLE_START_ADD_NEW.VALUE === value) {
        cloneAdditionConfig[ADDITIONAL_CONFIG.ENABLE_START_ADD_NEW.ID] =
          'Add New';
      }
    }
    setAdditionalConfig(cloneAdditionConfig);
    onSave({ additionalConfig: cloneAdditionConfig });
  };

  const onChangeCheckboxInput = (event) => {
    const { id, value } = event.target;
    const cloneAdditionConfig = jsUtility.cloneDeep(additionalConfig);
    cloneAdditionConfig[id] = value;
    setAdditionalConfig(cloneAdditionConfig);
  };

  const getSortByField = () => {
    const sortFieldList = columnList.map((column) => {
      return {
        label: column.label,
        value: column.field,
        isCheck: column.field === sorting.field,
      };
    });
    return sortFieldList;
  };

  const onChangeSortOrder = (value) => {
    const cloneSorting = jsUtility.cloneDeep(sorting);
    cloneSorting.order = value;
    setSorting(cloneSorting);
    onSave({ sorting: cloneSorting });
  };

  const checkboxOptions = [
    {
      label: ADDITIONAL_CONFIG.ENABLE_TASK.LABEL,
      value: ADDITIONAL_CONFIG.ENABLE_TASK.VALUE,
      selected: additionalConfig[ADDITIONAL_CONFIG.ENABLE_TASK.VALUE],
      customChildElement: (
        <TextInput
          id={ADDITIONAL_CONFIG.ENABLE_TASK.ID}
          value={additionalConfig[ADDITIONAL_CONFIG.ENABLE_TASK.ID]}
          onChange={onChangeCheckboxInput}
          onBlurHandler={() => onSave()}
          errorMessage={
            errorList[`features,${ADDITIONAL_CONFIG.ENABLE_TASK.ID}`]
          }
          readOnly={!additionalConfig[ADDITIONAL_CONFIG.ENABLE_TASK.VALUE]}
        />
      ),
      customChildElementClassName: cx(gClasses.MT10, gClasses.ML32),
    },
    {
      label: ADDITIONAL_CONFIG.ENABLE_DOWNLOAD.LABEL,
      value: ADDITIONAL_CONFIG.ENABLE_DOWNLOAD.VALUE,
      selected: additionalConfig[ADDITIONAL_CONFIG.ENABLE_DOWNLOAD.VALUE],
    },
    {
      label: ADDITIONAL_CONFIG.ENABLE_START_ADD_NEW.LABEL,
      value: ADDITIONAL_CONFIG.ENABLE_START_ADD_NEW.VALUE,
      selected: additionalConfig[ADDITIONAL_CONFIG.ENABLE_START_ADD_NEW.VALUE],
      customChildElement: (
        <TextInput
          id={ADDITIONAL_CONFIG.ENABLE_START_ADD_NEW.ID}
          value={additionalConfig[ADDITIONAL_CONFIG.ENABLE_START_ADD_NEW.ID]}
          onChange={onChangeCheckboxInput}
          onBlurHandler={() => onSave()}
          errorMessage={
            errorList[`features,${ADDITIONAL_CONFIG.ENABLE_START_ADD_NEW.ID}`]
          }
          readOnly={
            !additionalConfig[ADDITIONAL_CONFIG.ENABLE_START_ADD_NEW.VALUE]
          }
        />
      ),
      customChildElementClassName: cx(gClasses.MT10, gClasses.ML32),
    },
  ];

  const tableColumnError = errorList['report,table_columns'];

  const getAddColumnContent = () => (
    <Popper
      targetRef={addPopperRef}
      open={isOpenAddColumn}
      placement={EPopperPlacements.AUTO}
      className={styles.AddFieldPopper}
      content={
        <div ref={addColumnRef}>
          <Input
            id="search"
            className={cx(
              styles.FieldListSearch,
              gClasses.BorderLessInput,
              gClasses.FS13,
            )}
            placeholder="Search form fields"
            prefixIcon={<SearchIcon />}
            content={search}
            onChange={(e) => setSearch(e.target.value)}
            colorScheme={{}}
          />
          <div className={cx(styles.Divider, gClasses.MB8)} />
          <div className={cx(styles.FieldListItems)}>
            {fields.length === 0 ? (
              <p
                className={cx(
                  gClasses.FOne13GrayV38,
                  gClasses.TextAlignCenter,
                  gClasses.MT8,
                  gClasses.MB8,
                )}
              >
                {TABLE_COLUMNS.NO_RESULT_FOUND}
              </p>
            ) : (
              fields.map((data) => {
                const isSelected = columnList.some(
                  (column) => column.field === data._id,
                );
                let groupSourceTitle = EMPTY_STRING;
                if (data?.groupSourceType === 'data_field') {
                  groupSourceTitle = TABLE_COLUMNS.DATA_FIELDS;
                } else if (data?.groupSourceType === 'system_field') {
                  groupSourceTitle = TABLE_COLUMNS.SYSTEM_FIELDS;
                }
                return (
                  <>
                    {groupSourceTitle && (
                      <div className={styles.Category}>{groupSourceTitle}</div>
                    )}
                    <option
                      key={data._id}
                      className={cx(styles.FieldListOption, gClasses.Ellipsis, {
                        [styles.SelectedField]: isSelected,
                      })}
                      onClick={() => {
                        !isSelected && onSelectColumn(data);
                      }}
                      onKeyDown={(e) => {
                        !isSelected &&
                          keydownOrKeypessEnterHandle(e) &&
                          onSelectColumn(data);
                      }}
                      tabIndex={-1}
                      aria-selected
                    >
                      <Text content={data.field_name} />
                      {isSelected && (
                        <CheckListIcon color={colorSchemeDefault.activeColor} />
                      )}
                    </option>
                  </>
                );
              })
            )}
          </div>
        </div>
      }
    />
  );

  return (
    <>
      <div className={cx(styles.ConfigPanel, gClasses.P24)}>
        <div id={TABLE_COLUMNS.ID}>
          <Title
            content={TABLE_COLUMNS.LABEL}
            headingLevel={ETitleHeadingLevel.h3}
            size={ETitleSize.xs}
            className={cx(gClasses.MB16)}
          />
          <DndWrapper id={TABLE_COLUMNS.ID}>
            <SelectedColumns
              selectedColumn={columnList}
              setSelectedColumn={setColumnList}
              setEditModelIndex={setEditModelIndex}
              sorting={sorting}
              setSorting={setSorting}
              onSave={onSave}
            />
          </DndWrapper>
          <div className={cx(gClasses.PositionRelative, gClasses.MB24)}>
            <button
              className={styles.AddColumn}
              onClick={() => setIsOpenAddColumn(true)}
              ref={addPopperRef}
            >
              <PlusIconBlueNew className={gClasses.MR12} />
              <Text content={TABLE_COLUMNS.ADD_COLUMN} />
            </button>
            {tableColumnError && (
              <div role="alert" className={gClasses.FTwo12RedV2}>
                {tableColumnError}
              </div>
            )}
            {isOpenAddColumn && getAddColumnContent()}
          </div>
        </div>
        <div>
          <Title
            content={SORTING.LABEL}
            headingLevel={ETitleHeadingLevel.h3}
            size={ETitleSize.small}
            className={cx(gClasses.MB16, gClasses.FontSize13)}
          />
          <SingleDropdown
            id={SORTING.SORT_BY_ID}
            optionList={getSortByField()}
            onClick={(value) => onChangeSortBy(value)}
            selectedValue={sorting.field}
            className={gClasses.MB4}
            errorMessage={errorList['report,sorting,0,field']}
          />
          <SingleDropdown
            id={SORTING.SORT_ORDER_ID}
            optionList={SORTING.SORT_ORDER_OPTIONS}
            onClick={onChangeSortOrder}
            selectedValue={sorting.order}
            className={gClasses.MB24}
            errorMessage={errorList['report,sorting,0,order']}
          />
        </div>
        <div>
          <Title
            content={ADDITIONAL_CONFIG.LABEL}
            headingLevel={ETitleHeadingLevel.h3}
            size={ETitleSize.small}
            className={cx(gClasses.MB16, gClasses.FontSize13)}
          />
          <CheckboxGroup
            hideLabel
            options={checkboxOptions}
            checkboxGroupClassName={gClasses.Gap16}
            onClick={onChangeAdditionalConfig}
          />
        </div>
      </div>
      {(editModelIndex || editModelIndex === 0) && (
        <TableColumnConfig
          dashboardFields={fieldList}
          fieldIndex={editModelIndex}
          selectedField={columnList}
          setSelectedField={setColumnList}
          fieldList={fieldList}
          onClose={onCloseEditModelField}
          setErrorList={setErrorList}
          errorList={errorList}
          onSave={onSave}
        />
      )}
    </>
  );
}

ConfigPanel.propTypes = {
  onSave: PropTypes.func,
};

export default ConfigPanel;
