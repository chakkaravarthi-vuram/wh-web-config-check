import React from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  TextInput,
  SingleDropdown,
  Text,
  ETextSize,
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import Trash from 'assets/icons/application/Trash';
import styles from '../AddQuery.module.scss';
import { DB_CONNECTION_QUERIES_STRINGS } from '../../../DBConnector.strings';
import {
  generateDropDownOptions,
  generateTableFieldListDetails,
} from '../../../DBConnector.utils';
import { FEATURE_INTEGRATION_STRINGS } from '../../../../../Integration.strings';

function RowComponent(props) {
  const {
    currentRow = {},
    onChangeHandlers,
    path,
    errorList,
    readOnlyView,
    isDuplicateKeyError,
  } = props;
  const { t } = useTranslation();
  const { QUERY_CONFIG } = DB_CONNECTION_QUERIES_STRINGS(t);
  const {
    table_info,
    db_allowed_options: dbOptions,
    query: { selected_fields },
  } = useSelector((store) => store.IntegrationReducer.dbConnector);

  let errorComponent = null;
  if (isDuplicateKeyError) {
    errorComponent = (
      <Text
        size={ETextSize.XS}
        content={t(FEATURE_INTEGRATION_STRINGS.DUPLICATE_KEY_ERROR)}
        className={gClasses.red22}
      />
    );
  }

  return (
    <>
      <div className={cx(gClasses.DisplayFlex, gClasses.W100)}>
        <div className={cx(styles.FieldNameColumn, gClasses.MR16)}>
          <SingleDropdown
            id={QUERY_CONFIG.FIELD_NAME.ID}
            optionList={generateTableFieldListDetails(
              table_info,
              dbOptions?.data_type,
              currentRow?.field_name,
              selected_fields,
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
            id={QUERY_CONFIG.TYPE_CAST.ID}
            optionList={generateDropDownOptions(dbOptions?.type_cast)}
            selectedValue={currentRow.type_cast}
            onClick={(value, _label, _list, id) =>
              onChangeHandlers({ type: id, path, value })
            }
            errorMessage={errorList[`${path},${QUERY_CONFIG.TYPE_CAST.ID}`]}
            dropdownViewProps={{
              disabled: readOnlyView,
            }}
          />
        </div>
        <div className={cx(styles.DisplayNameColumn, gClasses.MR16)}>
          <TextInput
            id={QUERY_CONFIG.DISPLAY_NAME.ID}
            value={currentRow.display_name}
            onChange={(event) => {
              const { id, value } = event.target;
              onChangeHandlers({ type: id, path, value });
            }}
            errorMessage={errorList[`${path},${QUERY_CONFIG.DISPLAY_NAME.ID}`]}
            readOnly={readOnlyView}
          />
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
      {errorComponent}
    </>
  );
}

export default RowComponent;
