import { FIELD_TYPES } from '../../../../../../../components/form_builder/FormBuilder.strings';
import { TEXT_EDITOR_CONSTANTS } from '../../../../../../../components/text_editor/TextEditor.constants';
import { FIELD_LIST_TYPE, FIELD_TYPE } from '../../../../../../../utils/constants/form.constant';
import {
  isEmpty,
  cloneDeep,
  compact,
} from '../../../../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../../../../utils/strings/CommonStrings';
import { extractHTMLFromString } from '../../../../configurations/document_generation/DocumentGeneration.utils';
import { DOCUMENT_GENERATION_CONSTANTS } from './DocumentTemplate.constants';

export const EDITOR_CONFIGS = {
  extendedValidElements:
    'img[*],table[id|data-id|data-field-uuid|data-field-label|style|contenteditable|border],span[id|data-id|data-field-uuid|data-field-label|contenteditable|field-type|class|style|action-id|parent-id|child-id],button[id|onclick|class|style|title],svg[xmlns|width|height|viewbox|style|action-id|parent-id],path[fill|fill-rule|d|stroke-width|action-id|parent-id]',
  plugins: 'searchreplace table advlist lists link autolink',
  table_toolbar: 'tabledelete',
  scriptSrc: '/tinymce/tinymce.min.js',
  templateFontSizes: '8px 10px 12px 14px 16px 18px 24px 36px',
  headerFooterFontSizes: '8pt 10pt 12pt 14pt 18pt 24pt',
  TOOLBAR1:
    'undo redo bold italic underline fontSize | align forecolor backcolor link hr lineheight bullist numlist',
  // TOOLBAR1: 'bold italic underline fontSize align forecolor backcolor link hr lineheight bullist numlist',
  TOOLBAR2: 'insertFieldMenu insertTableMenu | insertImageMenu',
  TOOLBAR3: 'insertFieldMenu',
};

export const CONTENT_STYLES =
  '@import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"); * { font-family: "Open Sans", sans-serif !important; } .mce-content-body { width: 642.5px !important; margin: 0px 16px !important; } body { word-break: break-word !important; word-wrap: break-word !important; overflow-wrap: break-word !important; padding: 10px 0px 0px 0px; } p { margin: 0px; padding: 0px; } .document-gen-custom-field-list { font-size:12pt !important; background: #EBF4FF; border-radius: 16px; display: inline-block; height: fit-content; } .document-gen-custom-button-list { display: inline-block; width: 140px; font-family: Montserrat; font-size: 10pt; font-weight: 500; padding: 0px 10px; color: inherit; background: #EBF4FF; border-radius: 16px; outline: none; border: none; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; } .doc-gen-field-value-class { display:inline-block; vertical-align: top; }';

export const MAIL_SUBJECT_CONTENT_STYLES =
'@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap"); * { font-family: Inter !important; } .mce-content-body { margin: 0px 16px !important; } body { word-break: break-word !important; word-wrap: break-word !important; overflow-wrap: break-word !important; padding: 10px 0px 0px 0px; } p { margin: 0px; padding: 0px; } .document-gen-custom-field-list { font-size:12pt !important; background: #EBF4FF; border-radius: 16px; display: inline-block; height: fit-content; } .document-gen-custom-button-list { display: inline-block; width: 140px; font-family: Montserrat; font-size: 10pt; font-weight: 500; padding: 0px 10px; color: inherit; background: #EBF4FF; border-radius: 16px; outline: none; border: none; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; } .doc-gen-field-value-class { display:inline-block; vertical-align: top; }';

export const MAIL_DESCRIPTION_CONTENT_STYLES =
  '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap"); * { font-family: Inter !important; } .mce-content-body { margin: 0px 16px !important; } body { word-break: break-word !important; word-wrap: break-word !important; overflow-wrap: break-word !important; padding: 16px 0px 16px 0px; } p { margin: 0px; padding: 0px; } .document-gen-custom-field-list { font-size:12pt !important; background: #EBF4FF; border-radius: 16px; display: inline-block; height: fit-content; } .document-gen-custom-button-list { display: inline-block; width: 140px; font-family: Montserrat; font-size: 10pt; font-weight: 500; padding: 0px 10px; color inherit; background: #EBF4FF; border-radius: 16px; outline: none; border: none; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; } .doc-gen-field-value-class { display:inline-block; vertical-align: top; }';

