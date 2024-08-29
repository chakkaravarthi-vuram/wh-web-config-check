import React, { useCallback, useState, useEffect, useRef } from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  cloneDeep,
  find,
  get,
  has,
  includes,
  isEmpty,
  nullCheck,
  set,
  unset,
  uniqBy,
} from 'utils/jsUtility';
import { BS, INPUT_TYPES } from 'utils/UIConstants';
import gClasses from 'scss/Typography.module.scss';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import Label from 'components/form_components/label/Label';
import { POPPER_PLACEMENTS } from 'components/auto_positioning_popper/AutoPositioningPopper';
import {
  DOCUMENT_TYPES,
  DROPDOWN_CONSTANTS,
  EMPTY_STRING,
  ENTITY,
} from 'utils/strings/CommonStrings';
import InputDropdown from 'components/form_components/input_dropdown/InputDropdown';
import { getExtensionFromFileName } from 'utils/generatorUtils';
import useFileUploadHook from 'hooks/useFileUploadHook';
import { FORM_POPOVER_STATUS, IMAGE_EXTENSIONS } from 'utils/Constants';
import { validate } from 'utils/UtilityFunctions';
import { axiosGetUtils } from 'axios/AxiosHelper';
import { FLOW_CONFIG_STRINGS } from 'containers/edit_flow/EditFlow.strings';
import { VALIDATION_CONSTANT } from 'utils/constants/validation.constant';
import { SEND_EMAIL_STRINGS } from '../send_email/SendEmail.strings';
import {
  DOCUMENT_GENERATION_STRINGS,
  isFileUploadField,
} from './DocumentGeneration.utils';
import EditorComponent from './EditorComponent';
import { getActionsListFromUtils } from '../send_email/SendEmail.utils';
import { DOCUMENT_TABS } from '../Configuration.strings';
import Header from './header/Header';
import Footer from './footer/Footer';
import styles from './DocumentGeneration.module.scss';
import { documentActionsValidateSchema, documentFieldNameSchema } from '../../StepConfiguration.validations';
import { getDocumentActionsValidateData } from '../../StepConfiguration.utils';
import { getFileUrl } from '../../../../../utils/attachmentUtils';
import { EDITOR_CONFIGS } from '../../../../../components/text_editor/TextEditor.utils';
import { constructServerImages, getAllTablesFromSections, showToastPopover } from '../../../../../utils/UtilityFunctions';
import { getAllFieldsList } from '../../../../../redux/actions/EditFlow.Action';
import { displayErrorToast } from '../../../../../utils/flowErrorUtils';

