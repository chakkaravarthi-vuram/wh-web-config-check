import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty } from 'utils/jsUtility';
import gClasses from 'scss/Typography.module.scss';
import InfoField from '../form_components/info_field/InfoField';
import InsertField from './insert_field/InsertField';
import ChildCard from './child_card/ChildCard';
import InsertButton from './insert_button/InsertButton';
import InsertImage from './insert_image/InsertImage';
import './InformationWidget.css';
import {
  APP_TOOLBAR2,
  CHILD_EDIT_INIT,
  EDITOR_CONSTANTS,
  GET_ALL_FIELDS,
  TOOLBAR2,
  TOOLBAR2_BUTTONS,
  WIDGET_IGNORED_FIELD_TYPES,
} from './InformationWidget.constants';
import { WIDGET_STRINGS } from './InformationWidget.strings';
import { FIELD_TYPE } from '../../utils/constants/form.constant';
import {
  editorChangeHandler,
  onRemoveClickHandler,
} from './InformationWidget.utils';
import { EDITOR_CONFIGS } from '../text_editor/TextEditor.utils';
import { getAllTablesFromSections } from '../../utils/UtilityFunctions';
import {
  WIDGET_INIT_STATE,
  updateWidgetDataChange,
} from '../../redux/reducer/InformationWidgetReducer';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { emptyFunction } from '../../utils/jsUtility';
import { getModuleIdByModuleType } from '../../containers/form/Form.utils';
import { getAllFieldsTaskListThunk } from '../../redux/actions/InformationWidget.Action';
import { RESPONSE_FIELD_KEYS } from '../../utils/constants/form/form.constant';

