import { getAssigneesData, stepAssigneesPostData } from '../../../node_configuration/NodeConfiguration.utils';
import { REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS } from '../end_step/EndStepConfig.constants';
import { EMAIL_ACTIONS_INITIAL_STATE, EMAIL_CONSTANTS, EMAIL_RECIPIENT_TYPE, EMAIL_REQUEST_FIELD_KEYS, INITIAL_RECIPIENTS_DATA, MAIL_RECIPIENT_OBJECT_KEYS, MAIL_RECIPIENT_RESPONSE_OBJECT_KEYS } from './SendEmailConfig.constants';
import { getFieldLabelWithRefName, getFileNameFromServer } from '../../../../../utils/UtilityFunctions';
import { cloneDeep, compact, isEmpty, isUndefined } from '../../../../../utils/jsUtility';
import { formatMailContentFromServer } from '../../../EditFlow.utils';
import { getDmsLinkForPreviewAndDownload } from '../../../../../utils/attachmentUtils';
import { extractHTMLFromString } from '../../configurations/document_generation/DocumentGeneration.utils';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { getCurrentSystemField, UNNECESSARY_TAGS } from '../generate_document/general/document_template/DocumentTemplate.utils';
import { NODE_CONFIG_TABS } from '../../../node_configuration/NodeConfiguration.constants';

const {
    REMOVED_DOC_LIST,
    ENTITY,
    ENTITY_ID,
    REF_UUID,
    UPLOADED_DOC_METADATA,
} = EMAIL_CONSTANTS;

export const getStaticDocValue = (documentUrlDetails = []) => {
    console.log('getStaticDocValue_res', documentUrlDetails);
    if (isUndefined(documentUrlDetails)) return [];
    const data = cloneDeep(documentUrlDetails);
    const docList = [];
    let refUuid = null;
    data.forEach((file) => {
        console.log('getStaticDocValue_eachFile', file);
        const _file = {
            name: getFileNameFromServer(file?.original_filename),
            type: file?.original_filename?.content_type,
            size: file?.original_filename?.file_size,
            url: file?.url || '',
            thumbnail: `${getDmsLinkForPreviewAndDownload(
                window,
            )}/dms/display/?id=${file?.document_id}`,
            documentId: file?.document_id,
            refUuid: file?.original_filename?.ref_uuid,
        };
        if (isEmpty(refUuid)) {
            refUuid = file?.original_filename?.ref_uuid;
        }
        _file.file = _file;
        docList.push(_file);
    });
    console.log('getStaticDocValue_data', docList);
    return {
        docList,
        refUuid,
    };
};

export const getDocDetailsPostData = (state = {}) => {
    const docDetails = {};
    if (!isEmpty(state?.entity)) docDetails[ENTITY] = state.entity;
    if (!isEmpty(state?.entityId)) docDetails[ENTITY_ID] = state.entityId;
    if (!isEmpty(state?.refUuid)) docDetails[REF_UUID] = state.refUuid;
    if (!isEmpty(state?.uploadedDocMetadata)) {
        docDetails[UPLOADED_DOC_METADATA] = state.uploadedDocMetadata;
    }
    if (!isEmpty(state?.removedDocList)) {
        docDetails[REMOVED_DOC_LIST] = state?.removedDocList;
    }
    return docDetails;
};

