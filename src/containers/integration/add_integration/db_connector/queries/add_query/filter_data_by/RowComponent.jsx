import React from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { TextInput, SingleDropdown } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import Trash from 'assets/icons/application/Trash';
import styles from '../AddQuery.module.scss';
import { DB_CONNECTION_QUERIES_STRINGS } from '../../../DBConnector.strings';
import {
  generateDropDownOptions,
  generateTableFieldListDetails,
} from '../../../DBConnector.utils';
import { FILTER_OPERATOR } from '../../../DBConnector.constant';

function RowComponent(props) {
  const {
    currentRow = {},
    onChangeHandlers,
    path,
    errorList,
    readOnlyView,
  } = props;
  const { t } = useTranslation();
  const { QUERY_CONFIG } = DB_CONNECTION_QUERIES_STRINGS(t);
  const { table_info, db_allowed_options: dbOptions } = useSelector(
    (store) => store.IntegrationReducer.dbConnector,
  );

  const valueError = {};
  if (currentRow.operator === FILTER_OPERATOR.BETWEEN) {
    valueError.oneMessage = errorList[`${path},${QUERY_CONFIG.VALUES.ID},0`];
    if (valueError.oneMessage?.includes('ISO')) {
      valueError.oneMessage = QUERY_CONFIG.ERROR_MESSAGE.VALUE_DATE_FORMAT;
    }
    valueError.twoMessage = errorList[`${path},${QUERY_CONFIG.VALUES.ID},1`];
    if (valueError.twoMessage?.includes('ISO')) {
      valueError.twoMessage = QUERY_CONFIG.ERROR_MESSAGE.VALUE_DATE_FORMAT;
    }
  } else {
    if (currentRow.operator === FILTER_OPERATOR.IN) {
      valueError.message = Object.keys(errorList).reduce((res, key) => {
        if (key.includes(`${path},${QUERY_CONFIG.VALUES.ID}`)) {
          res = errorList[key];
        }
        return res;
      }, null);
    } else {
      valueError.message = errorList[`${path},${QUERY_CONFIG.VALUES.ID},0`];
    }
    if (valueError.message?.includes('ISO')) {
      valueError.message = QUERY_CONFIG.ERROR_MESSAGE.VALUE_DATE_FORMAT;
    }
  }

  return (
    <div className={cx(gClasses.DisplayFlex, gClasses.W100)}>
      <div className={cx(styles.FieldNameColumn, gClasses.MR16)}>
        <SingleDropdown
          id={QUERY_CONFIG.FIELD_NAME.ID}
          optionList={generateTableFieldListDetails(
            table_info,
            dbOptions?.data_type,
          )}
          selectedValue={currentRow.field_name}
          onClick={(value, _label, _list, id) =>
            onChangeHandlers({ type: id, path, value })
          }
          errorMessage={errorList[`${path},${QUERY_CONFIG.FIELD_NAME.ID}`]}
          dropdownViewProps={{
            disabled: readOnlyView,
          }}
        />
      </div>
      <div className={cx(styles.FieldTypeColumn, gClasses.MR16)}>
        <TextInput
          id={QUERY_CONFIG.FIELD_TYPE.ID}
          value={currentRow.field_type}
          readOnly
          errorMessage={errorList[`${path},${QUERY_CONFIG.FIELD_TYPE.ID}`]}
        />
      </div>
      <div className={cx(styles.TypeCastColumn, gClasses.MR16)}>
        <SingleDropdown
          id={QUERY_CONFIG.OPERATOR.ID}
          optionList={generateDropDownOptions(dbOptions?.operator)}
          selectedValue={currentRow.operator}
          onClick={(value, _label, _list, id) =>
            onChangeHandlers({ type: id, path, value })
          }
          errorMessage={errorList[`${path},${QUERY_CONFIG.OPERATOR.ID}`]}
          dropdownViewProps={{
            disabled: readOnlyView,
          }}
        />
      </div>
      <div className={cx(styles.DisplayNameColumn, gClasses.MR16)}>
        {currentRow.operator === FILTER_OPERATOR.BETWEEN ? (
          <div className={cx(BS.D_FLEX, gClasses.Gap8)}>
            <TextInput
              id={`${QUERY_CONFIG.VALUES.ID}`}
              value={currentRow.values[0]}
              onChange={(event) => {
                const { id, value } = event.target;
                onChangeHandlers({ type: id, path, min: value });
              }}
              errorMessage={valueError.oneMessage}
              readOnly={readOnlyView}
            />
            <TextInput
              id={`${QUERY_CONFIG.VALUES.ID}`}
              value={currentRow.values[1]}
              onChange={(event) => {
                const { id, value } = event.target;
                onChangeHandlers({ type: id, path, max: value });
              }}
              errorMessage={valueError.twoMessage}
              readOnly={readOnlyView}
            />
          </div>
        ) : (
          <TextInput
            id={QUERY_CONFIG.VALUES.ID}
            value={
              currentRow.operator === FILTER_OPERATOR.IN
                ? currentRow.values.join(',')
                : currentRow.values[0]
            }
            onChange={(event) => {
              const { id, value } = event.target;
              onChangeHandlers({ type: id, path, value });
            }}
            errorMessage={valueError.message}
            readOnly={readOnlyView}
          />
        )}
      </div>
      <div className={gClasses.MR16}>
        {!readOnlyView && (
          <button
            id={QUERY_CONFIG.DELETE.ID}
            onClick={() =>
              onChangeHandlers({ type: QUERY_CONFIG.DELETE.ID, path })
            }
          >
            <Trash />
          </button>
        )}
      </div>
    </div>
  );
}

export default RowComponent;
