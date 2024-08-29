import { FIELD_TYPES } from 'components/form_builder/FormBuilder.strings';
import { SEND_EMAIL_STRINGS } from 'containers/edit_flow/EditFlow.strings';
import { cloneDeep, compact, get, isEmpty } from 'utils/jsUtility';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { getDocumentGenerationRawHtml, getTableFieldRawHtml } from '../../node_configurations/generate_document/general/document_template/DocumentTemplate.utils';
import { DOCUMENT_GENERATION_CONSTANTS } from './DocumentGeneration.constants';

const getHeaders = (selectedColumns) => {
  const headers = [];
  selectedColumns &&
    selectedColumns.forEach((field) =>
      headers.push(
        `<td id="field-tag-${field.field_uuid}" data-field-uuid="${
          field.field_uuid
        }" data-field-name="${field.field_name}" style="height: 22.3906px;">${
          field && field.field_name
        }</td>`,
      ),
    );
  return headers;
};

const getOutputHeaders = (selectedColumns, tableHtml) => {
  const columnNames = [];
  const columnHTML = [];
  if (tableHtml && tableHtml.rows) {
    for (let i = 0; i < 1; i++) {
      const objCells = tableHtml.rows.item(i).cells;
      for (let j = 0; j < objCells.length; j++) {
        columnHTML.push(objCells.item(j).innerHTML);
        columnNames.push(objCells.item(j).textContent);
      }
    }
  }

  const headers = [];
  selectedColumns &&
    selectedColumns.forEach((field, index) =>
      headers.push(
        `<td id="field-tag-${field.field_uuid}" data-field-uuid="${field.field_uuid}" data-field-name="${field.field_name}" cm_table_column_uuid="${field.field_uuid}" cm_table_column_name="${columnNames[index]}" title="${field.field_name}">${columnHTML[index]}</td>`,
      ),
    );

  return headers;
};

const getTableRows = (selectedColumns) => {
  const headers = [];
  selectedColumns &&
    selectedColumns.forEach((field) =>
      headers.push(
        `<td style="height: 22.3906px;" title="${
          field.field_name
        }">${getTableFieldRawHtml(field.field_uuid, field.field_name)}</td>`,
      ),
    );
  return headers;
};

export const getTableDocumentGenerationRawHtml = (
  tableUuid,
  selectedColumns,
  tableName,
) =>
  `<p>${tableName}</p><table field-type="table" id="field-tag-${tableUuid}" data-id=${tableUuid} style="border-collapse: collapse; width: 100%; height: 44.7812px;" border="1"><tbody><tr style="height: 22.3906px;">${getHeaders(
    selectedColumns,
  ).join('')}</tr><tr style="height: 22.3906px;">${getTableRows(
    selectedColumns,
  ).join('')}</tr></tbody></table><br />`;

export const getOutputTableLayout = (tableUuid, selectedColumns, tableHtml) =>
  `<table id="field-tag-${tableUuid}" cm_table_uuid="${tableUuid}" style="border-collapse: collapse; width: 100%; height: 44.7812px;" border="1"><tbody><tr>${getOutputHeaders(
    selectedColumns,
    tableHtml,
  ).join('')}</tr><tr style="height: 22.3906px;">${getTableRows(
    selectedColumns,
  ).join('')}</tr></tbody></table>`;

export const getAllFieldsMenu = (allFields, editor) =>
  allFields.map((field) => {
    return {
      type: 'menuitem',
      text: field.label,
      isTitleMenuItem: [
        'system-fields-optionlist',
        'form-fields-optionlist',
      ].includes(field.id),
      onAction: () => {
        if (
          field.id === 'system-fields-optionlist' ||
          field.id === 'form-fields-optionlist' ||
          field.id === 'no-form-fields'
        ) {
          return;
        }
        editor.insertContent(
          getDocumentGenerationRawHtml(
            field.field_uuid || field.id,
            field.label,
            true,
          ),
        );
      },
    };
  });

export const getTableFields = (allFields) =>
  allFields.map((field) => {
    return {
      value: field.field_uuid,
      label: field.label,
    };
  });

export const COLUMN_SELECTION_MAXIUMUM_LIMIT = 7;

