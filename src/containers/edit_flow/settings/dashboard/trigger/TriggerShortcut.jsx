import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames/bind';
import FormTitle, {
  FORM_TITLE_TYPES,
} from 'components/form_components/form_title/FormTitle';
import { useHistory } from 'react-router-dom';
import gClasses from 'scss/Typography.module.scss';
import { SETTINGS_STRINGS } from 'containers/edit_flow/settings_configuration/SettingsConfiguration.utils';
import ConfigurationCard from 'containers/edit_flow/step_configuration/step_components/action_cards/ConfigurationCard';
import TriggerCard from 'containers/edit_flow/step_configuration/step_components/trigger_card/TriggerCard';
import TriggerShortcutIcon from 'assets/icons/parallel_flow/flow_dropdown/TriggerShortcutIcon';
import TriggerFlowIcon from 'assets/icons/parallel_flow/flow_dropdown/TriggerFlowIcon';
import { updateFlowDataChange, updateFlowStateChange } from 'redux/reducer/EditFlowReducer';
import { cloneDeep, isEmpty, remove, set } from 'utils/jsUtility';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { constructSubProcessMappingFromApiData } from 'containers/edit_flow/step_configuration/StepConfiguration.utils';
import { KEY_CODES } from 'utils/Constants';
import AddIcon from 'assets/icons/AddIcon';
import { getTriggerFieldsLength } from 'containers/edit_flow/EditFlow.utils';
import { saveFlowThunk } from 'redux/actions/EditFlow.Action';
import { useTranslation } from 'react-i18next';
import styles from './TriggerShortcut.module.scss';
import TriggerShortcutConfiguration from './TriggerShortcutConfiguration';
import { getCreateFlowValidateData, getFlowTriggerDetailsData } from '../../../EditFlow.utils';

