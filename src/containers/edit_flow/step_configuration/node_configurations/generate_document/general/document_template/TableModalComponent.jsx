import React, { useState } from 'react';
import cx from 'classnames/bind';
import { cloneDeep, compact, isEmpty } from 'utils/jsUtility';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import { BS } from 'utils/UIConstants';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import CheckboxGroup from 'components/form_components/checkbox_group/CheckboxGroup';
import { FORM_POPOVER_STATUS } from 'utils/Constants';
import styles from './DocumentTemplate.module.scss';
import {
  getTableFields,
} from './DocumentTemplate.utils';
import { COLUMN_SELECTION_MAXIUMUM_LIMIT } from './DocumentTemplate.constants';
import { GENERATE_DOCUMENT_STEP_CONFIGURATION_STRINGS } from '../../GenerateDocument.strings';
import { showToastPopover } from '../../../../../../../utils/UtilityFunctions';

function TableModalComponent(props) {
  const {
    isModalOpen,
    onCloseClick,
    onInsertTableClick,
    currentTable,
    isTableInsertDisabled,
  } = props;

  const { t } = useTranslation();
  const [selectedValues, setSelectedValue] = useState([]);

  const { TABLE } = GENERATE_DOCUMENT_STEP_CONFIGURATION_STRINGS(t).GENERAL.TEMPLATE;

  const handleInsertClick = () => {
    if (selectedValues.length > COLUMN_SELECTION_MAXIUMUM_LIMIT) {
      showToastPopover(
        TABLE.POP_OVER_STRINGS.TITLE,
        TABLE.POP_OVER_STRINGS.SUBTITLE,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    } else {
      try {
        if (currentTable && currentTable.fields) {
          const selectedColumns = selectedValues.map((columnId) =>
            currentTable.fields.find((field) => field.fieldUuid === columnId),
          );
          onInsertTableClick(currentTable, compact(selectedColumns));
          setSelectedValue([]);
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleModalClose = () => {
    setSelectedValue([]);
    onCloseClick();
  };

  let mainComponent = null;

  const onTableColumnClick = (value) => {
    let prevValues = cloneDeep(selectedValues);
    if (prevValues && prevValues.includes(value)) {
      prevValues = prevValues.filter((currValue) => currValue !== value);
    } else {
      prevValues.push(value);
    }
    setSelectedValue(prevValues);
  };

  if (isTableInsertDisabled) {
    mainComponent = (
      <span>{t(TABLE.INSIDE_TABLE_TEXT)}</span>
    );
  } else if (currentTable && currentTable.fields) {
    mainComponent = (
      <>
        {currentTable.fields.length > 1 && (
          <div className={gClasses.FOne13GrayV2}>
            <div className={gClasses.FieldName}>
              {t(TABLE.SELECT_TABLE_COLUMNS)}
            </div>
          </div>
        )}
        <CheckboxGroup
          optionList={getTableFields(currentTable.fields)}
          innerClassName={BS.FLEX_COLUMN}
          checkboxViewClassName={gClasses.PB10}
          id="table-columns"
          onClick={onTableColumnClick}
          selectedValues={selectedValues}
          className={gClasses.MT10}
          hideLabel
        />
      </>
    );
  } else {
    // do nothing
  }

  return (
    <div>
      <ModalLayout
        id="table_generation_modal"
        isModalOpen={isModalOpen}
        onCloseClick={handleModalClose}
        headerClassName={styles.TableGenModalHeader}
        closeIconClass={styles.TableGenClose}
        centerVH
        mainContentClassName={styles.TableGenModalContent}
        modalContainerClass={styles.TableGenModalContainer}
        headerContent={
          <div
            className={cx(
              styles.TableGenHeader,
              BS.JC_BETWEEN,
              BS.ALIGN_ITEM_CENTER,
              BS.D_FLEX,
            )}
          >
            <div className={cx(gClasses.FTwo20GrayV3, gClasses.FontWeight500)}>
              {t(TABLE.SELECT_COLUMNS)}
            </div>
          </div>
        }
        mainContent={<div>{mainComponent}</div>}
        footerClassName={styles.TableGenFooter}
        footerContent={
          <div
            className={cx(
              styles.ButtonContainer,
              BS.W100,
              BS.D_FLEX,
              BS.JC_END,
              BS.W100,
              styles.ForTableGen,
            )}
          >
            <div className={gClasses.CenterV}>
              <Button
                buttonType={BUTTON_TYPE.LIGHT}
                className={cx(BS.TEXT_NO_WRAP)}
                onClick={handleModalClose}
              >
                {t(TABLE.CANCEL)}
              </Button>
            </div>
            <div className={gClasses.CenterV}>
              <Button
                buttonType={BUTTON_TYPE.PRIMARY}
                className={cx(BS.TEXT_NO_WRAP)}
                onClick={handleInsertClick}
                disabled={isEmpty(selectedValues)}
              >
                {t(TABLE.INSERT_TABLE)}
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
}

export default TableModalComponent;
