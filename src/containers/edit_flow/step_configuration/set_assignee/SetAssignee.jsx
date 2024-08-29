import { Button, EButtonSizeType, EButtonType, ETitleSize, Label, RadioGroup, RadioGroupLayout, SingleDropdown, Text, Title } from '@workhall-pvt-lmt/wh-ui-library';
import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { set } from 'utils/jsUtility';
import { useHistory } from 'react-router-dom';
import styles from './SetAssignee.module.scss';
import gClasses from '../../../../scss/Typography.module.scss';
import PlusIconBlueNew from '../../../../assets/icons/PlusIconBlueNew';
import Table from '../../../../components/table/Table';
import { SET_ASSIGNEE_STRINGS } from './SetAssignee.strings';
import StepDueDateConfiguration from './due_date/StepDueDateConfiguration';
import { ACTORS_STRINGS, CONFIG_FIELD_KEY, DUE_DATE_AND_STATUS, FLOW_WORKFLOW_ALGORITHM, STEP_CARD_STRINGS } from '../../EditFlow.strings';
import { getRuleDetailsByIdApi } from '../../../../axios/apiService/rule.apiService';
import { getDueDateTableData, getEscalationTableData, USER_STEP_ASSIGNEE_OBJECT_KEYS } from './SetAssignee.utils';
import { deleteEscalationsThunk } from '../../../../redux/actions/FlowStepConfiguration.Action';
import jsUtility, { cloneDeep } from '../../../../utils/jsUtility';
import { updateFlowStateChange } from '../../../../redux/reducer/EditFlowReducer';
import { getDueDateValidation, getErrorMessageForDueDate } from '../StepConfiguration.utils';
import { getStepAssigneeOptionList } from '../../EditFlow.utils';
import DeleteConfirmModal from '../../../../components/delete_confirm_modal/DeleteConfirmModal';
import { MODULE_TYPES } from '../../../../utils/Constants';
import { DATA_TYPE, INITIAL_ASSIGNEE_DATA, INITIAL_RULE_BASED_ASSIGNEES_DATA } from '../StepConfiguration.constants';
import { DIGITS_REGEX } from '../../../../utils/strings/Regex';
import { FIELD_VISIBILITY_STRINGS } from '../../../form_configuration/field_visibility/FieldVisibilityRule.strings';
import { DUE_DATE_VALUE_TYPE } from '../../EditFlow.constants';
import StatusDropdown from '../node_configurations/status_dropdown/StatusDropdown';
import { FIELD_TYPE } from '../../../../utils/constants/form_fields.constant';
import RecipientsSelection from '../node_configurations/send_email/recipients_selection/RecipientsSelections';
import EmailEscalation from '../configurations/email_escalation/EmailEscalation';
import { getSystemFieldsList } from '../../node_configuration/NodeConfiguration.utils';
import { INITIAL_ESCALATION_RECIPIENTS_DATA } from '../node_configurations/send_email/SendEmailConfig.constants';
import { EMAIL_ESCALATION_STRING } from '../configurations/Configuration.strings';
import { ASSIGNEES_FLOW_SYSTEM_FIELDS, ASSIGNEES_STEP_SYSTEM_FIELDS } from '../../node_configuration/NodeConfiguration.constants';
import { FIELD_LIST_TYPE } from '../../../../utils/constants/form.constant';

