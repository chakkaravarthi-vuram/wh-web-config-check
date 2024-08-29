import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import FormTitle, {
  FORM_TITLE_TYPES,
} from 'components/form_components/form_title/FormTitle';
import gClasses from 'scss/Typography.module.scss';
import { SETTINGS_STRINGS } from 'containers/edit_flow/settings_configuration/SettingsConfiguration.utils';
import ConfigurationCard from 'containers/edit_flow/step_configuration/step_components/action_cards/ConfigurationCard';
import TriggerCard from 'containers/edit_flow/step_configuration/step_components/trigger_card/TriggerCard';
import TriggerShortcutIcon from 'assets/icons/parallel_flow/flow_dropdown/TriggerShortcutIcon';
import TriggerFlowIcon from 'assets/icons/parallel_flow/flow_dropdown/TriggerFlowIcon';
import { cloneDeep, isEmpty, remove, set } from 'utils/jsUtility';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { constructSubProcessMappingFromApiData } from 'containers/edit_flow/step_configuration/StepConfiguration.utils';
import { KEY_CODES } from 'utils/Constants';
import AddIcon from 'assets/icons/AddIcon';
import {
  createDatalistChange,
  dataListStateChangeAction,
} from 'redux/reducer/CreateDataListReducer';
import { getSaveDataListPostDetailsSelector } from 'redux/selectors/CreateDataList.selectors';
import { getDataListDetailsPostData } from 'containers/flow/create_data_list/CreateDataList.utility';
import { saveDataListApiThunk } from 'redux/actions/CreateDataList.action';
import { getTriggerFieldsLength } from 'containers/edit_flow/EditFlow.utils';
import styles from './TriggerShortcut.module.scss';
import TriggerShortcutConfiguration from './TriggerShortcutConfiguration';

function TriggerShortcut(props) {
  const {
    state,
    state: {
      trigger_details = [],
      isDatalistTriggerShortcutModalOpen,
      activeTriggerData,
      triggerDetailsServerError = {},
    },
    onDataListDataChange,
    saveDataListPostDetails,
    onSaveDataList,
  } = cloneDeep(props);
  const { t } = useTranslation();

  const { TRIGGER } = SETTINGS_STRINGS(t);
  const triggerIndex = trigger_details.findIndex(
    (trigger) => trigger.trigger_uuid === activeTriggerData?.trigger_uuid,
  );

  const handleAddShortcut = (triggerUuid) => {
    const triggerData = {};
    const currentTrigger = trigger_details.find(
      (trigger) => trigger.trigger_uuid === triggerUuid,
    );

    if (!isEmpty(triggerUuid)) {
      triggerData.trigger_uuid = triggerUuid;
      triggerData.trigger_name = currentTrigger?.trigger_name || EMPTY_STRING;
      triggerData.document_url_details = currentTrigger?.document_url_details || [];
      triggerData.child_flow_details = {
        child_flow_uuid: currentTrigger.child_flow_uuid,
      };
      triggerData.trigger_mapping = constructSubProcessMappingFromApiData(
        cloneDeep(currentTrigger.trigger_mapping),
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

    triggerData.parent_flow_details = {
      field_uuid: '',
      field_name: '',
    };

    onDataListDataChange({
      isDatalistTriggerShortcutModalOpen: true,
      activeTriggerData: triggerData,
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

  if (isEmpty(trigger_details)) {
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

    const { triggerDetailsServerError } = cloneDeep(state);
    const triggerIndex = trigger_details.findIndex(
      (trigger) => trigger.trigger_uuid === triggerUuid,
    );
    if (triggerIndex > -1 && triggerDetailsServerError && triggerDetailsServerError[triggerIndex]) {
      const updatedTriggerServerError = {};
      delete triggerDetailsServerError[triggerIndex];
      Object.keys(triggerDetailsServerError).forEach((key) => {
        if (key > triggerIndex) updatedTriggerServerError[key - 1] = triggerDetailsServerError[key];
        else updatedTriggerServerError[key] = triggerDetailsServerError[key];
      });
      onDataListDataChange({ triggerDetailsServerError: updatedTriggerServerError });
    }

    const clonedDatalistData = cloneDeep(saveDataListPostDetails);

    set(clonedDatalistData, 'trigger_details', clonedTriggerList);

    const savePostData = getDataListDetailsPostData(clonedDatalistData, false, true);

    onSaveDataList(savePostData, null, false);
  };
  console.log('triggerDetailsServerErrortriggerDetailsServerError', triggerDetailsServerError);
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
      {isDatalistTriggerShortcutModalOpen && (
        <TriggerShortcutConfiguration currentTriggerData={activeTriggerData} triggerIndex={triggerIndex} />
      )}
    </div>
  );
}

const mapStateToProps = ({ CreateDataListReducer }) => {
  return {
    state: CreateDataListReducer,
    saveDataListPostDetails: getSaveDataListPostDetailsSelector(
      CreateDataListReducer,
    ),
  };
};

const mapDispatchToProps = {
  onDataListDataChange: createDatalistChange,
  onDataListStateChange: dataListStateChangeAction,
  onSaveDataList: saveDataListApiThunk,
};

export default connect(mapStateToProps, mapDispatchToProps)(TriggerShortcut);