export const DOCUMENT_GENERATION_STRINGS = {
  ACTION_TYPE: {
    ID: 'action_uuid',
    LABEL:
      'flows.document_generation_strings.action_type_label',
    CHOOSE_ACTION_BUTTON: 'flows.send_data_to_datalist_all_labels.choose_action_button',
  },
  TEMPLATE_NAME: {
    ID: 'file_name',
    LABEL: 'flows.document_generation_strings.template_name.label',
    DROPDOWN_FIELD: 'document_template_field',
    DROPDOWN_ID: 'document_template_name_field_uuid',
    DROPDOWN_NAME: 'document_template_name',
    INPUT_ID: 'file_name',
    PLACEHOLDER: 'flows.document_generation_strings.template_name.placeholder',
    TOOLTIP_ID: 'file_name_tooltip',
    TOOLTIP_TEXT: 'flows.document_generation_strings.template_name.tooltip_text',
    TOOLTIP_SYMBOLS: '( < > : " / \\ | ? * )',
    SUPPORTED_FIELDS: [
      FIELD_TYPES.SINGLE_LINE,
      FIELD_TYPES.RADIO_GROUP,
      FIELD_TYPES.DROPDOWN,
      FIELD_TYPES.DATE,
      FIELD_TYPES.DATETIME,
      FIELD_TYPES.EMAIL,
      FIELD_TYPES.SCANNER,
      FIELD_TYPES.DATA_LIST_PROPERTY_PICKER,
      FIELD_TYPES.USER_PROPERTY_PICKER,
      FIELD_TYPES.USER_TEAM_PICKER,
      FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN,
    ],
  },
  DOCUMENT_BODY: {
    ID: 'document_body',
    LABEL: 'flows.document_generation_strings.document_body_label',
  },
  HEADER_SETTINGS: {
    ID: 'header_body',
    LABEL: 'flows.document_generation_strings.header_setting_label',
  },
  FOOTER_SETTINGS: {
    ID: 'footer_body',
    LABEL: 'flows.document_generation_strings.footer_settings_label',
  },
  DOCUMENT_REFERENCE: {
    ID: 'document_reference',
    LABEL: 'flows.document_generation_strings.document_reference.label',
    CREATE_FIELD_PLACEHOLDER: 'flows.document_generation_strings.document_reference.create_field_placeholder',
    LIST_LABEL: 'flows.document_generation_strings.document_reference.list_label',
    NO_FIELDS: 'flows.document_generation_strings.document_reference.no_field',
    ADD_FIELD: 'flows.document_generation_strings.document_reference.add_field',
    PLACEHOLDER: 'flows.document_generation_strings.document_reference.placeholder',
    FIELD_NAME: 'document_field_name',
    FIELD_UUID: 'document_field_uuid',
  },
  EDITOR_STRINGS: {
    INSERT_TABLE: 'flows.document_generation_strings.editor_strings.insert_table',
    INSERT_FIELD: 'flows.document_generation_strings.editor_strings.insert_field',
    SYSTEM_FIELDS_LABEL: 'flows.document_generation_strings.editor_strings.system_fields_label',
    FORM_FIELDS_LABEL: 'flows.document_generation_strings.editor_strings.form_fields_label',
  },
  INSIDE_TABLE_TEXT: 'flows.document_generation_strings.inside_table_text',
  SELECT_COLUMNS: 'flows.document_generation_strings.select_columns',
  SELECT_TABLE_COLUMNS: 'flows.document_generation_strings.select-table-column',
  SELECT_TABLE_COLUMNS_NOTE: 'flows.document_generation_strings.select_table_column_note',
  CANCEL: 'flows.document_generation_strings.cancel',
  INSERT_TABLE: 'flows.document_generation_strings.insert_table',
  HEADER: {
    ID: 'show_in_pages',
    LABEL: 'flows.document_generation_strings.header.label',
    OPTION_LIST: (t) => [
      {
        label: t('flows.document_generation_strings.header.option_list.select'),
        value: '',
      },
      {
        label: t('flows.document_generation_strings.header.option_list.all_pages'),
        value: 'all_pages',
      },
      {
        label: t('flows.document_generation_strings.header.option_list.first_page'),
        value: 'first_page',
      },
      {
        label: t('flows.document_generation_strings.header.option_list.except_first_page'),
        value: 'except_first_page',
      },
    ],
  },
  FOOTER: {
    ID: 'show_in_pages',
    LABEL: 'flows.document_generation_strings.footer_label',
    OPTION_LIST: (t) => [
      {
        label: t('flows.document_generation_strings.header.option_list.select'),
        value: '',
      },
      {
        label: t('flows.document_generation_strings.header.option_list.all_pages'),
        value: 'all_pages',
      },
      {
        label: t('flows.document_generation_strings.header.option_list.first_page'),
        value: 'first_page',
      },
      {
        label: t('flows.document_generation_strings.header.option_list.last_page'),
        value: 'last_page',
      },
      {
        label: t('flows.document_generation_strings.header.option_list.except_first_page'),
        value: 'except_first_page',
      },
    ],
  },
  SHOW_PAGE_NUMBER: {
    ID: 'show_page_number',
    OPTION_LIST: (t) => [
      {
        label: t('flows.document_generation_strings.show_page_number'),
        value: 'show_page_number',
      },
    ],
  },
  POP_OVER_STRINGS: {
    TITLE: 'Validation on column selection',
    SUBTITLE: `Exceeds maxiumum limit of ${COLUMN_SELECTION_MAXIUMUM_LIMIT}`,
  },
  VALIDTION_STRINGS: {
   COLUMN_MAX_SELECTION: `Column field selection exceeds the maximum limit of ${COLUMN_SELECTION_MAXIUMUM_LIMIT} fields allowed`,
  },
  UPLOAD_IMAGE: 'flows.document_generation_strings.upload_image',
  NO_TABLE_FOUND: 'flows.document_generation_strings.no_table_found',
  HEADER_FOOTER_ERROR: 'flows.document_generation_strings.header_footer_error',
};

