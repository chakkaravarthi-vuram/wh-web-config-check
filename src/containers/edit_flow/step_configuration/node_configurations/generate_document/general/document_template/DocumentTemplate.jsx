import React, { useEffect, useRef, useState } from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import {
  Skeleton,
  Text,
  ETextSize,
} from '@workhall-pvt-lmt/wh-ui-library';
import { useSelector } from 'react-redux';
import { includes, isEmpty } from 'utils/jsUtility';
import TextEditor from '../../../../../../../components/text_editor/TextEditor';
import {
  DOCUMENT_TYPES,
  EMPTY_STRING,
  ENTITY,
} from '../../../../../../../utils/strings/CommonStrings';
import {
  CONTENT_STYLES,
  EDITOR_CONFIGS,
  getAllFieldsMenu,
  getAllTablesMenu,
  getTableDocumentGenerationRawHtml,
  onRemoveClickHandler,
} from './DocumentTemplate.utils';
import gClasses from '../../../../../../../scss/Typography.module.scss';
import {
  nodeConfigDataChange,
  useFlowNodeConfig,
} from '../../../../../node_configuration/use_node_reducer/useNodeReducer';
import { INPUT_TYPES } from '../../../../../../../utils/UIConstants';
import {
  DEFAULT_FILE_UPLOAD_SIZE_IN_BYTES,
  DOC_GEN_IMG_EXTENSIONS as IMAGE_EXTENSIONS,
} from '../../../../../../../utils/Constants';
import { getExtensionFromFileName } from '../../../../../../../utils/generatorUtils';
import { VALIDATION_CONSTANT } from '../../../../../../../utils/constants/validation.constant';
import useFileUploadHook from '../../../../../../../hooks/useFileUploadHook';
import TableModalComponent from './TableModalComponent';
import { cloneDeep } from '../../../../../../../utils/jsUtility';
import styles from './DocumentTemplate.module.scss';
import { INSERT_IMAGE_MAX_FILE_SIZE, RESPONSE_FIELD_KEYS } from '../../GenerateDocument.constants';
import { displayErrorToast } from '../../../../../../../utils/flowErrorUtils';
import './DocumentTemplate.css';
import { HEADER_AND_FOOTER_HEIGHT } from '../../../../../../../components/text_editor/TextEditor.constants';

