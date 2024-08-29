import { DropdownList, EPopperPlacements, NestedDropdown, Size, Text } from '@workhall-pvt-lmt/wh-ui-library';
import React from 'react';
import cx from 'classnames';
import LeftIcon from 'assets/icons/LeftIcon';
import { useTranslation } from 'react-i18next';
import gClasses from '../../../scss/Typography.module.scss';
import styles from './LField.module.scss';
import { FIELD_TYPES } from '../../../containers/form/sections/field_configuration/FieldConfiguration.strings';
import { cloneDeep, isEmpty } from '../../../utils/jsUtility';
import QUERY_BUILDER from '../../condition_builder/ConditionBuilder.strings';

function LField(props) {
  const {
    selectedField,
    selectedTable,
    optionList,
    allFields,
    errorMessage,
    onChange,
  } = props;
  const { t } = useTranslation();

  const onOpen = (options) => {
    if (selectedField.table_uuid) {
        options?.setView(2);
    }
  };

  const getInitialView = (onNextView, onClose) => (
    <div>
      <DropdownList
        optionList={optionList}
        selectedValue={selectedTable?.value || selectedField?.value}
        onClick={(value) => {
            onChange(value);
            const field = allFields[value];
            if (field.field_type === FIELD_TYPES.TABLE) onNextView();
            else onClose();
        }}
        searchProps={{ searchPlaceholder: t('common_strings.search') }}
      />
    </div>
  );

  const getTableColumnsView = (onPreviousView, onClose) => {
    const onBack = () => {
        onPreviousView();
    };
    return (
      <div className={styles.TableColumnsView}>
        <button
            className={cx(
                styles.BackBtn,
                gClasses.CenterV,
                gClasses.PX16,
                gClasses.PT16,
            )}
            onClick={onBack}
        >
            <LeftIcon className={gClasses.MR10} />
            {selectedTable?.table_name}
        </button>
        <DropdownList
          className={styles.DropdownList}
          optionList={cloneDeep(selectedTable.columns)}
          selectedValue={selectedField?.value}
          onClick={(value) => {
            onChange(value);
            onClose();
          }}
        searchProps={{ searchPlaceholder: t('common_strings.search') }}
        />
      </div>
    );
  };

  return (
    <NestedDropdown
      displayText=""
      totalViews={2}
      onOpen={onOpen}
      popperPlacement={EPopperPlacements.BOTTOM_END}
      dropdownViewProps={{
        size: Size.md,
        customDropdownView: (
          <div className={gClasses.W100}>
            <Text
              content={selectedField?.label || t(QUERY_BUILDER.ALL_LABELS.CHOOSE_A_FIELD)}
              className={cx(gClasses.TextAlignLeft, { [styles.Placeholder]: isEmpty(selectedField?.label) })}
            />
          </div>
        ),
      }}
      errorMessage={errorMessage}
    >
      {({ close, view, nextView: onNextView, prevView: onPreviousView }) => {
        switch (view) {
          case 1: // Direct Fields
            return getInitialView(onNextView, close);
          case 2: // Table Fields
            return getTableColumnsView(onPreviousView, close);
          default:
            return null;
        }
      }}
    </NestedDropdown>
  );
}

export default LField;
