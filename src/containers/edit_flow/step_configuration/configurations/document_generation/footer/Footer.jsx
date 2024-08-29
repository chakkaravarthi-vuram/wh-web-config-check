import React from 'react';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { BS } from 'utils/UIConstants';
import CheckboxGroup from 'components/form_components/checkbox_group/CheckboxGroup';
import Label from 'components/form_components/label/Label';
import { cloneDeep, get, isEmpty, nullCheck, set, unset } from 'utils/jsUtility';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { POPPER_PLACEMENTS } from 'components/auto_positioning_popper/AutoPositioningPopper';
import EditorComponent from '../EditorComponent';
import { DOCUMENT_GENERATION_STRINGS } from '../DocumentGeneration.utils';
import { EDITOR_CONFIGS } from '../../../../../../components/text_editor/TextEditor.utils';

function Footer(props) {
  const { t } = useTranslation();
  const {
    fieldDropDownOptions,
    tableDropDownOptions,
    flowData,
    stepData,
    getAllFields,
    onChangeHandler,
    active_document_action,
    active_document_action: { footer_document, footer_body },
    isAllFieldsLoading,
    errorMessage,
    stepIndex,
    imageUploadRef,
    uploadedImages,
    setCurrentUploadedImage,
    currentUploadedImage,
    document_generation_error_list,
    updateFlowState,
    docEditorRef,
  } = props;

  const { FOOTER, SHOW_PAGE_NUMBER, FOOTER_SETTINGS } = DOCUMENT_GENERATION_STRINGS;

  const footer_config = get(footer_document, 'footer_config', {});

  const handleShowPageChange = (event) => {
    try {
      const activeStepDetails = cloneDeep(stepData);
      const activeDocument = cloneDeep(activeStepDetails.active_document_action);
      if (nullCheck(event, 'target.id')) {
        const {
          target: { value, id },
        } = event;
        set(activeDocument, ['footer_document', 'footer_config', id], value);
        activeStepDetails.active_document_action = activeDocument;
        updateFlowState({ activeStepDetails });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleCheckboxChange = (value) => {
    try {
      const activeStepDetails = cloneDeep(stepData);
      const activeDocument = cloneDeep(activeStepDetails.active_document_action);
      if (!isEmpty(footer_config[SHOW_PAGE_NUMBER.ID]) || footer_config[SHOW_PAGE_NUMBER.ID]) {
        unset(
          activeDocument,
          ['footer_document', 'footer_config', SHOW_PAGE_NUMBER.ID],
        );
      } else {
        set(
          activeDocument,
          ['footer_document', 'footer_config', SHOW_PAGE_NUMBER.ID],
          value,
        );
      }

      activeStepDetails.active_document_action = activeDocument;
      updateFlowState({ activeStepDetails });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <Label content={t(FOOTER_SETTINGS.LABEL)} hideLabelClass />
      <EditorComponent
        id={FOOTER_SETTINGS.ID}
        fieldDropDownOptions={fieldDropDownOptions}
        tableDropDownOptions={tableDropDownOptions}
        flowData={flowData}
        stepData={stepData}
        getAllFields={getAllFields}
        onChangeHandler={onChangeHandler}
        active_document_action={active_document_action}
        isAllFieldsLoading={isAllFieldsLoading}
        errorMessage={errorMessage}
        editorHeight={250}
        toolbar1={EDITOR_CONFIGS.HEADER_FOOTER_TOOLBAR1}
        toolbar2={EDITOR_CONFIGS.HEADER_FOOTER_TOOLBAR2}
        stepIndex={stepIndex}
        loaderHeight={200}
        imageUploadRef={imageUploadRef}
        uploadedImages={uploadedImages}
        setCurrentUploadedImage={setCurrentUploadedImage}
        currentUploadedImage={currentUploadedImage}
        initialEditorState={footer_body}
        headerFooterDocId={get(footer_document, '_id', null)}
        docEditorRef={docEditorRef}
        isHeaderFooter
      />
      <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.W100)}>
        <Dropdown
          id={FOOTER.ID}
          label={t(FOOTER.LABEL)}
          optionList={FOOTER.OPTION_LIST(t)}
          selectedValue={footer_config[FOOTER.ID]}
          onChange={handleShowPageChange}
          className={cx(BS.W50, gClasses.MR30)}
          errorMessage={
            document_generation_error_list &&
            document_generation_error_list[FOOTER.ID]
          }
          placement={POPPER_PLACEMENTS.BOTTOM}
        />
      </div>
      <CheckboxGroup
        id={SHOW_PAGE_NUMBER.ID}
        optionList={SHOW_PAGE_NUMBER.OPTION_LIST(t)}
        selectedValues={footer_config[SHOW_PAGE_NUMBER.ID] ? [SHOW_PAGE_NUMBER.OPTION_LIST(t)[0].value] : EMPTY_STRING}
        onClick={handleCheckboxChange}
        hideLabel
      />
    </div>
  );
}

export default Footer;
