import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { isEmpty, get, cloneDeep, unset } from 'utils/jsUtility';
import {
  Button,
  EButtonType,
  EPopperPlacements,
  Label,
  Modal,
  ModalStyleType,
  Popper,
  RadioGroup,
  Text,
  ETextSize,
  ModalSize,
  Skeleton,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames';
import gClasses from 'scss/Typography.module.scss';
import CloseIconV2 from 'assets/icons/CloseIconV2';
import { SketchPicker } from 'react-color';
import { useTranslation } from 'react-i18next';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import ThemeContext from '../../../hoc/ThemeContext';
import styles from './ChildCard.module.scss';
import { ARIA_ROLES, COLOR_CONSTANTS } from '../../../utils/UIConstants';
import TextEditor from '../../text_editor/TextEditor';
import { EDITOR_CONFIGS } from '../../text_editor/TextEditor.utils';
import {
  CHILD_EDIT_INIT,
  CHILD_INIT_LOCAL_STATE,
  CHILD_TOOLBAR2,
  EDITOR_CONSTANTS,
  FIELD_IDS,
  FIELD_OPTION_VALUES,
} from '../InformationWidget.constants';
import { WIDGET_STRINGS } from '../InformationWidget.strings';
import { FIELD_TYPE } from '../../../utils/constants/form.constant';
import { getInsertChildSchema } from './ChildCard.validation.schema';
import {
  useClickOutsideDetector,
  validate,
} from '../../../utils/UtilityFunctions';
import { emptyFunction, emptyRef } from '../../../utils/jsUtility';
import { EMPTY_HTML_REGEX } from '../../../utils/strings/Regex';
import FieldPicker from '../../field_picker/FieldPicker';
import { FEILD_LIST_DROPDOWN_TYPE, getGroupedFieldListForMapping } from '../../../containers/edit_flow/step_configuration/StepConfiguration.utils';

function ChildCard(props) {
  const {
    isModalOpen,
    handleModalOpen,
    parentEditorRef,
    customInit = {},
    allTableFields = [],
    allDirectArrayFields = [],
    setCurrentRecursiveFields,
    currentChildEditorContentRef,
    initialConfig: {
      initialValue = EMPTY_STRING,
      isChildEdit = false,
      currentEditingElement = null,
      isChildRecursive = 1,
      childRecursiveField = EMPTY_STRING,
      childBgColor = EMPTY_STRING,
      isChildBorder = 1,
    },
    setChildInitValue,
    onEditorClick,
  } = props;

  const { t } = useTranslation();

  const { INSERT_CHILD, CANCEL, SAVE } = WIDGET_STRINGS(t);

  const [editorLoading, setEditorLoading] = useState(true);
  const [localState, setLocalState] = useState(CHILD_INIT_LOCAL_STATE);
  const [childCardContent, setChildCardContent] = useState(EMPTY_STRING);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [allArrayFields, setAllArrayFields] = useState([]);
  const popperRef = useRef();

  useEffect(() => {
    const arrayFields = [...allTableFields, ...allDirectArrayFields];
    setAllArrayFields(arrayFields);

    if (isChildEdit) {
      const selectedField = arrayFields?.find(
        (field) => field?.value === childRecursiveField,
      );

      setLocalState({
        ...localState,
        [FIELD_IDS.CHILD_BORDER]: isChildBorder,
        [FIELD_IDS.CHILD_RECURSIVE]: isChildRecursive,
        [FIELD_IDS.CHILD_RECURSIVE_FIELD]: selectedField || {},
        [FIELD_IDS.CHILD_BG_COLOR]: childBgColor,
      });

      if (selectedField?.field_list_type === FIELD_TYPE.TABLE) {
        if (setCurrentRecursiveFields && !isEmpty(selectedField?.fields)) {
          setCurrentRecursiveFields(selectedField?.fields);
        }
      } else {
        setCurrentRecursiveFields([]);
      }
    }

    if (isChildEdit && !isEmpty(initialValue)) {
      setChildCardContent(initialValue);
      setEditorLoading(false);
    } else if (!isChildEdit) {
      setEditorLoading(false);
    }
  }, []);

  useClickOutsideDetector(popperRef, () => setColorPickerOpen(false));

  const {
    colorScheme: { highlight, widgetBg, appBg, activeColor },
  } = useContext(ThemeContext);

  const onCloseClick = () => {
    if (handleModalOpen) handleModalOpen(false);
    setLocalState(CHILD_INIT_LOCAL_STATE);
    setChildCardContent(EMPTY_STRING);
    setAllArrayFields([]);
    if (setCurrentRecursiveFields) setCurrentRecursiveFields([]);
    if (setChildInitValue) setChildInitValue(CHILD_EDIT_INIT);
  };

  const onSaveChildCardClick = () => {
    const currentErrorList = validate(
      {
        [FIELD_IDS.CHILD_RECURSIVE]: localState?.isChildRecursive,
        [FIELD_IDS.CHILD_BORDER]: localState?.isChildBorder,
        [FIELD_IDS.CHILD_RECURSIVE_FIELD]:
          localState?.childRecursiveField?.value,
        [FIELD_IDS.CHILD_EDITOR]: childCardContent,
      },
      getInsertChildSchema(t),
    );

    if (isEmpty(currentErrorList)) {
      if (parentEditorRef.current) {
        const recursiveFieldUuid = get(
          localState,
          ['childRecursiveField', 'value'],
          EMPTY_STRING,
        );

        const recursiveFieldType = get(
          localState,
          ['childRecursiveField', 'field_type'],
          EMPTY_STRING,
        );

        const isRecursive = localState?.isChildRecursive;

        const borderStyle =
          localState?.isChildBorder ===
          FIELD_OPTION_VALUES.CHILD_RECURSIVE_BORDER_YES
            ? 'border:1px solid gray;'
            : 'border:1px solid transparent;';

        const backgroundColor = localState?.childBgColor
          ? `background:${localState?.childBgColor};`
          : EMPTY_STRING;

        const uniqueId = uuidv4();

        const recursiveIcon =
          isRecursive === FIELD_OPTION_VALUES.CHILD_RECURSIVE_BORDER_YES
            ? '<span id="recursive-icon" class="child-card-icons recursive-icons">&#10227;</span>'
            : EMPTY_STRING;

        const card = `<div id="child-content-${uniqueId}" contenteditable="false" data-is-recursive="${isRecursive}" data-recursive-field="${recursiveFieldUuid}" data-recursive-field-type="${recursiveFieldType}" data-bg-color="${localState?.childBgColor}" data-is-border="${localState?.isChildBorder}" style="position:relative;width:100%;${backgroundColor}" class="child-card-container">
            <div class="card-icons-container" data-editor-only="1">
              ${recursiveIcon}
              <span id="edit-icon" action-id="edit-child" child-id="child-content-${uniqueId}" class="child-card-icons edit-icons">&#9998;</span>
            </div>
            <div id="child-content" class="child-content-container" style="position:relative;width:100%;pointer-events:none;border-radius:2px;${borderStyle}">
              ${childCardContent}
            </div>
        </div>`;

        if (isChildEdit) {
          parentEditorRef.current?.execCommand('mceSelectNode', false, currentEditingElement);
          parentEditorRef.current?.execCommand('mceReplaceContent', false, card);
        } else {
          parentEditorRef.current?.insertContent(card);
        }

        onCloseClick();
      }
    } else {
      setLocalState({
        ...localState,
        [FIELD_IDS.ERROR_LIST]: currentErrorList,
      });
    }
  };

  const handleChildCardChange = (editorHtml) => {
    if (currentChildEditorContentRef?.current?.dom) {
      const rawHtml = currentChildEditorContentRef.current.getContent({
        format: 'raw',
      });

      const rawEditorContent = currentChildEditorContentRef.current.getContent({
        format: 'text',
      });

      unset(localState, ['errorList', FIELD_IDS.CHILD_EDITOR]);

      setLocalState({
        ...localState,
      });

      if (!isEmpty(rawEditorContent?.trim()) || rawHtml?.includes('<img')) {
        setChildCardContent(rawHtml.replace(EMPTY_HTML_REGEX, '<br>'));
      } else {
        setChildCardContent(EMPTY_STRING);
      }
    }
    if (editorHtml) {
      return editorHtml.replace(EMPTY_HTML_REGEX, '<br>');
    }
    return null;
  };

  const onColorChange = (color) => {
    if (currentChildEditorContentRef.current?.iframeElement) {
      currentChildEditorContentRef.current.iframeElement.style.backgroundColor =
        color.hex;

      setLocalState({
        ...localState,
        [FIELD_IDS.CHILD_BG_COLOR]: color.hex,
      });
    }
  };

  const onRadioChangeHandler = (_event, id, value) => {
    unset(localState, ['errorList', id]);

    let updateData = {};

    if (id === INSERT_CHILD.CHILD_RECURSIVE.ID) {
      updateData = {
        childRecursiveField: {},
      };

      setCurrentRecursiveFields([]);
      unset(localState, ['errorList', INSERT_CHILD.CHILD_RECURSIVE_FIELD.ID]);
    }

    setLocalState({
      ...localState,
      [id]: value,
      ...updateData,
    });
  };

  const handleDropdownChangeHandler = (event) => {
    const {
      target: { value },
    } = event;

    const selectedField = allArrayFields?.find(
      (field) => field?.value === value,
    );

    if (selectedField?.field_list_type === FIELD_TYPE.TABLE) {
      if (setCurrentRecursiveFields && !isEmpty(selectedField?.fields)) {
        setCurrentRecursiveFields(selectedField?.fields);
      }
    } else {
      setCurrentRecursiveFields([]);
    }

    unset(localState, ['errorList', INSERT_CHILD.CHILD_RECURSIVE_FIELD.ID]);

    setLocalState({
      ...localState,
      [INSERT_CHILD.CHILD_RECURSIVE_FIELD.ID]: selectedField,
    });
  };

  const editorLoader = (
    <div>
      <Skeleton width="100%" height={50} />
      <Skeleton width="100%" height={300} />
    </div>
  );

  const allArrayFieldsFormatted = getGroupedFieldListForMapping(
    null,
    allArrayFields,
    EMPTY_STRING,
    FEILD_LIST_DROPDOWN_TYPE.ALL,
    t,
    [],
  );

  return (
    <Modal
      id={FIELD_IDS.INSERT_CHILD_CARD_MODAL}
      isModalOpen={isModalOpen}
      modalStyle={ModalStyleType.dialog}
      modalSize={ModalSize.full}
      headerContent={
        <div className={cx(gClasses.CenterVSpaceBetween, styles.HeaderContent)}>
          <Text
            size={ETextSize.XL}
            className={gClasses.FontWeight500}
            content={INSERT_CHILD.CONFIGURE_TITLE}
          />
          <CloseIconV2
            className={cx(gClasses.CursorPointer)}
            ariaLabel="Close"
            role={ARIA_ROLES.IMG}
            height="16"
            width="16"
            onClick={onCloseClick}
          />
        </div>
      }
      mainContentClassName={styles.EventDetailsContent}
      mainContent={
        <div className={styles.ChildCardContainer}>
          <RadioGroup
            id={INSERT_CHILD.CHILD_RECURSIVE.ID}
            labelText={INSERT_CHILD.CHILD_RECURSIVE.LABEL}
            selectedValue={localState?.isChildRecursive}
            options={INSERT_CHILD.CHILD_RECURSIVE.OPTIONS}
            onChange={onRadioChangeHandler}
            labelClassName={styles.LabelClassName}
            errorMessage={localState?.errorList?.isChildRecursive}
          />
          <div className={cx(gClasses.CenterVSpaceBetween, gClasses.W100)}>
            <RadioGroup
              id={INSERT_CHILD.CHILD_BORDER.ID}
              labelText={INSERT_CHILD.CHILD_BORDER.LABEL}
              selectedValue={localState?.isChildBorder}
              options={INSERT_CHILD.CHILD_BORDER.OPTIONS}
              onChange={onRadioChangeHandler}
              labelClassName={styles.LabelClassName}
              errorMessage={localState?.errorList?.isChildBorder}
            />
            <div className={gClasses.MB16}>
              <Label
                labelName={INSERT_CHILD.CHILD_BACKGROUND.LABEL}
                className={styles.LabelClassName}
              />
              <div ref={popperRef} className={gClasses.DisplayInlineBlock}>
                <button
                  onClick={() => setColorPickerOpen((p) => !p)}
                  className={cx(gClasses.CursorPointer, styles.ColorBtn)}
                  style={{
                    backgroundColor: localState?.childBgColor,
                  }}
                />
                <Popper
                  targetRef={popperRef}
                  open={colorPickerOpen}
                  placement={EPopperPlacements.BOTTOM_START}
                  className={gClasses.ZIndex22}
                  content={
                    <SketchPicker
                      onChange={onColorChange}
                      color={COLOR_CONSTANTS.WHITE}
                      presetColors={[highlight, widgetBg, appBg, activeColor]}
                      disableAlpha
                    />
                  }
                />
              </div>
            </div>
          </div>
          {localState?.isChildRecursive ===
            FIELD_OPTION_VALUES.CHILD_RECURSIVE_BORDER_YES && (
            <div className={gClasses.MB16}>
              <Label
                labelName={INSERT_CHILD.CHILD_RECURSIVE_FIELD.LABEL}
                className={styles.LabelClassName}
              />
              <FieldPicker
                isExactPopperWidth
                id={INSERT_CHILD.CHILD_RECURSIVE_FIELD.ID}
                optionList={cloneDeep(allArrayFieldsFormatted)}
                onChange={handleDropdownChangeHandler}
                errorMessage={localState?.errorList?.childRecursiveField}
                selectedOption={localState?.childRecursiveField}
                outerClassName={gClasses.W100}
                isDataFieldsOnly
                enableSearch
              />
            </div>
          )}
          <Label
            labelName={INSERT_CHILD.CHILD_EDITOR.LABEL}
            className={styles.LabelClassName}
          />
          <div
            className={cx(
              gClasses.PB32,
              localState?.errorList?.childCardEditor && styles.EditorError,
            )}
          >
            {editorLoading && editorLoader}
            {!editorLoading && (
              <TextEditor
                id={FIELD_IDS.CHILD_EDITOR}
                tinymceScriptSrc={EDITOR_CONFIGS.scriptSrc}
                onInit={(_evt, editor) => {
                  currentChildEditorContentRef.current = editor;

                  if (!isEmpty(childBgColor)) {
                    currentChildEditorContentRef.current.iframeElement.style.backgroundColor =
                      childBgColor;
                  }
                }}
                initialValue={initialValue}
                init={{
                  ...customInit,
                  extended_valid_elements: EDITOR_CONFIGS.extendedValidElements,
                  content_style: EDITOR_CONSTANTS.CONTENT_STYLE,
                  height: EDITOR_CONSTANTS.CHILD_HEIGHT,
                  paste_preprocess: (_, args) => {
                    if (args?.content?.includes('<img')) {
                      args.content = EMPTY_STRING;
                    }
                  },
                  plugins: EDITOR_CONFIGS.plugins,
                  toolbar1: EDITOR_CONFIGS.BODY_TOOLBAR1,
                  toolbar2: CHILD_TOOLBAR2,
                  paste_as_text: true,
                }}
                onClick={() => {
                  setColorPickerOpen((p) => !p);
                  onEditorClick();
                }}
                onEditorChange={handleChildCardChange}
              />
            )}
          </div>
          {localState?.errorList?.childCardEditor && (
            <Text
              content={localState?.errorList?.childCardEditor}
              size={ETextSize.SM}
              className={styles.EditorErrorMsg}
            />
          )}
        </div>
      }
      footerContent={
        <div className={cx(gClasses.RightH, styles.FooterContent)}>
          <Button
            buttonText={CANCEL}
            type={EButtonType.TERTIARY}
            onClickHandler={onCloseClick}
            className={gClasses.ML16}
          />
          <Button
            buttonText={SAVE}
            type={EButtonType.PRIMARY}
            onClickHandler={onSaveChildCardClick}
            className={gClasses.ML16}
          />
        </div>
      }
    />
  );
}

export default ChildCard;

ChildCard.defaultProps = {
  isModalOpen: false,
  handleModalOpen: emptyFunction,
  parentEditorRef: emptyRef,
  customInit: {},
  allTableFields: [],
  allDirectArrayFields: [],
  setCurrentRecursiveFields: emptyFunction,
  currentChildEditorContentRef: emptyRef,
};

ChildCard.propTypes = {
  isModalOpen: PropTypes.bool,
  handleModalOpen: PropTypes.func,
  parentEditorRef: PropTypes.object,
  customInit: PropTypes.object,
  allTableFields: PropTypes.array,
  allDirectArrayFields: PropTypes.array,
  setCurrentRecursiveFields: PropTypes.func,
  currentChildEditorContentRef: PropTypes.object,
};