export const getAllTablesMenu = (allTables, openInsertTableModal, t) => {
  if (isEmpty(allTables)) {
    return [
      {
        type: 'menuitem',
        text: t(DOCUMENT_GENERATION_STRINGS.NO_TABLE_FOUND),
      },
    ];
  }
  return allTables.map((table) => {
    return {
      type: 'menuitem',
      text: table.table_name,
      onAction: () => {
        openInsertTableModal(table);
      },
    };
  });
};

export const extractHTMLFromString = (rawHtml) => {
  try {
    if (typeof DOMParser !== undefined) {
      const parser = new DOMParser();
      const elementTag = parser?.parseFromString(rawHtml, 'text/html');
      return elementTag;
    } else {
      const elementTagInnerHTML = document.createElement('div');
      elementTagInnerHTML.innerHTML = rawHtml;
      return elementTagInnerHTML;
    }
  } catch (e) {
    console.log(e);
    return rawHtml;
  }
};

export const getFieldsDetailsById = (dataFields, directFields) => {
  const fieldList = directFields.filter((field) => {
    if (dataFields && dataFields.includes(field.field_uuid)) return true;
    return false;
  });
  return fieldList;
};

export const UNNECESSARY_TAGS = [
  'sel-mce_0',
  'mceResizeHandlenw',
  'mceResizeHandlene',
  'mceResizeHandlese',
  'mceResizeHandlesw',
];

export const CONTENT_STYLES =
  '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap"); * { font-family: Inter !important; } .mce-content-body { width: 642.5px !important; margin: 0px 16px !important; } body { word-break: break-word !important; word-wrap: break-word !important; overflow-wrap: break-word !important; } p { margin: 0px; padding: 0px; } .document-gen-custom-field-list { font-size:12pt !important; background: #eff1f4; border-radius: 4px; display: inline-block; height: fit-content; } .document-gen-custom-button-list { width: 140px; font-family: Montserrat; font-size: 10pt; font-weight: 500; padding: 5px 10px 5px 10px; color:black; background: #eff1f4; border-radius: 4px; outline: none; border: none; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; } .doc-gen-field-value-class { display:inline-block; vertical-align: top; }';

export const IGNORED_FIELD_TYPES = [
  'information',
];

