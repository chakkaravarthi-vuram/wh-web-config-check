import React from 'react';
import cx from 'classnames/bind';
import PropType from 'prop-types';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import gClasses from 'scss/Typography.module.scss';
import { cloneDeep, find, get, isEmpty, set } from 'utils/jsUtility';
import { KEY_CODES } from 'utils/Constants';
import { updateFlowDataChange } from 'redux/reducer/EditFlowReducer';
import HELPER_MESSAGE_TYPE from 'components/form_components/helper_message/HelperMessage.strings';
import HelperMessage from 'components/form_components/helper_message/HelperMessage';
import { checkFieldDependencyApiThunk } from 'redux/actions/EditFlow.Action';
import { deleteDocumentGenerationThunk, deleteSendDataToDatalistThunk, deleteSendEmailThunk } from 'redux/actions/FlowStepConfiguration.Action';
import ConfigurationCard from '../../step_components/action_cards/ConfigurationCard';
import { getActionsListFromUtils } from '../send_email/SendEmail.utils';
import {
  CONFIGURATION_TYPE_ID,
} from '../Configuration.strings';
import styles from './ConfigurationSection.module.scss';
import DependencyHandler from '../../../../../components/dependency_handler/DependencyHandler';
import { DEPENDENCY_ERRORS } from '../../../../../components/dependency_handler/DependencyHandler.constants';
import { FLOW_CONFIG_STRINGS } from '../../../EditFlow.strings';
import { updateFlowStateChange } from '../../../../../redux/reducer/EditFlowReducer';