export const getDocumentGenerationRawHtml = (id, label, isEditDoc, deleteTagId) => {
  if (isEmpty(deleteTagId)) {
    deleteTagId = id;
  }
  return `${
    isEditDoc ? '&nbsp;<span>' : ''
  }<span id="field-tag-${deleteTagId}" data-field-uuid=${id} contenteditable="false" field-type="direct" class="document-gen-custom-field-list" style="margin:5px 0;"><span id="button-tag-${id}" class="document-gen-custom-button-list" title="${label}">${label}</span><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" style="margin: 8px 10px 4px 0px; cursor: pointer;" action-id='remove-field' parent-id="field-tag-${deleteTagId}" viewbox="0 0 13 13"><path fill="#959BA3" fill-rule="evenodd" d="M2.179.293l4.006 4.006L10.192.293a1 1 0 011.32-.083l.095.083.471.471a1 1 0 010 1.415L8.071 6.185l4.007 4.007a1 1 0 010 1.415l-.471.471a1 1 0 01-1.415 0L6.185 8.071l-4.006 4.007a1 1 0 01-1.32.083l-.095-.083-.471-.471a1 1 0 010-1.415l4.006-4.007L.293 2.179a1 1 0 010-1.415L.764.293a1 1 0 011.415 0z" stroke-width="10" action-id='remove-field' parent-id="field-tag-${deleteTagId}"></path></svg></span>${
    isEditDoc ? '</span>&nbsp;' : ''
  }`;
};

export const getAllFieldsMenu = (allFields = [], editor, dispatch) =>
  allFields.map((field) => {
    const currentUpdatedField = {
      type: field?.isExpandMenu
        ? TEXT_EDITOR_CONSTANTS.NESTED_MENU_ITEM
        : TEXT_EDITOR_CONSTANTS.MENU_ITEM,
      text: field?.label,
      isTitleMenuItem: field?.isExpandMenu,
    };
    if (field?.isExpandMenu) {
      currentUpdatedField.getSubmenuItems = () =>
        getAllFieldsMenu(field?.subMenuItems, editor, dispatch);
    } else {
      currentUpdatedField.onAction = () => {
        if (field?.isExpandMenu) {
          return;
        }
        editor.insertContent(
          getDocumentGenerationRawHtml(field?.value, field?.parentLabel ? field.parentLabel : field?.label, true, field?.deleteTagId),
        );
      };
    }

    return currentUpdatedField;
  });

export const getTableFieldRawHtml = (id, label) =>
  `<span id="field-tag-${id}" data-column-uuid=${id} title=${label} contenteditable="false" field-type="direct" class="document-gen-custom-field-list"><button class="document-gen-custom-button-list">${label}</button></span>`;

const getTableRows = (selectedColumns) => {
  const headers = [];
  selectedColumns &&
    selectedColumns.forEach((field) =>
      headers.push(
        `<td style="height: 22.3906px;" title="${
          field.label
        }">${getTableFieldRawHtml(field.fieldUuid, field.label)}</td>`,
      ),
    );
  return headers;
};

const getColumnName = (field) => (
  `<td id="field-tag-${field.fieldUuid}" data-field-uuid="${field.fieldUuid
  }" data-field-name="${field.label}" style="height: 22.3906px;">${field?.label
  }</td>`
);

const getHeaders = (selectedColumns) => {
  const headers = [];
  selectedColumns &&
    selectedColumns.forEach((field) =>
      headers.push(getColumnName(field)),
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
        `<td id="field-tag-${field.fieldUuid}" data-column-uuid="${field.fieldUuid}" data-field-name="${field.label}" cm_table_column_uuid="${field.fieldUuid}" cm_table_column_name="${columnNames[index]}" title="${field.label}">${columnHTML[index]}</td>`,
      ),
    );

  return headers;
};

