import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FileIcon from 'assets/icons/FileIcon';
import MailIconV2 from 'assets/icons/MailIconV2';
import RefreshIconV2 from 'assets/icons/RefreshIconV2';
import { get, cloneDeep, isEmpty, unset } from 'utils/jsUtility';
import { Checkbox } from '@workhall-pvt-lmt/wh-ui-library';
import {
  getActionsListFromUtils, getActionsOptionList,
} from './Configuration.utils';
import ConfigurationSection from './configuration_section/ConfigurationSection';
// import ConfigurationModal from './configuration_modal/ConfigurationModal';
import {
  CONFIGURATION_CONTENT,
  CONFIGURATION_TYPE_ID,
  CONFIG_FIELD_KEY,
  ADDON_CONFIG,
} from './Configuration.strings';
import styles from './Configuration.module.scss';
import ConfigurationModalDetails from './ConfigurationModalDetails';

function Configuration(props) {
  const { t } = useTranslation();

  const {
    stepData,
    onFlowStateChange,
    steps,
    allSystemFields,
  } = props;

  const [showConfigCard, setShowConfigCard] = useState({
    send_email_condition: !isEmpty(get(stepData, [CONFIG_FIELD_KEY.EMAIL_ACTIONS], [])) || false,
    send_data_to_datalist_condition: !isEmpty(get(stepData, [CONFIG_FIELD_KEY.DATA_LIST_MAPPING], [])) || false,
    document_generation_condition: !isEmpty(get(stepData, [CONFIG_FIELD_KEY.DOCUMENT_GENERATION], [])) || false,
  });
  const [currentConfig, setCurrentConfigTypeId] = useState({});

  const {
    actions,
  } = stepData;

  const getActionsList = () => {
    const dropdownList = getActionsListFromUtils(
      actions,
    );
    return dropdownList;
  };

  useEffect(() => {
    const activeStepDetails = cloneDeep(stepData);
    const activeActions = getActionsList();

    try {
      const email_actions = get(stepData, [CONFIG_FIELD_KEY.EMAIL_ACTIONS], []);
      if (!isEmpty(email_actions)) {
        email_actions.map((email_action, index) => {
          if (!isEmpty(email_action) && !isEmpty(email_action.action_type)) {
            activeStepDetails.email_actions[index].action_type =
              email_action.action_type.filter((action) =>
                activeActions.includes(action),
              );
          }
          return null;
        });
      }

      const data_list_mapping = get(
        stepData,
        [CONFIG_FIELD_KEY.DATA_LIST_MAPPING],
        [],
      );
      if (!isEmpty(data_list_mapping)) {
        data_list_mapping.map((send_data_list, index) => {
          if (
            !isEmpty(send_data_list) &&
            !isEmpty(send_data_list.action_uuid)
          ) {
            activeStepDetails.data_list_mapping[
              index
            ].action_uuid = send_data_list.action_uuid.filter((action) =>
              activeActions.includes(action),
            );
          }
          return null;
        });
      }

      const document_generation = get(
        stepData,
        [CONFIG_FIELD_KEY.DOCUMENT_GENERATION],
        [],
      );
      if (!isEmpty(document_generation)) {
        document_generation.map((doc, index) => {
          if (!isEmpty(doc) && !isEmpty(doc.action_type)) {
            activeStepDetails.document_generation[
              index
            ].action_type = doc.action_type.filter((action) =>
              activeActions.includes(action),
            );
          }
          return null;
        });
      }
      onFlowStateChange({ activeStepDetails });
    } catch (e) {
      console.log('error 121212 activeActions', e);
    }
  }, []);

  const onSelectConfig = (id, key) => {
    console.log('radioclicksdgdy2');
    const activeStepDetails = cloneDeep(stepData);
    if (isEmpty(activeStepDetails.additional_configuration)) {
      activeStepDetails.additional_configuration = {};
    }
    activeStepDetails.additional_configuration[id] = !showConfigCard[id];

    if (showConfigCard[id]) {
      unset(activeStepDetails.error_list, key);
    }

    if (showConfigCard[id]) {
      setShowConfigCard((showConfigCard) => {
        return {
          ...showConfigCard, [id]: false,
        };
      },
      );
    } else {
      setShowConfigCard((showConfigCard) => {
        return {
          ...showConfigCard, [id]: true,
        };
      },
      );
    }
    onFlowStateChange({ activeStepDetails });
  };

  const getAllSection = () =>
    CONFIGURATION_CONTENT.map((content) => {
      let icon = null;
      let actionList = [];
      let optionDetails = [];
      let key = null;
      let errorList = {};
      switch (content.ID) {
        case CONFIGURATION_TYPE_ID.SEND_EMAIL:
          icon = <MailIconV2 />;
          actionList = get(stepData, [CONFIG_FIELD_KEY.EMAIL_ACTIONS], []);
          optionDetails = ADDON_CONFIG.SEND_EMAIL(t);
          key = CONFIG_FIELD_KEY.EMAIL_ACTIONS;
          errorList = get(stepData, ['emailActionsErrorList'], []);
          break;
        case CONFIGURATION_TYPE_ID.SEND_DATA_TO_DATALIST:
          icon = <RefreshIconV2 />;
          actionList = get(stepData, [CONFIG_FIELD_KEY.DATA_LIST_MAPPING], []);
          optionDetails = ADDON_CONFIG.SEND_DATA_TO_DATALIST(t);
          key = CONFIG_FIELD_KEY.DATA_LIST_MAPPING;
          errorList = get(stepData, ['datalistMappingErrorList'], []);
          break;
        case CONFIGURATION_TYPE_ID.DOCUMENT_GENERATION:
          icon = <FileIcon width={16} height={16} />;
          actionList = get(
            stepData,
            [CONFIG_FIELD_KEY.DOCUMENT_GENERATION],
            [],
          );
          optionDetails = ADDON_CONFIG.DOCUMENT_GENERATION(t);
          key = CONFIG_FIELD_KEY.DOCUMENT_GENERATION;
          errorList = get(stepData, ['docGenerationErrorList'], []);
          break;
        default:
          break;
      }
      console.log('actionList_Configuration', actionList, 'key', key);
      const isSelected = showConfigCard?.[optionDetails.id] || !isEmpty(actionList);
      return (
        <div key={optionDetails.id}>
          <Checkbox
            details={optionDetails}
            onClick={() => onSelectConfig(optionDetails.id, key)}
            id={optionDetails.id}
            isValueSelected={isSelected}
          />
          <ConfigurationSection
            configurationTypeId={content.ID}
            key={content.ID}
            textContent={content}
            Icon={icon}
            actionList={actionList}
            setConfigType={setCurrentConfigTypeId}
            stepData={stepData}
            configCondition={isSelected}
            configKey={key}
            errorList={errorList}
          />
        </div>
      );
    });
  return (
    <div className={styles.Configuration}>
      {getAllSection()}
      {
        currentConfig?.type && (
          <ConfigurationModalDetails
            configDetails={currentConfig}
            closeAddOnConfig={setCurrentConfigTypeId}
            stepData={stepData}
            metaData={{
              flowId: stepData.flow_id,
              stepId: stepData._id,
              stepUuid: stepData.step_uuid,
            }}
            steps={steps}
            updateFlowStateChange={() => { }}
            actions={getActionsOptionList(actions, stepData)}
            allSystemFields={allSystemFields}
          />
        )
      }
    </div>
  );
}

export default Configuration;
