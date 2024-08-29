import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import AddIcon from 'assets/icons/AddIcon';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { BS } from 'utils/UIConstants';
import jsUtility from 'utils/jsUtility';
import { useTranslation } from 'react-i18next';
import styles from './RecursiveMappingTable.module.scss';
import {
  getRecursiveTableUINew,
  isAllChildDeleted,
} from './RecursiveMappingTable.utils';
import { INTEGRATION_STRINGS } from '../Integration.utils';

function RecursiveMappingTable(props) {
  const {
    request_body = [],
    headers = [],
    handleAddRow,
    RowComponent,
    onChangeHandlers,
    error_list,
    isExternalIntegration,
    helperMessageClass,
    showAddMore = true,
    maxDepth = 3,
    childKey = 'child_rows',
    headerStyles = [],
    innerRowClass,
    isMLIntegration,
  } = props;
  const { t } = useTranslation();

  const { ADD_EVENT } = INTEGRATION_STRINGS;
  const tableHeaders =
    headers &&
    headers.map((eachHeader, index) => (
      <div className={cx(styles.Header, gClasses.LabelStyle, headerStyles[index], isMLIntegration && gClasses.PL0)}>{eachHeader}</div>
    ));
  return (
    <>
      <ul className={cx(styles.MappingList)}>
        <li className={cx(styles.HeaderRow, BS.D_FLEX)}>{tableHeaders}</li>
        {getRecursiveTableUINew(
          request_body,
          RowComponent,
          onChangeHandlers,
          {},
          error_list,
          0,
          isExternalIntegration,
          showAddMore,
          maxDepth,
          childKey,
          innerRowClass,
          helperMessageClass,
          t,
          isMLIntegration,
        )}
      </ul>
      {!isExternalIntegration && showAddMore && (
        <div
          role="button"
          tabIndex="0"
          onClick={() => handleAddRow()}
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && handleAddRow(e)}
          className={cx(
            styles.ButtonContainer,
            (jsUtility.isEmpty(request_body) || isAllChildDeleted(request_body)) &&
              gClasses.MT12,
          )}
        >
          <AddIcon className={cx(gClasses.MR3, styles.AddIcon)} />
          <span className={styles.AddShortcut}>{t(ADD_EVENT.ADD_KEY)}</span>
        </div>
      )}
    </>
  );
}

export default RecursiveMappingTable;
