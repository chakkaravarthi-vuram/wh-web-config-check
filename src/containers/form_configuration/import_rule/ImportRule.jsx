import { BorderRadiusVariant, Button, EButtonType, Input, Modal, ModalStyleType, ModalSize, TableColumnWidthVariant, TableScrollType, Table } from '@workhall-pvt-lmt/wh-ui-library';
import React, { useCallback } from 'react';
import cx from 'classnames/bind';
import modalStyles from 'components/form_components/modal_layout/CustomClasses.module.scss';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styles from '../field_value/FieldValue.module.scss';
import gClasses from '../../../scss/Typography.module.scss';
import { BS } from '../../../utils/UIConstants';
import { constructTableData, constructTableHeader } from './ImportRule.utils';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import SearchIconNew from '../../../assets/icons/SearchIconNew';
import CloseIconV2 from '../../../assets/icons/CloseIconV2';
import { getRulesListThunk, importRulesApiThunk } from '../../../redux/actions/Visibility.Action';
import useImportRule from './useImportRule';
import { isEmpty } from '../../../utils/jsUtility';
import { STEP_TYPE } from '../../../utils/Constants';
import { FIELD_DEFAULT_VALUE_STRINGS } from '../field_value/FieldValueRule.strings';

function ImportRule(props) {
  const {
    ruleType,
    flowId,
    formId,
    formUUID,
    getRuleList,
    onClose,
    onImport,
    flowData: { steps = [] },
  } = props;

  const getMetadata = () => {
     return {
       flow_id: flowId,
       rule_type: ruleType,
       current_form_uuid: formUUID,
     };
  };
  const consolidatedStepsList = steps.filter((step) => step.form_uuid && step.form_uuid !== formUUID && step.step_type === STEP_TYPE.USER_STEP);
  const {
    state: {
      ruleList,
      selectedRuleIds,
      searchStep,
      // searchRule: EMPTY_STRING,
      stepOptionList,
      selectedStep,
    },
    onStepClick,
    onSelectRule,
    onSelectAllRule,
    // onSearchRule,
    onSearchStep,
  } = useImportRule(consolidatedStepsList, getRuleList, getMetadata);
  const { t } = useTranslation();
  const { MODAL, LISTING } = FIELD_DEFAULT_VALUE_STRINGS(t);

  const isRuleSelected = (id) => {
    if (selectedRuleIds.includes(id)) return true;
    else return false;
  };

  const isAllRuleSelected = useCallback(() => {
    if (isEmpty(ruleList)) return false;
    return ruleList.every((rule) => (rule?.form_uuids || []).includes(formUUID) || selectedRuleIds.includes(rule?._id));
  }, [JSON.stringify(ruleList), selectedRuleIds]);

  const onImportClicked = () => {
    const params = {
      flow_id: flowId,
      current_form_id: formId,
      rule_ids: selectedRuleIds,
    };
    importRulesApiThunk(params, () => {
      onImport?.();
    });
  };
  const onCancelClicked = () => onClose();

  const getHeaderContent = () => (
    <div className={styles.HeaderTitle}>
      <div>{LISTING.NO_RULE.IMPORT_EXISTING_CONFIG}</div>
      <CloseIconV2
        className={styles.CloseIcon}
        onClick={onClose}
      />
    </div>
  );

  const getModalContent = () => (
    <div className={cx(BS.D_FLEX, styles.ImportedModalContent)}>
      <div className={cx(styles.SideBar, gClasses.P16)}>
          <Input
            className={cx(styles.SearchInput)}
            prefixIcon={<SearchIconNew className={styles.SearchStepIcon} />}
            content={searchStep}
            placeholder={MODAL.SEARCH_STEP}
            onChange={onSearchStep}
            borderRadiusType={BorderRadiusVariant.rounded}
          />
          <div
            className={cx(
              BS.D_FLEX,
              BS.FLEX_COLUMN,
              styles.StepTabContainer,
              gClasses.MT16,
            )}
          >
            {stepOptionList.map((item) => (
              <button
                onClick={() => onStepClick(item.value)}
                className={cx(
                  gClasses.CenterV,
                  BS.JC_START,
                  styles.StepTab,
                  (item.value === selectedStep) && styles.SelectedStep,
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
      </div>
      <div className={cx(styles.ImportTableConatiner, gClasses.P24)}>
        <Table
          className={styles.OverFlowInherit}
          tableClassName={styles.ImportTable}
          header={constructTableHeader(ruleType, isAllRuleSelected(), onSelectAllRule, formUUID, t)}
          data={constructTableData(ruleType, ruleList, formUUID, isRuleSelected, t)}
          isRowClickable
          onRowClick={(id) => onSelectRule(id, formUUID)}
          scrollType={TableScrollType.BODY_SCROLL}
          widthVariant={TableColumnWidthVariant.CUSTOM}
        />
      </div>
    </div>
  );

  const getFooterButtons = () => (
    <div className={cx(BS.W100, BS.D_FLEX, BS.JC_END, BS.ALIGN_ITEM_CENTER)}>
        <Button
          buttonText={MODAL.CANCEL}
          id="cancel-import"
          className={cx(modalStyles.SecondaryButton, gClasses.MR24, gClasses.P0)}
          type={EMPTY_STRING}
          onClick={onCancelClicked}
        />

        <Button
          buttonText={MODAL.IMPORT}
          type={EButtonType.PRIMARY}
          id="import_rule"
          onClick={onImportClicked}
        />
    </div>
  );

  return (
    <Modal
      id="import_rule"
      isModalOpen
      modalStyle={ModalStyleType.modal}
      customModalClass={styles.ModalContainerClass}
      className={styles.AppBasicDetailsModal}
      modalSize={ModalSize.lg}
      headerContent={getHeaderContent()}
      headerContentClassName={styles.ModalLayoutHeader}
      mainContent={getModalContent()}
      mainContentClassName={styles.ModalLayoutContent}
      footerContentClassName={cx(styles.ModalFooterClass)}
      footerContent={getFooterButtons()}
    />
    );
}

const mapDispatchToProps = () => {
 return {
    getRuleList: (params, onSuccess) => getRulesListThunk(params, onSuccess),
  };
};

const mapStateToProps = (state) => {
 return {
    flowData: state.EditFlowReducer.flowData,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ImportRule);