function DocumentGeneration(props) {
  const { t } = useTranslation();
  const {
    flowData,
    onFlowStateChange,
    stepData,
    documentTabIndex,
    stepRefUUID,
    setStepRefUUID,
  } = cloneDeep(props);

  const { docEditorRef } = props;

  const dispath = useDispatch();
  const { ERRORS } = FLOW_CONFIG_STRINGS;
  const { TEMPLATE_NAME, DOCUMENT_REFERENCE, EDITOR_STRINGS } = DOCUMENT_GENERATION_STRINGS;

  const { isAllFieldsLoading, allFields = [] } = flowData;
  const {
    actions,
    active_document_action = {},
    active_document_action: {
      action_uuid,
      document_template_name_field_uuid = {},
      file_name = EMPTY_STRING,
      document_field_name = EMPTY_STRING,
      document_body,
      document_template_field,
      image_doc_ids = [],
      headerFooterAPIStatus,
      saveClicked = false,
      document_generation_uuid,
      field_metadata = [],
    },
    document_generation_error_list = {},
    document_generation,
    is_initiation,
  } = stepData;

  const [documentFieldErrorList, setDocumentFieldErrorList] = useState(EMPTY_STRING);
  const [allDocumentFields, setAllDocumentFields] = useState([]);
  const [allTemplateNameFields, setAllTemplateNameFields] = useState([
    {
      label: 'No Supported Fields Found',
      value: null,
    },
  ]);
  const [newFieldName, setNewFieldName] = useState([]);
  const [newFieldList, setNewFieldList] = useState([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState({
    base64: EMPTY_STRING,
    imageName: EMPTY_STRING,
    file: {},
  });
  const [uploadedImages, setUploadedImages] = useState(constructServerImages(image_doc_ids));
  const [currentUploadedImage, setCurrentUploadedImage] = useState({});

  const imageUploadRef = useRef();

  const getAllFields = (...params) => {
    dispath(getAllFieldsList(...params));
  };

  useEffect(() => {
    const docFields = [];
    const nameSupportedFields = [];
    allFields &&
      allFields.forEach((field) => {
        if (isFileUploadField(field) && field.field_list_type === 'direct') {
          docFields.push({
            [DROPDOWN_CONSTANTS.OPTION_TEXT]: field.label,
            [DROPDOWN_CONSTANTS.VALUE]: field.field_uuid,
            hasUuid: true,
          });
        }
        if (TEMPLATE_NAME.SUPPORTED_FIELDS.includes(field.field_type) && field.field_list_type === 'direct') {
          nameSupportedFields.push(field);
        }
      });
    setAllDocumentFields(docFields);
    if (!isEmpty(nameSupportedFields)) setAllTemplateNameFields(nameSupportedFields);

    const templateNameField = find(allFields, {
      field_uuid: document_template_name_field_uuid,
    });

    if (!isEmpty(templateNameField)) {
      const activeStepDetails = cloneDeep(stepData);
      set(activeStepDetails.active_document_action, 'document_template_field', templateNameField);
      onFlowStateChange({ activeStepDetails });
    }
    return () => {
      setAllTemplateNameFields([
        {
          label: 'No Supported Fields Found',
          value: null,
        },
      ]);
      setAllDocumentFields([]);
      setUploadedImageUrl({
        base64: EMPTY_STRING,
        imageName: EMPTY_STRING,
        file: {},
      });
      setUploadedImages([]);
      setCurrentUploadedImage({});
    };
  }, [allFields?.length]);

  const getFileData = (doc_details, file_ref_uuid) => {
    const fileData = {
      type: DOCUMENT_TYPES.STEP_STATIC_IMAGES,
      file_type: getExtensionFromFileName(doc_details.name),
      file_name: doc_details.name,
      file_size: doc_details.size,
      file_ref_id: file_ref_uuid,
    };
    const file_metadata = [];
    file_metadata.push(fileData);
    const data = {
      file_metadata,
    };
    data.entity = ENTITY.FLOW_STEPS;
    data.entity_id = stepData._id;
    data.context_id = flowData.flow_id;
    if (stepRefUUID) data.ref_uuid = stepRefUUID;

    return data;
  };

  const { onFileUpload, documentDetails, uploadFile } = useFileUploadHook(
    getFileData,
    null,
    false,
  );

  const updateDocumentDetailsInState = (imageId, docMetaData) => {
    let constructServerImageUrl = EMPTY_STRING;

    if (window.location.protocol !== 'https:') {
      constructServerImageUrl = `https://workhall.dev/dms/display/?id=${imageId}`;
    } else {
      constructServerImageUrl = `https://${window.location.hostname}/dms/display/?id=${imageId}`;
    }

    const imageObject = cloneDeep({
      imageId,
      imageName: uploadedImageUrl.imageName,
      localImageUrl: {
        base64: uploadedImageUrl.base64,
        file: uploadedImageUrl.file,
      },
      serverImageUrl: constructServerImageUrl,
      document_details: docMetaData.document_details,
    });

    setUploadedImages([...uploadedImages, imageObject]);
    setCurrentUploadedImage(imageObject);

    // refreshing the file input to accept the same file if user selects it
    if (imageUploadRef?.current) imageUploadRef.current.value = EMPTY_STRING;
  };

  useEffect(() => {
    if (!isEmpty(documentDetails.file_metadata) && !isEmpty(uploadFile)) {
      let initial_step_ref_uuid = stepRefUUID;

      if (isEmpty(stepRefUUID)) {
        if (documentDetails && documentDetails.ref_uuid) {
          if (setStepRefUUID) setStepRefUUID(documentDetails.ref_uuid);
          initial_step_ref_uuid = documentDetails.ref_uuid;
        }
      }
      const finalPostPreviewData = {};
      const UploadedDocMetaData = [];
      if (documentDetails.entity_id) {
        finalPostPreviewData.document_details = {};
        finalPostPreviewData.document_details.entity = documentDetails.entity;
        finalPostPreviewData.document_details.entity_id =
          documentDetails.entity_id;
        finalPostPreviewData.document_details.ref_uuid = initial_step_ref_uuid;
        if (documentDetails.file_metadata) {
          documentDetails.file_metadata.forEach((file_info) => {
            UploadedDocMetaData.push({
              upload_signed_url: getFileUrl(file_info?.upload_signed_url),
              type: file_info.type,
              document_id: file_info._id,
            });
          });
        }
        finalPostPreviewData.document_details.uploaded_doc_metadata =
          UploadedDocMetaData;
      }
      let docDetails = {};
      if (finalPostPreviewData.document_details) {
        docDetails = {
          document_details: finalPostPreviewData.document_details,
        };
      }
      updateDocumentDetailsInState(
        documentDetails.file_metadata[0]._id,
        docDetails,
      );
    }
  }, [
    documentDetails && documentDetails.file_metadata,
    documentDetails &&
      documentDetails.file_metadata &&
      documentDetails.file_metadata.length,
  ]);

  const handleImageUpload = (event) => {
    event.preventDefault();
    const reader = new FileReader();
    const file = event.target.files[0];

    if (
      !includes(IMAGE_EXTENSIONS, getExtensionFromFileName(file.name)) ||
      file.type === EMPTY_STRING
    ) {
      showToastPopover(
        t(VALIDATION_CONSTANT.INVALID_FILE),
        t(VALIDATION_CONSTANT.ALLOWED_TYPES),
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
      return null;
    }

    reader.onloadend = () => {
      const imageName = file.name;
      const base64 = reader.result.split(',')[1];

      setUploadedImageUrl({ base64, imageName, file });
      onFileUpload({ files: [file] });
    };
    if (file !== null) {
      reader.readAsDataURL(file);
    }
    return null;
  };

   // getting all header & footer documents id
   const headerId = get(active_document_action, ['header_document', '_id'], null);
   const footerId = get(active_document_action, ['footer_document', '_id'], null);

   const docArray = [
     { id: headerId, value: 'header_body' },
     { id: footerId, value: 'footer_body' },
   ];

  const setHeaderFooter = async (stepData) => {
    const activeStepDetails = cloneDeep(stepData);

    try {
      const documentTobeResolved = docArray.map(async (eachDoc) => {
        if (!isEmpty(eachDoc?.id)) {
          const response = await axiosGetUtils(`/dms/display/?id=${eachDoc?.id}`);
          return {
            value: eachDoc?.value,
            content: response?.data || EMPTY_STRING,
          };
        }
        return {
          value: eachDoc?.value,
          content: EMPTY_STRING,
        };
      });

      const documentToBeSaved = await Promise.all(documentTobeResolved);

      documentToBeSaved?.forEach((eachDoc, index) => {
        set(activeStepDetails.active_document_action, [eachDoc?.value], eachDoc?.content);
        if (index === documentToBeSaved.length - 1) {
          set(activeStepDetails.active_document_action, 'headerFooterAPIStatus', true);
          onFlowStateChange({ activeStepDetails });
        }
      });
    } catch (err) {
      console.log('setHeaderFooter Error', err);
      displayErrorToast({ title: t('error_popover_status.somthing_went_wrong') });
    }
  };

  const isDocumentFieldExist = (fileName, key) => {
    if (isEmpty(document_generation) || isEmpty(fileName)) return false;

    try {
      let isExist = false;

      document_generation?.map((eachDoc) => {
        if (isEmpty(eachDoc) || isExist) return null;

        if (document_generation_uuid !== eachDoc?.document_generation_uuid) {
          if (!isEmpty(key)) {
            if (
              eachDoc[key] === fileName
            ) {
              isExist = true;
            }
          } else {
            if (
              eachDoc?.file_name?.trim() === fileName?.trim()
            ) {
              isExist = true;
            }
          }
        }

        return null;
      });

      return isExist;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const validateFields = (stepData, id) => {
    console.log('validateFieldsvalidateFields', id, saveClicked);
    if (isEmpty(id) || !saveClicked) return stepData;

    const activeStepDetails = cloneDeep(stepData);

    const {
      active_document_action = {},
    } = activeStepDetails;

    const error_list = validate(
      getDocumentActionsValidateData(
        cloneDeep(activeStepDetails),
      ),
      documentActionsValidateSchema(t),
    );

    if (!isEmpty(active_document_action?.file_name) && isDocumentFieldExist(active_document_action.file_name)) {
      set(error_list, 'file_name', t(ERRORS.DOC_TEMPLATE_UNIQUE_ERROR));
    }
    if (!isEmpty(active_document_action?.document_template_field) && isDocumentFieldExist(active_document_action?.document_template_field?.field_uuid, 'document_template_name_field_uuid')) {
      set(error_list, 'file_name', t(ERRORS.DOC_TEMPLATE_UNIQUE_ERROR));
    }
    if (isEmpty(active_document_action.file_name) && isEmpty(active_document_action.document_template_field)) {
      set(error_list, 'file_name', t(ERRORS.DOC_TEMPLATE_NAME_REQUIRED));
    }

    if (!has(error_list, [id]) && has(document_generation_error_list, [id])) {
      unset(activeStepDetails, ['document_generation_error_list', id]);
    } else if (has(error_list, [id])) {
      set(activeStepDetails, ['document_generation_error_list', id], error_list[id]);
    } else {
      // do nothing
    }

    return activeStepDetails;
  };

  const onChangeHandler = (event, selectedFieldsList, isHeaderFooter) => {
    const activeStepDetails = cloneDeep(stepData);
    if (isEmpty(activeStepDetails.active_document_action)) {
      activeStepDetails.active_document_action = {};
    }
    set(
      activeStepDetails.active_document_action,
      event.target.id,
      event.target.value,
    );

    if (!isHeaderFooter) {
      set(
        activeStepDetails.active_document_action,
        'selectedFieldsList',
        selectedFieldsList,
      );
    }

    let imageUploaded = uploadedImages;

    if (isEmpty(imageUploaded) && !isEmpty(image_doc_ids)) {
      imageUploaded = constructServerImages(image_doc_ids);
    }

    set(
      activeStepDetails.active_document_action,
      'uploadedImages',
      imageUploaded,
    );

    if (activeStepDetails.document_generation_error_list) {
      unset(
        activeStepDetails.document_generation_error_list,
        DOCUMENT_GENERATION_STRINGS.DOCUMENT_BODY.ID,
      );
    }

    let updatedActiveStepDetails = activeStepDetails;

    if (isEmpty(event.target.value)) {
      updatedActiveStepDetails = validateFields(activeStepDetails, DOCUMENT_GENERATION_STRINGS.DOCUMENT_BODY.ID);
    }

    if ((headerId && !headerFooterAPIStatus) || (footerId && !headerFooterAPIStatus)) setHeaderFooter(updatedActiveStepDetails);
    else onFlowStateChange({ activeStepDetails: updatedActiveStepDetails });
  };

  const allTableFields = [];
  const allFieldsWithoutTable = [];

  [...(allFields || []), ...(field_metadata || [])]?.forEach((field) => {
    if (
      field.field_list_type === 'table' &&
      !isFileUploadField(field)
    ) {
      allTableFields.push(field);
    } else if (
      field.field_list_type === 'direct' &&
      field.field_type !== 'table' &&
      !isFileUploadField(field)
    ) {
      allFieldsWithoutTable.push(field);
    }
  });

  const allTablesFields = getAllTablesFromSections(allTableFields, allFields);

  allFieldsWithoutTable.push({
    id: 'system-fields-optionlist',
    label: t(EDITOR_STRINGS.SYSTEM_FIELDS_LABEL),
    value: 'SYSTEM FIELDS',
    field_uuid: 'system-fields-optionlist',
  });

  if (allFieldsWithoutTable && allFieldsWithoutTable.length === 1) {
    allFieldsWithoutTable.unshift({
      id: 'no-form-fields',
      label: 'No Fields Found',
      value: 'No Fields Found',
      field_uuid: 'no-form-fields',
    });
  }

  allFieldsWithoutTable.unshift({
    id: 'form-fields-optionlist',
    label: t(EDITOR_STRINGS.FORM_FIELDS_LABEL),
    value: 'FORM FIELDS',
    field_uuid: 'form-fields-optionlist',
  });

  const fieldDropDownOptions = [].concat(
    uniqBy(allFieldsWithoutTable, (field) => field.field_uuid),
    SEND_EMAIL_STRINGS.SYSTEM_FIELD_OPTIONS_LIST(t),
  );

  const getActionsList = () => {
    const dropdownList = getActionsListFromUtils(actions, is_initiation);
    return dropdownList;
  };

  const onChooseActionDropdownChangeHandler = (event) => {
    const activeStepDetails = cloneDeep(stepData);
    if (nullCheck(event, 'target.id')) {
      const {
        target: { value, id },
      } = event;
      if (isEmpty(activeStepDetails.active_document_action[id])) {
        activeStepDetails.active_document_action[id] = [];
      }
      const index = activeStepDetails.active_document_action[
        id
      ].findIndex((action) => action === value);
      if (index > -1) {
        activeStepDetails.active_document_action[id].splice(
          index,
          1,
        );
      } else {
        activeStepDetails.active_document_action[id].push(value);
      }

      const updatedActiveStepDetails = validateFields(activeStepDetails, id);
      onFlowStateChange({ activeStepDetails: updatedActiveStepDetails });
    }
  };
  const onNameChangeHandler = (event) => {
    const activeStepDetails = cloneDeep(stepData);
    if (nullCheck(event, 'target.id')) {
      const {
        target: { value, id },
      } = event;
      activeStepDetails.active_document_action[id] = value;
      unset(activeStepDetails.active_document_action, TEMPLATE_NAME.DROPDOWN_FIELD);
      const updatedActiveStepDetails = validateFields(activeStepDetails, TEMPLATE_NAME.INPUT_ID);
      onFlowStateChange({ activeStepDetails: updatedActiveStepDetails });
    }
  };

  let currentTabComponent = null;

  const onDropdownVisibility = useCallback(
    (isDropdownVisibility) => {
      if (!isDropdownVisibility) {
        setNewFieldName(EMPTY_STRING);
        setDocumentFieldErrorList(EMPTY_STRING);
      }
    },
    [flowData],
  );

  const handleDocFieldNameChange = (event) => {
    const activeStepDetails = cloneDeep(stepData);
    if (nullCheck(event, 'target.id')) {
      const {
        target: { value, id },
      } = event;
      const currentField = find(allFields, {
        value,
      });
      if (!isEmpty(currentField)) {
        unset(activeStepDetails.active_document_action, TEMPLATE_NAME.INPUT_ID);
        activeStepDetails.active_document_action[id] =
          currentField;

        const updatedActiveStepDetails = validateFields(activeStepDetails, TEMPLATE_NAME.INPUT_ID);
        onFlowStateChange({ activeStepDetails: updatedActiveStepDetails });
      }
    }
  };

  const removeSelectedTag = () => {
    const activeStepDetails = cloneDeep(stepData);
    unset(activeStepDetails.active_document_action, TEMPLATE_NAME.DROPDOWN_ID);
    unset(activeStepDetails.active_document_action, TEMPLATE_NAME.DROPDOWN_FIELD);
    const updatedActiveStepDetails = validateFields(activeStepDetails, TEMPLATE_NAME.INPUT_ID);
    onFlowStateChange({ activeStepDetails: updatedActiveStepDetails });
  };

  const onNewFieldNameChangeHandler = (event) => {
    setNewFieldName(event.target.value);
    setDocumentFieldErrorList(EMPTY_STRING);
  };

  const isDocumentNameExist = (fieldName) => {
    let isExist = false;

    const allDocFields = [...allDocumentFields, ...newFieldList];

    allDocFields?.map((field) => {
      if (field.label === fieldName) isExist = true;
      return null;
    });

    return isExist;
  };

  const onAddNewField = (closeDropdown) => {
  try {
    const activeStepDetails = cloneDeep(stepData);

    const errorList = validate(
      {
        document_field_name: newFieldName || EMPTY_STRING,
      },
      documentFieldNameSchema(t),
    );

    if (isDocumentNameExist(newFieldName)) {
      set(errorList, 'document_field_name', 'Document Field Name must be unique');
    }

    if (!isEmpty(errorList)) {
      setDocumentFieldErrorList(errorList?.document_field_name);
      return null;
    }

    setNewFieldList((newFieldList) => [
      ...newFieldList,
      {
        [DROPDOWN_CONSTANTS.OPTION_TEXT]: newFieldName,
        [DROPDOWN_CONSTANTS.VALUE]: newFieldName,
        hasUuid: false,
      },
    ]);

    activeStepDetails.active_document_action[
      DOCUMENT_REFERENCE.FIELD_NAME
    ] = newFieldName;

    unset(
      activeStepDetails.active_document_action,
      DOCUMENT_REFERENCE.FIELD_UUID,
    );

    const updatedactiveStepDetails = validateFields(activeStepDetails, DOCUMENT_REFERENCE.FIELD_NAME);
    onFlowStateChange({ activeStepDetails: updatedactiveStepDetails });
    if (closeDropdown) closeDropdown();
  } catch (e) {
    console.log(e);
  }

    return null;
  };

  const handleDocumentFieldChange = (event) => {
    const activeStepDetails = cloneDeep(stepData);
    if (nullCheck(event, 'target.id')) {
      const {
        target: { value },
      } = event;
      const currentDocField = find(allDocumentFields, {
        value,
      });
      if (isEmpty(currentDocField)) {
        activeStepDetails.active_document_action[
          DOCUMENT_REFERENCE.FIELD_NAME
        ] = value;
        unset(
          activeStepDetails.active_document_action,
          DOCUMENT_REFERENCE.FIELD_UUID,
        );
      } else {
        activeStepDetails.active_document_action[
          DOCUMENT_REFERENCE.FIELD_NAME
        ] = currentDocField.label;
        activeStepDetails.active_document_action[
          DOCUMENT_REFERENCE.FIELD_UUID
        ] = currentDocField.value;
      }

      const updatedActiveStepDetails = validateFields(activeStepDetails, DOCUMENT_REFERENCE.FIELD_NAME);
      onFlowStateChange({ activeStepDetails: updatedActiveStepDetails });
    }
  };
  const templateNameTooltip = `${t(TEMPLATE_NAME.TOOLTIP_TEXT)} ${TEMPLATE_NAME.TOOLTIP_SYMBOLS}`;

  switch (documentTabIndex) {
    case DOCUMENT_TABS.BASIC: {
      currentTabComponent = (
        <div
          className={cx(BS.D_BLOCK, BS.JC_BETWEEN, gClasses.CenterV, BS.W100)}
        >
          <Dropdown
            id={DOCUMENT_GENERATION_STRINGS.ACTION_TYPE.ID}
            label={t(DOCUMENT_GENERATION_STRINGS.ACTION_TYPE.LABEL)}
            placeholder={t(DOCUMENT_GENERATION_STRINGS.ACTION_TYPE.CHOOSE_ACTION_BUTTON)}
            optionList={getActionsList()}
            onChange={onChooseActionDropdownChangeHandler}
            selectedValue={action_uuid}
            errorMessage={
              document_generation_error_list &&
              document_generation_error_list[
                DOCUMENT_GENERATION_STRINGS.ACTION_TYPE.ID
              ]
            }
            isMultiSelect
            isRequired
          />
          <InputDropdown
            id={DOCUMENT_GENERATION_STRINGS.TEMPLATE_NAME.INPUT_ID}
            label={t(DOCUMENT_GENERATION_STRINGS.TEMPLATE_NAME.LABEL)}
            dropdownId={TEMPLATE_NAME.DROPDOWN_FIELD}
            optionList={allTemplateNameFields}
            selectedTagValue={[document_template_field]}
            errorMessage={
              document_generation_error_list &&
              document_generation_error_list[
                DOCUMENT_GENERATION_STRINGS.TEMPLATE_NAME.ID
              ]
            }
            value={file_name}
            dropdownListClasses={styles.DocumentNameList}
            onChange={onNameChangeHandler}
            onDropdownChange={handleDocFieldNameChange}
            removeSelectedTag={removeSelectedTag}
            isHideInput={!isEmpty(document_template_field)}
            innerClassName={
              !isEmpty(document_template_field)
                ? gClasses.P5
                : EMPTY_STRING
            }
            dropdownPlaceholder={t(TEMPLATE_NAME.PLACEHOLDER)}
            helperToolTipId={TEMPLATE_NAME.TOOLTIP_ID}
            helperTooltipMessage={templateNameTooltip}
            required
          />
          <Label
            content={t(DOCUMENT_GENERATION_STRINGS.DOCUMENT_BODY.LABEL)}
            hideLabelClass
            isRequired
          />
          <EditorComponent
            id={DOCUMENT_GENERATION_STRINGS.DOCUMENT_BODY.ID}
            fieldDropDownOptions={fieldDropDownOptions}
            tableDropDownOptions={allTablesFields}
            flowData={flowData}
            stepData={stepData}
            getAllFields={getAllFields}
            onChangeHandler={onChangeHandler}
            active_document_action={active_document_action}
            isAllFieldsLoading={isAllFieldsLoading}
            errorMessage={
              document_generation_error_list &&
              document_generation_error_list[
                DOCUMENT_GENERATION_STRINGS.DOCUMENT_BODY.ID
              ]
            }
            editorHeight="60vh"
            toolbar1={EDITOR_CONFIGS.DOC_TOOLBAR1}
            toolbar2={EDITOR_CONFIGS.BODY_TOOLBAR2}
            imageUploadRef={imageUploadRef}
            uploadedImages={uploadedImages}
            setCurrentUploadedImage={setCurrentUploadedImage}
            currentUploadedImage={currentUploadedImage}
            initialEditorState={document_body}
          />
          <Dropdown
            id={DOCUMENT_REFERENCE.ID}
            label={t(DOCUMENT_GENERATION_STRINGS.DOCUMENT_REFERENCE.LABEL)}
            dropdownListCreateLabel={
              t(DOCUMENT_GENERATION_STRINGS.DOCUMENT_REFERENCE
                .CREATE_FIELD_PLACEHOLDER)
            }
            dropdownListChooseLabel={
              t(DOCUMENT_GENERATION_STRINGS.DOCUMENT_REFERENCE.LIST_LABEL)
            }
            dropdownListNotFoundLabel={
              t(DOCUMENT_GENERATION_STRINGS.DOCUMENT_REFERENCE.NO_FIELDS)
            }
            ButtonLabelMultiSectionDropdown={
              t(DOCUMENT_GENERATION_STRINGS.DOCUMENT_REFERENCE.ADD_FIELD)
            }
            placeholder={
              t(DOCUMENT_GENERATION_STRINGS.DOCUMENT_REFERENCE.PLACEHOLDER)
            }
            optionList={[...allDocumentFields, ...newFieldList]}
            onChange={handleDocumentFieldChange}
            selectedValue={document_field_name}
            onInputChangeHandler={onNewFieldNameChangeHandler}
            onButtonClick={onAddNewField}
            stopPropagationFromButton
            inputValue={newFieldName}
            setSelectedValue
            strictlySetSelectedValue
            errorMessage={
              document_generation_error_list &&
              document_generation_error_list[
                DOCUMENT_GENERATION_STRINGS.DOCUMENT_REFERENCE.FIELD_NAME
              ]
            }
            textError={documentFieldErrorList}
            isMultiSectionDropdown
            isRequired
            disableFocusFilter
            placement={POPPER_PLACEMENTS.TOP}
            dropdownVisibility={onDropdownVisibility}
            waitForApiResponse
          />
        </div>
      );
      break;
    }
    case DOCUMENT_TABS.HEADER: {
      currentTabComponent = (
        <div>
          <Header
            id={DOCUMENT_GENERATION_STRINGS.DOCUMENT_BODY.ID}
            fieldDropDownOptions={fieldDropDownOptions}
            tableDropDownOptions={allTablesFields}
            flowData={flowData}
            stepData={stepData}
            getAllFields={getAllFields}
            onChangeHandler={onChangeHandler}
            active_document_action={active_document_action}
            isAllFieldsLoading={isAllFieldsLoading}
            imageUploadRef={imageUploadRef}
            uploadedImages={uploadedImages}
            setCurrentUploadedImage={setCurrentUploadedImage}
            currentUploadedImage={currentUploadedImage}
            updateFlowState={onFlowStateChange}
            document_generation_error_list={document_generation_error_list}
            docEditorRef={docEditorRef}
          />
        </div>
      );
      break;
    }
    case DOCUMENT_TABS.FOOTER: {
      currentTabComponent = (
        <div>
          <Footer
            id={DOCUMENT_GENERATION_STRINGS.DOCUMENT_BODY.ID}
            fieldDropDownOptions={fieldDropDownOptions}
            tableDropDownOptions={allTablesFields}
            flowData={flowData}
            stepData={stepData}
            getAllFields={getAllFields}
            onChangeHandler={onChangeHandler}
            active_document_action={active_document_action}
            isAllFieldsLoading={isAllFieldsLoading}
            imageUploadRef={imageUploadRef}
            uploadedImages={uploadedImages}
            setCurrentUploadedImage={setCurrentUploadedImage}
            currentUploadedImage={currentUploadedImage}
            updateFlowState={onFlowStateChange}
            document_generation_error_list={document_generation_error_list}
            docEditorRef={docEditorRef}
          />
        </div>
      );
      break;
    }
    default:
      break;
  }

  return (
    <>
      {currentTabComponent}
      <input
        id="doc-gen-image-upload"
        type={INPUT_TYPES.FILE}
        className={cx(BS.INVISIBLE, BS.P_ABSOLUTE)}
        onChange={handleImageUpload}
        ref={imageUploadRef}
        accept={IMAGE_EXTENSIONS}
      />
    </>
  );
}

export default DocumentGeneration;