const getParsedValue = (
  rawHtml,
  editorRef,
  tableDropDownOptions = [],
  fieldDropDownOptions = [],
  uploadedImages = [],
  isHeaderFooter,
) => {
  if (editorRef?.current && editorRef.current.dom) {
    let htmlContent = cloneDeep(rawHtml);

    const selected_fields = [];
    htmlContent = htmlContent.replace(/\r?<\/p>\n<p>/g, '<br>');

    if (!isHeaderFooter) {
      tableDropDownOptions.map((table) => {
        const tagId = `field-tag-${table.table_uuid}`;
        let fieldTag = editorRef.current.dom.get(tagId);

        do {
          if (!fieldTag) {
            return null;
          }
          try {
            let selected_columns = [];
            if (fieldTag && fieldTag?.rows && fieldTag?.rows?.item && fieldTag?.rows?.item(0)) {
              const objCells = fieldTag.rows.item(0).cells;
              if (!isEmpty(objCells)) {
                for (
                  let currentColumn = 0;
                  currentColumn < objCells.length;
                  currentColumn++
                ) {
                  selected_columns.push(
                    objCells.item(currentColumn).getAttribute('data-field-uuid'),
                  );
                }
                if (table?.fields) {
                  selected_columns = selected_columns.map((field_uuid) =>
                    table.fields.find((column) => field_uuid === column.field_uuid),
                  );
                }
                selected_columns = compact(selected_columns);
                selected_fields.push(...selected_columns);
                const value = editorRef.current.dom.getOuterHTML(fieldTag);
                htmlContent = htmlContent.replace(
                  value,
                  getOutputTableLayout(table.table_uuid, selected_columns, fieldTag),
                );
              }
            }
            fieldTag = editorRef.current.dom.getNext(fieldTag, `#${tagId}`);
          } catch (e) {
            fieldTag = null;
            console.log('tableDropDownOptions 468', e);
          }
        } while (fieldTag);

        return null;
      });

      fieldDropDownOptions.map((field) => {
        const tagId = `field-tag-${field.field_uuid}`;
        const fieldTag = editorRef.current.dom.get(tagId);

        if (!fieldTag) {
          return null;
        }
        selected_fields.push(field);
        const value = editorRef.current.dom.getOuterHTML(fieldTag);
        if (field.field_type === FIELD_TYPES.LINK) {
          htmlContent = htmlContent.replaceAll(
            value,
            `<a id="${field.field_uuid}" cm_link_uuid="${field.field_uuid}" cm_field_type="${field.field_type}" class="doc-gen-field-value-class">!@#\${"type":"field","identifier":"${field.field_uuid}","title":"${field.label}"}$#@!</a>`,
          );
        } else {
          htmlContent = htmlContent.replaceAll(
            value,
            `<span id="${field.field_uuid}" cm_field_uuid="${field.field_uuid}" class="doc-gen-field-value-class">!@#\${"type":"field","identifier":"${field.field_uuid}","title":"${field.label}"}$#@!</span>`,
          );
        }

        return null;
      });

      SEND_EMAIL_STRINGS.SYSTEM_FIELD_OPTIONS_LIST.map((field) => {
        const tagId = `field-tag-${field.id}`;
        const fieldTag = editorRef.current.dom.get(tagId);

        if (!fieldTag) {
          return null;
        }
        const value = editorRef.current.dom.getOuterHTML(fieldTag);
        if (field.id === DOCUMENT_GENERATION_CONSTANTS.FLOW_LINK) {
          htmlContent = htmlContent.replaceAll(
            value,
            `<a id="${field.id}" cm_link_uuid="${field.id}" class="doc-gen-field-value-class">!@#\${"type":"system","identifier":"${field.id}","title":"${field.label}"}$#@!</a>`,
          );
        } else {
          htmlContent = htmlContent.replaceAll(
            value,
            `<span id="${field.id}" cm_field_uuid="${field.id}" class="doc-gen-field-value-class">!@#\${"type":"system","identifier":"${field.id}","title":"${field.label}"}$#@!</span>`,
          );
        }

        return null;
      });
    }

    htmlContent = htmlContent.replaceAll('inline-boundary', EMPTY_STRING);
    htmlContent = htmlContent.replaceAll(
      '.mce-content-body { width: 642.5px !important; margin: 0px 16px !important; } ',
      EMPTY_STRING,
    );

    // image upload changes

    uploadedImages.forEach((eachImage) => {
        const tagId = `doc-gen-image-${eachImage.imageId}`;

        const imageTag = editorRef.current.dom.get(tagId);

        if (imageTag && !isEmpty(eachImage?.localImageUrl)) {
          const tagSrcValue = editorRef.current.dom.getAttrib(imageTag, 'src', EMPTY_STRING);
          htmlContent = htmlContent.replaceAll(tagSrcValue, eachImage?.serverImageUrl);
        }
    });

    UNNECESSARY_TAGS.forEach((tagId) => {
      const selectionTag = editorRef.current.dom.get(tagId);
      if (selectionTag) {
        const value = editorRef.current.dom.getOuterHTML(selectionTag);
        htmlContent = htmlContent.replace(value, EMPTY_STRING);
      }
    });

    return { htmlContent, selected_fields };
  } else {
    return {};
  }
};