function ConfigurationSection(props) {
  const { t } = useTranslation();
  const {
    configurationTypeId,
    textContent,
    Icon,
    actionList,
    setConfigType,
    stepData,
    stepData: {
      error_list,
    },
    flowData,
    flowData: {
      showFieldDependencyDialog = {},
      dependency_data,
      dependency_name,
      dependency_type,
    },
    onFlowDataChange,
    onFlowStateChange,
    configCondition,
    deleteDocumentGeneration,
    deleteSendEmail,
    deleteSendDataToDatalist,
    configKey,
    checkFieldDependencyApi,
    errorList = {},
  } = props;

  const {
    _id,
    actions,
    allFields = [],
    document_generation,
  } = stepData;

  const activeActionList = getActionsListFromUtils(
    actions,
  );

  const onAddClickHandler = (event) => {
    event.preventDefault();
    setConfigType && setConfigType({
      type: configurationTypeId,
      activeUuid: null,
    });
  };
  const onKeyAddClickHandler = (event) => {
    if (
      (event.keyCode && event.keyCode === KEY_CODES.ENTER) ||
      (event.which && event.which === KEY_CODES.ENTER)
    ) {
      event.preventDefault();
      onAddClickHandler(event);
    }
  };

  const isDocumentFieldExist = (fieldUuid, key, activeDocumentUuid) => {
    if (isEmpty(document_generation) || isEmpty(fieldUuid)) return false;

    try {
      let isExist = false;

      document_generation?.map((eachDoc) => {
        if (isEmpty(eachDoc) || isExist) return null;

        if (activeDocumentUuid !== eachDoc?.document_generation_uuid) {
          if (!isEmpty(key)) {
            if (
              eachDoc[key] === fieldUuid
            ) {
              isExist = true;
            }
          }
        }

        return null;
      });

      return isExist;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const onDeleteHandler = async (idk) => {
    let actionCards = [];
    const activeStepDetails = cloneDeep(stepData);
    const params = {
      _id: stepData._id,
      step_uuid: stepData.step_uuid,
      flow_id: flowData.flow_id,
    };
    switch (configurationTypeId) {
      case CONFIGURATION_TYPE_ID.SEND_EMAIL:
        actionCards = activeStepDetails.email_actions;
        params.email_uuid = actionCards[idk].email_uuid;
        if (actionCards[idk]?.email_attachments && !isEmpty(actionCards[idk]?.email_attachments?.attachment_id)) {
          params.document_details = {
            removed_doc_list: actionCards[idk]?.email_attachments?.attachment_id,
          };
        }
        if (!isEmpty(get(activeStepDetails, ['emailActionsErrorList'], []))) {
            const { emailActionsErrorList = {} } = cloneDeep(activeStepDetails);
            delete emailActionsErrorList[idk];
            const updatedEmailActionsErrorList = {};
            Object.keys(emailActionsErrorList).forEach((key) => {
              if (key > idk) updatedEmailActionsErrorList[key - 1] = emailActionsErrorList[key];
              else updatedEmailActionsErrorList[key] = emailActionsErrorList[key];
            });
            activeStepDetails.emailActionsErrorList = updatedEmailActionsErrorList;
        }
        deleteSendEmail(params);
        actionCards.splice(idk, 1);
        activeStepDetails.email_actions = actionCards;
        break;
      case CONFIGURATION_TYPE_ID.SEND_DATA_TO_DATALIST:
        actionCards = activeStepDetails.data_list_mapping;
        params.mapping_uuid = actionCards[idk].mapping_uuid;
        if (!isEmpty(get(activeStepDetails, ['datalistMappingErrorList'], []))) {
          const { datalistMappingErrorList = {} } = cloneDeep(activeStepDetails);
          delete datalistMappingErrorList[idk];
          const updatedDataListMappingErrorList = {};
            Object.keys(datalistMappingErrorList).forEach((key) => {
              if (key > idk) updatedDataListMappingErrorList[key - 1] = datalistMappingErrorList[key];
              else updatedDataListMappingErrorList[key] = datalistMappingErrorList[key];
            });
            activeStepDetails.datalistMappingErrorList = updatedDataListMappingErrorList;
        }
        deleteSendDataToDatalist(params);
        actionCards.splice(idk, 1);
        activeStepDetails.data_list_mapping = actionCards;
        break;

      case CONFIGURATION_TYPE_ID.DOCUMENT_GENERATION:
        actionCards = cloneDeep(activeStepDetails.document_generation);
        const active_document_action = actionCards[idk];

        const {
          image_doc_ids = [],
        } = active_document_action;
        if (!isEmpty(get(activeStepDetails, ['docGenerationErrorList'], []))) {
          const { docGenerationErrorList = {} } = cloneDeep(activeStepDetails);
          delete docGenerationErrorList[idk];
          const updatedDocGenerationErrorList = {};
            Object.keys(docGenerationErrorList).forEach((key) => {
              if (key > idk) updatedDocGenerationErrorList[key - 1] = docGenerationErrorList[key];
              else updatedDocGenerationErrorList[key] = docGenerationErrorList[key];
            });
            activeStepDetails.docGenerationErrorList = updatedDocGenerationErrorList;
            onFlowStateChange({ activeStepDetails });
        }
        let removedDocList = [];

        set(activeStepDetails, ['document_details', 'removed_doc_list'], []);

        const templateId = active_document_action?.template_doc_id;
        const headerId = get(active_document_action, ['header_document', '_id'], null);
        const footerId = get(active_document_action, ['footer_document', '_id'], null);

        if (templateId) removedDocList.push(templateId);
        if (headerId) removedDocList.push(headerId);
        if (footerId) removedDocList.push(footerId);

        if (!isEmpty(image_doc_ids)) {
          removedDocList = [...removedDocList, ...image_doc_ids];
        }

        activeStepDetails.document_details = {
          removed_doc_list: removedDocList,
        };
        params.document_details = activeStepDetails.document_details;
        params.document_generation_uuid = actionCards[idk].document_generation_uuid;
        const documentField = find(allFields, {
          field_uuid: actionCards[idk]?.document_field_uuid,
        });

        const fieldDependencyParams = {};
        let dependencyData = {};

        if (!isEmpty(documentField) && !isDocumentFieldExist(actionCards[idk]?.document_field_uuid, 'document_field_uuid', actionCards[idk]?.document_generation_uuid)) {
          set(fieldDependencyParams, 'field_uuid', [documentField.field_uuid]);
          set(fieldDependencyParams, 'step_id', _id);
          dependencyData = await checkFieldDependencyApi(fieldDependencyParams, DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.STEP_DEPENDENCY_TYPE.DOCUMENT_GENERATION_REMOVE, active_document_action?.file_name);
        }

        if (isEmpty(dependencyData?.dependency_list)) {
          actionCards.splice(idk, 1);
          deleteDocumentGeneration(params, actionCards);
        }
        break;
      default:
        break;
    }
    if (configurationTypeId !== CONFIGURATION_TYPE_ID.DOCUMENT_GENERATION) {
      onFlowStateChange({ activeStepDetails });
    }
  };

  const onEditHandler = async (idk) => {
    const activeStepDetails = cloneDeep(stepData);
    let activeUuid = null;
    switch (configurationTypeId) {
      case CONFIGURATION_TYPE_ID.SEND_EMAIL:
        activeUuid = get(activeStepDetails, ['email_actions', idk, 'email_uuid'], null);
        break;
      case CONFIGURATION_TYPE_ID.SEND_DATA_TO_DATALIST:
        activeUuid = get(activeStepDetails, ['data_list_mapping', idk, 'mapping_uuid'], null);
        break;
      case CONFIGURATION_TYPE_ID.DOCUMENT_GENERATION:
        activeUuid = get(activeStepDetails, ['document_generation', idk, 'document_generation_uuid'], null);
        break;
      default:
        break;
    }
    setConfigType({
      type: configurationTypeId,
      activeUuid,
    });
    onFlowStateChange({ activeStepDetails });
  };

  const getAddConfigurationCard = () => (
    <ConfigurationCard
      textContent={textContent}
      onAddClickHandler={onAddClickHandler}
      onKeyAddClickHandler={onKeyAddClickHandler}
      isAddNewConfig
      errorList={errorList}
    />
  );

  const getConfiguartionCardList = () => {
    const cardList = actionList.map((action, index) => (
      <ConfigurationCard
        textContent={textContent}
        Icon={Icon}
        action={action}
        configKey={configKey}
        index={index}
        onDeleteHandler={onDeleteHandler}
        onEditHandler={onEditHandler}
        configurationTypeId={configurationTypeId}
        activeActionList={activeActionList}
        errorList={errorList}
      />
    ));
    return cardList;
  };

  let addConfigCard = null;

  if (configurationTypeId !== CONFIGURATION_TYPE_ID.DOCUMENT_GENERATION) {
    addConfigCard = getAddConfigurationCard();
  } else {
    if (actionList && actionList.length < 3) {
      addConfigCard = getAddConfigurationCard();
    }
  }

  const dependencyConfigCancelHandler = () => {
    onFlowDataChange({
      showFieldDependencyDialog: false,
      showFormDependencyDialog: false,
      showSectionDependencyDialog: false,
    });
  };
  let dependencyPopup = null;
  if (showFieldDependencyDialog?.isVisible) {
    let customDescription = null;
    let hideSubtitle = false;
    let customTitle = null;
    if (dependency_type === DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.STEP_DEPENDENCY_TYPE.DOCUMENT_GENERATION_DOC_REPLACEMENT) {
      customDescription = t(FLOW_CONFIG_STRINGS.ADDITIONAL_CONFIG.DOC_GENERATION_REPLACE_DOCUMENT_DEPENDENCY.DESCRIPTION);
      hideSubtitle = true;
      customTitle = `${t(FLOW_CONFIG_STRINGS.ADDITIONAL_CONFIG.DOC_GENERATION_REPLACE_DOCUMENT_DEPENDENCY.TITLE)} ${dependency_name}`;
    }
    dependencyPopup = (
        <DependencyHandler
          onDeleteClick={() => { }}
          onCancelDeleteClick={dependencyConfigCancelHandler}
          dependencyHeaderTitle={dependency_name}
          dependencyData={dependency_data}
          customDescription={customDescription}
          hideSubtitle={hideSubtitle}
          customTitle={customTitle}
        />
      );
  }

  return (
    <div className={cx(gClasses.MB15, gClasses.ML32)}>
     {configCondition ? (
     <>
      <div className={cx(gClasses.FTwo12GrayV9, gClasses.MB6)}>
        {t(textContent.SUB_TITLE)}
      </div>
      <div className={styles.AllConfigCards} role="list">
        {getConfiguartionCardList()}
        {addConfigCard}
      </div>
     </>
     ) : null }
      <HelperMessage
        message={error_list?.[configKey]}
        type={HELPER_MESSAGE_TYPE.ERROR}
        id={configKey}
        className={cx(gClasses.ErrorMarginV2)}
        noMarginBottom
      />
      {dependencyPopup}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    flowData: state.EditFlowReducer.flowData,
  };
};

const mapDispatchToProps = {
  onFlowDataChange: updateFlowDataChange,
  onFlowStateChange: updateFlowStateChange,
  deleteDocumentGeneration: deleteDocumentGenerationThunk,
  deleteSendEmail: deleteSendEmailThunk,
  deleteSendDataToDatalist: deleteSendDataToDatalistThunk,
  checkFieldDependencyApi: checkFieldDependencyApiThunk,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfigurationSection);

ConfigurationSection.defaultProps = {
  customSectionContent: null,
  Icon: null,
  setConfigType: null,
  configurationTypeId: null,
};
ConfigurationSection.propTypes = {
  customSectionContent: PropType.oneOfType([PropType.node, PropType.element]),
  Icon: PropType.oneOfType([PropType.node, PropType.element]),
  setConfigType: PropType.func,
  configurationTypeId: PropType.oneOf([
    CONFIGURATION_TYPE_ID.SEND_EMAIL,
    CONFIGURATION_TYPE_ID.DOCUMENT_GENERATION,
    CONFIGURATION_TYPE_ID.SEND_DATA_TO_DATALIST,
  ]),
};
