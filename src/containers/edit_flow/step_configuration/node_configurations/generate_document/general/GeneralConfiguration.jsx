import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ECheckboxSize,
  Label,
  SingleDropdown,
  Text,
  TextInput,
  Size,
  Checkbox,
  NestedDropdown,
  DropdownList,
  EPopperPlacements,
  Chip,
  MultiDropdown,
  Tooltip,
  ETooltipPlacements,
  ETooltipType,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import { cloneDeep, nullCheck, set, unset } from 'utils/jsUtility';
import { GENERATE_DOCUMENT_STEP_CONFIGURATION_STRINGS } from '../GenerateDocument.strings';
import gClasses from '../../../../../../scss/Typography.module.scss';
import styles from '../GenerateDocument.module.scss';
import WarningIcon from '../../../../../../assets/icons/step_configuration_icons/WarningIcon';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import DocumentTemplate from './document_template/DocumentTemplate';
import {
  nodeConfigDataChange,
  useFlowNodeConfig,
} from '../../../../node_configuration/use_node_reducer/useNodeReducer';
import { generateEventTargetObject } from '../../../../../../utils/generatorUtils';
import { DOC_NAME_TOOLTIP_ID, RESPONSE_FIELD_KEYS } from '../GenerateDocument.constants';
import FieldConfiguration from '../../../../manage_flow_fields/FieldConfiguration';
import { ManageFlowFieldsProvider } from '../../../../manage_flow_fields/use_manage_flow_fields_reducer/useManageFlowFieldsReducer';
import { MANAGE_FLOW_FIELD_INITIAL_STATE } from '../../../../manage_flow_fields/ManageFlowFields.constants';
import Plus from '../../../../../../assets/icons/configuration_rule_builder/Plus';
// import RightMultiNavigateIcon from '../../../../../../assets/icons/RightMultiNavigateIcon';
// import LeftDirArrowIcon from '../../../../../../assets/icons/app_builder_icons/LeftDirArrow';
import { DEFAULT_COLORS_CONSTANTS } from '../../../../../../utils/UIConstants';
import jsUtility, { isEmpty } from '../../../../../../utils/jsUtility';
import useApiCall from '../../../../../../hooks/useApiCall';
import { FIELD_LIST_TYPE, FIELD_TYPE, MAX_PAGINATION_SIZE } from '../../../../../../utils/constants/form.constant';
import { apiGetAllFieldsList } from '../../../../../../axios/apiService/flow.apiService';
import { formatAllFieldsList } from '../../../../node_configuration/NodeConfiguration.utils';
import { getDocumentFieldDetails } from '../GenerateDocument.utils';
import { DOCUMENT_GENERATION_STRINGS } from '../../../configurations/document_generation/DocumentGeneration.utils';
import HelpIconV2 from '../../../../../../assets/icons/HelpIconV2';
import CheckIcon from '../../../../../../assets/icons/flow_icons/CheckIcon';

