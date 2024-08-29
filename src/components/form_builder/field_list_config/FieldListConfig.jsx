import React, { useEffect, useRef } from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import Tab, { TAB_TYPE } from 'components/tab/Tab';
import HelpIcon from 'assets/icons/HelpIcon';
import { BS } from 'utils/UIConstants';
import { useTranslation } from 'react-i18next';
import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import { HEADER_AND_BODY_LAYOUT } from 'components/form_components/modal/Modal.strings';
import { connect } from 'react-redux';
import { externalFieldReducerDataChange } from 'redux/actions/Visibility.Action';
import { externalFieldsDataChange } from 'redux/actions/DefaultValueRule.Action';
import BasicConfig from './basic_config/BasicConfig';
import { FIELD_CONFIG, FIELD_CONFIGS, FIELD_LIST_CONFIGS_TABS } from '../FormBuilder.strings';
import ValidationConfig from './validation_config/ValidationConfig';
import { FIELD_LIST_TYPE, FORM_FIELD_CONFIG_TYPES } from '../../../utils/constants/form.constant';
import { constructFieldListConfigErrorList } from '../../../utils/formUtils';
import Button, { BUTTON_TYPE } from '../../form_components/button/Button';
import gClasses from '../../../scss/Typography.module.scss';
import VisibilityConfigTask from '../field_config/visibility_config/VisibilityConfigTask';
import styles from './FieldListConfig.module.scss';

