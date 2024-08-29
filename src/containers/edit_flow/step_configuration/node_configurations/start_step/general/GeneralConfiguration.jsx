import {
  RadioGroup,
  Text,
  RadioGroupLayout,
  EPopperPlacements,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import React from 'react';
import { useTranslation } from 'react-i18next';
import AutomatedTriggerType from '../../../../../../components/automated_systems/automated_trigger_point/TriggerPoint';
import gClasses from '../../../../../../scss/Typography.module.scss';
import { START_STEP_CONFIGURATION_STRINGS } from '../StartStepConfiguration.strings';
import styles from '../StartStepConfiguration.module.scss';
import UserPicker from '../../../../../../components/user_picker/UserPicker';
import { CancelToken } from '../../../../../../utils/UtilityFunctions';
import { START_NODE_RESPONSE_FIELD_KEYS } from '../StartStepConfig.constants';
import { generateEventTargetObject } from '../../../../../../utils/generatorUtils';
import { useFlowNodeConfig } from '../../../../node_configuration/use_node_reducer/useNodeReducer';
import { TEAM_TYPES_PARAMS, USER_TYPES_PARAMS } from '../../../../../../utils/Constants';

const cancelToken = new CancelToken();

function GeneralConfiguration(props) {
  const { t } = useTranslation();

  const { state } = useFlowNodeConfig();
  const { hasAutoTrigger, initiators, autoTriggerDetails = {}, serverError = {} } = state;
  const { schedulerDetails = {} } = autoTriggerDetails;

  const {
    onChangeHandler,
    errorList = {},
    triggerErrorList = {},
    onRadioChangeHandler,
    onUserSelectHandler,
  } = props;

  const {
    TRIGGER_CONFIG_HEADER,
    GENERAL: { TRIGGER, INTIATORS },
  } = START_STEP_CONFIGURATION_STRINGS(t);

  const onFieldValueChange = (value, additionalProps = {}) => {
    onUserSelectHandler(
      generateEventTargetObject(INTIATORS.ID, value, additionalProps),
    );
  };

  return (
    <div>
      <Text
        className={cx(gClasses.FontWeight500, gClasses.FTwo16GrayV3)}
        content={TRIGGER_CONFIG_HEADER}
      />
      <RadioGroup // Scehduler?
        labelText={TRIGGER.LABEL}
        selectedValue={hasAutoTrigger}
        options={TRIGGER.OPTIONS}
        labelClassName={cx(styles.FieldLabel, styles.RadioLabelMargin)}
        optionClassName={gClasses.BlackV12}
        layout={RadioGroupLayout.inline}
        onChange={onRadioChangeHandler}
        className={cx(gClasses.MT8, gClasses.MB24)}
        id={START_NODE_RESPONSE_FIELD_KEYS.HAS_AUTO_TRIGGER}
      />
      {hasAutoTrigger && (
        <AutomatedTriggerType // Scheduler configuration
          onChangeHandler={onChangeHandler}
          isStartStep
          automatedSystemsState={{
            ...schedulerDetails,
            errorList: triggerErrorList,
          }
        }
        />
      )}
      <Text
        className={cx(
          gClasses.FontWeight500,
          gClasses.FTwo16GrayV3,
          gClasses.MT24,
        )}
        content={TRIGGER.TITLE}
      />
      <UserPicker // Initators
        id={INTIATORS.ID}
        isSearchable
        labelClassName={gClasses.FTwo12BlackV20}
        required={!hasAutoTrigger}
        selectedValue={initiators}
        maxCountLimit={2}
        className={gClasses.MT12}
        labelText={INTIATORS.LABEL}
        allowedUserType={USER_TYPES_PARAMS.ALL_USERS}
        allowedTeamType={TEAM_TYPES_PARAMS.SYSTEM_ORGANISATION_TEAMS}
        errorMessage={errorList[INTIATORS.ID] || serverError[INTIATORS.ID]}
        onSelect={onFieldValueChange}
        onRemove={(userOrTeamId) => {
          onFieldValueChange(userOrTeamId, { removeUserValue: true });
        }}
        noDataFoundMessage={INTIATORS.NO_USERS_FOUND}
        cancelToken={cancelToken}
        popperPosition={EPopperPlacements.AUTO}
      />
    </div>
  );
}

export default GeneralConfiguration;
