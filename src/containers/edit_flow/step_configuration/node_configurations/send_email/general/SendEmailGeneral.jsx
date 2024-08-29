import React, { useState, useEffect, useRef } from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import {
    ETitleSize, Title,
    MultiDropdown,
    Label,
    ErrorVariant,
} from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import DocumentUpload from '../../../../../../components/form_components/file_uploader/FileUploader';
import styles from '../SendEmailConfig.module.scss';
import { EMPTY_STRING, ENTITY, NO_FIELDS_FOUND } from '../../../../../../utils/strings/CommonStrings';
import { getAccountConfigurationDetailsApiService } from '../../../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import { useClickOutsideDetector, CancelToken } from '../../../../../../utils/UtilityFunctions';
import { generateUuid, getExtensionFromFileName } from '../../../../../../utils/generatorUtils';
import jsUtility, { cloneDeep, isEmpty } from '../../../../../../utils/jsUtility';
import { getDmsLinkForPreviewAndDownload } from '../../../../../../utils/attachmentUtils';
import useSimplifiedFileUploadHook from '../../../../../../hooks/useSimplifiedFileUploadHook';
import RecipientsSelection from '../recipients_selection/RecipientsSelections';
import {
    EMAIL_LABELS,
    RECIPIENTS_TYPE_OPTIONS,
    SEND_EMAIL_CONFIG_CONSTANTS,
    emailBodyErrorId,
    emailSubjectErrorId,
} from '../SendEmailConfig.string';
import { nodeConfigDataChange, useFlowNodeConfig } from '../../../../node_configuration/use_node_reducer/useNodeReducer';
import {
    FIELD_LIST_TYPE,
    FIELD_TYPE,
    INITIAL_PAGE,
    MAX_PAGINATION_SIZE,
} from '../../../../../../utils/constants/form.constant';
import { apiGetAllFieldsList } from '../../../../../../axios/apiService/flow.apiService';
import { EMAIL_CONSTANTS, EMAIL_RESPONSE_FIELD_KEYS, INITIAL_RECIPIENTS_DATA, INITIAL_RULE_BASED_RECIPIENTS_DATA, MAIL_RECIPIENT_OBJECT_KEYS } from '../SendEmailConfig.constants';
import TextEditor from '../../../../../../components/text_editor/TextEditor';
import {
    EDITOR_CONFIGS,
    getAllFieldsMenu,
    MAIL_DESCRIPTION_CONTENT_STYLES,
    MAIL_SUBJECT_CONTENT_STYLES,
    onRemoveClickHandler,
} from '../../generate_document/general/document_template/DocumentTemplate.utils';
import CloseIconNew from '../../../../../../assets/icons/CloseIconNew';
import useApiCall from '../../../../../../hooks/useApiCall';
import { formatAllFieldsList } from '../../../../node_configuration/NodeConfiguration.utils';
import { RESPONSE_KEYS } from '../../data_manipulator/DataManipulator.constants';

const recipientsCancelToken = new CancelToken();
const ccRecipientsCancelToken = new CancelToken();
const recipientsRuleCancelToken = new CancelToken();
const ccRecipientsRuleCancelToken = new CancelToken();
const ruleBasedRecipientsCancelToken = new CancelToken();
const ruleBasedCCRecipientsCancelToken = new CancelToken();

