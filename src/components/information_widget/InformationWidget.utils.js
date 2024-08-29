import { isEmpty } from 'utils/jsUtility';
import { extractHTMLFromString } from '../../containers/edit_flow/step_configuration/configurations/document_generation/DocumentGeneration.utils';
import {
  EDITOR_HTML_IDS,
  FIELD_IDS,
  FIELD_OPTION_VALUES,
} from './InformationWidget.constants';
import { FIELD_TYPE } from '../../utils/constants/form.constant';
import { EMPTY_STRING, TEAM_CREATED_DATE_TIME } from '../../utils/strings/CommonStrings';
import { emptyFunction, isUndefined, uniq } from '../../utils/jsUtility';
import { getFormattedDateFromUTC } from '../../utils/dateUtils';
import { HOLIDAY_DATE } from '../../containers/admin_settings/language_and_calendar/holidays/holiday_table/HolidayTable.strings';
import { WIDGET_STRINGS } from './InformationWidget.strings';

export const getWidgetFieldHtml = (selectedField, isEdit = false) =>
  `${!isEdit ? '&nbsp;<span>' : EMPTY_STRING}<span id="field-tag-${selectedField?.value}" data-field-id="${selectedField?.value}" data-field-label="${selectedField?.label}" data-field-type="${selectedField?.field_type}" contenteditable="false" style="margin:5px 0; padding: 4px 10px; font-size:12px !important; background: #eff1f4; border-radius: 4px; display: inline-block; height: fit-content;"><span id="button-tag-${selectedField?.value}" style="display: inline-block; width: 140px; font-size: 10px; font-weight: 500; background: #eff1f4; color: inherit; border-radius: 4px; outline: none; border: none; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;" title="${selectedField?.label}">${selectedField?.label}</span><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" style="cursor: pointer;" action-id='remove-field' parent-id="field-tag-${selectedField?.value}" viewbox="0 0 13 13"><path fill="#228bb5" fill-rule="evenodd" d="M2.179.293l4.006 4.006L10.192.293a1 1 0 011.32-.083l.095.083.471.471a1 1 0 010 1.415L8.071 6.185l4.007 4.007a1 1 0 010 1.415l-.471.471a1 1 0 01-1.415 0L6.185 8.071l-4.006 4.007a1 1 0 01-1.32.083l-.095-.083-.471-.471a1 1 0 010-1.415l4.006-4.007L.293 2.179a1 1 0 010-1.415L.764.293a1 1 0 011.415 0z" stroke-width="10" action-id='remove-field' parent-id="field-tag-${selectedField?.value}"></path></svg></span>${!isEdit ? '</span>&nbsp;' : EMPTY_STRING}`;

export const getMinifiedWidgetFieldHtml = (selectedField) =>
  `<span id="field-tag-${selectedField?.value}" data-field-id="${selectedField?.value}" data-field-label="${selectedField?.label}" data-field-type="${selectedField?.field_type}"></span>`;

export const getWidgetButtonHtml = (link, label, buttonStyle) => {
  if (buttonStyle === FIELD_OPTION_VALUES.BUTTON_TYPE_LINK) {
    return `<span contenteditable="false"><a href="${link}" target="_blank" style="color: #217CF5;">${label}</a></span>`;
  } else if (buttonStyle === FIELD_OPTION_VALUES.BUTTON_TYPE_SOLID) {
    return `<span contenteditable="false"><a href="${link}" target="_blank"><button style="border-radius: 3px; border: 1px solid #217CF5; background: #217CF5; color: white; padding: 8px 16px; cursor: pointer;">${label}</button></a></span>`;
  } else {
    return `<span contenteditable="false"><a href="${link}" target="_blank"><button style="border-radius: 3px; border: 1px solid #217CF5; outline: #217CF5; color: #217CF5; padding: 8px 16px; cursor: pointer;background: white;">${label}</button></a></span>`;
  }
};

