import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label, InputTreeLayout } from '@workhall-pvt-lmt/wh-ui-library';
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep, set, find, get } from 'utils/jsUtility';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import PlusIcon from 'assets/icons/PlusIcon';
import styles from '../AddQuery.module.scss';
import RowComponent from './RowComponent';
import { DB_CONNECTION_QUERIES_STRINGS } from '../../../DBConnector.strings';
import {
  getDefaultKeyLabelsForFilterDateBy,
  getFilterDateByHeader,
} from '../../../DBConnector.utils';
import {
  FILTER_OPERATOR,
  INITIAL_FILTER_DATA_BY_DATA,
} from '../../../DBConnector.constant';

function FilterDataBy(props) {
  const {
    filterDataByData,
    onChangesQuery,
    readOnlyView = false,
    errorList,
    tableInfo,
  } = props;
  const { t } = useTranslation();
  const { QUERY_CONFIG } = DB_CONNECTION_QUERIES_STRINGS(t);

  const onChangeHandlers = ({ type, path, value, min = null, max = null }) => {
    const cloneFilterDataBy = cloneDeep(filterDataByData) || [];
    const cloneErrorList = cloneDeep(errorList);
    switch (type) {
      case QUERY_CONFIG.FIELD_NAME.ID:
        set(cloneFilterDataBy, [path, type], value);
        const selectedFieldType = find(tableInfo, {
          COLUMN_NAME: value,
        }).DATA_TYPE;
        set(
          cloneFilterDataBy,
          [path, QUERY_CONFIG.FIELD_TYPE.ID],
          selectedFieldType,
        );
        delete cloneErrorList[`${path},${type}`];
        break;
      case QUERY_CONFIG.OPERATOR.ID:
        set(cloneFilterDataBy, [path, type], value);
        const values = get(cloneFilterDataBy, [path, QUERY_CONFIG.VALUES.ID], []);
        if (value === FILTER_OPERATOR.BETWEEN) {
          if (values.length > 2) {
            set(cloneFilterDataBy, [path, QUERY_CONFIG.VALUES.ID], [EMPTY_STRING, EMPTY_STRING]);
          } else if (values.length === 1) {
            set(cloneFilterDataBy, [path, QUERY_CONFIG.VALUES.ID, 1], EMPTY_STRING);
          }
        } else if (value !== FILTER_OPERATOR.IN) {
          if (values.length > 1) {
            set(cloneFilterDataBy, [path, QUERY_CONFIG.VALUES.ID], [values[0]]);
          }
        }
        delete cloneErrorList[`${path},${type}`];
        break;
      case QUERY_CONFIG.VALUES.ID:
        const prevValues = get(cloneFilterDataBy, [path, type], []);
        const selectedOperator = get(
          cloneFilterDataBy,
          [path, QUERY_CONFIG.OPERATOR.ID],
          null,
        );
        let currentValues = [];
        if (selectedOperator === FILTER_OPERATOR.IN && value.length > 0) {
          currentValues = value.split(',');
          prevValues?.forEach(
            (_val, index) => delete cloneErrorList[`${path},${type},${index}`],
          );
        } else if (selectedOperator === FILTER_OPERATOR.BETWEEN) {
          currentValues = prevValues;
          if (min !== null) {
            currentValues[0] = min;
            delete cloneErrorList[`${path},${type},0`];
          }
          if (max !== null) {
            currentValues[1] = max;
            delete cloneErrorList[`${path},${type},1`];
          }
        } else {
          currentValues = [value];
          delete cloneErrorList[`${path},${type},0`];
        }
        set(cloneFilterDataBy, [path, type], currentValues);
        delete cloneErrorList[`${path},${type}`];
        break;
      case QUERY_CONFIG.DELETE.ID:
        const currentPath = (path || []).split(',');
        currentPath.push('is_deleted');
        set(cloneFilterDataBy, currentPath, true);
        break;
      case QUERY_CONFIG.ADD_MORE_FILTER.ID:
        const addData = cloneDeep(INITIAL_FILTER_DATA_BY_DATA);
        addData.path = path;
        addData.key_uuid = uuidv4();
        addData.key = addData.key_uuid;
        set(cloneFilterDataBy, path, addData);
        break;
      default:
        break;
    }
    onChangesQuery(
      { selected_filters: cloneFilterDataBy },
      { filter_error_list: cloneErrorList },
    );
  };

  return (
    <div>
      <Label
        labelName={QUERY_CONFIG.FILTER_DATA_BY_TITLE}
        className={styles.SectionLabelClassName}
      />
      <InputTreeLayout
        tableHeaders={getFilterDateByHeader(t)}
        headerStyles={[
          styles.FieldNameColumn,
          styles.FieldTypeColumn,
          styles.OperatorColumn,
          styles.ValuesColumn,
        ]}
        data={filterDataByData}
        depth={0}
        maxDepth={3}
        AddMoreIcon={() => <PlusIcon className={styles.Icon} />}
        RowComponent={RowComponent}
        errorList={errorList}
        onChangeHandlers={onChangeHandlers}
        keyLabels={getDefaultKeyLabelsForFilterDateBy(t)}
        hideRootAdd={false}
        readOnlyView={readOnlyView}
        duplicateRowErrorClassName={styles.DuplicateRowError}
      />
    </div>
  );
}

export default FilterDataBy;
