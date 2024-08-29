import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { useDispatch } from 'react-redux';
import gClasses from 'scss/Typography.module.scss';
import { validate } from 'utils/UtilityFunctions';
import { useTranslation } from 'react-i18next';
import {
  isEmpty,
  cloneDeep,
  set,
  get,
} from 'utils/jsUtility';
import { Button, EButtonType, ETitleSize, Modal, ModalSize, SingleDropdown, Text, TextInput, Title, Variant } from '@workhall-pvt-lmt/wh-ui-library';
import {
  DUE_DATE_AND_STATUS,
  EMAIL_ESCALATION_STRING,
  CONFIG_FIELD_KEY,
  MODAL_ACTION_BUTTON,
} from '../Configuration.strings';
import styles from './EmailEscalation.module.scss';
import { getEmailEscalationPostData, getErrorMessageForDueDate } from '../Configuration.utils';
import { constructDueDateData } from '../../StepConfiguration.utils';
import { constructEscalationValidationData, dueDateValidationSchema, emailEscalationValidationSchema } from '../../StepConfiguration.validations';
import { generateEventTargetObject } from '../../../../../utils/generatorUtils';
import { ARIA_ROLES, INPUT_TYPES } from '../../../../../utils/UIConstants';
import { updateFlowStateChange } from '../../../../../redux/reducer/EditFlowReducer';
import RecipientsSelection from '../../node_configurations/send_email/recipients_selection/RecipientsSelections';
import { ESCALATION_RECIPIENT_OBJECT_KEYS, INITIAL_ESCALATION_RECIPIENTS_DATA, INITIAL_ESCALATION_RULE_BASED_RECIPIENTS_DATA } from '../../node_configurations/send_email/SendEmailConfig.constants';
import { CancelToken, keydownOrKeypessEnterHandle } from '../../../../../utils/UtilityFunctions';
import { getAssigneesData, updateLoaderStatus, validateAssigneesData } from '../../../node_configuration/NodeConfiguration.utils';
import { RECIPIENTS_TYPE_OPTIONS } from '../../node_configurations/send_email/SendEmailConfig.string';
import { ESCALATION_STRINGS } from './EmailEscalation.strings';
import CloseIcon from '../../../../../assets/icons/CloseIcon';
import { saveEscalationsThunk } from '../../../../../redux/actions/FlowStepConfiguration.Action';
import { FIELD_LIST_TYPE, FIELD_TYPE } from '../../../../../utils/constants/form.constant';
import { getEscalationsApi } from '../../../../../axios/apiService/rule.apiService';
import { displayErrorToast } from '../../../../../utils/flowErrorUtils';

const escalationRecipientsCancelToken = new CancelToken();
const ruleBasedEscalationRecipientsCancelToken = new CancelToken();

