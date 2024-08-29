import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import { cloneDeep, isEmpty } from 'utils/jsUtility';
import './EditorCustomStyles.css';
import { axiosGetUtils } from 'axios/AxiosHelper';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import Skeleton from 'react-loading-skeleton';
import HelperMessage, {
  HELPER_MESSAGE_TYPE,
} from 'components/form_components/helper_message/HelperMessage';
import styles from './DocumentGeneration.module.scss';
import { SEND_EMAIL_STRINGS } from '../send_email/SendEmail.strings';
import {
  CONTENT_STYLES,
  getAllFieldsMenu,
  getAllTablesMenu,
  getTableDocumentGenerationRawHtml,
  onEditorTemplateStateChange,
  DOCUMENT_GENERATION_STRINGS,
  onRemoveClickHandler,
  extractHTMLFromString,
  IGNORED_FIELD_TYPES,
} from './DocumentGeneration.utils';
import TableModalComponent from './TableModalComponent';
import TextEditor from '../../../../../components/text_editor/TextEditor';
import { EDITOR_CONFIGS } from '../../../../../components/text_editor/TextEditor.utils';
import { getEditorUIValue } from '../../node_configurations/generate_document/general/document_template/DocumentTemplate.utils';

function EditorComponent(props) {
  const { t } = useTranslation();
  const {
    id,
    fieldDropDownOptions,
    flowData,
    getAllFields,
    onChangeHandler,
    tableDropDownOptions,
    active_document_action,
    active_document_action: { selectedFieldsList, headerFooterAPIStatus },
    isAllFieldsLoading,
    hideMessage,
    errorMessage,
    editorHeight,
    toolbar1,
    toolbar2,
    loaderHeight,
    uploadedImages,
    setCurrentUploadedImage,
    currentUploadedImage,
    imageUploadRef,
    isHeaderFooter,
    headerFooterDocId,
    initialEditorState,
  } = cloneDeep(props);

  const { docEditorRef = {} } = props;

  const { EDITOR_STRINGS } = DOCUMENT_GENERATION_STRINGS;
  const editorRef = useRef(null);
  const notificationRef = useRef(null);
  const fetchingAllFields = useRef(true);
  const [initialEditorValue, setInitialEditorValue] =
    useState(initialEditorState);
  const [currentEditorValue, setCurrentEditorValue] =
    useState();
  const [selectedTableColumnList, setSelectedTableColumnList] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTable, setCurrentTable] = useState({});
  const [isEditorLoading, setIsEditorLoading] = useState(true);
  const [isTableInsertDisabled, setTableInsertDisabled] = useState(false);

  const setFetchingAllFields = (status) => {
    if (fetchingAllFields) fetchingAllFields.current = status;
  };

  useEffect(() => {
    if (isEmpty(initialEditorState)) {
      if (!isHeaderFooter) {
        if (!isAllFieldsLoading && !fetchingAllFields?.current) {
          if (
            active_document_action?.template_doc_id
          ) {
            axiosGetUtils(
              `/dms/display/?id=${active_document_action.template_doc_id}`,
            )
              .then((response) => {
                const initVal = getEditorUIValue(
                  response.data,
                  active_document_action.data_fields,
                  fieldDropDownOptions,
                  SEND_EMAIL_STRINGS.SYSTEM_FIELD_OPTIONS_LIST(t),
                );
                setInitialEditorValue(initVal);
              })
              .catch((error) => {
                console.log('Doc generation Error', error);
              });
          }
        }
      }
    } else if (!isHeaderFooter) {
      let fields = [];
      let fieldsDropdown = [];

      if (!isEmpty(active_document_action.data_fields)) {
        fields = active_document_action.data_fields;
        fieldsDropdown = fieldDropDownOptions;
      } else {
        fields = selectedFieldsList.map((field) => field.field_uuid);
        fieldsDropdown = selectedFieldsList;
      }

      const initVal = getEditorUIValue(
        initialEditorState,
        fields,
        fieldsDropdown,
        SEND_EMAIL_STRINGS.SYSTEM_FIELD_OPTIONS_LIST(t),
      );
      setInitialEditorValue(initVal);
    }
    return () => {};
  }, [isAllFieldsLoading, fetchingAllFields?.current]);

  useEffect(() => {
    if (!isHeaderFooter && isEmpty(initialEditorState)) {
      const { flow_id } = flowData;
      const paginationData = {
        page: 1,
        size: 1000,
        sort_by: 1,
        flow_id,
        ignore_field_types: IGNORED_FIELD_TYPES,
        include_property_picker: 1,
      };
      getAllFields(
        paginationData,
        null,
        false,
        null,
        null,
        setFetchingAllFields,
      );
    }
    return () => {};
  }, []);

  const showNotification = () => {
    const { notificationManager } = editorRef.current;

    clearTimeout(notificationRef.current);

    notificationManager.open({
      text: t(DOCUMENT_GENERATION_STRINGS.HEADER_FOOTER_ERROR),
      type: 'error',
    });

    notificationRef.current = setTimeout(() => {
      notificationManager.close();
    }, 2000);
  };

  const handleEditorStateChange = (editorHtml) => {
    if (currentEditorValue === editorHtml) return; // handled internal component did update
    onEditorTemplateStateChange(
      editorHtml,
      id,
      editorRef,
      onChangeHandler,
      tableDropDownOptions,
      fieldDropDownOptions,
      uploadedImages,
      isHeaderFooter,
      active_document_action,
    );
    setCurrentEditorValue(editorHtml);
  };

  useEffect(() => {
    if (editorRef?.current && !isEmpty(currentUploadedImage)) {
      const { imageId, imageName, localImageUrl } =
        cloneDeep(currentUploadedImage);

      if (!isEmpty(localImageUrl)) {
        const { base64 = EMPTY_STRING, file = {} } = localImageUrl;

        // blob cache handling as per the tinymce library
        const id = `blobid ${new Date().getTime()}`;
        const { blobCache } = editorRef.current.editorUpload;
        const blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);
        const blobUrl = blobInfo.blobUri();
        editorRef.current.insertContent(
          `<img key="image-key-${blobUrl}" id="doc-gen-image-${imageId}" style="${
            isHeaderFooter
              ? 'max-width: 100px; max-height: 50px;'
              : 'max-width: 100%;'
          }" data-image-id="${imageId}" src="${blobUrl}" alt="${imageName}" title="${imageName}" />`,
        );
      }
    }
    setCurrentUploadedImage({});
  }, [currentUploadedImage?.imageId]);

  // functions applicable only for document generation template body -- start

  const handleTableMenuChange = (fields, tableUuid) => {
    setSelectedTableColumnList({
      ...selectedTableColumnList,
      [tableUuid]: fields,
    });
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
  };

  const onInsertTableClick = (table, selectedColumns) => {
    handleTableMenuChange(selectedColumns, table.table_uuid);
    editorRef.current.insertContent(
      getTableDocumentGenerationRawHtml(
        table.table_uuid,
        selectedColumns,
        table.table_name,
      ),
    );
    onCloseModal();
  };

  const openInsertTableModal = (table) => {
    if (table?.fields) {
      table.fields = table.fields.filter((field) =>
        !(IGNORED_FIELD_TYPES.includes(field.field_type)),
      );
    }
    setCurrentTable(table);
    setIsModalOpen(true);
  };

  const handleEditorClickHandler = (editorValue) => {
    if (id === DOCUMENT_GENERATION_STRINGS.DOCUMENT_BODY.ID) {
      return onRemoveClickHandler(
        editorValue,
        editorRef,
        handleEditorStateChange,
      );
    }
    return null;
  };

  const handleKeyDown = (event) => {
    if (isHeaderFooter) {
      const body = editorRef.current.getBody();
      if (
        event.keyCode === 8 ||
        event.which === 8 ||
        event.keyCode === 46 ||
        event.which === 46
      ) {
        return true;
      }
      if (body.offsetHeight > 52) {
        event.preventDefault();
        showNotification();
        return false;
      }
    }
    return true;
  };

  // functions applicable only for document generation template body -- end

  const editorLoader = (
    <div>
      <Skeleton width="100%" height={50} />
      <Skeleton width="100%" height={loaderHeight || 240} />
    </div>
  );

  if (
    isAllFieldsLoading ||
    (active_document_action?.template_doc_id &&
      !isHeaderFooter &&
      isEmpty(initialEditorValue)) ||
    (isHeaderFooter && headerFooterDocId && !headerFooterAPIStatus)
  ) {
    return editorLoader;
  }

  return (
    <div>
      <div className={!isEmpty(errorMessage) && styles.EditorError}>
        {isEditorLoading && editorLoader}
        <div style={{ display: isEditorLoading ? 'none' : 'block' }}>
          <TextEditor
            tinymceScriptSrc={process.env.PUBLIC_URL + EDITOR_CONFIGS.scriptSrc}
            initialValue={initialEditorValue}
            onInit={(_evt, editor) => {
              editorRef.current = editor;
              docEditorRef.current = editor;
              setIsEditorLoading(false);
            }}
            value={currentEditorValue}
            onClick={handleEditorClickHandler}
            init={{
              content_style: CONTENT_STYLES,
              height: editorHeight,
              width: 694,
              table_toolbar: EDITOR_CONFIGS.table_toolbar,
              paste_preprocess: (_, args) => {
                try {
                  const htmlElement = extractHTMLFromString(args.content);
                  const textContentFromHtml = htmlElement?.textContent;

                  if (isHeaderFooter && textContentFromHtml?.length > 28) {
                    showNotification();
                    args.content = EMPTY_STRING;
                  }
                  if (args?.content?.includes('<img')) {
                    args.content = EMPTY_STRING;
                  }
                } catch (e) {
                  console.log(e);
                }
              },
              extended_valid_elements: EDITOR_CONFIGS.extendedValidElements,
              plugins: EDITOR_CONFIGS.plugins,
              toolbar1: toolbar1,
              toolbar2: toolbar2,
              paste_as_text: isHeaderFooter,
              setup: (editor) => {
                editor.ui.registry.addMenuButton('insertFieldMenu', {
                  text: t(EDITOR_STRINGS.INSERT_FIELD),
                  search: {
                    placeholder: 'Search field',
                  },
                  fetch: (callback) => {
                    const items = getAllFieldsMenu(
                      fieldDropDownOptions,
                      editor,
                    );
                    callback(items);
                  },
                });

                editor.ui.registry.addMenuButton('insertTableMenu', {
                  text: t(EDITOR_STRINGS.INSERT_TABLE),
                  search: {
                    placeholder: 'Search Table',
                  },
                  fetch: (callback) => {
                    const items = getAllTablesMenu(
                      tableDropDownOptions,
                      openInsertTableModal,
                      t,
                    );
                    callback(items);
                  },
                });

                editor.ui.registry.addButton('insertImageMenu', {
                  icon: 'image',
                  tooltip: t(DOCUMENT_GENERATION_STRINGS.UPLOAD_IMAGE),
                  onAction: () => {
                    const rawEditorContent = editor.getContent({
                      format: 'text',
                    });

                    if (
                      (rawEditorContent?.length < 28 || !isHeaderFooter) &&
                      imageUploadRef?.current
                    ) {
                      imageUploadRef?.current?.click();
                    } else {
                      showNotification();
                    }
                  },
                });
              },
            }}
            onEditorChange={handleEditorStateChange}
            onKeyDown={handleKeyDown}
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
        {isModalOpen && (
          <TableModalComponent
            isModalOpen={isModalOpen}
            onCloseClick={onCloseModal}
            currentTable={currentTable}
            onInsertTableClick={onInsertTableClick}
            isTableInsertDisabled={isTableInsertDisabled}
          />
        )}
      </div>
      {!hideMessage ? (
        <HelperMessage
          message={errorMessage}
          type={HELPER_MESSAGE_TYPE.ERROR}
          className={gClasses.ErrorMarginV1}
        />
      ) : null}
    </div>
  );
}

export default EditorComponent;