function DocumentTemplate(props) {
  const { allowInsert = false, value, id, loaderHeight, editorRef, errorMessage, isBody = false, isHeaderFooter } = props;

  const { t } = useTranslation();

  const [isEditorLoading, setIsEditorLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState({});
  const [insertColumnModalOpen, setInsertColumnModalOpen] = useState(false);
  const [isTableInsertDisabled, setTableInsertDisabled] = useState(false);
  const [editorContent, setEditorContent] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState({
    base64: EMPTY_STRING,
    imageName: EMPTY_STRING,
    file: {},
  });

  useEffect(() => {
    setEditorContent(value);
  }, []);

  const imageUploadRef = useRef();
  const { flowData } = useSelector((state) => state.EditFlowReducer);

  const { state, dispatch } = useFlowNodeConfig();

  const { insertFieldsList, allTablesFields, allDocuments = [], refUuid, removedDocList = [], templateDocId, staticValueDetails = {}, errorList = {} } = state;

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
    data.entity_id = state.stepId;
    data.context_id = flowData.flow_id;
    if (refUuid) data.ref_uuid = refUuid;

    return data;
  };

  const { onFileUpload, documentDetails } = useFileUploadHook(
    getFileData,
    null,
    false,
  );

  useEffect(() => {
    if (documentDetails?.file_metadata?.length) {
      let constructServerImageUrl;
      const imageId = documentDetails?.file_metadata?.[0]?._id;
      if (window.location.protocol !== 'https:') {
        constructServerImageUrl = `https://workhall.dev/dms/display/?id=${imageId}`;
      } else {
        constructServerImageUrl = `https://${window.location.hostname}/dms/display/?id=${imageId}`;
      }

        const imageContent = `<img key="image-key-${new Date().getTime()}" id="doc-gen-image-${imageId}" style="max-width: 100%;" data-image-id="${imageId}" src="${constructServerImageUrl}" alt="${
          uploadedImageUrl?.imageName
        }" title="${uploadedImageUrl?.imageName}" />`;

        editorRef?.current?.insertContent(imageContent);

      // refreshing the file input to accept the same file if user selects it
      if (imageUploadRef?.current) imageUploadRef.current.value = EMPTY_STRING;
      const clonedImages = cloneDeep(allDocuments);
      clonedImages.push(documentDetails?.file_metadata?.[0]);
      console.log('documentDetailsdocumentDetails', documentDetails);
      dispatch(
        nodeConfigDataChange({
          allDocuments: clonedImages,
          refUuid: documentDetails?.ref_uuid,
        }),
      );
    }
  }, [documentDetails?.file_metadata, documentDetails?.file_metadata?.length]);

  const handleEditorStateChange = (editorHtml) => {
    console.log('editorStateChange', editorHtml);
    const clonedErrorList = cloneDeep(errorList);

    if (value === editorHtml) return;
    const addOnData = {
      [RESPONSE_FIELD_KEYS.REMOVED_DOC_LIST]: removedDocList || [],
    };
    if (id === RESPONSE_FIELD_KEYS.DOCUMENT_BODY) {
      if (!isEmpty(templateDocId)) {
        addOnData[RESPONSE_FIELD_KEYS.REMOVED_DOC_LIST]?.push(templateDocId);
      }
      delete clonedErrorList?.[id];
      addOnData[RESPONSE_FIELD_KEYS.TEMPLATE_DOC_ID] = null;
    } else if (id === RESPONSE_FIELD_KEYS.DOCUMENT_HEADER) {
      const clonedHeader = cloneDeep(state?.headerDocument);

      const headerBody = editorRef?.current?.getBody?.();

      if (headerBody?.offsetHeight < HEADER_AND_FOOTER_HEIGHT) {
        delete clonedErrorList?.[id];
      }
      if (!isEmpty(state?.headerDocument?._id)) {
        addOnData[RESPONSE_FIELD_KEYS.REMOVED_DOC_LIST]?.push(state?.headerDocument?._id);
      }
      clonedHeader._id = null;
      addOnData.headerDocument = clonedHeader;
    } else if (id === RESPONSE_FIELD_KEYS.DOCUMENT_FOOTER) {
      const clonedFooter = cloneDeep(state?.footerDocument);
      if (!isEmpty(state?.footerDocument?._id)) {
        addOnData[RESPONSE_FIELD_KEYS.REMOVED_DOC_LIST]?.push(state?.footerDocument?._id);
      }

      const footerBody = editorRef?.current?.getBody?.();

      if (footerBody?.offsetHeight < HEADER_AND_FOOTER_HEIGHT) {
        delete clonedErrorList?.[id];
      }
      clonedFooter._id = null;
      addOnData.footerDocument = clonedFooter;
    }

    dispatch(
      nodeConfigDataChange({
        [id]: editorHtml,
        errorList: clonedErrorList,
        ...addOnData,
      }),
    );
  };

  const openInsertTableModal = (table) => {
    setSelectedTable(table);
    setInsertColumnModalOpen(true);
  };

  const handleImageUpload = (event) => {
    event.preventDefault();
    const reader = new FileReader();
    const file = event.target.files[0];
    const fileType = getExtensionFromFileName(file.name)?.toLowerCase();
    if (
      (file.type === EMPTY_STRING) ||
      (
        !includes(IMAGE_EXTENSIONS, fileType) ||
        !includes(staticValueDetails?.allowedFileTypes, fileType)
      )
    ) {
      const allowedExtensions = cloneDeep(IMAGE_EXTENSIONS);
      const allowedExtensionsInAdminSettings = allowedExtensions.filter((type) => staticValueDetails?.allowedFileTypes?.includes(type.toLowerCase()));
      displayErrorToast({
        title: t(VALIDATION_CONSTANT.INVALID_FILE),
        subtitle: `${t(VALIDATION_CONSTANT.ALLOWED_SPECIFIC_FILE_TYPES)} ${allowedExtensionsInAdminSettings.join(', ')}`,
      });
      return null;
    }
    const maximumFileSize = staticValueDetails?.maximumFileSize > INSERT_IMAGE_MAX_FILE_SIZE ? INSERT_IMAGE_MAX_FILE_SIZE : staticValueDetails?.maximumFileSize;
    if (file.size > (maximumFileSize * DEFAULT_FILE_UPLOAD_SIZE_IN_BYTES)) {
      displayErrorToast({
        title: t(VALIDATION_CONSTANT.FILE_SIZE_EXCEED),
        subtitle: `${t(VALIDATION_CONSTANT.LESS_FILE_SIZE)} ${maximumFileSize}MB`,
      });
      return null;
    }

    reader.onloadend = () => {
      onFileUpload({ files: [file] });
      const imageName = file.name;
      const base64 = reader.result.split(',')[1];

      setUploadedImageUrl({ base64, imageName, file });
    };
    if (file !== null) {
      reader.readAsDataURL(file);
    }
    return null;
  };

  // functions applicable only for document generation template body -- end

  const onCloseModal = () => {
    setInsertColumnModalOpen(false);
  };

  const onInsertTableClick = (table, selectedColumns) => {
    editorRef.current.insertContent(
      getTableDocumentGenerationRawHtml(
        table.tableUuid,
        selectedColumns,
        table.label,
      ),
    );
    onCloseModal();
  };

  const editorLoader = (
    <div>
      <Skeleton width="100%" height={50} />
      <Skeleton width="100%" height={loaderHeight || 240} />
    </div>
  );

  console.log('insertFieldsListeditorLoader', insertFieldsList, isEditorLoading, allTablesFields);

  if (isEmpty(insertFieldsList)) {
    return editorLoader;
  }

  const handleEditorClickHandler = (editorValue) => {
    if (allowInsert) {
      return onRemoveClickHandler(
        editorValue,
        editorRef,
        handleEditorStateChange,
      );
    }
    return null;
  };

  return (
    <>
      {!isEmpty(insertFieldsList) && (
        <>
          <div className={!isEmpty(errorMessage) && styles.EditorError}>
            <TextEditor
              id={id}
              tinymceScriptSrc={process.env.PUBLIC_URL + EDITOR_CONFIGS.scriptSrc}
              initialValue={editorContent}
              onInit={(_evt, editor) => {
                editorRef.current = editor;
                setIsEditorLoading(false);
              }}
              value={value}
              onClick={handleEditorClickHandler}
              isHeaderFooter={isHeaderFooter}
              editorRef={editorRef}
              init={{
                content_style: CONTENT_STYLES,
                height: isBody ? '40vh' : '250px',
                width: 694,
                table_toolbar: EDITOR_CONFIGS.table_toolbar,
                extended_valid_elements: EDITOR_CONFIGS.extendedValidElements,
                plugins: EDITOR_CONFIGS.plugins,
                toolbar1: EDITOR_CONFIGS.TOOLBAR1,
                toolbar2: EDITOR_CONFIGS.TOOLBAR2,
                setup: (editor) => {
                  allowInsert &&
                    editor.ui.registry.addMenuButton('insertFieldMenu', {
                      text: 'Insert field',
                      search: {
                        placeholder: 'Search field',
                      },
                      fetch: (callback) => {
                        const items = getAllFieldsMenu(
                          insertFieldsList,
                          editor,
                          dispatch,
                        );
                        callback(items);
                      },
                    });

                  allowInsert &&
                    editor.ui.registry.addMenuButton('insertTableMenu', {
                      text: 'Insert table',
                      search: {
                        placeholder: 'Search Table',
                      },
                      fetch: (callback) => {
                        const items = getAllTablesMenu(
                          allTablesFields,
                          openInsertTableModal,
                          t,
                        );
                        callback(items);
                      },
                    });

                  editor.ui.registry.addButton('insertImageMenu', {
                    icon: 'image',
                    tooltip: 'Insert image',
                    onAction: () => {
                      const rawEditorContent = editor.getContent({
                        format: 'text',
                      });

                      if (
                        (rawEditorContent?.length < 28 || !isHeaderFooter) &&
                        imageUploadRef?.current
                      ) {
                        imageUploadRef?.current?.click();
                      }
                    },
                  });
                },
              }}
              onEditorChange={handleEditorStateChange}
              onNodeChange={(currentNodeObj) => {
                if (currentNodeObj?.element &&
                  currentNodeObj.element.nodeName === 'TD'
                ) {
                  setTableInsertDisabled(true);
                } else {
                  setTableInsertDisabled(false);
                }
              }}
            />
          </div>
          {!isEmpty(errorMessage) &&
            <div className={gClasses.PT4}>
              <Text
                content={errorMessage}
                size={ETextSize.XS}
                className={gClasses.FTwo11RedV22}
              />
            </div>
          }
        </>
      )}
      {insertColumnModalOpen && (
        <TableModalComponent
          isModalOpen
          onCloseClick={onCloseModal}
          currentTable={selectedTable}
          onInsertTableClick={onInsertTableClick}
          isTableInsertDisabled={isTableInsertDisabled}
        />
      )}
      <input
        id="doc-gen-image-upload"
        type={INPUT_TYPES.FILE}
        className={cx(gClasses.DisplayNone)}
        onChange={handleImageUpload}
        ref={imageUploadRef}
        accept={IMAGE_EXTENSIONS}
      />
    </>
  );
}

export default DocumentTemplate;