function TriggerShortcut(props) {
  const {
    flowData,
    flowData: { trigger_details = [], document_url_details = [], triggerDetailsServerError = {} },
    updateFlowState,
    saveFlowAPI,
    onFlowDataChange,
  } = cloneDeep(props);

  const history = useHistory();
  const { t } = useTranslation();

  const { TRIGGER } = SETTINGS_STRINGS(t);
  const triggerIndex = trigger_details.findIndex(
    (trigger) => trigger.trigger_uuid === flowData?.activeTriggerData?.trigger_uuid,
  );

  const handleAddShortcut = (triggerUuid) => {
    const triggerData = {};
    const currentTrigger = trigger_details.find(
      (trigger) => trigger.trigger_uuid === triggerUuid,
    );

    if (!isEmpty(triggerUuid)) {
      triggerData.trigger_uuid = triggerUuid;
      triggerData.trigger_name = currentTrigger?.trigger_name || EMPTY_STRING;
      triggerData.child_flow_details = {
        child_flow_uuid: currentTrigger.child_flow_uuid,
      };
      triggerData.trigger_mapping = constructSubProcessMappingFromApiData(
        cloneDeep(currentTrigger.trigger_mapping || []),
      );
      triggerData.trigger_mapping_error_list = {};
    } else {
      triggerData.child_flow_details = {
        child_flow_uuid: EMPTY_STRING,
        child_flow_id: EMPTY_STRING,
        child_flow_name: EMPTY_STRING,
      };
      triggerData.trigger_mapping = [];
      triggerData.trigger_mapping_error_list = {};
    }
    console.log('updatedTriggerMapping triggerData', triggerData, cloneDeep());
    triggerData.parent_flow_details = {
      parent_flow_uuid: flowData.flow_id,
      parent_flow_id: flowData.flow_uuid,
      parent_flow_name: flowData.flow_name,
    };
    triggerData.document_url_details = document_url_details;

    updateFlowState({
      flowData: {
        ...flowData,
        isFlowTriggerShortcutModalOpen: true,
        activeTriggerData: triggerData,
      },
    });
  };

  const onKeyAddClickHandler = (event) => {
    if (
      (event.keyCode && event.keyCode === KEY_CODES.ENTER) ||
      (event.which && event.which === KEY_CODES.ENTER)
    ) {
      event.preventDefault();
      onKeyAddClickHandler(event);
    }
  };

  const getAddTriggerCard = () => (
    <ConfigurationCard
      textContent={TRIGGER.CARD_TEXT}
      onAddClickHandler={() => handleAddShortcut()}
      onKeyAddClickHandler={() => onKeyAddClickHandler()}
      isAddNewConfig
      buttonClass={styles.AddBtn}
    />
  );

  let addTriggerComponent = null;

  if (isEmpty(flowData?.trigger_details)) {
    addTriggerComponent = getAddTriggerCard();
  } else {
    addTriggerComponent = (
      <div
        role="button"
        tabIndex="0"
        onClick={() => handleAddShortcut()}
        onKeyDown={() => onKeyAddClickHandler()}
        className={styles.ButtonContainer}
      >
        <AddIcon className={cx(gClasses.MR3, styles.AddIcon)} />
        <span className={styles.AddShortcut}>
          {TRIGGER.CARD_TEXT.ACTIONS.ADD}
        </span>
      </div>
    );
  }

  const handleDeleteHandler = (triggerUuid) => {
    const clonedTriggerList = cloneDeep(trigger_details);
    remove(clonedTriggerList, { trigger_uuid: triggerUuid });
    const triggerIndex = trigger_details.findIndex(
      (trigger) => trigger.trigger_uuid === triggerUuid,
    );
    const { triggerDetailsServerError } = cloneDeep(flowData);
    if (triggerIndex > -1 && triggerDetailsServerError && triggerDetailsServerError[triggerIndex]) {
      const updatedTriggerServerError = {};
      delete triggerDetailsServerError[triggerIndex];
      Object.keys(triggerDetailsServerError).forEach((key) => {
        if (key > triggerIndex) updatedTriggerServerError[key - 1] = triggerDetailsServerError[key];
        else updatedTriggerServerError[key] = triggerDetailsServerError[key];
      });
      onFlowDataChange({ triggerDetailsServerError: updatedTriggerServerError });
    }
    const clonedFlowData = cloneDeep(flowData);

    set(clonedFlowData, 'trigger_details', clonedTriggerList);

    saveFlowAPI({
      data: {
        ...getFlowTriggerDetailsData({}, clonedFlowData),
        ...getCreateFlowValidateData(clonedFlowData),
      },
      loader: true,
      history,
    }, true);
  };
  console.log('TriggerCards', trigger_details, triggerDetailsServerError);
  const getTriggerCards = () =>
    trigger_details?.map((trigger, index) => (
      <TriggerCard
        title={trigger?.trigger_name}
        subTitle1={trigger?.child_flow_name}
        subTitle2={`${
          getTriggerFieldsLength(trigger?.trigger_mapping) || '0'
        } ${TRIGGER.CARD_TEXT.FIELDS_CONFIGURED}`}
        iconElm={<TriggerShortcutIcon />}
        secondaryIconElm={<TriggerFlowIcon className={styles.TriggerIcon} />}
        editLabel={TRIGGER.EDIT_LABEL}
        deleteLabel={TRIGGER.DELETE_LABEL}
        onEditClick={() => handleAddShortcut(trigger?.trigger_uuid)}
        onDeleteClick={() => handleDeleteHandler(trigger?.trigger_uuid)}
        triggerServerError={triggerDetailsServerError[index]}
        triggerIndex={index}
      />
    ));

  return (
    <div>
      <FormTitle
        type={FORM_TITLE_TYPES.TYPE_2}
        className={cx(gClasses.PB0, gClasses.FontWeight600, gClasses.GrayV3)}
      >
        {TRIGGER.TITLE}
      </FormTitle>
      {getTriggerCards()}
      {addTriggerComponent}
      {flowData?.isFlowTriggerShortcutModalOpen && (
        <TriggerShortcutConfiguration
          currentTriggerData={flowData?.activeTriggerData}
          triggerIndex={triggerIndex}
        />
      )}
    </div>
  );
}

const mapStateToProps = ({ EditFlowReducer }) => {
  return {
    flowData: EditFlowReducer.flowData,
  };
};

const mapDispatchToProps = {
  updateFlowState: updateFlowStateChange,
  saveFlowAPI: saveFlowThunk,
  onFlowDataChange: updateFlowDataChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(TriggerShortcut);
