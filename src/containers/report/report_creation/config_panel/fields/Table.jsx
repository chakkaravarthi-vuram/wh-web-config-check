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
import { getGroupedTableFields } from '../ConfigPanel.utils';
import CONFIG_PANEL_STRINGS from '../ConfigPanel.strings';

function Table(props) {
  const {
    tableFields,
    selectedTableName,
    fieldDisplayNameSelectedValue,
    onClickBackBtn,
    onClickField,
  } = props;
  const { t } = useTranslation();
  const { SEARCH_FIELD, NO_RESULT_FOUND } = CONFIG_PANEL_STRINGS(t);
  const [search, setSearch] = useState(EMPTY_STRING);

  const getTableFields = () => {
    const fields = tableFields;
    if (!search) return fields;
    const keyword = search.toLowerCase();
    const filteredFields = fields.filter((fld) =>
      fld.fieldNames.toLowerCase().includes(keyword),
    );
    const result = getGroupedTableFields(filteredFields, t);
    return result;
  };

  const fields = getTableFields();
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
        {selectedTableName}
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
                onClick={() => onClickField(data)}
                onKeyDown={(e) =>
                  keydownOrKeypessEnterHandle(e) && onClickField(data)
                }
                aria-selected={
                  data.fieldNames === fieldDisplayNameSelectedValue
                }
              >
                {data.fieldNames}
              </option>
            </>
          ))
        )}
      </div>
    </div>
  );
}

Table.propTypes = {
  tableFields: PropTypes.array,
  selectedTableName: PropTypes.string,
  fieldDisplayNameSelectedValue: PropTypes.string,
  onClickBackBtn: PropTypes.func,
  onClickField: PropTypes.func,
};

export default Table;