export const onRemoveClickHandler = (value, editorRef, handleChildEdit) => {
  if (isEmpty(editorRef?.current)) return;

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
      const spanElem = editorRef.current.dom.getParent(
        originalTargetElem,
        `#${parentId}`,
      );
      spanElem.remove();
      editorRef.current.selection.moveToBookmark(currentCursorLocation);
    } else if (actionId === 'edit-child') {
      const childId = editorRef.current.dom.getAttrib(
        originalTargetElem,
        'child-id',
        null,
      );

      const childElem = editorRef.current.dom.get(childId);

      const isRecursive = editorRef.current.dom.getAttrib(
        childElem,
        EDITOR_HTML_IDS.IS_RECURSIVE,
        FIELD_OPTION_VALUES.CHILD_RECURSIVE_BORDER_YES,
      );
      const recursiveField = editorRef.current.dom.getAttrib(
        childElem,
        EDITOR_HTML_IDS.RECURSIVE_FIELD,
        EMPTY_STRING,
      );
      const bgColor = editorRef.current.dom.getAttrib(
        childElem,
        EDITOR_HTML_IDS.BG_COLOR,
        EMPTY_STRING,
      );
      const isBorder = editorRef.current.dom.getAttrib(
        childElem,
        EDITOR_HTML_IDS.CHILD_BORDER,
        FIELD_OPTION_VALUES.CHILD_RECURSIVE_BORDER_YES,
      );

      const childContentElem = childElem?.querySelector('#child-content');
      const recursiveIcon = childElem?.querySelector('#recursive-icon');

      const initialValue = childContentElem?.innerHTML;

      if (recursiveIcon) {
        initialValue?.replace(recursiveIcon?.innerHTML, EMPTY_STRING);
      }

      if (handleChildEdit) {
        handleChildEdit({
          initialValue,
          currentEditingElement: childElem,
          [FIELD_IDS.CHILD_RECURSIVE]: Number(isRecursive),
          [FIELD_IDS.CHILD_RECURSIVE_FIELD]: recursiveField,
          [FIELD_IDS.CHILD_BORDER]: Number(isBorder),
          childBgColor: bgColor,
        });
      }
    }
  }
};

const getCustomTemplateFormat = ({ fieldType, fieldId }) => {
  switch (fieldType) {
    case FIELD_TYPE.LINK:
      return `{{#removeTrailingComma}}{{#${fieldId}}}<a href={{link_url}} target="_blank">{{link_text}}</a>, {{/${fieldId}}}{{/removeTrailingComma}}`;
    case FIELD_TYPE.PHONE_NUMBER:
      return `{{#${fieldId}.phone_number}}{{${fieldId}.country_code}} {{${fieldId}.phone_number}}{{/${fieldId}.phone_number}}`;
    case FIELD_TYPE.CURRENCY:
      return `{{#${fieldId}.value}}{{${fieldId}.value}} {{${fieldId}.currency_type}}{{/${fieldId}.value}}`;
    case FIELD_TYPE.USER_TEAM_PICKER:
      return `{{#removeTrailingComma}}{{#${fieldId}.users}}{{first_name}} {{last_name}}, {{/${fieldId}.users}}{{/removeTrailingComma}}`;
    case FIELD_TYPE.DATA_LIST:
      return `{{#removeTrailingComma}}{{#${fieldId}}}{{label}}, {{/${fieldId}}}{{/removeTrailingComma}}`;
    case FIELD_TYPE.DATE:
      return `{{#renderDate}}{{${fieldId}}}{{/renderDate}}`;
    case FIELD_TYPE.DATETIME:
      return `{{#renderDateTime}}{{${fieldId}}}{{/renderDateTime}}`;
    case FIELD_TYPE.CHECKBOX:
      return `{{#removeTrailingComma}}{{#${fieldId}}}{{.}}, {{/${fieldId}}}{{/removeTrailingComma}}`;
    case FIELD_TYPE.YES_NO:
      return `{{#renderYesNo}}{{${fieldId}}}{{/renderYesNo}}`;
    default:
      return `{{${fieldId}}}`;
  }
};

