import React from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import { cloneDeep, isEmpty } from 'utils/jsUtility';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { Table } from '@workhall-pvt-lmt/wh-ui-library';
import styles from './MappingTable.module.scss';
import { INTEGRATION_STRINGS, isAllRowsDeleted } from '../Integration.utils';
import Plus from '../../../assets/icons/configuration_rule_builder/Plus';

function MappingTable(props) {
  const {
    tblHeaders = [],
    mappingList = [],
    handleMappingChange,
    initialRow,
    innerTableClass,
    mappingKey,
    initialRowKeyValue,
    noAddRow = false,
    error_list = {},
    headerRowClass,
    outerClass,
    headerStyles = [],
    headerClassName,
    tableRowClass,
    addRowClass,
    addKeyLabel,
    isTableUI,
    tableClassName,
  } = props;

  const { t } = useTranslation();

  const { ADD_MORE, ADD_KEY, ADD_EVENT } = INTEGRATION_STRINGS;

  console.log('tblHeaderstblHeaders', tblHeaders, isTableUI);
  let tableHeaders = tblHeaders;

  if (!isTableUI) {
    tableHeaders = tblHeaders?.map((eachHeader, index) => (
      <div className={cx(styles.Header, gClasses.LabelStyle, headerStyles[index], headerClassName)}>
        {eachHeader}
      </div>
    ));
  }

  const constructTableMappingFields = () => {
    const mappedFieldList = [];
    const clonedMappingList = cloneDeep(mappingList);

    const duplicateKeyIndex = (clonedMappingList || []).findIndex(
      (_, index) =>
        error_list[`${mappingKey},${index}`] &&
        error_list[`${mappingKey},${index}`].includes('duplicate value'),
    );
    let duplicateKeyRow = {};

    if (duplicateKeyIndex !== -1) {
      duplicateKeyRow = (clonedMappingList || [])[duplicateKeyIndex];
    }

    if (!isEmpty(clonedMappingList)) {
      clonedMappingList?.map((currentRow, index) => {
        if (initialRow && !currentRow?.is_deleted) {
          const isDuplicateKeyError = (duplicateKeyIndex > -1) && currentRow?.key === duplicateKeyRow?.key;
          const fieldList = initialRow(
            index,
            mappingKey,
            isDuplicateKeyError,
            duplicateKeyIndex,
          );

          const currentRowComponent = isTableUI ? fieldList : <li className={cx(BS.D_FLEX, tableRowClass)}>{fieldList}</li>;

          mappedFieldList.push(currentRowComponent);
        }
        return null;
      });
    }

    return mappedFieldList;
  };

  const handleAddMore = () => {
    const clonedList = cloneDeep(mappingList) || [];
    if (initialRowKeyValue) {
      clonedList.push({
        ...initialRowKeyValue,
      });
    }
    if (handleMappingChange) handleMappingChange(clonedList, mappingKey);
  };

  let currentComponent = null;

  if (isTableUI) {
    currentComponent = !isAllRowsDeleted(mappingList) && (
      <Table
        header={tableHeaders}
        data={constructTableMappingFields()}
        className={cx(tableClassName, gClasses.MT17)}
      />
    );
  } else {
    currentComponent = !isAllRowsDeleted(mappingList) && (
      <ul className={innerTableClass}>
        <li className={cx(BS.D_FLEX, headerRowClass)}>{tableHeaders}</li>
        {constructTableMappingFields(mappingList)}
      </ul>
    );
  }

  return (
    <div className={cx(outerClass)}>
      {currentComponent}
      {!noAddRow && (
        <div
          tabIndex={0}
          role="button"
          className={cx(
            BS.D_FLEX,
            BS.ALIGN_ITEM_CENTER,
            gClasses.MT12,
            addRowClass,
            isAllRowsDeleted(mappingList) && gClasses.MT12,
          )}
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && handleAddMore(e)}
          onClick={handleAddMore}
        >
          <Plus />
          <span className={cx(styles.AddMoreText, gClasses.FTwo13, gClasses.ML8, gClasses.FontWeight500)}>
            {addKeyLabel ||
              (mappingKey === ADD_EVENT.QUERY_PARAMS.ID
                ? t(ADD_KEY)
                : t(ADD_MORE))}
          </span>
        </div>
      )}
    </div>
  );
}

export default MappingTable;