function InformationWidget(props) {
  const {
    errorMessage,
    label,
    onChangeHandler,
    description,
    getAllFieldsApi,
    metaData = {},
    moduleType,
    entityData,
    contextData,
    allFieldsHasMore,
    allFields,
    allFieldsCurrentPage,
    updateWidgetDataChange,
    refUuid,
    isAllFieldsLoading,
    onInit,
    isAppWidget,
    addDocumentHandler,
    informationData = {},
    isDesignElements = false,
    setColorPickerOpen,
  } = props;

  const { t } = useTranslation();

  const { EDITOR_STRINGS } = WIDGET_STRINGS(t);

  const [showInsertModal, setShowInsertModal] = useState(false);
  const [showChildCardModal, setShowChildCardModal] = useState(false);
  const [showInsertButtonModal, setShowInsertButtonModal] = useState(false);
  const [allDirectFields, setAllDirectFields] = useState([]);
  const [currentRecursiveFields, setCurrentRecursiveFields] = useState([]);
  const [allTableFields, setAllTableFields] = useState([]);
  const [allDirectArrayFields, setAllDirectArrayFields] = useState([]);
  const [childInitValue, setChildInitValue] = useState(CHILD_EDIT_INIT);

  const currentEditorContentRef = useRef();
  const currentChildEditorContentRef = useRef();
  const imageUploadRef = useRef();
  const currentImageTagRef = useRef();

  const parentEditorRef = showChildCardModal
    ? currentChildEditorContentRef
    : currentEditorContentRef;

  const getFields = async (search, pageParam) => {
    const params = {
      page: pageParam || allFieldsCurrentPage || 1,
      size: GET_ALL_FIELDS.PAGE_SIZE,
      ignore_field_types: WIDGET_IGNORED_FIELD_TYPES,
      ...getModuleIdByModuleType(metaData, moduleType, false, isDesignElements),
    };

    if (!isEmpty(search)) params.search = search;

    if (getAllFieldsApi) {
      const { resAllFields } = await getAllFieldsApi(params);

      const directFields = [];
      const directArrayFields = [];
      const tableFields = [];

      resAllFields?.forEach((field = {}) => {
        if (field.field_type === FIELD_TYPE.TABLE) return;

        if (field?.field_list_type === FIELD_TYPE.TABLE) {
          tableFields.push(field);
        } else {
          directFields.push(field);
          if (
            [
              FIELD_TYPE.CHECKBOX,
              FIELD_TYPE.LINK,
              FIELD_TYPE.USER_TEAM_PICKER,
              FIELD_TYPE.DATA_LIST,
            ].includes(field?.field_type)
          ) {
            directArrayFields.push(field);
          }
        }
      });

      const allTableFields = getAllTablesFromSections(
        tableFields,
        resAllFields,
      );
      setAllTableFields(allTableFields);
      setAllDirectFields(directFields);
      setAllDirectArrayFields(directArrayFields);
    }
  };

  useEffect(() => {
    if (!isAppWidget) getFields();

    return () => {
      updateWidgetDataChange(WIDGET_INIT_STATE);
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(currentImageTagRef?.current)) {
      parentEditorRef?.current?.insertContent(currentImageTagRef?.current);
      currentImageTagRef.current = EMPTY_STRING;
    }
  }, [informationData?.[RESPONSE_FIELD_KEYS.INSERTED_DOCUMENT_DETAILS]?.length]);

  const handleChildEdit = ({
    initialValue,
    currentEditingElement,
    isChildRecursive = 1,
    childRecursiveField = EMPTY_STRING,
    isChildBorder = 1,
    childBgColor,
  }) => {
    setChildInitValue({
      initialValue,
      currentEditingElement,
      isChildEdit: true,
      isChildRecursive,
      childRecursiveField,
      isChildBorder,
      childBgColor,
    });
    setShowChildCardModal(true);
  };

  const handleEditorClickHandler = (editorValue) => {
    setColorPickerOpen(false);
    onRemoveClickHandler(editorValue, parentEditorRef, handleChildEdit);
  };
  const handleEditorChange = (event) =>
    editorChangeHandler({ event, onChangeHandler });

  const getEditorSetup = (editor = {}) => {
    editor.ui.registry.addButton(TOOLBAR2_BUTTONS.INSERT_FIELD, {
      text: EDITOR_STRINGS.INSERT_FIELD,
      onAction: () => {
        setShowInsertModal(true);
      },
    });
    editor.ui.registry.addButton(TOOLBAR2_BUTTONS.INSERT_CHILD, {
      text: EDITOR_STRINGS.INSERT_CHILD,
      onAction: () => {
        setShowChildCardModal(true);
      },
    });
    editor.ui.registry.addButton(TOOLBAR2_BUTTONS.INSERT_BUTTON, {
      text: EDITOR_STRINGS.INSERT_BUTTON,
      onAction: () => {
        setShowInsertButtonModal(true);
      },
    });
    editor.ui.registry.addButton(TOOLBAR2_BUTTONS.INSERT_IMAGE, {
      icon: TOOLBAR2_BUTTONS.IMAGE,
      tooltip: EDITOR_STRINGS.INSERT_IMAGE,
      onAction: () => {
        imageUploadRef?.current?.click();
      },
    });
  };

  return (
    <div className={gClasses.MT16}>
      {!isAppWidget && showInsertModal && (
        <InsertField
          allFields={allDirectFields}
          childRecursiveFields={currentRecursiveFields}
          isModalOpen={showInsertModal}
          handleModalOpen={setShowInsertModal}
          parentEditorRef={parentEditorRef}
          allFieldsHasMore={allFieldsHasMore}
          apiFields={allFields}
          getFields={getFields}
          isLoading={isAllFieldsLoading}
        />
      )}

      {!isAppWidget && showInsertButtonModal && (
        <InsertButton
          isModalOpen={showInsertButtonModal}
          handleModalOpen={setShowInsertButtonModal}
          parentEditorRef={parentEditorRef}
        />
      )}

      {!isAppWidget && showChildCardModal && (
        <ChildCard
          isModalOpen={showChildCardModal}
          handleModalOpen={setShowChildCardModal}
          handleInsertModalOpen={setShowInsertModal}
          parentEditorRef={currentEditorContentRef}
          allTableFields={allTableFields}
          allDirectArrayFields={allDirectArrayFields}
          setCurrentRecursiveFields={setCurrentRecursiveFields}
          currentChildEditorContentRef={currentChildEditorContentRef}
          customInit={{
            extended_valid_elements: EDITOR_CONFIGS.extendedValidElements,
            setup: (editor) => getEditorSetup(editor),
          }}
          onEditorClick={handleEditorClickHandler}
          initialConfig={childInitValue}
          setChildInitValue={setChildInitValue}
        />
      )}

      <InsertImage
        imageUploadRef={imageUploadRef}
        parentEditorRef={parentEditorRef}
        entityData={entityData}
        contextData={contextData}
        entityId={metaData.moduleId}
        refUuid={refUuid}
        addDocumentHandler={addDocumentHandler}
        currentImageTagRef={currentImageTagRef}
        isDesignElements={isDesignElements}
      />
      <InfoField
        errorMessage={errorMessage}
        label={label}
        onChangeHandler={isAppWidget ? onChangeHandler : handleEditorChange}
        description={description}
        currentEditorContentRef={currentEditorContentRef}
        toolBar2={isAppWidget ? APP_TOOLBAR2 : TOOLBAR2}
        customInit={{
          content_style: EDITOR_CONSTANTS.CONTENT_STYLE,
          extended_valid_elements: EDITOR_CONFIGS.extendedValidElements,
          setup: (editor) => getEditorSetup(editor),
        }}
        onEditorClick={handleEditorClickHandler}
        customEditorHeight={EDITOR_CONSTANTS.HEIGHT}
        onInit={onInit}
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    taskId: state.CreateTaskReducer?.task_details?._id,
    // refUuid: state.CreateTaskReducer?.ref_uuid,
    flowId: state.EditFlowReducer?.flowData?.flow_id,
    datalistId: state.CreateDataListReducer?.data_list_id,
    allFieldsCurrentPage: state.InformationWidgetReducer.allFieldsCurrentPage,
    isAllFieldsLoading: state.InformationWidgetReducer.isAllFieldsLoading,
    allFieldsHasMore: state.InformationWidgetReducer.allFieldsHasMore,
    allFields: state.InformationWidgetReducer.allFieldsList,
  };
};

