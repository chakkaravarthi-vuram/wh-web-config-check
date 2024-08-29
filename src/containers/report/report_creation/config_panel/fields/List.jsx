import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import gClasses from 'scss/Typography.module.scss';
import LeftIcon from 'assets/icons/LeftIcon';
import SearchIcon from 'assets/icons/SearchIcon';
import styles from './Fields.module.scss';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { getGroupedField } from '../ConfigPanel.utils';
import CONFIG_PANEL_STRINGS from '../ConfigPanel.strings';

function List(props) {
  const {
    fieldType,
    fieldDisplayNameSelectedValue,
    systemFields,
    dataFields,
    onClickBackBtn,
    onClickTable,
    onClickField,
  } = props;
  const { t } = useTranslation();
  const { SEARCH_FIELD, SYSTEM_FIELDS, NO_RESULT_FOUND } =
    CONFIG_PANEL_STRINGS(t);
  const [search, setSearch] = useState(EMPTY_STRING);

  /** This function construct the fields for the selected data Source */
  const getFields = () => {
    const fields = fieldType === SYSTEM_FIELDS ? systemFields : dataFields;
    if (!search) return fields;
    const keyword = search.toLowerCase();
    const filteredFields = fields.filter((fld) => {
      const { is_table_field, fieldNames, table_name } = fld;
      if (is_table_field) {
        return table_name.toLowerCase().includes(keyword);
      } else {
        return fieldNames.toLowerCase().includes(keyword);
      }
    });
    const [result, , tableFields] = getGroupedField(t, filteredFields, []);
    return [...result, ...tableFields];
  };

  const fields = getFields();
  const isEmpty = fields.length === 0;

  return (
    <div className={cx(styles.FieldList)}>
      <button
        className={cx(
          gClasses.ClickableElement,
          styles.BackBtn,
          gClasses.MB20,
          gClasses.CenterV,
          gClasses.PX16,
        )}
        onClick={onClickBackBtn}
      >
        <LeftIcon className={gClasses.MR10} />
        {fieldType}
      </button>
      <div className={cx(gClasses.CenterV, gClasses.MB12, gClasses.PX16)}>
        <SearchIcon />
        <input
          className={cx(gClasses.ML10, gClasses.BorderLessInput, gClasses.FS13)}
          placeholder={SEARCH_FIELD}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
      </div>
      <div className={cx(styles.Divider, gClasses.MB8)} />
      <div className={cx(styles.FieldListItems)}>
        {isEmpty ? (
          <p
            className={cx(
              gClasses.FOne13GrayV38,
              gClasses.TextAlignCenter,
              gClasses.MT8,
              gClasses.MB8,
            )}
          >
            {NO_RESULT_FOUND}
          </p>
        ) : (
          fields.map((data) => (
            <>
              {data.groupFieldType && (
                <div className={styles.Category}>{data.groupFieldType}</div>
              )}
              <option
                key={data.output_key}
                className={cx(styles.Option, {
                  [styles.Selected]:
                    data.fieldNames === fieldDisplayNameSelectedValue,
                })}
                onClick={() => {
                  if (data.is_table_field) {
                    onClickTable(data.table_name, data.table_reference_name);
                  } else {
                    onClickField(data);
                  }
                }}
                onKeyDown={(e) => {
                  if (data.is_table_field) {
                    keydownOrKeypessEnterHandle(e) &&
                      onClickTable(data.table_name, data.table_reference_name);
                  } else {
                    keydownOrKeypessEnterHandle(e) && onClickField(data);
                  }
                }}
                aria-selected={
                  data.fieldNames === fieldDisplayNameSelectedValue
                }
              >
                {data.is_table_field ? data.table_name : data.fieldNames}
              </option>
            </>
          ))
        )}
      </div>
    </div>
  );
}

List.propTypes = {
  fieldType: PropTypes.string,
  fieldDisplayNameSelectedValue: PropTypes.string,
  systemFields: PropTypes.array,
  dataFields: PropTypes.array,
  onClickBackBtn: PropTypes.func,
  onClickTable: PropTypes.func,
  onClickField: PropTypes.func,
};

export default List;