export const editorChangeHandler = ({
  event = {},
  onChangeHandler = emptyFunction,
}) => {
  const htmlDocElement = extractHTMLFromString(event?.target?.value);

  const fieldElements = htmlDocElement.querySelectorAll(
    `[${EDITOR_HTML_IDS.FIELD_DATA_ID}]`,
  );

  let fieldIds = Array.from(fieldElements)?.map((element = {}) => element.getAttribute(EDITOR_HTML_IDS.FIELD_DATA_ID));

  fieldIds = fieldIds?.filter((currentField) => !isEmpty(currentField));
  fieldIds = uniq(fieldIds) || [];

  const recursiveFieldElements = htmlDocElement.querySelectorAll(
    `[${EDITOR_HTML_IDS.RECURSIVE_FIELD}]`,
  );

  let recursiveFieldIds = Array.from(recursiveFieldElements)?.map((element = {}) => element.getAttribute(EDITOR_HTML_IDS.RECURSIVE_FIELD));

  recursiveFieldIds = recursiveFieldIds?.filter((currentRecursiveField) => !isEmpty(currentRecursiveField));
  recursiveFieldIds = uniq(recursiveFieldIds) || [];

  const allFieldIds = uniq([...(fieldIds || []), ...(recursiveFieldIds || [])]);

  onChangeHandler(event, allFieldIds);
};

const getRecursiveTemplateByType = ({ recursiveField, innerContent, recursiveFieldType }) => {
  if (recursiveFieldType === FIELD_TYPE.USER_TEAM_PICKER) {
    return `{{#${recursiveField}.users}}${innerContent}{{/${recursiveField}.users}}`;
  } else {
    return `{{#${recursiveField}}}${innerContent}{{/${recursiveField}}}`;
  }
};

export const getParsedValueForOutput = (data) => {
  const htmlDocElement = extractHTMLFromString(data);

  const editorOnlyElements = htmlDocElement.querySelectorAll(
    `[${EDITOR_HTML_IDS.EDITOR_ONLY}]`,
  );

  editorOnlyElements?.forEach((e) => e?.remove());

  let rawHtml = htmlDocElement?.body?.innerHTML;
  if (!htmlDocElement) return rawHtml;

  const recursiveElements = htmlDocElement.querySelectorAll(
    `[${EDITOR_HTML_IDS.RECURSIVE_FIELD}]`,
  );

  recursiveElements.forEach((element = {}) => {
    const recursiveField = element.getAttribute(
      EDITOR_HTML_IDS.RECURSIVE_FIELD,
    );
    const recursiveFieldType = element.getAttribute(
      EDITOR_HTML_IDS.RECURSIVE_FIELD_TYPE,
    );

    const isRecursive = element.getAttribute(EDITOR_HTML_IDS.IS_RECURSIVE);
    const isBorder = element.getAttribute(EDITOR_HTML_IDS.CHILD_BORDER);

    const borderStyle =
      Number(isBorder) ===
      FIELD_OPTION_VALUES.CHILD_RECURSIVE_BORDER_YES
        ? 'border:1px solid gray;'
        : EMPTY_STRING;

    const currentElemOuterHtml = element?.outerHTML;
    const childContentElem = element?.children?.[0];

    element.removeAttribute('contenteditable');
    childContentElem?.setAttribute?.('style', `position:relative;width:100%;margin-bottom:8px;border-radius:2px;${borderStyle}`);

    rawHtml = rawHtml.replace(currentElemOuterHtml, element?.outerHTML);
    const childInnerHtml = childContentElem?.outerHTML;

    const templateFormat =
      Number(isRecursive) === FIELD_OPTION_VALUES.CHILD_RECURSIVE_BORDER_YES
        ? getRecursiveTemplateByType({ recursiveField, recursiveFieldType, innerContent: childInnerHtml })
        : childInnerHtml;

    rawHtml = rawHtml.replace(element?.innerHTML, templateFormat);
  });

  const fieldElements = htmlDocElement.querySelectorAll(
    `[${EDITOR_HTML_IDS.FIELD_DATA_ID}]`,
  );

  fieldElements.forEach((element) => {
    const fieldType = element.getAttribute(EDITOR_HTML_IDS.FIELD_TYPE_DATA);
    const fieldId = element.getAttribute(EDITOR_HTML_IDS.FIELD_DATA_ID);

    rawHtml = rawHtml.replace(
      element?.outerHTML,
      getCustomTemplateFormat({ fieldType, fieldId }),
    );
  });

  return rawHtml;
};