const mapDispatchToProps = {
  updateWidgetDataChange: updateWidgetDataChange,
  getAllFieldsApi: getAllFieldsTaskListThunk,
};

export default connect(mapStateToProps, mapDispatchToProps)(InformationWidget);

InformationWidget.defaultProps = {
  errorMessage: EMPTY_STRING,
  label: EMPTY_STRING,
  description: EMPTY_STRING,
  parentModuleType: EMPTY_STRING,
  taskId: EMPTY_STRING,
  flowId: EMPTY_STRING,
  datalistId: EMPTY_STRING,
  refUuid: EMPTY_STRING,
  allFieldsHasMore: false,
  isAllFieldsLoading: false,
  isAppWidget: false,
  allFieldsCurrentPage: 1,
  allFields: [],
  onChangeHandler: emptyFunction,
  getAllFieldsApi: emptyFunction,
  updateWidgetDataChange: emptyFunction,
  onInit: emptyFunction,
  setColorPickerOpen: emptyFunction,
};

InformationWidget.propTypes = {
  errorMessage: PropTypes.string,
  label: PropTypes.string,
  description: PropTypes.string,
  parentModuleType: PropTypes.string,
  taskId: PropTypes.string,
  flowId: PropTypes.string,
  datalistId: PropTypes.string,
  refUuid: PropTypes.string,
  allFieldsHasMore: PropTypes.bool,
  isAllFieldsLoading: PropTypes.bool,
  isAppWidget: PropTypes.bool,
  allFieldsCurrentPage: PropTypes.number,
  allFields: PropTypes.array,
  onChangeHandler: PropTypes.func,
  getAllFieldsApi: PropTypes.func,
  updateWidgetDataChange: PropTypes.func,
  onInit: PropTypes.func,
  setColorPickerOpen: PropTypes.func,
};