function FieldListConfig(props) {
  const {
    isFieldListShowWhenRule, fieldListType, configTitle, sectionIndex, fieldListIndex, onCloseClickHandler, onSaveFieldListHandler, tableName, onTableNameChangeHandler, onTableNameBlurHandler,
    onTableReferenceNameChangeHandler, tableRefName, selectedTabIndex, onTabChangeHandler, error_list, server_error, onVisibilityConfigChangeHandler, onValidationConfigChangeHandler, is_row_maximum, is_row_minimum, isPopUpOpen, currentTableUuid,
    onFieldListShowWhenRule, getRuleDetailsByIdInFieldVisibilityApi, fieldListShowWhenRule, onTableReferenceNameBlurHandler, is_visible, onFieldVisibleRule, row_maximum, row_minimum, errorList, is_unique_column_available,
    selectedField, tabelFields, add_new_row, allow_delete_existing, allow_modify_existing,
    expression,
    previous_expression,
    rule_expression_has_validation,
    clearFieldMetadata,
    clearDefaultValueExternalFields,
  } = props;
  const { t } = useTranslation();
  const headerContainerRef = useRef(null);
  const buttonContainerCompRef = useRef(null);
  const contentContainerRef = useRef(null);
  const currentComponentContainerRef = useRef(null);
  useEffect(() => () => { clearFieldMetadata(); clearDefaultValueExternalFields(); }, []);
  useEffect(() => {
    if (
      headerContainerRef.current &&
      contentContainerRef.current &&
      buttonContainerCompRef.current
    ) {
      let listHeight = 0;
      listHeight =
        contentContainerRef.current.clientHeight -
        (buttonContainerCompRef.current.clientHeight +
          headerContainerRef.current.clientHeight);
      if (currentComponentContainerRef.current) {
        currentComponentContainerRef.current.style.height = `${listHeight}px`;
      }
    }
  });
  const getFieldListTabs = () => {
    if (fieldListType === FIELD_LIST_TYPE.TABLE) {
      const constructedErrorList = constructFieldListConfigErrorList(error_list, server_error, [{ id: 'table_name', label: 'Table Name' }, { id: 'table_reference_name', label: 'Table Reference Name' }], sectionIndex, fieldListIndex);
      switch (selectedTabIndex) {
        case 1:
          return (
            <BasicConfig
              tableName={tableName}
              tableRefName={tableRefName}
              onTableNameChangeHandler={onTableNameChangeHandler}
              onTableNameBlurHandler={onTableNameBlurHandler}
              onTableReferenceNameChangeHandler={onTableReferenceNameChangeHandler}
              error_list={constructedErrorList}
              onTableReferenceNameBlurHandler={onTableReferenceNameBlurHandler}
              table_uuid={currentTableUuid}
              getRuleDetailsById={(avoidExpressionUpdate) => {
                fieldListShowWhenRule && getRuleDetailsByIdInFieldVisibilityApi(
                   fieldListShowWhenRule,
                   sectionIndex,
                   fieldListIndex,
                   undefined,
                   avoidExpressionUpdate,
                   );
                 }
              }
            />
          );
        case 2:
          return (
            <ValidationConfig
            isRowMaximumValue={is_visible}
            rowMaximumValue={onFieldVisibleRule}
            isRowMinimumValue={is_visible}
            rowMinimumValue={onFieldVisibleRule}
            onValidationChangeHandler={onValidationConfigChangeHandler}
            is_row_maximum={is_row_maximum}
            is_row_minimum={is_row_minimum}
            row_maximum={row_maximum}
            row_minimum={row_minimum}
            errorList={errorList}
            is_unique_column_available={is_unique_column_available}
            currentTableUuid={currentTableUuid}
            selectedField={selectedField}
            tabelFields={tabelFields}
            add_new_row={add_new_row}
            allow_modify_existing={allow_modify_existing}
            allow_delete_existing={allow_delete_existing}
            />
          );
        case 3:
          return (
            <VisibilityConfigTask
              serverEntityUuid="hello"
              getRuleDetailsById={(avoidExpressionUpdate) => getRuleDetailsByIdInFieldVisibilityApi(fieldListShowWhenRule, sectionIndex, fieldListIndex, undefined, avoidExpressionUpdate)}
              ruleId={fieldListShowWhenRule}
              isShowWhenRule={isFieldListShowWhenRule}
              onVisibilityChangeHandler={onVisibilityConfigChangeHandler}
              onShowWhenRule={onFieldListShowWhenRule}
              isVisible={is_visible}
              onFieldVisibleRule={onFieldVisibleRule}
              fieldType={fieldListType}
              previous_expression={previous_expression}
              expression={expression}
              rule_expression_has_validation={rule_expression_has_validation}
            />
          );
        default:
          return null;
      }
    }
    return null;
  };
  const setDefaultIndex = () => {
    onTabChangeHandler(FIELD_CONFIGS.BASIC_CONFIG.TAB_INDEX);
  };

  const header = (
    <div className={cx(styles.header)} ref={headerContainerRef}>
      <div className={cx(BS.D_FLEX, BS.FLEX_ROW, BS.JC_BETWEEN)}>
        <div className={gClasses.CenterV}>
          <div className={cx(gClasses.ModalHeader, styles.HeaderSelect)}>
            {configTitle}
          </div>
          <HelpIcon
            className={cx(gClasses.ML5)}
            title={FIELD_CONFIG(t).HEADER_TOOLTIP}
            ariaLabel="field config"
            id="fieldConfigHelp"
          />
        </div>
      </div>
      <Tab
        className={cx(gClasses.MT5)}
        tabIList={FIELD_LIST_CONFIGS_TABS(fieldListType, t)}
        setTab={onTabChangeHandler}
        selectedIndex={selectedTabIndex}
        type={TAB_TYPE.TYPE_5}
      />
    </div>
  );
  const footer = (
    <>
      <Button
        buttonType={BUTTON_TYPE.SECONDARY}
        className={cx(BS.TEXT_NO_WRAP, gClasses.MT2, styles.SecondaryButton)}
        onClick={() => onCloseClickHandler(FORM_FIELD_CONFIG_TYPES.FIELD_LIST, fieldListType, sectionIndex, fieldListIndex)}
      >
        Discard
      </Button>
      <Button
        buttonType={BUTTON_TYPE.PRIMARY}
        className={cx(
          styles.Save,
          gClasses.FTwo10,
        )}
        onClick={() => onSaveFieldListHandler(sectionIndex + 1, fieldListIndex)}
      >
        Save
      </Button>
    </>
  );
  return (
    <ModalLayout
        id="field-list-config"
        modalContainerClass={styles.ModalContainerClass}
        headerContent={header}
        headerClassName={gClasses.PB0}
        footerContent={footer}
        isModalOpen={isPopUpOpen}
        mainContent={getFieldListTabs()}
        backgroundScrollElementId={HEADER_AND_BODY_LAYOUT}
        unmountCall={setDefaultIndex}
        onCloseClick={() => onCloseClickHandler(FORM_FIELD_CONFIG_TYPES.FIELD_LIST, fieldListType, sectionIndex, fieldListIndex)}
    />
  );
}

const mapStateToProps = () => {};
const mapDispatchToProps = (dispatch) => {
  return {
    clearFieldMetadata: () => dispatch(externalFieldReducerDataChange({
      externalFields: {
        pagination_details: [],
        hasMore: false,
      },
      field_metadata: [] })),
    clearDefaultValueExternalFields: () => dispatch(externalFieldsDataChange({
        externalFields: {
          pagination_details: [],
          pagination_data: [],
        },
        field_metadata: [],
       })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FieldListConfig);
FieldListConfig.defaultProps = {
  isPopUpOpen: false,
};
FieldListConfig.propTypes = {
  isPopUpOpen: PropTypes.bool,
};