export const getParsedValueForEmailTemplate = (
    rawHtml,
    editorRef,
    fieldDropDownOptions = [],
    systemFields = [],
    isEmailSubject,
) => {
    if (editorRef?.current?.dom) {
        const body = editorRef.current.getBody();
        const rawHtml = body.innerHTML;
        const removeHtmlRegex = /(<([^>]+)>)/gi;
        const removeNewLineRegex = /(\n)/gi;
        const parsedContent = cloneDeep(rawHtml)
            .replace(removeHtmlRegex, '')
            .replace(removeNewLineRegex, '');
        const rawEditorContent = editorRef.current.getContent({ format: 'text' });
        if (
            parsedContent.length &&
            (rawEditorContent && !isEmpty(rawEditorContent.trim()))
        ) {
            let htmlContent = cloneDeep(rawHtml);
            const htmlDocElement = extractHTMLFromString(htmlContent);
            if (isEmailSubject) {
                const selectionTag = htmlDocElement.getElementsByTagName('p');
                if (selectionTag) {
                    const value = editorRef.current.dom.getOuterHTML(selectionTag[0]);
                    htmlContent = value;
                }
            }

            const fieldElements = htmlDocElement.querySelectorAll(
                '[data-field-uuid]',
            );

            console.log('fieldElementssystemFields', rawHtml, fieldDropDownOptions, systemFields, fieldElements);

            const selectedFields = [];

            fieldElements.forEach((element) => {
                const fieldUuid = element.getAttribute('data-field-uuid');
                if (fieldUuid === 'undefined' || fieldUuid === undefined || isEmpty(fieldUuid)) return;

                const fieldOuterHtml = element?.outerHTML;

                const currentField = fieldDropDownOptions?.find((eachField) => eachField?.fieldUuid === fieldUuid);

                if (!isEmpty(currentField)) {
                    selectedFields.push(currentField);
                    htmlContent = htmlContent.replaceAll(
                        fieldOuterHtml,
                        `!@#\${"type":"field","identifier":"${currentField.fieldUuid}","title":"${currentField.label}"}$#@!`,
                    );
                } else {
                    const currentSystemField = getCurrentSystemField({ fieldUuid, systemFields });
                    if (!isEmpty(currentSystemField)) {
                        selectedFields.push(currentSystemField);

                        htmlContent = htmlContent.replaceAll(
                            fieldOuterHtml,
                            `!@#\${"type":"system","identifier":"${currentSystemField.value}","title":"${currentSystemField.label}"}$#@!`,
                        );
                    }
                }
            });

            htmlContent = htmlContent.replace(/\r?<\/p>\n<p>/g, '<br>');

            htmlContent = htmlContent.replaceAll('inline-boundary', EMPTY_STRING);
            htmlContent = htmlContent.replaceAll(
                '.mce-content-body { width: 642.5px !important; margin: 0px 16px !important; } ',
                EMPTY_STRING,
            );

            UNNECESSARY_TAGS.forEach((tagId) => {
                const selectionTag = editorRef.current.dom.get(tagId);
                if (selectionTag) {
                    const value = editorRef.current.dom.getOuterHTML(selectionTag);
                    htmlContent = htmlContent.replace(value, EMPTY_STRING);
                }
            });
            if (isEmailSubject) {
                htmlContent = htmlContent.replace(/<[^>]*>?/gm, '');
                htmlContent = htmlContent.replace(/&nbsp;/gm, ' ');
            }
            return { htmlContent, selectedFields };
        } else return {};
    } else {
        return {};
    }
};

const normalizeRecipientsList = (data) => {
    const recipients = [];
    data.forEach((recipient) => {
        switch (recipient?.recipients_type) {
            case EMAIL_RECIPIENT_TYPE.USERS_OR_TEAMS:
                recipients.push({
                    recipientsType: recipient?.recipients_type,
                    directRecipients: recipient?.direct_recipients,
                });
                break;
            case EMAIL_RECIPIENT_TYPE.EMAIL_ADDRESS:
                recipients.push({
                    recipientsType: recipient?.recipients_type,
                    externalRecipient: (recipient?.external_recipient)?.join(),
                });
                break;
            case EMAIL_RECIPIENT_TYPE.FORM_FIELDS:
            case EMAIL_RECIPIENT_TYPE.FORM_REPORTING_MANAGER_ASSIGNEE:
                recipients.push({
                    recipientsType: recipient?.recipients_type,
                    recipientsFieldUuids: recipient?.recipients_field_uuids,
                });
                break;
            case EMAIL_RECIPIENT_TYPE.SYSTEM_FIELDS:
                recipients.push({
                    recipientsType: recipient?.recipients_type,
                    recipientsSystemFields: recipient?.recipients_system_fields,
                });
                break;
            case EMAIL_RECIPIENT_TYPE.RULE:
                const rules = [];
                recipient?.rules?.forEach((ruleData) => {
                    rules.push(({
                        condition_rule: ruleData.condition_rule,
                        ruleRecipient: normalizeRecipientsList(ruleData.rule_recipient),
                    }));
                });
                recipients.push({
                    recipientsType: recipient?.recipients_type,
                    rules,
                });
                break;
            default:
                break;
        }
    });
    return recipients;
};