function GeneralConfiguration(props) {
  const { editorRef, headerRef, footerRef, isAddOnConfig = false, actions = [], metaData } = props;

  const { t } = useTranslation();

  const { data: docFields, fetch: docFieldFetch, clearData: clearDocFields, isLoading: isDocFieldsLoading, hasMore: hasMoreDocFields, page: docFieldsCurrentPage } = useApiCall({}, true, formatAllFieldsList);

  const { TYPE_AND_STORE, TEMPLATE, BUTTON_ACTION } =
    GENERATE_DOCUMENT_STEP_CONFIGURATION_STRINGS(t).GENERAL;

  const { TEMPLATE_NAME } = DOCUMENT_GENERATION_STRINGS;

  const templateNameTooltip = `${t(TEMPLATE_NAME.TOOLTIP_TEXT)} ${TEMPLATE_NAME.TOOLTIP_SYMBOLS}`;

  const { state, dispatch } = useFlowNodeConfig();
  // const [fieldListType, setFieldListType] = useState(EMPTY_STRING);
  // const [selectedStep, setSelectedStep] = useState(EMPTY_STRING);
  const [docFieldSearch, setDocFieldSearch] = useState(EMPTY_STRING);

  const {
    fileName,
    documentNameUuid,
    allowHeader,
    allowFooter,
    headerDocument,
    footerDocument,
    isFieldModalOpen,
    templateNameInsertFieldsList, // modified to only form fields
    errorList = {},
    documentFieldUuid = EMPTY_STRING,
    documentFieldName = EMPTY_STRING,
    documentBody,
    documentHeader,
    documentFooter,
    selectedActionLabels = [],
    documentGenerationActions = {},
  } = state;

  console.log('templateNameInsertFieldsList', templateNameInsertFieldsList);

  const documentNameField = getDocumentFieldDetails(documentNameUuid, templateNameInsertFieldsList);

  const onChangeHandler = (event) => {
    const { id, value } = event.target;
    const clonedErrorList = cloneDeep(errorList);
    delete clonedErrorList?.[RESPONSE_FIELD_KEYS.FILE_NAME];

    dispatch(
      nodeConfigDataChange({
        [id]: value,
        errorList: clonedErrorList,
      }),
    );
  };

  const handleCheckHandler = (id) => {
    const updatedData = {
      [id]: !state[id],
    };

    if (id === TEMPLATE.HEADER.ID) {
      updatedData[RESPONSE_FIELD_KEYS.DOCUMENT_HEADER] = null;

      const clonedHeaderDocument = cloneDeep(headerDocument);
      set(clonedHeaderDocument, ['headerConfig', RESPONSE_FIELD_KEYS.SHOW_IN_PAGES], EMPTY_STRING);
      set(clonedHeaderDocument, ['headerConfig', RESPONSE_FIELD_KEYS.SHOW_PAGE_NUMBER], false);

      if (!isEmpty(clonedHeaderDocument?._id)) {
        updatedData[RESPONSE_FIELD_KEYS.REMOVED_DOC_LIST]?.push(clonedHeaderDocument?._id);
        clonedHeaderDocument._id = null;
      }

      updatedData[RESPONSE_FIELD_KEYS.HEADER_DOCUMENT] = clonedHeaderDocument;
    } else {
      updatedData[RESPONSE_FIELD_KEYS.DOCUMENT_FOOTER] = null;

      const clonedFooterDocument = cloneDeep(footerDocument);
      set(clonedFooterDocument, ['footerConfig', RESPONSE_FIELD_KEYS.SHOW_IN_PAGES], EMPTY_STRING);
      set(clonedFooterDocument, ['footerConfig', RESPONSE_FIELD_KEYS.SHOW_PAGE_NUMBER], false);

      if (!isEmpty(clonedFooterDocument?._id)) {
        updatedData[RESPONSE_FIELD_KEYS.REMOVED_DOC_LIST]?.push(clonedFooterDocument?._id);
        clonedFooterDocument._id = null;
      }

      updatedData[RESPONSE_FIELD_KEYS.FOOTER_DOCUMENT] = clonedFooterDocument;
    }

    dispatch(
      nodeConfigDataChange(updatedData),
    );
  };
  console.log('errorListhandleDocumentFieldChange', errorList, state);
  const handleDocumentFieldChange = (event) => {
    if (nullCheck(event, 'target.id')) {
      const {
        target: { value, label },
      } = event;
      const clonedErrorList = cloneDeep(errorList);
      delete clonedErrorList?.[RESPONSE_FIELD_KEYS.DOCUMENT_FIELD_NAME];

      dispatch(
        nodeConfigDataChange({
          documentFieldName: label,
          documentFieldUuid: value,
          errorList: clonedErrorList,
        }),
      );
    }
  };

  const headerConfig = headerDocument?.headerConfig;

  const headerShowPageChange = (event) => {
    try {
      if (nullCheck(event, 'target.id')) {
        const {
          target: { value, id },
        } = event;
        const clonedHeaderDocument = cloneDeep(headerDocument);

        set(clonedHeaderDocument, ['headerConfig', id], value);

        dispatch(
          nodeConfigDataChange({
            headerDocument: clonedHeaderDocument,
          }),
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const headerCheckboxChange = () => {
    try {
      const clonedHeaderDocument = cloneDeep(headerDocument);

      if (headerConfig?.showPageNumber) {
        unset(clonedHeaderDocument, [
          'headerConfig',
          RESPONSE_FIELD_KEYS.SHOW_PAGE_NUMBER,
        ]);
      } else {
        set(
          clonedHeaderDocument,
          ['headerConfig', RESPONSE_FIELD_KEYS.SHOW_PAGE_NUMBER],
          true,
        );
      }

      dispatch(
        nodeConfigDataChange({
          headerDocument: clonedHeaderDocument,
        }),
      );
    } catch (e) {
      console.log(e);
    }
  };

  const footerConfig = footerDocument?.footerConfig;

  const footerShowPageChange = (event) => {
    try {
      if (nullCheck(event, 'target.id')) {
        const {
          target: { value, id },
        } = event;
        const clonedFooterDocument = cloneDeep(footerDocument);

        set(clonedFooterDocument, ['footerConfig', id], value);

        dispatch(
          nodeConfigDataChange({
            footerDocument: clonedFooterDocument,
          }),
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const footerCheckboxChange = () => {
    try {
      const clonedFooterDocument = cloneDeep(footerDocument);

      if (footerConfig?.showPageNumber) {
        unset(clonedFooterDocument, [
          'footerConfig',
          RESPONSE_FIELD_KEYS.SHOW_PAGE_NUMBER,
        ]);
      } else {
        set(
          clonedFooterDocument,
          ['footerConfig', RESPONSE_FIELD_KEYS.SHOW_PAGE_NUMBER],
          true,
        );
      }

      dispatch(
        nodeConfigDataChange({
          footerDocument: clonedFooterDocument,
        }),
      );
    } catch (e) {
      console.log(e);
    }
  };

  const onChooseDocumentNameField = (field) => {
    console.log('onChooseDocumentNameField', field);
    const clonedErrorList = cloneDeep(errorList);
    delete clonedErrorList?.[RESPONSE_FIELD_KEYS.FILE_NAME];

    dispatch(
      nodeConfigDataChange({
        documentNameUuid: field?.value,
        fileName: field?.fieldName || field?.label,
        errorList: clonedErrorList,
      }),
    );
  };

  const onRemoveTemplateField = () => {
    dispatch(
      nodeConfigDataChange({
        documentNameUuid: null,
        fileName: EMPTY_STRING,
      }),
    );
  };

  const onCreateFieldClick = () => {
    dispatch(
      nodeConfigDataChange({
        isFieldModalOpen: true,
      }),
    );
  };

  const onFieldCloseClick = () => {
    dispatch(
      nodeConfigDataChange({
        isFieldModalOpen: false,
      }),
    );
  };

  // const getInitialView = (onNextView) => (
  //   <DropdownList
  //     optionList={templateNameInsertFieldsList}
  //     selectedValue={fieldListType?.selectedValue}
  //     customDropdownListView={
  //       (option) => (
  //         <button
  //           className={cx(styles.ViewContainer, gClasses.CenterV, gClasses.JusSpaceBtw, gClasses.W100, gClasses.PX12, gClasses.PY10)}
  //           onClick={() => {
  //             setFieldListType(option);
  //             onNextView();
  //           }}
  //         >
  //           <div className={cx(gClasses.FTwo13, styles.FlowOrDlLabel)}>{option.label}</div>
  //           <RightMultiNavigateIcon />
  //         </button>
  //       )
  //     }
  //     className={gClasses.Zindex1}
  //   />
  // );

  const getFieldsList = (onNextView, onClose) => (
    <div className={styles.SecondNestedView}>
      {/* <button className={cx(gClasses.PX12, gClasses.PY10, gClasses.CenterV)} onClick={onPreviousView}>
        <LeftDirArrowIcon className={gClasses.MR5} fill="#959BA3" />
        <Text content={fieldListType?.label} />
      </button> */}
      <DropdownList
        className={styles.Dropdown}
        optionList={templateNameInsertFieldsList}
        customDropdownListView={
          (option) => (
            <button
              className={cx(styles.ViewContainer, gClasses.CenterV, gClasses.JusSpaceBtw, gClasses.W100, gClasses.PX12, gClasses.PY10)}
              onClick={() => {
                // if (option?.isStep) {
                //   setSelectedStep(option);
                //   onNextView();
                // } else {
                //   onChooseDocumentNameField(option);
                //   onClose();
                // }
                onChooseDocumentNameField(option);
                onClose();
              }}
            >
              <div className={cx(gClasses.FTwo13, styles.FlowOrDlLabel)}>{option.label}</div>
              {/* {option?.isStep && <RightMultiNavigateIcon />} */}
              {option?.value === documentNameUuid && <CheckIcon />}
            </button>
          )
        }
      />
    </div>
  );

  // const getStepSystemFields = (onClose, onPreviousView) => (
  //   <div className={styles.SecondNestedView}>
  //     <button className={cx(gClasses.PX12, gClasses.PY10, gClasses.CenterV)} onClick={onPreviousView}>
  //       <LeftDirArrowIcon className={gClasses.MR5} fill="#959BA3" />
  //       <Text content={selectedStep.label} />
  //     </button>
  //     <DropdownList
  //       className={styles.Dropdown}
  //       optionList={selectedStep.subMenuItems}
  //       customDropdownListView={
  //         (option) => (
  //           <button
  //             className={cx(styles.ViewContainer, gClasses.CenterV, gClasses.JusSpaceBtw, gClasses.W100, gClasses.PX12, gClasses.PY10)}
  //             onClick={() => {
  //               onChooseDocumentNameField(option);
  //               onClose();
  //             }}
  //           >
  //             <div className={cx(gClasses.FTwo13, styles.FlowOrDlLabel)}>{option.label}</div>
  //           </button>
  //         )
  //       }
  //     />
  //   </div>
  // );

  const handleSaveFieldResponse = (response) => {
    dispatch(
      nodeConfigDataChange({
        documentFieldName: response?.field_name,
        documentFieldUuid: response?.field_uuid,
      }),
    );
  };

  const onActionClick = (value, label) => {
    const clonedActions = cloneDeep(documentGenerationActions);
    const selectedActions = cloneDeep(clonedActions?.actionUuid) || [];
    const clonedLabels = cloneDeep(clonedActions?.selectedActionLabels) || [];
    const index = selectedActions?.findIndex((actionUuid) => actionUuid === value);
    if (index > -1) {
      selectedActions.splice(index, 1);
      clonedLabels.splice(index, 1);
    } else {
      selectedActions.push(value);
      clonedLabels.push(label);
    }
    clonedActions.actionUuid = selectedActions;
    dispatch(
      nodeConfigDataChange({
        documentGenerationActions: clonedActions,
        selectedActionLabels: clonedLabels,
      }),
    );
  };

  const getAllInitialDocFields = (search, page) => {
    const docFieldParams = {
      page: page || docFieldsCurrentPage || 1,
      size: MAX_PAGINATION_SIZE,
      flow_id: metaData.flowId,
      field_list_type: FIELD_LIST_TYPE.DIRECT,
      allowed_field_types: [FIELD_TYPE.FILE_UPLOAD],
      search: search,
    };
    if (jsUtility.isEmpty(docFieldParams.search)) delete docFieldParams.search;
    docFieldFetch(apiGetAllFieldsList(docFieldParams));
  };

  const getAllDocFields = () => {
    clearDocFields({ data: [], paginationData: {} });
    setDocFieldSearch(EMPTY_STRING);
    getAllInitialDocFields(EMPTY_STRING, 1);
  };

  const onDocFieldsSearchChangeHandler = (event) => {
    setDocFieldSearch(event?.target?.value);
    getAllInitialDocFields(event?.target?.value, 1);
  };

  const loadMoreDocFields = () => {
    getAllInitialDocFields(docFieldSearch, docFieldsCurrentPage + 1);
  };

  return (
    <div>
      {
        isAddOnConfig && (
          <MultiDropdown
            optionList={cloneDeep(actions)}
            dropdownViewProps={{
              labelName: BUTTON_ACTION,
              selectedLabel: !isEmpty(selectedActionLabels) && selectedActionLabels.join(', '),
              errorMessage: errorList?.actionUuid,
            }}
            onClick={onActionClick}
            selectedListValue={documentGenerationActions?.actionUuid}
          />
        )
      }
      <ManageFlowFieldsProvider initialState={MANAGE_FLOW_FIELD_INITIAL_STATE}>
        {isFieldModalOpen && (
          <FieldConfiguration
            metaData={{
              moduleId: metaData?.flowId,
            }}
            onCloseClick={onFieldCloseClick}
            isDocumentGeneration
            onSaveFieldResponse={handleSaveFieldResponse}
          />
        )}
      </ManageFlowFieldsProvider>

      <Text
        className={cx(gClasses.FontWeight500, gClasses.FTwo16GrayV3)}
        content={TYPE_AND_STORE.TITLE}
      />
      <div className={gClasses.MT12}>
        <Label // document type instruction
          labelName={TYPE_AND_STORE.DOCUMENT_TYPE.LABEL}
          innerLabelClass={styles.FieldLabel}
        />
        <div className={cx(gClasses.MT12, styles.DocTypeContainer)}>
          <WarningIcon />
          <Text
            content={TYPE_AND_STORE.DOCUMENT_TYPE.INSTRUCTION}
            className={styles.DocInstructionLabel}
          />
        </div>
      </div>
      <div className={cx(gClasses.DisplayFlex, gClasses.JusSpaceBtw)}>
        <Label // choose doc field
          labelName={TYPE_AND_STORE.STORE_FIELD.LABEL}
          className={gClasses.MT12}
          innerLabelClass={styles.FieldLabel}
          isRequired
        />
      </div>
      <div className={styles.StoreField}>
        <SingleDropdown
          id={TYPE_AND_STORE.STORE_FIELD.ID}
          optionList={cloneDeep(docFields) || []}
          onClick={(value, label, _list, id) => {
            handleDocumentFieldChange(generateEventTargetObject(id, value, { label }));
          }}
          searchProps={{
            searchPlaceholder: TYPE_AND_STORE.STORE_FIELD.SEARCH.PLACEHOLDER,
            searchValue: docFieldSearch,
            onChangeSearch: onDocFieldsSearchChangeHandler,
            searchLabelClass: styles.SearchLabel,
            searchInputClass: styles.SearchInput,
          }}
          infiniteScrollProps={{
            dataLength: docFields?.length || 0,
            next: loadMoreDocFields,
            hasMore: hasMoreDocFields,
            scrollableId: TYPE_AND_STORE.STORE_FIELD.CREATE.ID,
            scrollThreshold: 0.8,
          }}
          dropdownViewProps={{
            placeholder: TYPE_AND_STORE.STORE_FIELD.PLACEHOLDER,
            onClick: getAllDocFields,
            onKeyDown: getAllDocFields,
            selectedLabel: documentFieldName,
          }}
          selectedValue={documentFieldUuid}
          noDataFoundMessage={TYPE_AND_STORE.STORE_FIELD.SEARCH.NO_FIELDS_FOUND}
          errorMessage={errorList?.[RESPONSE_FIELD_KEYS.DOCUMENT_FIELD_NAME]}
          isLoadingOptions={isDocFieldsLoading}
        />
        <button
          onClick={onCreateFieldClick}
          className={cx(styles.Button)}
        >
          <Plus />
          {TYPE_AND_STORE.STORE_FIELD.CREATE.BUTTON_LABEL}
        </button>
      </div>
      <div>
        <Text
          className={cx(
            gClasses.FontWeight500,
            gClasses.FTwo16GrayV3,
            gClasses.MT24,
          )}
          content={TEMPLATE.TITLE}
        />
        <div
          className={cx(
            gClasses.DisplayFlex,
            gClasses.JusSpaceBtw,
            gClasses.MB6,
            gClasses.AlignItemBaseline,
          )}
        >
          <div className={gClasses.DisplayFlex}>
            <Label // choose doc field
              labelName={TEMPLATE.NAME.LABEL}
              innerLabelClass={styles.FieldLabel}
              isRequired
            />
            <Tooltip
              id={DOC_NAME_TOOLTIP_ID}
              tooltipClass={styles.InfoTooltip}
              className={gClasses.ML7}
              text={templateNameTooltip}
              tooltipType={ETooltipType.INFO}
              tooltipPlacement={ETooltipPlacements.TOP}
              icon={<HelpIconV2 className={styles.InfoIcon} />}
            />
          </div>
          <NestedDropdown
            displayText="Insert field"
            totalViews={3}
            className={styles.InsertDropdown}
            popperPlacement={EPopperPlacements.BOTTOM}
            dropdownViewProps={{
              customDropdownView: (
                <div
                  className={cx(
                    gClasses.FTwo13BlueV39,
                    gClasses.W100,
                    gClasses.FontWeight500,
                  )}
                >
                  Insert field
                </div>
              ),
            }}
          >
            {({ close, view, nextView: onNextView, prevView: onPreviousView }) => {
              console.log('viewnested', view);
              switch (view) {
                // case 1: return getInitialView(onNextView);
                // case 2: return getFieldsList(onNextView, close, onPreviousView);
                // case 3: return getStepSystemFields(onPreviousView, close);
                case 1: return getFieldsList(onNextView, close, onPreviousView);
                default: return null;
              }
            }}
          </NestedDropdown>
        </div>
        {!isEmpty(documentNameUuid) ?
          <div className={styles.TemplateField}>
            <Chip
              id={documentNameUuid}
              text={documentNameField?.parentLabel || documentNameField?.label}
              className={cx(gClasses.FS13, gClasses.FontWeight500, gClasses.LineHeightV2, gClasses.LetterSpacingNormal)}
              textClassName={styles.ChipTextStyle}
              backgroundColor={DEFAULT_COLORS_CONSTANTS.LIGHT_BLUE}
              textColor={DEFAULT_COLORS_CONSTANTS.BLUE_V39}
              onDelete={onRemoveTemplateField}
            />
          </div> :
          <TextInput
            id={TEMPLATE.NAME.ID}
            className={gClasses.MT6}
            required
            placeholder={TEMPLATE.NAME.PLACEHOLDER}
            value={fileName}
            onChange={onChangeHandler}
            size={Size.sm}
            errorMessage={errorList?.[RESPONSE_FIELD_KEYS.FILE_NAME]}
          />
        }
        <Label // main template
          labelName={TEMPLATE.DOCUMENT.LABEL}
          className={cx(gClasses.MT12, gClasses.MB6)}
          innerLabelClass={styles.FieldLabel}
          isRequired
        />
        <DocumentTemplate
          id={RESPONSE_FIELD_KEYS.DOCUMENT_BODY}
          allowInsert
          editorRef={editorRef}
          errorMessage={errorList?.[RESPONSE_FIELD_KEYS.DOCUMENT_BODY]}
          value={documentBody}
          isBody
        />
        <div className={gClasses.MT16}>
          <Checkbox // Allow header
            id={TEMPLATE.HEADER.ID}
            className={cx(gClasses.CenterV, gClasses.MT12)}
            isValueSelected={allowHeader}
            details={TEMPLATE.HEADER.ADD_PAGE_HEADER_OPTION}
            size={ECheckboxSize.LG}
            onClick={() => handleCheckHandler(TEMPLATE.HEADER.ID)}
            checkboxViewLabelClassName={cx(
              gClasses.FTwo13GrayV90,
              gClasses.CheckboxClass,
            )}
            errorMessage={EMPTY_STRING}
          />
          {allowHeader && (
            <div className={gClasses.ML28}>
              <Label // header template
                labelName={TEMPLATE.HEADER.LABEL}
                className={cx(gClasses.MT16, gClasses.MB6)}
                innerLabelClass={styles.FieldLabel}
                isRequired
              />
              <DocumentTemplate
                id={RESPONSE_FIELD_KEYS.DOCUMENT_HEADER}
                editorRef={headerRef}
                errorMessage={errorList?.[RESPONSE_FIELD_KEYS.DOCUMENT_HEADER]}
                value={documentHeader}
                isHeaderFooter
              />
              <div className={gClasses.MT16}>
                <SingleDropdown
                  id={TEMPLATE.HEADER.PAGE_HEADER.ID}
                  optionList={TEMPLATE.HEADER.PAGE_HEADER.OPTIONS(true)}
                  onClick={(value, _label, _list, id) =>
                    headerShowPageChange(generateEventTargetObject(id, value))
                  }
                  dropdownViewProps={{
                    labelName: TEMPLATE.HEADER.PAGE_HEADER.LABEL,
                  }}
                  placeholder={TEMPLATE.HEADER.PAGE_HEADER.PLACEHOLDER}
                  selectedValue={headerConfig?.showInPages}
                  showReset
                  className={gClasses.ZIndex2}
                />
                <Checkbox // Allow header
                  className={cx(gClasses.CenterV, gClasses.MT12)}
                  isValueSelected={headerConfig?.showPageNumber}
                  id={TEMPLATE.HEADER.PAGE_HEADER.SHOW_PAGE_NUMBER.ID}
                  details={TEMPLATE.HEADER.PAGE_HEADER.SHOW_PAGE_NUMBER_OPTION}
                  size={ECheckboxSize.LG}
                  onClick={headerCheckboxChange}
                  checkboxViewLabelClassName={cx(
                    gClasses.FTwo13GrayV90,
                    gClasses.CheckboxClass,
                  )}
                  errorMessage={EMPTY_STRING}
                />
              </div>
            </div>
          )}
        </div>
        <div className={gClasses.MT16}>
          <Checkbox // Allow footer
            id={TEMPLATE.FOOTER.ID}
            className={cx(gClasses.CenterV, gClasses.MT12)}
            isValueSelected={allowFooter}
            details={TEMPLATE.FOOTER.ADD_PAGE_FOOTER_OPTION}
            size={ECheckboxSize.LG}
            onClick={() => handleCheckHandler(TEMPLATE.FOOTER.ID)}
            checkboxViewLabelClassName={cx(
              gClasses.FTwo13GrayV90,
              gClasses.CheckboxClass,
            )}
            errorMessage={EMPTY_STRING}
          />
          {allowFooter && (
            <div className={gClasses.ML28}>
              <Label // footer template
                labelName={TEMPLATE.FOOTER.LABEL}
                className={cx(gClasses.MT12, gClasses.MB6)}
                innerLabelClass={styles.FieldLabel}
                isRequired
              />
              <DocumentTemplate
                id={RESPONSE_FIELD_KEYS.DOCUMENT_FOOTER}
                editorRef={footerRef}
                errorMessage={errorList?.[RESPONSE_FIELD_KEYS.DOCUMENT_FOOTER]}
                value={documentFooter}
                isHeaderFooter
              />
              <div className={gClasses.MT16}>
                <SingleDropdown
                  id={TEMPLATE.FOOTER.PAGE_FOOTER.ID}
                  optionList={TEMPLATE.HEADER.PAGE_HEADER.OPTIONS(false)}
                  onClick={(value, _label, _list, id) =>
                    footerShowPageChange(generateEventTargetObject(id, value))
                  }
                  dropdownViewProps={{
                    labelName: TEMPLATE.FOOTER.PAGE_FOOTER.LABEL,
                  }}
                  placeholder={TEMPLATE.FOOTER.PAGE_FOOTER.PLACEHOLDER}
                  selectedValue={footerConfig?.showInPages}
                  showReset
                />
                <Checkbox // Allow header
                  className={cx(gClasses.CenterV, gClasses.MT12)}
                  id={TEMPLATE.HEADER.PAGE_HEADER.SHOW_PAGE_NUMBER.ID}
                  isValueSelected={footerConfig?.showPageNumber}
                  details={TEMPLATE.FOOTER.PAGE_FOOTER.SHOW_PAGE_NUMBER_OPTION}
                  size={ECheckboxSize.LG}
                  onClick={footerCheckboxChange}
                  checkboxViewLabelClassName={cx(
                    gClasses.FTwo13GrayV90,
                    gClasses.CheckboxClass,
                  )}
                  errorMessage={EMPTY_STRING}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GeneralConfiguration;