export const getTableDocumentGenerationRawHtml = (
  tableUuid,
  selectedColumns,
  tableName,
) =>
  `<p>${tableName}</p><table field-type="table" id="field-tag-${tableUuid}" data-table-uuid=${tableUuid} style="border-collapse: collapse; width: 100%; height: 44.7812px;" border="1"><tbody><tr style="height: 22.3906px;">${getHeaders(
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

export const UNNECESSARY_TAGS = [
  'sel-mce_0',
  'mceResizeHandlenw',
  'mceResizeHandlene',
  'mceResizeHandlese',
  'mceResizeHandlesw',
];

export const getCurrentSystemField = ({ fieldUuid, systemFields = [] }) => {
  const fieldUuidLen = fieldUuid?.split('.');
  if (fieldUuidLen?.length > 1) {
    const stepUuid = fieldUuidLen[1];
    const currentStepSystemFields = systemFields?.find((eachField) => eachField?.value === stepUuid);
    return currentStepSystemFields?.subMenuItems?.find((eachField) => eachField?.value === fieldUuid);
  } else {
    if (fieldUuid === DOCUMENT_GENERATION_CONSTANTS.PROCEDURE_ID) {
      fieldUuid = DOCUMENT_GENERATION_CONSTANTS.FLOW_ID;
    } else if (fieldUuid === DOCUMENT_GENERATION_CONSTANTS.PROCEDURE_LINK) {
      fieldUuid = DOCUMENT_GENERATION_CONSTANTS.FLOW_LINK;
    }
    return systemFields?.find((eachField) => eachField?.value === fieldUuid);
  }
};

const getParsedValue = (
  rawHtml,
  editorRef,
  tableDropDownOptions = [],
  fieldDropDownOptions = [],
  uploadedImages = [],
  isHeaderFooter,
  systemFields = [],
) => {
  if (editorRef?.current && editorRef.current.dom) {
    let htmlContent = cloneDeep(rawHtml);
    const htmlDocElement = extractHTMLFromString(htmlContent);

    const fieldElements = htmlDocElement.querySelectorAll(
      '[data-field-uuid]',
    );
    const selectedFields = [];
    fieldElements.forEach((element) => {
      const fieldUuid = element.getAttribute('data-field-uuid');
      if (fieldUuid === 'undefined' || fieldUuid === undefined || isEmpty(fieldUuid)) return;

      const fieldOuterHtml = element?.outerHTML;

      const currentField = fieldDropDownOptions?.find((eachField) => eachField?.fieldUuid === fieldUuid);

      if (!isEmpty(currentField)) {
        if (currentField?.fieldListType !== FIELD_LIST_TYPE.DIRECT) {
          return;
        }
        selectedFields.push(currentField);
        if (currentField.fieldType === FIELD_TYPES.LINK) {
          htmlContent = htmlContent.replaceAll(
            fieldOuterHtml,
            `<span><a id="${currentField.fieldUuid}" cm_link_uuid="${currentField.fieldUuid}" cm_field_type="${currentField.fieldType}" class="doc-gen-field-value-class">!@#\${"type":"field","identifier":"${currentField.fieldUuid}","title":"${currentField.label}"}$#@!</a></span>`,
          );
        } else {
          htmlContent = htmlContent.replaceAll(
            fieldOuterHtml,
            `<span id="${currentField.fieldUuid}" cm_field_uuid="${currentField.fieldUuid}" class="doc-gen-field-value-class">!@#\${"type":"field","identifier":"${currentField.fieldUuid}","title":"${currentField.label}"}$#@!</span>`,
          );
        }
      } else {
        const currentSystemField = getCurrentSystemField({ fieldUuid, systemFields });
        if (currentSystemField) {
          selectedFields.push(currentSystemField);
          if (currentSystemField?.fieldType === FIELD_TYPES.LINK) {
            htmlContent = htmlContent.replaceAll(
              fieldOuterHtml,
              `<span><a id="${currentSystemField.value}" cm_link_uuid="${currentSystemField.value}" cm_field_type="${currentSystemField.type}" class="doc-gen-field-value-class">!@#\${"type":"system","identifier":"${currentSystemField.value}","title":"${currentSystemField.label}"}$#@!</a></span>`,
            );
          } else {
            const label = currentSystemField?.parentLabel || currentSystemField.label;
            htmlContent = htmlContent.replaceAll(
              fieldOuterHtml,
              `<span id="${currentSystemField.value}" cm_field_uuid="${currentSystemField.value}" class="doc-gen-field-value-class">!@#\${"type":"system","identifier":"${currentSystemField.value}","title":"${label}"}$#@!</span>`,
            );
          }
        }
      }
    });

    htmlContent = htmlContent.replace(/\r?<\/p>\n<p>/g, '<br>');
    if (!isHeaderFooter) {
      tableDropDownOptions.map((table) => {
        const tagId = `field-tag-${table.tableUuid}`;
        let fieldTag = editorRef.current.dom.get(tagId);

        do {
          if (!fieldTag) {
            return null;
          }
          try {
            let selected_columns = [];
            if (
              fieldTag &&
              fieldTag?.rows &&
              fieldTag?.rows?.item &&
              fieldTag?.rows?.item(0)
            ) {
              const objCells = fieldTag.rows.item(0).cells;
              if (!isEmpty(objCells)) {
                for (
                  let currentColumn = 0;
                  currentColumn < objCells.length;
                  currentColumn++
                ) {
                  selected_columns.push(
                    objCells
                      .item(currentColumn)
                      .getAttribute('data-field-uuid'),
                  );
                }
                if (table?.fields) {
                  selected_columns = selected_columns.map((fieldUuid) =>
                    table.fields.find(
                      (column) => fieldUuid === column.fieldUuid,
                    ),
                  );
                }
                selected_columns = compact(selected_columns);
                selectedFields.push(...selected_columns);
                const value = editorRef.current.dom.getOuterHTML(fieldTag);
                htmlContent = htmlContent.replace(
                  value,
                  getOutputTableLayout(
                    table.tableUuid,
                    selected_columns,
                    fieldTag,
                  ),
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
        const tagSrcValue = editorRef.current.dom.getAttrib(
          imageTag,
          'src',
          EMPTY_STRING,
        );
        htmlContent = htmlContent.replaceAll(
          tagSrcValue,
          eachImage?.serverImageUrl,
        );
      }
    });

    UNNECESSARY_TAGS.forEach((tagId) => {
      const selectionTag = editorRef.current.dom.get(tagId);
      if (selectionTag) {
        const value = editorRef.current.dom.getOuterHTML(selectionTag);
        htmlContent = htmlContent.replace(value, EMPTY_STRING);
      }
    });
    return { htmlContent, selectedFields };
  } else {
    return {};
  }
};

export const formatEditorTemplatePostData = (
  editorHtml,
  editorRef,
  tableDropDownOptions = [],
  fieldDropDownOptions = [],
  uploadedImages = [],
  isHeaderFooter,
  systemFields = [],
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
      ((rawEditorContent && !isEmpty(rawEditorContent.trim())) ||
        rawHtml.includes('<img') ||
        rawHtml.includes('<hr'))
    ) {
      const { htmlContent, selectedFields } = getParsedValue(
        rawHtml,
        editorRef,
        tableDropDownOptions,
        fieldDropDownOptions,
        uploadedImages,
        null,
        systemFields,
      );
      return {
        htmlContent,
        selectedFields,
        isHeaderFooter,
      };
    } else {
      const { htmlContent } = getParsedValue(
        rawHtml,
        editorRef,
        [],
        [],
        uploadedImages,
        isHeaderFooter,
        systemFields,
      );
      const htmlContentTobeSent =
        (rawEditorContent && !isEmpty(rawEditorContent.trim())) ||
        rawHtml.includes('<img') || rawHtml.includes('<hr')
          ? htmlContent
          : EMPTY_STRING;
      return {
        htmlContent: isHeaderFooter ? htmlContentTobeSent : EMPTY_STRING,
        selectedFields: [],
        isHeaderFooter,
      };
    }
  }
  if (editorHtml) {
    return {
      htmlContent: editorHtml?.replace(/\r?<\/p>\n<p>/g, '<br>'),
      selectedFields: [],
      isHeaderFooter,
    };
  }
  return {};
};

export const getAllTablesMenu = (allTables, openInsertTableModal) => {
  if (isEmpty(allTables)) {
    return [
      {
        type: 'menuitem',
        text: 'No tables found',
      },
    ];
  }
  return allTables.map((table) => {
    return {
      type: 'menuitem',
      text: table.label,
      onAction: () => {
        openInsertTableModal(table);
      },
    };
  });
};

export const getTableFields = (allFields) =>
  allFields?.map((field) => {
    return {
      value: field.fieldUuid,
      label: field.label,
    };
  });

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
        spanElem?.remove();
        editorRef.current.selection.moveToBookmark(currentCursorLocation);
        editorStateChange(editorRef.current?.getContent());
      }
    }
    return null;
  };

  export const getEditorUIValue = (
    rawHtml_,
    dataFields,
    fieldDropDownOptionsParam,
    systemFieldsFromServer,
    systemFields,
  ) => {
    try {
      const htmlDocElement = extractHTMLFromString(rawHtml_);
      let rawHtml = new XMLSerializer().serializeToString(htmlDocElement);
      if (!htmlDocElement) return rawHtml;
      dataFields &&
        dataFields.forEach((dataField) => {
          if (fieldDropDownOptionsParam) {
            const currentField = fieldDropDownOptionsParam.find(
              (field) => field.fieldUuid === dataField,
            );
            if (currentField) {
              if (currentField.fieldListType === FIELD_LIST_TYPE.TABLE) {
                const currentFieldElement = htmlDocElement.querySelector(`[cm_table_column_uuid="${currentField.fieldUuid}"]`);
                if (currentFieldElement?.outerHTML) {
                if (currentFieldElement?.hasAttribute('cm_table_column_name')) {
                    rawHtml = rawHtml.replaceAll(
                      currentFieldElement?.outerHTML,
                      getColumnName(currentField),
                    );
                  } else {
                    rawHtml = rawHtml.replaceAll(
                      currentFieldElement?.outerHTML,
                      getTableFieldRawHtml(currentField.fieldUuid, currentField.label),
                    );
                  }
                }
              } else {
                let currentFieldElement = htmlDocElement.querySelector(`[cm_field_uuid="${currentField.fieldUuid}"]`);
                if (currentField.fieldType === FIELD_TYPES.LINK) {
                  currentFieldElement = htmlDocElement.querySelector(`[cm_link_uuid="${currentField.fieldUuid}"]`);
                }
                if (currentFieldElement?.outerHTML) {
                  rawHtml = rawHtml.replaceAll(
                    currentField.field_type === FIELD_TYPES.LINK ? `<span>${currentFieldElement?.outerHTML}</span>` : currentFieldElement?.outerHTML,
                    getDocumentGenerationRawHtml(currentField.fieldUuid, currentField.label, false),
                  );
                }
              }
            }
          }
      });
      systemFieldsFromServer.forEach((field) => {
        const dataField = getCurrentSystemField({ fieldUuid: field, systemFields });
        if (!isEmpty(dataField)) {
          let currentFieldElement = htmlDocElement.querySelector(`[cm_field_uuid="${field}"]`);
          if (dataField.fieldType === FIELD_TYPE.LINK) {
            currentFieldElement = htmlDocElement.querySelector(`[cm_link_uuid="${field}"]`) || {};
          }
          if (currentFieldElement?.outerHTML) {
            rawHtml = rawHtml.replaceAll(
              dataField.fieldType === FIELD_TYPES.LINK ? `<span>${currentFieldElement?.outerHTML}</span>` : currentFieldElement?.outerHTML,
              getDocumentGenerationRawHtml(dataField.value, dataField?.parentLabel || dataField?.label, false, dataField?.deleteTagId),
            );
          }
        }
      });
      return rawHtml;
    } catch (e) {
      console.log(e);
    }
    return rawHtml_;
  };