function EmailEscalation(props) {
  const [isLoadingDetails, setLoadingDetails] = useState(false);
  const [isErrorInEscalation, setErrorStatus] = useState(false);
  const { stepData, flowData, closeEscalationModal, recipientSystemFields } = props;
  const { active_escalation = {}, activeEscalationUuid } = stepData;
  const recipients = active_escalation.escalation_recipients || [];
  const { escalation_due = {} } = active_escalation;

  const { t } = useTranslation();
  const dispatch = useDispatch();

  let due_date_error = '';
  if (!isEmpty(stepData.escalation_error_list)) {
    due_date_error = getErrorMessageForDueDate(stepData.escalation_error_list, true);
  }

  const getEscalationDetails = async () => {
    if (activeEscalationUuid) {
      setLoadingDetails(true);
      updateLoaderStatus(true);
      setErrorStatus(false);
      try {
        const response = await getEscalationsApi({
          step_id: stepData?._id,
          flow_id: flowData.flow_id,
          escalation_uuid: activeEscalationUuid,
        });
        setLoadingDetails(false);
        updateLoaderStatus(false);
        const activeStepDetails = cloneDeep(stepData);
        const activeEscalation = cloneDeep(response.flow_step?.escalations || {});
        activeEscalation.escalation_recipients = getAssigneesData(
          activeEscalation?.escalation_recipients,
          response?.field_metadata,
          recipientSystemFields,
          ESCALATION_RECIPIENT_OBJECT_KEYS,
        );
        activeStepDetails.active_escalation = cloneDeep(activeEscalation);
        dispatch(updateFlowStateChange({ activeStepDetails }));
        console.log('fetching escalation details', response);
      } catch (error) {
        updateLoaderStatus(false);
        setLoadingDetails(false);
        setErrorStatus(true);
        displayErrorToast({ title: 'Something went wrong' });
        console.log('Error in fetching escalation details', error);
      }
    }
  };

  useEffect(() => {
    getEscalationDetails();
  }, []);

  const getDueDateOnlyValidation = (activeStepDetails) => {
    const escalation_due_data = activeStepDetails.active_escalation.escalation_due || {};
    const error_list = validate(constructDueDateData(escalation_due_data) || {}, dueDateValidationSchema(t));
    if (isEmpty(error_list) && activeStepDetails.escalation_error_list) {
      Object.keys(activeStepDetails.escalation_error_list).forEach((errorKey) => {
        if (errorKey.includes('escalation_due') || errorKey.includes('duration')) {
          delete activeStepDetails.escalation_error_list[errorKey];
        }
      });
    }
    const consolidated_error_list = (isEmpty(activeStepDetails.escalation_error_list) && isEmpty(error_list)) ? {} : { ...(activeStepDetails.escalation_error_list || {}), ...(error_list || {}) };
    return consolidated_error_list;
  };

  const onChangeHandler = (event) => {
    const { id, value } = event.target;
    const activeStepDetails = cloneDeep(stepData);
    if (
      !Number.isNaN(Number(value))
      && id
      && activeStepDetails.active_escalation.escalation_due[id] !== value
    ) {
      activeStepDetails.active_escalation.escalation_due[id] = value;
      activeStepDetails.escalation_error_list = getDueDateOnlyValidation(activeStepDetails);
      dispatch(updateFlowStateChange({ activeStepDetails }));
    }
  };

  const onDropdownChange = (event) => {
    const { id, value } = event.target;
    if (id) {
      const activeStepDetails = cloneDeep(stepData);
      if (
        id === CONFIG_FIELD_KEY.DURATION_TYPE
        && activeStepDetails.active_escalation.escalation_due[id] !== value
      ) {
        activeStepDetails.active_escalation.escalation_due[id] = value;
        activeStepDetails.escalation_error_list = getDueDateOnlyValidation(activeStepDetails);
      }
      console.log('onDropdownChange', activeStepDetails.active_escalation);
      dispatch(updateFlowStateChange({ activeStepDetails }));
    }
  };

  const content = EMAIL_ESCALATION_STRING.FORM_DETAILS.DESCRIPTION_LABEL.Value.map((Value) => (
    <div className={Value.class}>{t(Value.value)}</div>
  ));

  const updateRecipientsData = (recipientsData) => {
    const activeStepDetails = cloneDeep(stepData);
    if (!isEmpty(activeStepDetails?.[`${ESCALATION_RECIPIENT_OBJECT_KEYS.parentKey}ErrorList`])) {
      const { errorList } = validateAssigneesData(recipientsData, ESCALATION_RECIPIENT_OBJECT_KEYS, true, t);
      set(activeStepDetails, [`${ESCALATION_RECIPIENT_OBJECT_KEYS.parentKey}ErrorList`], errorList);
    }
    set(activeStepDetails, ['active_escalation', 'escalation_recipients'], recipientsData);
    dispatch(updateFlowStateChange({ activeStepDetails }));
  };

  let mainContent = null;
  if (!isLoadingDetails && !isErrorInEscalation) {
    mainContent = (
      <div className={cx(gClasses.W100)}>
        <div className={cx(gClasses.DisplayFlex, gClasses.MB16)}>
          <TextInput
            id={CONFIG_FIELD_KEY.DURATION}
            labelText={DUE_DATE_AND_STATUS.TITLE}
            innerLabelClass={styles.Label}
            inputClassName={styles.DueDate}
            type={INPUT_TYPES.NUMBER}
            value={escalation_due[CONFIG_FIELD_KEY.DURATION]}
            onChange={(event) => onChangeHandler(event)}
            variant={Variant.border}
            required
            suffixIcon={
              <SingleDropdown
                id={CONFIG_FIELD_KEY.DURATION_TYPE}
                dropdownViewProps={{
                  variant: Variant.borderLess,
                }}
                optionList={DUE_DATE_AND_STATUS.DUE_DATE.OPTIONS}
                selectedValue={escalation_due[CONFIG_FIELD_KEY.DURATION_TYPE]}
                onClick={(value, _label, _list, id) => onDropdownChange(generateEventTargetObject(id, value))}
              />
            }
            placeholder={
              DUE_DATE_AND_STATUS.DUE_DATE.OPTIONS[1].value ===
                escalation_due[CONFIG_FIELD_KEY.DURATION_TYPE]
                ? DUE_DATE_AND_STATUS.DUE_DATE.HOURS_PLACEHOLDER
                : DUE_DATE_AND_STATUS.DUE_DATE.DAYS_PLACEHOLDER
            }
            errorMessage={due_date_error}
          />
          <div className={gClasses.ML24}>
            <Text
              content={t(
                EMAIL_ESCALATION_STRING.FORM_DETAILS.ESCALATION_TYPE.TITLE,
              )}
              className={cx(gClasses.LabelStyle, styles.TypeLabel)}
            />
            <Text
              content={t(
                EMAIL_ESCALATION_STRING.FORM_DETAILS.ESCALATION_TYPE.LABEL,
              )}
              className={styles.MailLabel}
            />
          </div>
        </div>
        {/* <Title content={EMAIL_RECIPIENTS} size={ETitleSize.xs} className={gClasses.GrayV3} /> */}
        <div className={gClasses.MB24}>
          <RecipientsSelection
            id={ESCALATION_RECIPIENT_OBJECT_KEYS.parentKey}
            key={ESCALATION_RECIPIENT_OBJECT_KEYS.parentKey}
            labelText={t(EMAIL_ESCALATION_STRING.THEN_MAIL)}
            required
            recipientsCancelToken={escalationRecipientsCancelToken}
            fieldDropdownClass={styles.FormFieldDropdown}
            dropdownClassInsideRule={styles.RuleDropdownClass}
            objectKeys={ESCALATION_RECIPIENT_OBJECT_KEYS}
            defaultApiParams={{
              sort_by: 1,
              flow_id: flowData?.flow_id,
              field_list_type: FIELD_LIST_TYPE.DIRECT,
              allowed_field_types: [FIELD_TYPE.USER_TEAM_PICKER, FIELD_TYPE.EMAIL],
              include_property_picker: 1,
            }}
            metaData={{
              moduleId: flowData?.flow_id,
              stepUUID: stepData.step_uuid,
            }}
            typeOptionsList={RECIPIENTS_TYPE_OPTIONS(t)}
            updateRecipientsData={(allRecipients) => updateRecipientsData(allRecipients)}
            systemFieldListInitial={recipientSystemFields}
            errorList={stepData?.[`${ESCALATION_RECIPIENT_OBJECT_KEYS.parentKey}ErrorList`]}
            recipientsData={recipients}
            ruleBasedRecipientsCancelToken={ruleBasedEscalationRecipientsCancelToken}
            initialAssigneeData={INITIAL_ESCALATION_RECIPIENTS_DATA}
            ruleBasedRecipientInitData={INITIAL_ESCALATION_RULE_BASED_RECIPIENTS_DATA}
          />
        </div>
        <div className={cx(gClasses.MB24)}>
          <Text
            content={t(EMAIL_ESCALATION_STRING.FORM_DETAILS.MAIL_SUBJECT.LABEL)}
            className={cx(gClasses.MB6, gClasses.LabelStyle)}
          />
          <Text
            content={t(EMAIL_ESCALATION_STRING.FORM_DETAILS.MAIL_SUBJECT.VALUE)}
            className={cx(styles.MailSubject, gClasses.CenterV, gClasses.PL10)}
          />
        </div>
        <Text
          content={t(EMAIL_ESCALATION_STRING.FORM_DETAILS.DESCRIPTION_LABEL.LABEL)}
          className={cx(gClasses.LabelStyle, gClasses.MT16)}
        />
        <div className={cx(styles.Content, gClasses.MT6)}>{content}</div>
        <Text
          content={t(EMAIL_ESCALATION_STRING.INSTRUCTION_MESSAGE)}
          className={cx(gClasses.MT24, styles.Label)}
        />
      </div>
    );
  }

  const onCloseClickHandler = () => {
    const activeStepDetails = cloneDeep(stepData);
    activeStepDetails.active_escalation = {};
    activeStepDetails.activeEscalationUuid = null;
    activeStepDetails.escalation_error_list = {};
    set(activeStepDetails, [`${ESCALATION_RECIPIENT_OBJECT_KEYS.parentKey}ErrorList`], {});
    dispatch(updateFlowStateChange({ activeStepDetails }));
    closeEscalationModal();
  };

  const header = (
    <>
      <Title
        content={t(ESCALATION_STRINGS.TITLE)}
        size={ETitleSize.small}
        className={cx(gClasses.MT24, gClasses.ML32)}
      />
      <CloseIcon
        className={cx(styles.CloseIcon, gClasses.CursorPointer)}
        onClick={onCloseClickHandler}
        role={ARIA_ROLES.BUTTON}
        tabIndex={0}
        onKeyDown={(e) => {
          keydownOrKeypessEnterHandle(e) && onCloseClickHandler();
        }}
      />
    </>
  );
  const onSaveHandler = async () => {
    const activeStepDetails = cloneDeep(stepData);
    let errorList = [];
    let active_data = {};
    active_data = activeStepDetails.active_escalation;
    errorList = validate(
      constructEscalationValidationData(cloneDeep(activeStepDetails.active_escalation)),
      emailEscalationValidationSchema(t),
    );
    const { errorList: recipientErrors } = validateAssigneesData(
      get(active_data, ['escalation_recipients'], []),
      ESCALATION_RECIPIENT_OBJECT_KEYS,
      true,
      t,
    );
    set(activeStepDetails, [`${ESCALATION_RECIPIENT_OBJECT_KEYS.parentKey}ErrorList`], recipientErrors);
    activeStepDetails.escalation_error_list = errorList;
    if (isEmpty(errorList) && !isEmpty(active_data) && isEmpty(recipientErrors)) {
      const postData = {
        _id: stepData._id,
        step_uuid: stepData.step_uuid,
        flow_id: flowData.flow_id,
        escalations: getEmailEscalationPostData(active_data),
      };
      dispatch(saveEscalationsThunk(postData)).then((resData) => {
        if (resData) {
          set(activeStepDetails, 'escalations', resData?.escalations || []);
          console.log('activeStepDetails', activeStepDetails, 'onSaveEscalation_resData', resData);
          if (!isEmpty(resData.validation_message)) {
            let isEscalationActionError = false;
            resData.validation_message.forEach((eachMessage) => {
              if (eachMessage.field.includes('escalations')) {
                const esclationIndex = eachMessage && eachMessage.field.split('.')[1];
                if (esclationIndex) {
                  const { escalation_uuid } = activeStepDetails.escalations[esclationIndex];
                  if (escalation_uuid === active_data.escalation_uuid) isEscalationActionError = true;
                }
              }
            });
            if (!isEscalationActionError) {
              delete activeStepDetails.active_escalation;
              delete activeStepDetails.activeEscalationUuid;
            } else closeEscalationModal();
          } else {
            closeEscalationModal();
          }
          dispatch(updateFlowStateChange({ activeStepDetails }));
        }
      });
    } else {
      dispatch(updateFlowStateChange({ activeStepDetails }));
    }
  };
  return (
    <Modal
      id={ESCALATION_STRINGS.ID}
      isModalOpen
      modalSize={ModalSize.md}
      customModalClass={styles.W70}
      headerContent={header}
      headerContentClassName={gClasses.FlexJustifyBetween}
      mainContent={mainContent}
      mainContentClassName={cx(
        gClasses.PL32,
        gClasses.PR32,
        gClasses.PT24,
        gClasses.PB24,
      )}
      footerContent={
        <div className={cx(gClasses.DisplayFlex, gClasses.gap8)}>
          <Button
            buttonText={t(MODAL_ACTION_BUTTON.CANCEL)}
            onClick={onCloseClickHandler}
            noBorder
            type={EButtonType.OUTLINE_SECONDARY}
          />
          <Button
            buttonText={t(MODAL_ACTION_BUTTON.SAVE)}
            onClick={onSaveHandler}
          />
        </div>
      }
      footerContentClassName={cx(styles.Footer)}
    />
  );
}

export default EmailEscalation;
