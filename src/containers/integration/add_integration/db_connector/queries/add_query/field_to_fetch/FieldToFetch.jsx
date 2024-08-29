import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Label,
  InputTreeLayout,
  Text,
  ETextSize,
} from '@workhall-pvt-lmt/wh-ui-library';
import { v4 as uuidv4 } from 'uuid';
import gClasses from 'scss/Typography.module.scss';
import PlusIcon from 'assets/icons/PlusIcon';
import { cloneDeep, set, find, get, isEmpty } from 'utils/jsUtility';
import styles from '../AddQuery.module.scss';
import RowComponent from './RowComponent';
import { DB_CONNECTION_QUERIES_STRINGS } from '../../../DBConnector.strings';
import {
  getDefaultKeyLabelsForFieldToFetch,
  getFieldToFetchHeader,
} from '../../../DBConnector.utils';
import { DEFAULT_TYPE_CAST_VALUE, INITIAL_FIELD_TO_FETCH_DATA } from '../../../DBConnector.constant';

function FieldToFetch(props) {
  const {
    fieldToFetchData,
    onChangesQuery,
    readOnlyView = false,
    errorList,
    tableInfo,
    getClearSortDataBy,
  } = props;
  const { t } = useTranslation();
  const { QUERY_CONFIG } = DB_CONNECTION_QUERIES_STRINGS(t);

  const onChangeHandlers = ({ type, path, value }) => {
    const cloneFieldToFetchData = cloneDeep(fieldToFetchData) || [];
    const cloneErrorList = cloneDeep(errorList);
    let sort_fields = {};
    switch (type) {
      case QUERY_CONFIG.FIELD_NAME.ID:
        sort_fields = getClearSortDataBy(
          get(cloneFieldToFetchData, [path, type]),
        );
        set(cloneFieldToFetchData, [path, type], value);
        set(cloneFieldToFetchData, [path, QUERY_CONFIG.DISPLAY_NAME.ID], value);
        const selectedFieldType = find(tableInfo, {
          COLUMN_NAME: value,
        }).DATA_TYPE;
        set(
          cloneFieldToFetchData,
          [path, QUERY_CONFIG.FIELD_TYPE.ID],
          selectedFieldType,
        );
        set(cloneFieldToFetchData, [path, QUERY_CONFIG.TYPE_CAST.ID], DEFAULT_TYPE_CAST_VALUE);
        delete cloneErrorList[`${path},${type}`];
        delete cloneErrorList[`${path},${QUERY_CONFIG.TYPE_CAST.ID}`];
        delete cloneErrorList[`${path},${QUERY_CONFIG.DISPLAY_NAME.ID}`];
        break;
      case QUERY_CONFIG.TYPE_CAST.ID:
        set(cloneFieldToFetchData, [path, type], value);
        delete cloneErrorList[`${path},${type}`];
        break;
      case QUERY_CONFIG.DISPLAY_NAME.ID:
        sort_fields = getClearSortDataBy(
          get(cloneFieldToFetchData, [path, QUERY_CONFIG.FIELD_NAME.ID]),
          value,
        );
        set(cloneFieldToFetchData, [path, type], value);
        delete cloneErrorList[`${path},${type}`];
        delete cloneErrorList[`${path}`];
        break;
      case QUERY_CONFIG.DELETE.ID:
        sort_fields = getClearSortDataBy(
          get(cloneFieldToFetchData, [path, QUERY_CONFIG.FIELD_NAME.ID]),
        );
        set(cloneFieldToFetchData, [path, 'is_deleted'], true);
        break;
      case QUERY_CONFIG.ADD_MORE_FIELD.ID:
        const addData = cloneDeep(INITIAL_FIELD_TO_FETCH_DATA);
        addData.path = path;
        addData.key_uuid = uuidv4();
        addData.key = addData.key_uuid;
        set(cloneFieldToFetchData, path, addData);
        delete cloneErrorList?.undefined;
        break;
      default:
        break;
    }
    const updateData = { selected_fields: cloneFieldToFetchData };
    if (!isEmpty(sort_fields)) {
      updateData.sort_fields = sort_fields;
    }
    onChangesQuery(updateData, { field_error_list: cloneErrorList });
  };

  let errorComponent = null;
  if (errorList?.undefined) {
    errorComponent = (
      <Text
        size={ETextSize.XS}
        content={errorList.undefined}
        className={gClasses.red22}
      />
    );
  }

  return (
    <div>
      <Label
        labelName={QUERY_CONFIG.FIELD_TO_FETCH_TITLE}
        className={styles.SectionLabelClassName}
        isRequired
      />
      <InputTreeLayout
        tableHeaders={getFieldToFetchHeader(t)}
        headerStyles={[
          styles.FieldNameColumn,
          styles.FieldTypeColumn,
          styles.TypeCastColumn,
          styles.DisplayNameColumn,
        ]}
        headerRowClass={errorList?.undefined && styles.DuplicateRowError}
        data={fieldToFetchData}
        depth={0}
        maxDepth={3}
        AddMoreIcon={() => <PlusIcon className={styles.Icon} />}
        RowComponent={RowComponent}
        errorList={errorList}
        onChangeHandlers={onChangeHandlers}
        keyLabels={getDefaultKeyLabelsForFieldToFetch(t)}
        hideRootAdd={false}
        readOnlyView={readOnlyView}
        duplicateRowErrorClassName={styles.DuplicateRowError}
      />
      {errorComponent}
    </div>
  );
}

export default FieldToFetch;