export const constructGetApiRecipients = (data, fieldDetails, systemFields, isRequired = true) => {
    if (isEmpty(data)) {
        if (isRequired) {
            return INITIAL_RECIPIENTS_DATA;
        } else return [];
    }
    const recipients = normalizeRecipientsList(data);
    return getAssigneesData(recipients, fieldDetails, systemFields, MAIL_RECIPIENT_OBJECT_KEYS);
};

export const getEmailAddressPostData = (value) => {
    const emailArray = value?.split(',')
        .map((eachValue) =>
            isEmpty(eachValue.trim()) ? null : eachValue.trim(),
        );
    console.log('getEmailPostData_value', value, 'emailArray', compact(emailArray));
    return compact(emailArray);
};

export const emailActionValidateData = (state, isAddOnConfig, addOnData) => {
    const {
        emailUuid,
        emailSubject,
        emailBody,
        emailAttachments,
        actionUuid,
    } = cloneDeep(state);
    return {
        emailUuid,
        emailSubject: addOnData?.tabIndex === NODE_CONFIG_TABS.ADDITIONAL ? addOnData?.parsedEmailSubject : getParsedValueForEmailTemplate(
            emailSubject,
            addOnData.emailSubjectRef,
            addOnData.allFieldsList,
            addOnData?.insertFieldsList?.[1]?.subMenuItems,
            true,
          )?.htmlContent,
        emailBody: addOnData?.tabIndex === NODE_CONFIG_TABS.ADDITIONAL ? addOnData?.parsedEmailBody : getParsedValueForEmailTemplate(
            emailBody,
            addOnData.emailBodyRef,
            addOnData.allFieldsList,
            addOnData?.insertFieldsList?.[1]?.subMenuItems,
          )?.htmlContent,
        emailAttachments,
        ...isAddOnConfig ? { actionUuid } : {},
    };
};

export const constructSaveStepEmailActions = (state, isAddOnConfig, addOnData) => {
    const clonedState = cloneDeep(state);
    const emailActionsArray = [];
    const {
        emailActions: {
            emailSubject,
            emailBody,
            recipients = [],
            ccRecipients = [],
            emailAttachments = {},
            emailUuid,
        },
        uploadedFiles,
      } = clonedState;

    const newEmailActions = {
        email_subject: addOnData?.tabIndex === NODE_CONFIG_TABS.ADDITIONAL ? addOnData?.parsedEmailSubject : getParsedValueForEmailTemplate(
            emailSubject,
            addOnData.emailSubjectRef,
            addOnData.allFieldsList,
            addOnData?.insertFieldsList?.[1]?.subMenuItems,
            true,
          )?.htmlContent,
        email_body: addOnData?.tabIndex === NODE_CONFIG_TABS.ADDITIONAL ? addOnData?.parsedEmailBody : getParsedValueForEmailTemplate(
            emailBody,
            addOnData.emailBodyRef,
            addOnData.allFieldsList,
            addOnData?.insertFieldsList?.[1]?.subMenuItems,
          )?.htmlContent,
        recipients: stepAssigneesPostData(recipients, MAIL_RECIPIENT_OBJECT_KEYS, MAIL_RECIPIENT_RESPONSE_OBJECT_KEYS),
    };
    if (!isEmpty(emailUuid)) newEmailActions.email_uuid = emailUuid;
    const attachments = {};
    if (!isEmpty(emailAttachments?.fieldUuid)) {
        attachments.field_uuid = emailAttachments?.fieldUuid;
    }
    if (!isEmpty(uploadedFiles)) {
        attachments.attachment_id = uploadedFiles?.map((f) => f?.documentId);
    }
    if (isAddOnConfig) {
        newEmailActions.action_uuid = clonedState?.emailActions?.actionUuid;
    }
    console.log('attachmentsConstructpostdata', attachments, 'newEmailActionsDynamic', newEmailActions);
    if (!isEmpty(attachments)) newEmailActions.email_attachments = attachments;
    if (!isEmpty(ccRecipients)) newEmailActions.cc_recipients = stepAssigneesPostData(ccRecipients, MAIL_RECIPIENT_OBJECT_KEYS, MAIL_RECIPIENT_RESPONSE_OBJECT_KEYS);
    emailActionsArray.push(newEmailActions);
    console.log('stateDataConstructEmailActionsNEW', newEmailActions, 'notEmptyCCrecipient', !isEmpty(ccRecipients), 'emailActionsArray', emailActionsArray);
    return [{ ...newEmailActions }];
};

