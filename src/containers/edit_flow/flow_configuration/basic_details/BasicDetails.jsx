import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { cloneDeep } from 'lodash';
import { connect } from 'react-redux';
import cx from 'classnames';
import gClasses from 'scss/Typography.module.scss';
import { getBasicDetailsSelector } from 'redux/selectors/EditFlow.selectors';
import {
  updateFlowDataChange,
  updateFlowStateChange,
} from 'redux/reducer/EditFlowReducer';
import {
  Button,
  EButtonType,
  ETitleSize,
  Size,
  TextArea,
  TextInput,
  Title,
} from '@workhall-pvt-lmt/wh-ui-library';
import { FLOW_STRINGS, FLOW_VALIDATION_STRINGS } from '../../EditFlow.strings';
import styles from './BasicDetails.module.scss';
import jsUtils, { safeTrim } from '../../../../utils/jsUtility';
import { validate } from '../../../../utils/UtilityFunctions';
import { getCreateFlowSchema } from '../../EditFlow.validation.schema';
import { constructJoiObject } from '../../../../utils/ValidationConstants';
import { VALIDATION_CONSTANT } from '../../../../utils/constants/validation.constant';
import { NAME_VALIDATION_ALLOWED_CHARACTERS } from '../../EditFlow.constants';
import { ARIA_ROLES } from '../../../../utils/UIConstants';
import CloseIconV2 from '../../../../assets/icons/CloseIconV2';
import UserPicker from '../../../../components/user_picker/UserPicker';
import { FLOW_SECURITY_CONSTANTS } from '../../../flows/flow_create_or_edit/FlowCreateOrEdit.constant';
import { TEAM_TYPES_PARAMS, USER_TYPES_PARAMS } from '../../../../utils/Constants';