export const removeFieldAndDocIds = ({
  data = EMPTY_STRING,
  fieldUuids = [],
  docIds = [],
  isPostData = false,
}) => {
  const htmlDocElement = extractHTMLFromString(data);

  const filteredFieldUuids = fieldUuids?.filter((uuid) => {
    if (isEmpty(uuid)) return false;

    const fields = htmlDocElement.querySelectorAll(
      `[${EDITOR_HTML_IDS.FIELD_DATA_ID}="${uuid}"]`,
    );

    const recursiveFields = htmlDocElement.querySelectorAll(
      `[${EDITOR_HTML_IDS.RECURSIVE_FIELD}="${uuid}"]`,
    );

    return fields?.length || recursiveFields?.length;
  });

  const filteredDocIds = docIds?.filter((docId) => {
    if (isEmpty(docId)) return false;

    const doc = htmlDocElement.querySelectorAll(
      `[${EDITOR_HTML_IDS.DATA_IMAGE_ID}="${docId}"]`,
    );

    return doc?.length;
  });

  let rawHtml = htmlDocElement?.body?.innerHTML;
  if (!htmlDocElement) return rawHtml;

  const fieldElements = htmlDocElement.querySelectorAll(
    `[${EDITOR_HTML_IDS.FIELD_DATA_ID}]`,
  );

  const fieldFunc = isPostData
    ? getMinifiedWidgetFieldHtml
    : getWidgetFieldHtml;

  fieldElements.forEach((element) => {
    const value = element.getAttribute(EDITOR_HTML_IDS.FIELD_DATA_ID);
    const label = element.getAttribute(EDITOR_HTML_IDS.FIELD_LABEL_DATA);
    const field_type = element.getAttribute(EDITOR_HTML_IDS.FIELD_TYPE_DATA);

    rawHtml = rawHtml.replace(
      element?.outerHTML,
      fieldFunc(
        {
          value,
          label,
          field_type,
        },
        true,
      ),
    );
  });

  const renderedTemplate = getParsedValueForOutput(rawHtml);

  return { filteredFieldUuids, filteredDocIds, rawHtml, renderedTemplate };
};

export const getRenderCustomFunctions = (t) => {
  return {
    renderDate: () => (text, render) => {
      const renderedText = render(text);
      if (isEmpty(renderedText)) {
        return EMPTY_STRING;
      }
      return getFormattedDateFromUTC(render(text), HOLIDAY_DATE);
    },
    renderDateTime: () => (text, render) => {
      const renderedText = render(text);
      if (isEmpty(renderedText)) {
        return EMPTY_STRING;
      }
      return getFormattedDateFromUTC(render(text), TEAM_CREATED_DATE_TIME);
    },
    removeTrailingComma: () => (text, render) => {
      const renderedText = render(text);
      if (isEmpty(renderedText)) {
        return EMPTY_STRING;
      }

      return renderedText?.slice(0, -2);
    },
    renderYesNo: () => (boolean, render) => {
      const renderedBoolean = render(boolean);
      if (isUndefined(renderedBoolean) || isEmpty(renderedBoolean)) {
        return EMPTY_STRING;
      }
      return (renderedBoolean === true || renderedBoolean === 'true') ? WIDGET_STRINGS(t).TEMPLATE_STRINGS.YES : WIDGET_STRINGS(t).TEMPLATE_STRINGS.NO;
    },
  };
};