export const constructSendEmailPostData = (state, isAddOnConfig, addOnData = {}) => {
    const stateData = cloneDeep(state);
    const uploadedFiles = stateData?.uploadedFiles;
    const emailActions = constructSaveStepEmailActions(stateData, isAddOnConfig, addOnData);
    console.log('stateDataConstructSendEmail', stateData, 'emailActions', emailActions, 'uploadedFiles', uploadedFiles);
    let postData = {
        [REQUEST_FIELD_KEYS.FLOW_ID]: stateData?.[RESPONSE_FIELD_KEYS.FLOW_ID],
        [REQUEST_FIELD_KEYS.ID]: stateData?.[RESPONSE_FIELD_KEYS.ID],
        [REQUEST_FIELD_KEYS.STEP_UUID]: stateData?.[RESPONSE_FIELD_KEYS.STEP_UUID],
        [EMAIL_REQUEST_FIELD_KEYS.EMAIL_ACTIONS]: isAddOnConfig ? emailActions[0] : emailActions,
    };
    if (!isAddOnConfig) {
        postData = {
            ...postData,
            [REQUEST_FIELD_KEYS.STEP_NAME]: stateData?.[RESPONSE_FIELD_KEYS.STEP_NAME],
            [REQUEST_FIELD_KEYS.STEP_TYPE]: stateData?.[RESPONSE_FIELD_KEYS.STEP_TYPE],
            [REQUEST_FIELD_KEYS.STEP_ORDER]: stateData?.[RESPONSE_FIELD_KEYS.STEP_ORDER],
            [REQUEST_FIELD_KEYS.STEP_STATUS]: stateData?.[RESPONSE_FIELD_KEYS.STEP_STATUS],
        };
    }
    postData.document_details = getDocDetailsPostData(stateData?.docDetails);
    console.log('constructSendEmailPostData', postData);
    return postData;
};

export const constructGetApiEmailActions = (email_actions, fieldDetails, systemFields, actions, formAndSystemFields) => {
    if (isUndefined(email_actions)) {
        return {
            emailActions: EMAIL_ACTIONS_INITIAL_STATE,
            mailSubjectFields: [],
        };
    }

    const selectedActionLabels = [];
    if (email_actions?.action_uuid && !isEmpty(actions)) {
        actions.forEach((action) => {
            if (email_actions.action_uuid?.includes(action.value)) {
                selectedActionLabels.push(action.label);
            }
        });
    }
    const dynamicDocLabels = [];
    if (email_actions?.email_attachments?.field_uuid && !isEmpty(fieldDetails)) {
        fieldDetails.forEach((field) => {
            if (email_actions?.email_attachments?.field_uuid?.includes(field.field_uuid)) {
                dynamicDocLabels.push(getFieldLabelWithRefName(field.field_name, field.reference_name));
            }
        });
    }
    const newEmailActions = {
        emailActions: {
            emailSubject: formatMailContentFromServer(
                email_actions?.email_subject,
                formAndSystemFields,
            ),
            emailBody: formatMailContentFromServer(
                email_actions?.email_body,
                formAndSystemFields,
            ),
            emailAttachments: {
                fieldUuid: email_actions?.email_attachments?.field_uuid || [],
            },
            recipients: constructGetApiRecipients(email_actions?.recipients, fieldDetails, systemFields),
            ccRecipients: constructGetApiRecipients(email_actions?.cc_recipients, fieldDetails, systemFields, false),
            emailUuid: email_actions?.email_uuid,
            actionUuid: email_actions?.action_uuid,
            selectedActionLabels,
            dynamicDocLabels,
        },
    };

    console.log('newEmailActionsGETApi', selectedActionLabels, newEmailActions);
    return newEmailActions;
};