function SetAssignee(props) {
  const { t } = useTranslation();
  const {
    metadata = {},
    stepDetails = {},
    assigneeSystemFields,
    allSystemFields,
    setAssigneeData,
    isNavOpen,
  } = props;
  const {
    flowId,
    stepUUID,
    formUUID,
  } = metadata;
  console.log('SetAssignee_stepdetails', stepDetails, 'props', props);
  const dispatch = useDispatch();
  const showCreateTask = useSelector((state) => state.RoleReducer.is_show_app_tasks);
  const history = useHistory();
  const { flowData } = useSelector((s) => s.EditFlowReducer);
  const { DUE_DATE, ESCALATION, SET_ASSIGNEE, CUSTOMIZED_STATUS } = SET_ASSIGNEE_STRINGS(t);
  const [showStepDueDateModal, setShowStepDueDateModal] = useState(false);
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [dueDateRuleDetail, setDueDateRuleDetail] = useState({ list: [], isLoading: false });
  const [selectedRule, setSelectedRule] = useState(null);
  const [deleteDueDateConfirmation, setDeleteDueDateConfirmation] = useState(false);
  const [deleteEscalation, setDeleteEscalation] = useState(null);
  const [isShowRadioOption, setShowRadioOption] = useState(false);

  const recipientSystemFields = getSystemFieldsList({
    allSystemFields,
    allowedSystemFields: ASSIGNEES_FLOW_SYSTEM_FIELDS,
    steps: flowData.steps,
    allowedStepSystemFields: ASSIGNEES_STEP_SYSTEM_FIELDS,
  });
  const { due_data = {} } = stepDetails || {};
  console.log('stepDetailsSetAssignee', stepDetails);
  const { DELETE } = FIELD_VISIBILITY_STRINGS(t);

  const getDueDateRuleDetails = (ruleUuid) => {
    if (ruleUuid) {
      setDueDateRuleDetail({ list: [], isLoading: true });
      getRuleDetailsByIdApi({ rule_uuid: ruleUuid, flow_id: flowId })
        .then((res = {}) => {
          const ruleDetails = res?.rule_details || {};
          setDueDateRuleDetail({ list: [ruleDetails], isLoading: false });
        })
        .catch(() => setDueDateRuleDetail({ list: [], isLoading: false }));
    }
  };

  const onStatusSelected = (value, clonedFlowData = cloneDeep(flowData)) => {
    const activeStepDetails = jsUtility.cloneDeep(stepDetails);
    activeStepDetails.step_status = value;
    dispatch(updateFlowStateChange({ activeStepDetails, flowData: clonedFlowData }));
  };

  useEffect(() => {
    if (due_data?.type === DATA_TYPE.RULE) {
      getDueDateRuleDetails(due_data?.rule_uuid);
    }
  }, []);

  const onWorkloadDataChangeHandler = (value) => {
    const activeStepDetails = cloneDeep(stepDetails);
    activeStepDetails.is_workload_assignment = value;
    dispatch(updateFlowStateChange({ activeStepDetails }));
  };

  const onDueDateValueChange = (event) => {
    let { value } = event.target;
    value = value?.replace(DIGITS_REGEX, '');
    const activeStepDetails = jsUtility.cloneDeep(stepDetails);
    activeStepDetails[DUE_DATE_AND_STATUS.DUE_DATE.ID][
      DUE_DATE.DURATION.ID
    ] = value;
    activeStepDetails[DUE_DATE_AND_STATUS.DUE_DATE.ID].type = DATA_TYPE.DIRECT;
    activeStepDetails.error_list = getDueDateValidation(
      activeStepDetails,
      t,
    );
    dispatch(updateFlowStateChange({ activeStepDetails }));
  };

  const onDueDateTypeChange = (value) => {
    const activeStepDetails = jsUtility.cloneDeep(stepDetails);
    activeStepDetails[DUE_DATE_AND_STATUS.DUE_DATE.ID].duration_type = value;
    activeStepDetails[DUE_DATE_AND_STATUS.DUE_DATE.ID].type = DATA_TYPE.DIRECT;
    activeStepDetails.error_list = getDueDateValidation(
      activeStepDetails,
      t,
    );
    dispatch(updateFlowStateChange({ activeStepDetails }));
  };

  const updateDueDateRule = (rule) => {
    setDueDateRuleDetail({ list: [rule], isLoading: false });
    const activeStepDetails = jsUtility.cloneDeep(stepDetails);
    activeStepDetails[DUE_DATE_AND_STATUS.DUE_DATE.ID].rule_uuid = rule?.rule_uuid;
    activeStepDetails[DUE_DATE_AND_STATUS.DUE_DATE.ID].type = DATA_TYPE.RULE;
    dispatch(updateFlowStateChange({ activeStepDetails }));
  };

  const onEditDueDate = (id) => {
    setSelectedRule(id);
    setShowStepDueDateModal(true);
  };

  const onEditEscalation = (escalation) => {
    const activeStepDetails = jsUtility.cloneDeep(stepDetails);
    activeStepDetails.activeEscalationUuid = escalation?.escalation_uuid;
    dispatch(updateFlowStateChange({ activeStepDetails }));
    setShowEscalationModal(true);
  };

  const onAddEscalationClick = () => {
    setShowEscalationModal(true);
    const activeStepDetails = jsUtility.cloneDeep(stepDetails);
    activeStepDetails.active_escalation = {
      escalation_type: EMAIL_ESCALATION_STRING.FORM_DETAILS.ESCALATION_TYPE.VALUE,
      escalation_recipients: INITIAL_ESCALATION_RECIPIENTS_DATA,
      escalation_due: { duration_type: DUE_DATE_AND_STATUS.DUE_DATE.OPTIONS[0].value, duration: '' },
    };
    dispatch(updateFlowStateChange({ activeStepDetails }));
  };

  const closeEscalationModal = () => {
    setShowEscalationModal(false);
  };

  const removeDeletedEscalation = ({ escalation_uuid }) => {
    const activeStepDetails = cloneDeep(stepDetails);
    const { escalations = [] } = activeStepDetails;
    const deletedIndex = escalations?.findIndex((escalation) => escalation.escalation_uuid === escalation_uuid);
    escalations.splice(deletedIndex, 1);
    set(activeStepDetails, ['escalations'], escalations);
    dispatch(updateFlowStateChange({ activeStepDetails }));
  };

  const onDeleteEscalation = (escalation) => {
    const activeStepDetails = cloneDeep(stepDetails);
    const params = {
      _id: activeStepDetails._id,
      step_uuid: activeStepDetails.step_uuid,
      flow_id: flowData.flow_id,
      escalation_uuid: escalation.escalation_uuid,
    };

    const data = {
      onDelete: () => {
        dispatch(deleteEscalationsThunk(params, removeDeletedEscalation));
        setDeleteEscalation(null);
      },
      onCancel: () => setDeleteEscalation(null),
      onClose: () => setDeleteEscalation(null),
      title: ESCALATION.DELETE_ESCALATION,
      subText1: ESCALATION.DELETE_ESCALATION_SUB_TEXT_1,
    };

    setDeleteEscalation(data);
  };

  const removeDueDateRuleConfirmation = () => {
    setDeleteDueDateConfirmation(true);
  };

  const removeDueDateRule = () => {
    const activeStepDetails = jsUtility.cloneDeep(stepDetails);
    activeStepDetails[DUE_DATE_AND_STATUS.DUE_DATE.ID] = {
      [CONFIG_FIELD_KEY.DURATION]: null,
      [CONFIG_FIELD_KEY.DURATION_TYPE]: DUE_DATE_VALUE_TYPE.DAYS,
      [CONFIG_FIELD_KEY.TYPE]: DATA_TYPE.DIRECT,
    };
    dispatch(updateFlowStateChange({ activeStepDetails }));
    setDeleteDueDateConfirmation(false);
    setDueDateRuleDetail({ list: [], isLoading: false });
  };

  const escalationErrorRowIndices = [];
  Object.keys(stepDetails?.escalationErrorList || {}).forEach((key) => {
    escalationErrorRowIndices.push(Number(key));
  });

  const onChangeClickHandler = () => {
    setShowRadioOption(true);
  };

  return (
    <div className={styles.Container}>
      {showStepDueDateModal && (
        <StepDueDateConfiguration
          metaData={{
            moduleId: flowId,
            formUUID: formUUID,
            stepUUID: stepUUID,
            ruleId: selectedRule,
          }}
          ruleUUID={due_data?.rule_uuid}
          moduleType={MODULE_TYPES.FLOW}
          onClose={() => setShowStepDueDateModal(false)}
          onSave={updateDueDateRule}
          stepDetails={{ step_name: stepDetails.step_name }}
        />
      )}

      {
        showEscalationModal && (
          <EmailEscalation
            stepData={stepDetails}
            flowData={flowData}
            closeEscalationModal={closeEscalationModal}
            recipientSystemFields={recipientSystemFields}
          />
        )}

      {
        deleteDueDateConfirmation && (
          <DeleteConfirmModal
            onDelete={removeDueDateRule}
            onCancel={() => setDeleteDueDateConfirmation(false)}
            onClose={() => setDeleteDueDateConfirmation(false)}
            title={DELETE.DELETE_MODAL_TITLE}
            subText1={DELETE.DELETE_MODAL_SUB_TITLE_FIRST}
            subText2={DELETE.DELETE_MODAL_SUB_TITLE_SECOND}
            isModalOpen
          />
        )}

      {deleteEscalation && (
        <DeleteConfirmModal
          onDelete={deleteEscalation.onDelete}
          onCancel={deleteEscalation.onCancel}
          onClose={deleteEscalation.onClose}
          title={deleteEscalation.title}
          subText1={deleteEscalation.subText1}
          subText2={deleteEscalation.subText2}
          isModalOpen
        />
      )}

      <div className={cx(gClasses.MB24)}>
        <Title
          content={SET_ASSIGNEE.TITLE}
          size={ETitleSize.xs}
          className={gClasses.MB16}
        />
        {stepDetails && (
          <>
            <RecipientsSelection
              id="assignees"
              key="assignees"
              dropdownClassInsideRule={styles.RuleDropdownClass}
              fieldDropdownClass={styles.FormFieldDropdown}
              labelText={SET_ASSIGNEE.CHOOSE_ACTOR_LABEL}
              isNavOpen={isNavOpen}
              containerStyles={cx(isNavOpen ? styles.ContainerStyle2 : styles.ContainerStyle1)}
              required
              // recipientsCancelToken={recipientsCancelToken}
              objectKeys={USER_STEP_ASSIGNEE_OBJECT_KEYS}
              defaultApiParams={{
                sort_by: 1,
                flow_id: flowData?.flow_id,
                field_list_type: FIELD_LIST_TYPE.DIRECT,
                allowed_field_types: [FIELD_TYPE.USER_TEAM_PICKER],
                include_property_picker: 1,
              }}
              metaData={{
                moduleId: flowId,
                stepUUID: stepUUID,
              }}
              typeOptionsList={getStepAssigneeOptionList(t)}
              updateRecipientsData={setAssigneeData}
              systemFieldListInitial={assigneeSystemFields}
              errorList={stepDetails?.[`${USER_STEP_ASSIGNEE_OBJECT_KEYS.parentKey}ErrorList`]}
              recipientsData={stepDetails.step_assignees}
              initialAssigneeData={INITIAL_ASSIGNEE_DATA}
              ruleBasedRecipientInitData={INITIAL_RULE_BASED_ASSIGNEES_DATA}
            />
            <Text
              content={t(ACTORS_STRINGS.SET_ASSIGNMENT)}
              className={cx(gClasses.MT16, styles.FieldLabel)}
            />
            <div
              className={cx(
                gClasses.MT6,
                gClasses.DisplayFlex,
              )}
            >
              {
                !isShowRadioOption && (
                  <>
                    <Text
                      content={stepDetails.is_workload_assignment ?
                        FLOW_WORKFLOW_ALGORITHM.OPTION_LIST(t)[1].label :
                        FLOW_WORKFLOW_ALGORITHM.OPTION_LIST(t)[0].label}
                      className={cx(gClasses.FTwo13GrayV3, gClasses.MY_AUTO)}
                    />
                    <Button
                      size={EButtonSizeType.MD}
                      buttonText={STEP_CARD_STRINGS(t).CHANGE_BUTTON}
                      onClickHandler={onChangeClickHandler}
                      noBorder
                      type={EButtonType.OUTLINE_SECONDARY}
                      className={cx(styles.ChangeTextClass, gClasses.ML4)}
                    />
                  </>
                )
              }
            </div>
            {isShowRadioOption && (
              <RadioGroup
                hideLabel
                className={gClasses.MT6}
                options={FLOW_WORKFLOW_ALGORITHM.OPTION_LIST(t)}
                layout={RadioGroupLayout.stack}
                onChange={(_event, _id, value) => {
                  onWorkloadDataChangeHandler(value !== 0);
                }}
                selectedValue={stepDetails.is_workload_assignment ?
                  FLOW_WORKFLOW_ALGORITHM.OPTION_LIST(t)[1].value :
                  FLOW_WORKFLOW_ALGORITHM.OPTION_LIST(t)[0].value
                }
              />
            )}
          </>
        )}
      </div>

      <div className={cx(gClasses.MB24)}>
        <Title
          content={DUE_DATE.TITLE}
          size={ETitleSize.xs}
          className={gClasses.MB8}
        />
        <Label
          labelName={DUE_DATE.SUB_TEXT}
          className={cx(gClasses.MB6, gClasses.DisplayFlex)}
          innerLabelClass={cx(gClasses.Margin0, styles.FieldLabel)}
        />
        {dueDateRuleDetail.list.length === 0 && (
          <>
            <div className={cx(styles.DueDate, gClasses.MB8)}>
              <input
                id={DUE_DATE.DURATION.ID}
                className={styles.DueDateInput}
                placeholder="000"
                onChange={onDueDateValueChange}
                value={due_data.duration}
                autoComplete="off"
              />
              <SingleDropdown
                id={DUE_DATE.DURATION_TYPE.ID}
                className={styles.DueDateDropdown}
                dropdownViewProps={{
                  className: gClasses.BorderNone,
                }}
                onClick={onDueDateTypeChange}
                selectedValue={due_data.duration_type}
                popperClassName={styles.DueDateDropdown}
                optionList={DUE_DATE.DURATION_TYPE.OPTIONS}
              />
            </div>
            <p className={styles.DueDataError}>
              {getErrorMessageForDueDate(stepDetails.error_list)}
            </p>
            <button
              className={cx(styles.BlueIconButton, gClasses.MT16)}
              onClick={() => setShowStepDueDateModal(true)}
            >
              <PlusIconBlueNew />
              {DUE_DATE.SET_CONFIGURATION_RULE}
            </button>
          </>
        )}

        {(dueDateRuleDetail.isLoading ||
          (!dueDateRuleDetail.isLoading && dueDateRuleDetail.list.length !== 0)) && (
            <Table
              className={styles.Table}
              header={DUE_DATE.TABLE_HEADER}
              data={getDueDateTableData(
                dueDateRuleDetail.list,
                onEditDueDate,
                removeDueDateRuleConfirmation,
              )}
              loaderColCount={3}
              loaderRowCount={1}
              isDataLoading={dueDateRuleDetail.isLoading}
            />
          )}
      </div>

      <div className={cx(gClasses.MB24)}>
        <StatusDropdown
          selectedValue={stepDetails?.step_status}
          onClickHandler={onStatusSelected}
          contentTitle={CUSTOMIZED_STATUS.TITLE}
          isContentSubTitleNotNeeded
          doNotUpdateStatus
          hideStepName
        />
      </div>

      <div className={cx(gClasses.MB24)}>
        <Title
          content={ESCALATION.TITLE}
          size={ETitleSize.xs}
          className={gClasses.MB8}
        />
        <Label labelName={ESCALATION.SUB_TEXT} className={cx(gClasses.MB8)} />
        {
          (stepDetails.escalations?.length > 0) &&
          (
            <Table
              className={styles.Table}
              header={ESCALATION.TABLE_HEADER}
              data={getEscalationTableData(
                stepDetails.escalations,
                onEditEscalation,
                onDeleteEscalation,
                history,
                showCreateTask,
              )}
              loaderColCount={3}
              loaderRowCount={1}
              errorRowIndices={escalationErrorRowIndices}
            />
          )}

        <button
          className={cx(styles.BlueIconButton, gClasses.MT16)}
          onClick={onAddEscalationClick}
        >
          <PlusIconBlueNew />
          {ESCALATION.ADD_ESCALATION}
        </button>
      </div>
    </div>
  );
}

export default SetAssignee;