function BasicDetails(props) {
  const { t } = useTranslation();
  const { editFlowInitialLoading } = props;
  const { BASIC_INFO } = FLOW_STRINGS;
  const {
    flowData,
    continueClickHandler,
    server_error,
    isCreateFlowModal,
    onCloseClickHandler,
  } = props;
  const errors = jsUtils.merge(flowData.error_list, server_error);
  const { flow_name, flow_description = false, initiators = {} } = flowData;

  let nameError = errors?.flow_name;
  if (
    nameError?.includes(
      `${t(VALIDATION_CONSTANT.INVALID)} ${t(BASIC_INFO.FLOW_NAME.LABEL)}`,
    )
  ) {
    nameError = `${
      FLOW_VALIDATION_STRINGS(t).CHARACTERS_ALLOWED
    } ${NAME_VALIDATION_ALLOWED_CHARACTERS}`;
  }

  const validateKeys = (value, key, errorList = {}, isOnBlur = false) => {
    let keyError = {};
    if (!jsUtils.isEmpty(errorList?.[key]) || isOnBlur) {
      keyError = validate(
        { [key]: value },
        constructJoiObject({ [key]: getCreateFlowSchema(t)?.[key] }),
      );
      if (!keyError?.[key]) delete errorList[key];
    }
    return {
      ...errorList,
      ...(keyError || {}),
    };
  };

  const removeServerError = (id) => {
    const { onFlowStateChange } = props;
    const serverErrors = cloneDeep(server_error);
    if (serverErrors?.[id]) delete serverErrors[id];
    onFlowStateChange({ server_error: serverErrors });
  };

  const onFlowNameChangeHandler = (event, isOnBlur) => {
    const { onFlowDataChange } = props;
    let { error_list = {} } = cloneDeep(flowData);
    const {
      target: { value, id },
    } = event;
    const flowName = isOnBlur ? safeTrim(value) : value;
    error_list = validateKeys(flowName, id, error_list, isOnBlur);
    onFlowDataChange({ flow_name: flowName, error_list });
    removeServerError(id);
  };

  const onFlowDescriptionChangeHandler = (event) => {
    const { onFlowDataChange } = props;
    const {
      target: { value, id },
    } = event;
    const flowDescription = value;
    let { error_list } = cloneDeep(flowData);
    error_list = validateKeys(flowDescription, id, error_list);
    onFlowDataChange({ flow_description: flowDescription, error_list });
  };

  const onFlowInitiatorChange = (value, removeUser = false) => {
    const { onFlowDataChange } = props;
    const userTeam = cloneDeep(initiators) || { users: [], teams: [] };
    userTeam.users = userTeam?.users || [];
    userTeam.teams = userTeam?.teams || [];
    if (removeUser) {
      userTeam.users = userTeam.users?.filter((u) => u._id !== value) || [];
      userTeam.teams = userTeam.teams?.filter((u) => u._id !== value) || [];
    } else {
      const isUser = value?.is_user;
      isUser
        ? (userTeam.users = [...userTeam.users, value])
        : (userTeam.teams = [...userTeam.teams, value]);
    }

    onFlowDataChange({ initiators: userTeam });
  };

  return (
   <>
   { isCreateFlowModal &&
   <div
      className={cx(
        gClasses.CenterV,
        gClasses.JusEnd,
        gClasses.P24,
        gClasses.PB16,
      )}
   >
      <CloseIconV2
        className={cx(gClasses.CursorPointer)}
        role={ARIA_ROLES.IMG}
        height={16}
        width={16}
        onClick={onCloseClickHandler}
      />
   </div>
   }
    <div className={cx(isCreateFlowModal && gClasses.CenterH, !isCreateFlowModal && gClasses.W100Important)}>
      <div className={cx(isCreateFlowModal && cx(gClasses.P24, gClasses.PT0, styles.CreateMaxWidth), !isCreateFlowModal && gClasses.W100Important)}>
        {isCreateFlowModal &&
        <Title
          className={cx(gClasses.TextAlignCenterImp, gClasses.MB4, gClasses.FontSize24, styles.TitleClass)}
          content={t(FLOW_STRINGS.CREATE_FLOW_TITLE)}
          size={ETitleSize.small}
        />}
        <TextInput
          placeholder={t(BASIC_INFO.FLOW_NAME.PLACEHOLDER)}
          labelText={t(BASIC_INFO.FLOW_NAME.LABEL)}
          id={BASIC_INFO.FLOW_NAME.ID}
          onChange={onFlowNameChangeHandler}
          onBlurHandler={(e) => onFlowNameChangeHandler(e, true)}
          value={flow_name}
          errorMessage={nameError}
          className={gClasses.MB16}
          required
          isLoading={editFlowInitialLoading}
          autoFocus
        />
        <TextArea
          placeholder={t(BASIC_INFO.FLOW_DESCRIPTION.PLACEHOLDER)}
          labelText={t(BASIC_INFO.FLOW_DESCRIPTION.LABEL)}
          id={BASIC_INFO.FLOW_DESCRIPTION.ID}
          onChange={onFlowDescriptionChangeHandler}
          value={flow_description}
          errorMessage={errors.flow_description}
          isLoading={editFlowInitialLoading}
          size={Size.sm}
          className={gClasses.MB16}
          inputInnerClassName={gClasses.InputBorderRadius4}
        />
        <UserPicker
          id={FLOW_SECURITY_CONSTANTS(t).INITIATORS}
          labelClassName={styles.FieldLabel}
          labelText={FLOW_SECURITY_CONSTANTS(t).TO_START_FLOW}
          className={cx(gClasses.W50)}
          selectedValue={initiators}
          onSelect={onFlowInitiatorChange}
          onRemove={(id) => onFlowInitiatorChange(id, true)}
          allowedUserType={USER_TYPES_PARAMS.ALL_USERS}
          allowedTeamType={TEAM_TYPES_PARAMS.SYSTEM_ORGANISATION_TEAMS}
          isSearchable
        />
        { isCreateFlowModal &&
        <div
          className={cx(
            gClasses.CenterV,
            gClasses.JusEnd,
            gClasses.MT16,
          )}
        >
          <Button
            buttonText={t(FLOW_STRINGS.ACTION_BUTTONS.CANCEL)}
            noBorder
            className={cx(gClasses.MR24, gClasses.FontWeight500, styles.CancelButton)}
            onClickHandler={onCloseClickHandler}
          />
          <Button
            type={EButtonType.PRIMARY}
            buttonText={t(FLOW_STRINGS.ACTION_BUTTONS.NEXT)
            }
            onClickHandler={continueClickHandler}
          />
        </div>
      }
      </div>
    </div>
   </>
  );
}

const mapDispatchToProps = {
  onFlowDataChange: updateFlowDataChange,
  onFlowStateChange: updateFlowStateChange,
};

export default connect(
  getBasicDetailsSelector,
  mapDispatchToProps,
)(BasicDetails);
BasicDetails.defaultProps = {};
BasicDetails.propTypes = {
  flowData: PropTypes.objectOf(PropTypes.any).isRequired,
  onFlowDataChange: PropTypes.func.isRequired,
};
