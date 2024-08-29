import React from 'react';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import { BS } from 'utils/UIConstants';
import Label from 'components/form_components/label/Label';
import CheckboxGroup from 'components/form_components/checkbox_group/CheckboxGroup';
import { cloneDeep, get, isEmpty, nullCheck, set, unset } from 'utils/jsUtility';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { POPPER_PLACEMENTS } from 'components/auto_positioning_popper/AutoPositioningPopper';
import EditorComponent from '../EditorComponent';
import { DOCUMENT_GENERATION_STRINGS } from '../DocumentGeneration.utils';
import { EDITOR_CONFIGS } from '../../../../../../components/text_editor/TextEditor.utils';

function Header(props) {
  const { t } = useTranslation();
  const {
    fieldDropDownOptions,
    tableDropDownOptions,
    flowData,
    stepData,
    getAllFields,
    onChangeHandler,
    active_document_action,
    active_document_action: { header_document, header_body },
    isAllFieldsLoading,
    errorMessage,
    stepIndex,
    imageUploadRef,
    uploadedImages,
    setCurrentUploadedImage,
    currentUploadedImage,
    updateFlowState,
    document_generation_error_list,
    docEditorRef,
  } = props;

  const header_config = get(header_document, 'header_config', {});

  const { HEADER, SHOW_PAGE_NUMBER, HEADER_SETTINGS } = DOCUMENT_GENERATION_STRINGS;

  const handleShowPageChange = (event) => {
    try {
      const activeStepDetails = cloneDeep(stepData);
      const activeDocument = cloneDeep(active_document_action);

      if (nullCheck(event, 'target.id')) {
        const {
          target: { value, id },
        } = event;

        set(activeDocument, ['header_document', 'header_config', id], value);

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
      const activeDocument = cloneDeep(active_document_action);

      if (!isEmpty(header_config[SHOW_PAGE_NUMBER.ID]) || header_config[SHOW_PAGE_NUMBER.ID]) {
        unset(
          activeDocument,
          ['header_document', 'header_config', SHOW_PAGE_NUMBER.ID],
        );
      } else {
        set(
          activeDocument,
          ['header_document', 'header_config', SHOW_PAGE_NUMBER.ID],
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
      <Label content={t(HEADER_SETTINGS.LABEL)} hideLabelClass />
      <EditorComponent
        id={HEADER_SETTINGS.ID}
        fieldDropDownOptions={fieldDropDownOptions}
        tableDropDownOptions={tableDropDownOptions}
        flowData={flowData}
        stepData={stepData}
        getAllOrUserPickerFields={getAllFields}
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
        initialEditorState={header_body}
        headerFooterDocId={get(header_document, '_id', null)}
        docEditorRef={docEditorRef}
        isHeaderFooter
      />
      <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.W100)}>
        <Dropdown
          id={HEADER.ID}
          label={t(HEADER.LABEL)}
          optionList={HEADER.OPTION_LIST(t)}
          selectedValue={header_config[HEADER.ID]}
          onChange={handleShowPageChange}
          className={cx(BS.W50, gClasses.MR30)}
          errorMessage={
            document_generation_error_list &&
            document_generation_error_list[HEADER.ID]
          }
          placement={POPPER_PLACEMENTS.BOTTOM}
        />
      </div>
      <CheckboxGroup
        id={SHOW_PAGE_NUMBER.ID}
        optionList={SHOW_PAGE_NUMBER.OPTION_LIST(t)}
        selectedValues={header_config[SHOW_PAGE_NUMBER.ID] ? [SHOW_PAGE_NUMBER.OPTION_LIST(t)[0].value] : EMPTY_STRING}
        onClick={handleCheckboxChange}
        hideLabel
      />
    </div>
  );
}

export default Header;