export const onEditorTemplateStateChange = (
  editorHtml,
  id,
  editorRef,
  onChangeHandler,
  tableDropDownOptions,
  fieldDropDownOptions,
  uploadedImages,
  isHeaderFooter,
) => {
  if (editorRef?.current && editorRef.current.dom) {
    const body = editorRef.current.getBody();
    const htmlTag = editorRef.current.dom.getParent(body, 'html');
    const rawHtml = editorRef.current.dom.getOuterHTML(htmlTag);
    const removeHtmlRegex = /(<([^>]+)>)/gi;
    const removeNewLineRegex = /(\n)/gi;
    const parsedContent = rawHtml
      .replace(removeHtmlRegex, '')
      .replace(removeNewLineRegex, '');
    const rawEditorContent = editorRef.current.getContent({ format: 'text' });

    if (
      !isHeaderFooter &&
      parsedContent.length &&
      ((rawEditorContent && !isEmpty(rawEditorContent.trim())) || rawHtml.includes('<img'))
    ) {
      const { htmlContent, selected_fields } = getParsedValue(
        rawHtml,
        editorRef,
        tableDropDownOptions,
        fieldDropDownOptions,
        uploadedImages,
        null,
      );
      onChangeHandler(
        {
          target: {
            id: id,
            value: htmlContent,
          },
        },
        selected_fields,
        isHeaderFooter,
      );
    } else {
      const { htmlContent } = getParsedValue(
        rawHtml,
        editorRef,
        [],
        [],
        uploadedImages,
        isHeaderFooter,
      );
      const htmlContentTobeSent = ((rawEditorContent && !isEmpty(rawEditorContent.trim())) || rawHtml.includes('<img')) ? htmlContent : EMPTY_STRING;
      onChangeHandler(
        {
          target: {
            id: id,
            value: isHeaderFooter ? htmlContentTobeSent : EMPTY_STRING,
          },
        },
        [],
        isHeaderFooter,
      );
    }
    return editorHtml?.replace(/\r?<\/p>\n<p>/g, '<br>');
  }
  if (editorHtml) {
    return editorHtml?.replace(/\r?<\/p>\n<p>/g, '<br>');
  }
  return null;
};

export const onRemoveClickHandler = (value, editorRef, editorStateChange) => {
  if (isEmpty(editorRef?.current)) return null;
  // cross browser target elem support
  const originalTargetElem =
    value.srcElement || value.originalTarget || value.target;
  if (
    originalTargetElem &&
    editorRef &&
    editorRef.current &&
    editorRef.current.dom
  ) {
    const actionId = editorRef.current.dom.getAttrib(
      originalTargetElem,
      'action-id',
      null,
    );
    const parentId = editorRef.current.dom.getAttrib(
      originalTargetElem,
      'parent-id',
      null,
    );
    if (actionId === 'remove-field') {
      const currentCursorLocation = editorRef.current.selection.getBookmark();
      const spanElem = editorRef.current.dom
        .getParent(originalTargetElem, `#${parentId}`);
      // const styleParent = spanElem.parentNode;
      // if (styleParent) styleParent.remove();
      spanElem.remove();
      editorRef.current.selection.moveToBookmark(currentCursorLocation);
    }
  }
  editorStateChange();
  return null;
};

export const getImageRemovedDocId = (active_data) => {
  const {
    document_body = EMPTY_STRING,
    header_body = EMPTY_STRING,
    footer_body = EMPTY_STRING,
    uploadedImages = [],
  } = cloneDeep(active_data);

  const imageRemovedDocId = [];

  uploadedImages?.forEach((eachImage) => {
    try {
      const documentElement = extractHTMLFromString(document_body);
      const headerElement = extractHTMLFromString(header_body);
      const footerElement = extractHTMLFromString(footer_body);

      const documentImageTag = documentElement?.querySelector(`[data-image-id="${eachImage.imageId}"]`);
      const headerImageTag = headerElement?.querySelector(`[data-image-id="${eachImage.imageId}"]`);
      const footerImageTag = footerElement?.querySelector(`[data-image-id="${eachImage.imageId}"]`);

      console.log({ documentImageTag, headerImageTag, footerImageTag });
      if (!documentImageTag && !headerImageTag && !footerImageTag) {
        imageRemovedDocId.push(eachImage.imageId);
      }
    } catch (e) {
      console.log(e);
    }
  });

  return imageRemovedDocId;
};

export const isFileUploadField = (field) => {
  if (isEmpty(field)) return false;

  if (field.field_type === FIELD_TYPES.FILE_UPLOAD) {
    return true;
  }
  if (
    field.field_type === FIELD_TYPES.USER_PROPERTY_PICKER ||
    field.field_type === FIELD_TYPES.DATA_LIST_PROPERTY_PICKER
  ) {
    if (get(field, ['property_picker_details', 'reference_field_type'], null) === FIELD_TYPES.FILE_UPLOAD) {
      return true;
    }
    return false;
  }
  return false;
};

export default getAllFieldsMenu;
