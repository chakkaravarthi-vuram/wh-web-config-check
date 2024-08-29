import React, { useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import styles from './InfoField.module.scss';
import gClasses from '../../../scss/Typography.module.scss';
import { isEmpty } from '../../../utils/jsUtility';
import Label from '../label/Label';
import HelperMessage, {
  HELPER_MESSAGE_TYPE,
} from '../helper_message/HelperMessage';
import TextEditor from '../../text_editor/TextEditor';
import { EDITOR_CONFIGS } from '../../text_editor/TextEditor.utils';
import {
  EMPTY_HTML_REGEX,
  REMOVE_HTML_REGEX,
  REMOVE_NEW_LINE_REGEX,
} from '../../../utils/strings/Regex';

function InfoField(props) {
  const {
    customIcon,
    noToolbar,
    label,
    errorMessage,
    basicToolbar,
    isInstruction,
    editorClassName = null,
    customEditorHeight,
    onChangeHandler,
    description,
    currentEditorContentRef,
    toolBar2,
    customInit = {},
    onEditorClick,
    onInit,
  } = props;

  const [isEditorLoading, setIsEditorLoading] = useState(true);

  const editorDescription = !isEmpty(description) ? description : EMPTY_STRING;
  const [initialEditorDescription] = useState(editorDescription);

  const editorContentRef = useRef();

  let toolBar;
  let editorHeight = 0;
  if (basicToolbar) {
    toolBar = EDITOR_CONFIGS.BASIC_TOOLBAR;
    editorHeight = 200;
  } else if (noToolbar) {
    toolBar = EMPTY_STRING;
    editorHeight = 100;
  } else {
    editorHeight = 300;
    toolBar = EDITOR_CONFIGS.BODY_TOOLBAR1;
  }

  const editorLoader = (
    <div>
      <Skeleton width="100%" height={50} />
      <Skeleton
        width="100%"
        height={(customEditorHeight || editorHeight) - 50}
      />
    </div>
  );

  const onEditorStateChange = (editorHtml) => {
    if (description === editorHtml) return null; // handled internal component did update

    if (editorContentRef?.current?.dom) {
      const rawHtml = editorContentRef.current.getContent({
        format: 'raw',
      });
      const parsedContent = rawHtml
        .replace(REMOVE_HTML_REGEX, EMPTY_STRING)
        .replace(REMOVE_NEW_LINE_REGEX, EMPTY_STRING);
      const rawEditorContent = editorContentRef.current.getContent({
        format: 'text',
      });

      if (!isEmpty(rawEditorContent?.trim()) || rawHtml.includes('<img')) {
        onChangeHandler({
          target: {
            value: rawHtml.replace(EMPTY_HTML_REGEX, '<br>'),
            parsedContent: parsedContent,
          },
        });
      } else {
        onChangeHandler({
          target: { value: EMPTY_STRING, parsedContent: EMPTY_STRING },
        });
      }
    }
    if (editorHtml) {
      return editorHtml.replace(EMPTY_HTML_REGEX, '<br>');
    }
    return null;
  };

  return (
    <div className={styles.InputTextStyle}>
      <Label
        labelFor="InfoField_Editor"
        content={label}
        isRequired={!isInstruction}
        hideLabelClass
      />
      <div className={!isEmpty(errorMessage) && styles.EditorError}>
        {isEditorLoading && editorLoader}
        <div
          style={{ display: isEditorLoading ? 'none' : 'block' }}
          className={editorClassName}
        >
          <TextEditor
            id="InfoField_Editor"
            tinymceScriptSrc="/tinymce/tinymce.min.js"
            initialValue={initialEditorDescription}
            onClick={onEditorClick}
            onInit={(_evt, editor) => {
              if (editorContentRef) {
                editorContentRef.current = editor;
              }
              if (currentEditorContentRef) {
                currentEditorContentRef.current = editor;
              }
              setIsEditorLoading(false);
              if (onInit) onInit(_evt, editor);
            }}
            init={{
              ...customInit,
              height: customEditorHeight || editorHeight,
              paste_preprocess: (_, args) => {
                if (args?.content?.includes('<img')) {
                  args.content = EMPTY_STRING;
                }
              },
              plugins: EDITOR_CONFIGS.plugins,
              toolbar1: toolBar,
              toolbar2: toolBar2,
              paste_as_text: true,
            }}
            onEditorChange={onEditorStateChange}
          />
        </div>
      </div>
      {customIcon || null}
      {!isEmpty(errorMessage) && (
        <HelperMessage
          message={errorMessage}
          type={HELPER_MESSAGE_TYPE.ERROR}
          className={gClasses.ErrorMarginV1}
        />
      )}
    </div>
  );
}

export default InfoField;

InfoField.defaultProps = {
  readOnly: false,
  toolbarHidden: false,
  placeholder: 'INFORMATION',
  basicToolbar: false,
};

InfoField.propTypes = {
  readOnly: PropTypes.bool,
  toolbarHidden: PropTypes.bool,
  placeholder: PropTypes.string,
  basicToolbar: PropTypes.bool,
};