function SendEmailGeneral(props) {
    const {
        metaData: {
            flowId,
        },
        recipientSystemFields,
        updateRecipientsData,
        isAddOnConfig,
        actions,
        editorRef,
        emailSubjectRef,
        isLoadingAllFields,
        insertFieldsList,
        subjectInsertFieldsList,
    } = props;

    const [userProfileData, setUserProfileData] = useState({});
    const [isInsertOpen, setIsInsertOpen] = useState(false);
    const { t } = useTranslation();
    const [documentFieldSearchText, setDocumentFieldSearchText] = useState();
    const [, setIsEditorLoading] = useState(true);

    const {
        GENERAL: {
            EMAIL_RECIPIENTS,
            TO,
            CC,
            EMAIL_CONTENT,
            MAIL_SUBJECT,
            MAIL_DESRIPTION,
            STATIC_ATTACHMENTS,
            DYNAMIC_ATTACHMENTS,
            DYNAMIC_ATTACHEMNTS_PLACEHOLDER,
            BUTTON_ACTION,
        },
        SEARCH_DOCUMENT_FIELDS,
    } = SEND_EMAIL_CONFIG_CONSTANTS(t);

    const {
        SOURCE_VALUE,
        DOCUMENT_DETAILS,
    } = RESPONSE_KEYS;
    const {
        EMAIL_SUBJECT,
        EMAIL_BODY,
    } = EMAIL_RESPONSE_FIELD_KEYS;
    const {
        RECIPIENTS,
    } = EMAIL_CONSTANTS;

    const {
        state,
        dispatch,
    } = useFlowNodeConfig();
    const {
        emailActions,
        allSystemFields = [],
        recipientsErrorList = {},
        ccRecipientsErrorList = {},
        uploadedFiles,
        docDetails,
        errorList,
        dataFields = [],
        emailConfigRefUuid,
    } = state;

    const popperRef = useRef(null);
    useClickOutsideDetector(popperRef, () => setIsInsertOpen(false));

    const recipientTypeOptionList = RECIPIENTS_TYPE_OPTIONS(t);
    const { data: allDocumentFields, fetch: getAllDocumentFields, page: documentFieldsCurrentPage, hasMore: hasMoreDocumentFields, clearData: clearAllDocumentFields } = useApiCall({}, true, formatAllFieldsList);
    console.log('state_sendEmail', state, 'emailActions', emailActions, 'ccRecipients', emailActions?.ccRecipients);

    const getAllDocumentFieldsList = (params = {}) => {
        params = {
            page: INITIAL_PAGE,
            size: MAX_PAGINATION_SIZE,
            sort_by: 1,
            flow_id: flowId,
            include_property_picker: 1,
            ...params,
            allowed_field_types: [FIELD_TYPE.FILE_UPLOAD],
        };
        if (isEmpty(params.search)) delete params.search;
        getAllDocumentFields(apiGetAllFieldsList(params));
    };

    const loadMoreDocumentFields = () => {
        getAllDocumentFieldsList(
            { page: documentFieldsCurrentPage + 1 },
        );
    };

    const onDocumentFieldSearch = (event) => {
        setDocumentFieldSearchText(event.target.value);
        getAllDocumentFieldsList({ search: event.target.value });
    };

    const updateNodeState = (data = {}) => {
        console.log('state_updateNodeStateDATA', data);
        !isEmpty(data) && dispatch(
            nodeConfigDataChange(data),
        );
    };

    useEffect(() => {
        getAccountConfigurationDetailsApiService().then((response) => {
            console.log('responseGetAccountConfig', response);
            setUserProfileData(response);
        });
        return () => {
            clearAllDocumentFields();
        };
    }, []);

    const onRemoveSystemField = (value) => {
        const clonedSystemFields = cloneDeep(allSystemFields);
        const selectedIndex = clonedSystemFields?.findIndex((option) => option?.value === value);
        console.log('valueonRemoveSystemField', value, 'allSystemFields', clonedSystemFields, 'selectedIndex', selectedIndex);
        if (selectedIndex > -1) {
            clonedSystemFields.splice(selectedIndex, 1);
        }
        console.log('clonedSystemFieldsNew', clonedSystemFields);
        updateNodeState({
            allSystemFields: clonedSystemFields,
        });
    };

    const appliedSystemFields = allSystemFields?.map((option) => {
        console.log('allSystemFields', option);
        return (
            <div
                className={cx(
                    gClasses.CenterVH,
                    gClasses.MR10,
                    gClasses.MB5,
                    styles.FieldTag,
                )}
            >
                <div className={cx(styles.UserName, gClasses.Ellipsis, gClasses.FTwo12)}>
                    {option?.label || option}
                </div>
                <button
                    className={cx(gClasses.DisplayFlex, gClasses.ML5)}
                    onClick={() => onRemoveSystemField(option?.value)}
                >
                    <CloseIconNew className={cx(styles.CloseIcon)} />
                </button>
            </div>
        );
    });

    const onDynamicDropdownFocus = () => {
        getAllDocumentFieldsList();
    };

    const onEmailStateChange = (id, value) => {
        console.log('eventEMAILonChangeHandler', 'value', value, 'id', id);
        const clonedActions = cloneDeep(emailActions);
        switch (id) {
            case EMAIL_SUBJECT:
                if (emailActions?.emailSubject !== value) {
                    clonedActions[id] = value;
                }
                break;
            case EMAIL_BODY:
                if (emailActions?.emailBody !== value) {
                    clonedActions[id] = value;
                }
                break;
            default: break;
        }
        dispatch(
            nodeConfigDataChange({
                emailActions: clonedActions,
            }),
        );
    };

    const getFileData = (file, file_ref_uuid, _entityType, entityId, refUuid) => {
        const fileData = {
            type: 'email_attachments',
            file_type: getExtensionFromFileName(file.name, true),
            file_name: file?.name?.slice(0, -1 * (file.name.length - file.name.lastIndexOf('.'))),
            file_size: file?.size,
            file_ref_id: file_ref_uuid,
        };

        const file_metadata = [];
        file_metadata.push(fileData);
        const data = {
            file_metadata,
        };
        data.entity = ENTITY.FLOW_STEPS;
        data.context_id = flowId;
        data.entity_id = state?.stepId;
        data.ref_uuid = emailConfigRefUuid || refUuid || generateUuid();
        return data;
    };

    const onUploadFile = (res, data, file) => {
        const fileMetaData = jsUtility.get(data, ['file_metadata', 0], {});
        console.log('onUploadFile_res', res, 'data', data, 'file', file, 'fileMetaData', fileMetaData, 'docDetails', state?.docDetails);
        const documentId = jsUtility.get(res, ['file_metadata', 0, '_id'], {});
        const _file = {
            name: file.name,
            type: fileMetaData.file_type,
            size: fileMetaData.file_size,
            url: data?.url || '',
            thumbnail: `${getDmsLinkForPreviewAndDownload(
                window,
            )}/dms/display/?id=${documentId}`,
            documentId,
            refUuid: res?.ref_uuid,
        };
        _file.file = _file;
        const responseMetaData = jsUtility.get(res, ['file_metadata', 0], {});
        const document = {
            upload_signed_url: responseMetaData?.upload_signed_url?.s3_key,
            document_id: documentId,
            type: fileMetaData?.type,
        };
        console.log('onUploadFile_document', cloneDeep(uploadedFiles));
        const clonedData = cloneDeep(uploadedFiles);
        const currentData = {};
        currentData[RESPONSE_KEYS.STATIC_VALUE] = { ..._file, file: _file };
        currentData[SOURCE_VALUE] = currentData?.[RESPONSE_KEYS.STATIC_VALUE]?.documentId || currentData?.[RESPONSE_KEYS.STATIC_VALUE]?.id;

        const clonedDocuments = cloneDeep(state?.docDetails?.uploadedDocMetadata) || [];
        clonedDocuments.push(document);

        currentData[DOCUMENT_DETAILS] = {
            entity: ENTITY.FLOW_STEPS,
            entityId: res.entity_id,
            refUuid: res.ref_uuid,
            uploadedDocMetadata: clonedDocuments,
        };
        clonedData.push(currentData[RESPONSE_KEYS.STATIC_VALUE]);
        console.log('onUploadFile_currentData', currentData, 'clonedData', clonedData, 'attachmentIds', currentData[SOURCE_VALUE], 'responseMetaData', responseMetaData);
        dispatch(
          nodeConfigDataChange({
            uploadedFiles: clonedData,
            docDetails: currentData[DOCUMENT_DETAILS],
            emailConfigRefUuid: res.ref_uuid,
          }),
        );
    };

    const onRemoveStaticFile = (index, fileId) => {
        const clonedData = cloneDeep(uploadedFiles);
        const clonedDocs = cloneDeep(docDetails);
        const docMetadata = cloneDeep(docDetails?.uploadedDocMetadata) || [];
        const removedDocs = cloneDeep(docDetails?.removedDocList) || [];
        console.log('onRemoveStaticFile_index', index, 'uploadedFiles', uploadedFiles, 'clonedDocs', clonedDocs, 'fileId', fileId);
        if (index > -1) {
            clonedData.splice(index, 1);
            docMetadata?.splice(index, 1);
            removedDocs.push(fileId);
        }
        clonedDocs.uploadedDocMetadata = docMetadata;
        clonedDocs.removedDocList = removedDocs;
        dispatch(
            nodeConfigDataChange({
              uploadedFiles: clonedData,
              docDetails: clonedDocs,
            }),
        );
    };

    // Doc details and upload file to be impeltmented
    const {
        onRetryFileUpload,
        onFileUpload,
        documentDetails,
        uploadFile,
        onDeletFileUpload,
        // files,
    } = useSimplifiedFileUploadHook(getFileData, null);

    useEffect(() => {
        if (!isEmpty(documentDetails?.data)) {
            onUploadFile(documentDetails, documentDetails?.data, documentDetails?.file);
        }
    }, [documentDetails?.file_metadata,
        documentDetails?.file_metadata?.length]);

    const onDynamicDropdownSelect = (value, label) => {
        console.log('onDynamicDropdownSelectVALUE', value, 'label', label);
        const clonedActions = cloneDeep(emailActions);

        const docFields = cloneDeep(emailActions?.emailAttachments?.fieldUuid);
        const clonedLabels = cloneDeep(emailActions?.dynamicDocLabels || []);
        const index = docFields?.findIndex((fieldUuid) => fieldUuid === value);
        console.log('onDynamicDropdownSelect_docFields', docFields, 'index', index);
        if (index > -1) {
            docFields.splice(index, 1);
            clonedLabels.splice(index, 1);
        } else {
            docFields.push(value);
            clonedLabels.push(label);
        }
        clonedActions.emailAttachments.fieldUuid = docFields;
        clonedActions.dynamicDocLabels = clonedLabels;
        console.log('onDynamicDropdownSelect_clonedActions', clonedActions, 'docFields', docFields);
        dispatch(
            nodeConfigDataChange({
                emailActions: clonedActions,
            }),
        );
    };

    const onActionClick = (value, label) => {
        const clonedActions = cloneDeep(emailActions);
        const selectedActions = cloneDeep(clonedActions?.actionUuid) || [];
        const clonedLabels = cloneDeep(emailActions?.selectedActionLabels) || [];
        const index = selectedActions?.findIndex((actionUuid) => actionUuid === value);
        if (index > -1) {
            selectedActions.splice(index, 1);
            clonedLabels.splice(index, 1);
        } else {
            selectedActions.push(value);
            clonedLabels.push(label);
        }
        clonedActions.actionUuid = selectedActions;
        clonedActions.selectedActionLabels = clonedLabels;
        dispatch(
            nodeConfigDataChange({
                emailActions: clonedActions,
            }),
        );
    };

    const handleEditorClickHandler = (editorValue, ref, id) => onRemoveClickHandler(
            editorValue,
            ref,
            (value) => onEmailStateChange(id, value),
          );

    return (
        <>
            {
                isAddOnConfig && (
                    <div className={gClasses.MB12}>
                        <MultiDropdown
                            optionList={cloneDeep(actions)}
                            dropdownViewProps={{
                                labelName: BUTTON_ACTION,
                                selectedLabel: !isEmpty(emailActions?.selectedActionLabels) && emailActions?.selectedActionLabels.join(', '),
                                errorMessage: errorList?.['emailActions,actionUuid'],
                            }}
                            getPopperContainerClassName={(isOpen) => isOpen ? gClasses.ZIndex10 : EMPTY_STRING}
                            onClick={onActionClick}
                            required
                            selectedListValue={emailActions?.actionUuid}
                        />
                    </div>
                )
            }
            <Title content={EMAIL_RECIPIENTS} size={ETitleSize.xs} className={gClasses.GrayV3} />
            <div className={cx(gClasses.PositionRelative, gClasses.ZIndex2)}>
            <RecipientsSelection
                id={RECIPIENTS}
                key={RECIPIENTS}
                labelText={TO}
                required
                recipientsCancelToken={recipientsCancelToken}
                ruleCancelToken={recipientsRuleCancelToken}
                fieldDropdownClass={styles.FormFieldDropdown}
                dropdownClassInsideRule={styles.RuleDropdownClass}
                objectKeys={{
                    ...MAIL_RECIPIENT_OBJECT_KEYS,
                    parentKey: EMAIL_RESPONSE_FIELD_KEYS.RECIPIENTS,
                }}
                defaultApiParams={{
                    sort_by: 1,
                    flow_id: flowId,
                    field_list_type: FIELD_LIST_TYPE.DIRECT,
                    allowed_field_types: [FIELD_TYPE.USER_TEAM_PICKER, FIELD_TYPE.EMAIL],
                    include_property_picker: 1,
                }}
                metaData={{
                    moduleId: flowId,
                    stepUUID: state.stepUuid,
                }}
                typeOptionsList={recipientTypeOptionList}
                updateRecipientsData={(allRecipients) => updateRecipientsData(allRecipients, RECIPIENTS)}
                systemFieldListInitial={recipientSystemFields}
                errorList={recipientsErrorList}
                recipientsData={emailActions?.recipients}
                ruleBasedRecipientsCancelToken={ruleBasedRecipientsCancelToken}
                initialAssigneeData={INITIAL_RECIPIENTS_DATA}
                ruleBasedRecipientInitData={INITIAL_RULE_BASED_RECIPIENTS_DATA}
            />
            <RecipientsSelection
                id={EMAIL_CONSTANTS.CC_RECIPIENTS}
                key={EMAIL_CONSTANTS.CC_RECIPIENTS}
                labelText={CC}
                dropdownClassInsideRule={styles.RuleDropdownClass}
                fieldDropdownClass={styles.FormFieldDropdown}
                objectKeys={{
                    ...MAIL_RECIPIENT_OBJECT_KEYS,
                    parentKey: EMAIL_RESPONSE_FIELD_KEYS.CC_RECIPIENTS,
                }}
                defaultApiParams={{
                    sort_by: 1,
                    flow_id: flowId,
                    field_list_type: FIELD_LIST_TYPE.DIRECT,
                    allowed_field_types: [FIELD_TYPE.USER_TEAM_PICKER, FIELD_TYPE.EMAIL],
                    include_property_picker: 1,
                }}
                metaData={{
                    moduleId: flowId,
                    stepUUID: state.stepUuid,
                }}
                typeOptionsList={recipientTypeOptionList}
                recipientsCancelToken={ccRecipientsCancelToken}
                ruleCancelToken={ccRecipientsRuleCancelToken}
                updateRecipientsData={(allRecipients) => updateRecipientsData(allRecipients, EMAIL_RESPONSE_FIELD_KEYS.CC_RECIPIENTS)}
                errorList={ccRecipientsErrorList}
                systemFieldListInitial={recipientSystemFields}
                recipientsData={emailActions?.ccRecipients}
                ruleBasedRecipientsCancelToken={ruleBasedCCRecipientsCancelToken}
                initialAssigneeData={INITIAL_RECIPIENTS_DATA}
                ruleBasedRecipientInitData={INITIAL_RULE_BASED_RECIPIENTS_DATA}
            />
            </div>
            <Title content={EMAIL_CONTENT} size={ETitleSize.xs} className={cx(gClasses.GrayV3, gClasses.MT24, gClasses.MB12)} />
            <div className={cx(gClasses.MT12, gClasses.PositionRelative, isInsertOpen && gClasses.ZIndex1)}>
                <Label
                    labelName={MAIL_SUBJECT}
                    className={cx(gClasses.MT12, gClasses.MB12)}
                    innerLabelClass={styles.LabelClass}
                    isRequired
                />
                {
                    (!isLoadingAllFields) && (
                        <TextEditor
                            tinymceScriptSrc={process.env.PUBLIC_URL + EDITOR_CONFIGS.scriptSrc}
                            // initialValue={emailActions?.emailSubject}
                            onInit={(_evt, editor) => {
                                emailSubjectRef.current = editor;
                                setIsEditorLoading(false);
                            }}
                            value={emailActions?.emailSubject}
                            onClick={(editorValue) => handleEditorClickHandler(editorValue, emailSubjectRef, EMAIL_SUBJECT)}
                            restrictNewLines
                            editorRef={emailSubjectRef}
                            init={{
                                content_style: MAIL_SUBJECT_CONTENT_STYLES,
                                height: '128px',
                                extended_valid_elements: EDITOR_CONFIGS.extendedValidElements,
                                toolbar: false,
                                menubar: false,
                                statusbar: false,
                                toolbar1: EDITOR_CONFIGS.TOOLBAR3,
                                setup: (editor) => {
                                    editor.ui.registry.addMenuButton('insertFieldMenu', {
                                        text: EMAIL_LABELS(t).INSERT_FIELD,
                                        search: {
                                            placeholder: EMAIL_LABELS(t).SEARCH_FIELD,
                                        },
                                        fetch: (callback) => {
                                            const items = getAllFieldsMenu(
                                                subjectInsertFieldsList,
                                                editor,
                                                dispatch,
                                                nodeConfigDataChange,
                                                dataFields,
                                            );
                                            callback(items);
                                        },
                                    });
                                },
                            }}
                            onEditorChange={(value) => onEmailStateChange(EMAIL_SUBJECT, value)}
                            errorMessage={errorList?.[emailSubjectErrorId]}
                        />
                    )
                }
            </div>
            <div className={cx(gClasses.CenterV, gClasses.MT10)}>
                {appliedSystemFields}
            </div>
            <Label
                labelName={MAIL_DESRIPTION}
                className={cx(gClasses.MT12, gClasses.MB6)}
                innerLabelClass={styles.LabelClass}
                isRequired
            />
            <div className={cx(gClasses.MT12, gClasses.MB12)}>
                {
                    (!isLoadingAllFields) && (
                        <TextEditor
                            tinymceScriptSrc={process.env.PUBLIC_URL + EDITOR_CONFIGS.scriptSrc}
                            // initialValue={emailActions?.emailBody}
                            onInit={(_evt, editor) => {
                                editorRef.current = editor;
                                setIsEditorLoading(false);
                            }}
                            value={emailActions?.emailBody}
                            onClick={(editorValue) => handleEditorClickHandler(editorValue, editorRef, EMAIL_BODY)}
                            init={{
                                content_style: MAIL_DESCRIPTION_CONTENT_STYLES,
                                height: '40vh',
                                extended_valid_elements: EDITOR_CONFIGS.extendedValidElements,
                                plugins: EDITOR_CONFIGS.plugins,
                                toolbar1: EDITOR_CONFIGS.TOOLBAR1,
                                toolbar2: EDITOR_CONFIGS.TOOLBAR3,
                                setup: (editor) => {
                                    editor.ui.registry.addMenuButton('insertFieldMenu', {
                                        text: EMAIL_LABELS(t).INSERT_FIELD,
                                        search: {
                                            placeholder: EMAIL_LABELS(t).SEARCH_FIELD,
                                        },
                                        fetch: (callback) => {
                                            const items = getAllFieldsMenu(
                                                insertFieldsList,
                                                editor,
                                                dispatch,
                                                nodeConfigDataChange,
                                                dataFields,
                                            );
                                            callback(items);
                                        },
                                    });
                                },
                            }}
                            onEditorChange={(value) => onEmailStateChange(EMAIL_BODY, value)}
                            errorMessage={errorList?.[emailBodyErrorId]}
                        />
                    )
                }

            </div>
            <DocumentUpload
                label={STATIC_ATTACHMENTS}
                isDragDrop
                isMultiple
                onRetryClick={onRetryFileUpload}
                onDeleteClick={(index, fileId) => {
                    onDeletFileUpload(index, fileId);
                    onRemoveStaticFile(index, fileId);
                }}
                addFile={(files) => {
                    onFileUpload(files);
                }}
                uploadedFiles={uploadedFiles || []}
                allowedExtensions={userProfileData?.allowed_extensions}
                thumbnailUrls={(uploadedFiles || [])?.map((f) => f.url)}
                errorVariant={ErrorVariant.direct}
                errorMessage={EMPTY_STRING}
                maximumFileSize={userProfileData?.maximum_file_size || 10}
                labelClassName={styles.LabelClass}
                isLoading={uploadFile?.isFileUploadInProgress}
            />
            <div className={gClasses.MT12}>
                <MultiDropdown
                    optionList={cloneDeep(allDocumentFields)}
                    dropdownViewProps={{
                        selectedLabel: !isEmpty(emailActions?.dynamicDocLabels) && emailActions.dynamicDocLabels?.join(', '),
                        labelName: DYNAMIC_ATTACHMENTS,
                        placeholder: DYNAMIC_ATTACHEMNTS_PLACEHOLDER,
                        labelClassName: styles.LabelClass,
                        onClick: onDynamicDropdownFocus,
                        onKeyDown: onDynamicDropdownFocus,

                    }}
                    noDataFoundMessage={t(NO_FIELDS_FOUND)}
                    searchProps={{
                        searchPlaceholder: SEARCH_DOCUMENT_FIELDS,
                        searchValue: documentFieldSearchText,
                        onChangeSearch: onDocumentFieldSearch,
                    }}
                    infiniteScrollProps={{
                        dataLength: allDocumentFields.length,
                        next: loadMoreDocumentFields,
                        hasMore: hasMoreDocumentFields,
                    }}
                    onClick={onDynamicDropdownSelect}
                    selectedListValue={emailActions?.emailAttachments?.fieldUuid}
                />
            </div>

        </>
    );
}
export default SendEmailGeneral;
