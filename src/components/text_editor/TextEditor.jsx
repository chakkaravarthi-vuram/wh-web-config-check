import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { ETextSize, Text } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import { CHARMAP, EDITOR_CONFIGS, getLanguageLocale, getLanguageUrl } from './TextEditor.utils';
import gClasses from '../../scss/Typography.module.scss';
import { DOCUMENT_GENERATION_STRINGS, extractHTMLFromString } from '../../containers/edit_flow/step_configuration/configurations/document_generation/DocumentGeneration.utils';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { KEY_CODES } from '../../utils/Constants';
import { HEADER_AND_FOOTER_HEIGHT } from './TextEditor.constants';

function TextEditor(props) {
  const {
    id,
    tinymceScriptSrc,
    labelText,
    initialValue,
    onInit,
    value,
    className,
    onClick,
    init = {},
    onEditorChange,
    editorRef,
    onNodeChange,
    errorMessage,
    isHeaderFooter,
    restrictNewLines,
  } = props;
  const notificationRef = useRef(null);
  const { t } = useTranslation();

  const initial_init_value = {
    language_url: getLanguageUrl(),
    language: getLanguageLocale(),
    menubar: false,
    statusbar: false,
    selector: 'textarea',
    hasUploadTab: true,
    contextmenu: false,
    paste_data_images: false,
    smart_paste: false,
    font_size_formats: EDITOR_CONFIGS.templateFontSizes,
    charmap: CHARMAP,
    anchor_bottom: false,
    anchor_top: false,
    relative_urls: false,
    remove_script_host: false,
    convert_urls: true,
  };
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

  const handleKeyDown = (event) => {
    if (isHeaderFooter) {
      const body = editorRef.current.getBody();
      if (
        event.keyCode === KEY_CODES.DELETE ||
        event.which === KEY_CODES.DELETE ||
        event.keyCode === KEY_CODES.BACKSPACE ||
        event.which === KEY_CODES.BACKSPACE
      ) {
        return true;
      }
      if (body.offsetHeight > HEADER_AND_FOOTER_HEIGHT) {
        event.preventDefault();
        showNotification();
        return false;
      }
    }
    if (restrictNewLines) {
      if (
        event.keyCode === KEY_CODES.ENTER ||
        event.which === KEY_CODES.ENTER
      ) {
        return false;
      }
    }
    return true;
  };

  return (
    <>
      <Editor
        id={id}
        tinymceScriptSrc={tinymceScriptSrc}
        initialValue={initialValue}
        labelText={labelText}
        className={className}
        onInit={onInit}
        value={value}
        onClick={onClick}
        init={{
          ...init,
          ...initial_init_value,
          paste_preprocess: (_, args) => {
            try {
              if (isHeaderFooter) {
                const htmlElement = extractHTMLFromString(args.content);
                const textContentFromHtml = htmlElement?.textContent;
                if (textContentFromHtml?.length > 28) {
                  showNotification();
                  args.content = EMPTY_STRING;
                }
                if (args?.content?.includes('<img')) {
                  args.content = EMPTY_STRING;
                }
              }
            } catch (e) {
              console.log(e);
            }
          },
        }}
        onEditorChange={onEditorChange}
        onKeyDown={handleKeyDown}
        onNodeChange={onNodeChange}
      />
      {
        errorMessage && (
          <Text
            content={errorMessage}
            className={gClasses.red22}
            size={ETextSize.SM}
          />
        )
      }
    </>
  );
}

export default TextEditor;
