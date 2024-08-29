import React, { useEffect } from 'react';
import { Checkbox, EPopperPlacements, ETextSize, ETitleSize, Text, Title } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import { DATA_ACCESS_STRINGS } from './DataAccess.strings';
import SecurityPolicy from '../security_policy/SecurityPolicy';
import { cloneDeep, emptyFunction, isEmpty } from '../../../../utils/jsUtility';
import { DATA_ACCESS_CONSTANTS } from './DataAccess.constants';
import { confirmBuilderChangePopover } from '../../../form_configuration/field_visibility/FieldVisibilityRule.utils';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { POLICY_STRINGS } from '../security_policy/SecurityPolicy.strings';
import styles from '../security_policy/SecurityPolicy.module.scss';
import { DATALISTS_CREATE_EDIT_CONSTANTS } from '../../../data_lists/data_lists_create_or_edit/DatalistsCreateEdit.constant';
import { TEAM_TYPES_PARAMS, USER_TYPES_PARAMS } from '../../../../utils/Constants';
import UserPicker from '../../../../components/user_picker/UserPicker';
import { CancelToken } from '../../../../utils/UtilityFunctions';

function DataAccess(props) {
  const {
    flowId,
    moduleId,
    moduleType,
    policyList,
    policyListHasValidation,
    onDataChange = emptyFunction,
    onPolicyConditionUpdate,
    isRowSecurityEnabled,
    userFieldOptionList = [],
    userFieldPaginationData = {},
    userFieldPolicyErrorList = {},
    onLoadMoreFields,
    isUserFieldsLoading,
    securityPolicyErrorList,
    onEntityViewerSelectHandler = emptyFunction,
    entityViewerSelectedData = [],
    onRemoveEntityViewer = emptyFunction,
    entityViewerSuggestionData,
    entityViewerSearchValue = EMPTY_STRING,
    setEntityViewerSearchValue = emptyFunction,
    errorList,
    onUserSelectHandler,
    onUserRemoveHandler,
  } = props;

  const { t } = useTranslation();
  const { SECURITY: { ADVANCED_DATA_SECURITY }, NO_DATA_FOUND } = DATALISTS_CREATE_EDIT_CONSTANTS(t);

  const policyViewersCancelToken = new CancelToken();

  useEffect(
    () => () => {
      onDataChange({
        securityPolicyErrorList: {},
        policyListHasValidation: false,
        userFieldPolicyErrorList: {},
      });
    },
    [],
  );

  const handleEnableChange = () => {
    const clonedPolicyErrorList = cloneDeep(securityPolicyErrorList);

    delete clonedPolicyErrorList?.policyList;

    if (!isRowSecurityEnabled || isEmpty(policyList)) {
      onDataChange({
        [DATA_ACCESS_CONSTANTS.IS_ROW_SECURITY_POLICY]: !isRowSecurityEnabled,
        securityPolicyErrorList: clonedPolicyErrorList,
      });
    } else {
      confirmBuilderChangePopover(
        () =>
          onDataChange({
            [DATA_ACCESS_CONSTANTS.IS_ROW_SECURITY_POLICY]:
              !isRowSecurityEnabled,
            [DATA_ACCESS_CONSTANTS.POLICY_LIST]: [],
            [DATA_ACCESS_CONSTANTS.USER_FIELD_POLICY_ERROR]: {},
            securityPolicyErrorList: clonedPolicyErrorList,
          }),
        t,
      );
    }
  };

  return (
    <>
    <div className={gClasses.MT16}>
        <Text
          content={POLICY_STRINGS.ENTITY_VIEWERS.TITLE}
          size={ETextSize.MD}
          className={cx(styles.Title, gClasses.LabelStyle)}
        />
        <Text content={POLICY_STRINGS.ENTITY_VIEWERS.SUB_TITLE} size={ETextSize.SM} />
    </div>
    <div className={gClasses.W100}>
        <UserPicker
            id={POLICY_STRINGS.ENTITY_VIEWERS.ID}
            // labelClassName={styles.FieldLabel}
            className={cx(gClasses.W50)}
            selectedValue={entityViewerSelectedData}
            onSelect={(selectedUserorTeam) => onUserSelectHandler(selectedUserorTeam, POLICY_STRINGS.ENTITY_VIEWERS.ID)}
            onRemove={(selectedUserorTeamID) => onUserRemoveHandler(selectedUserorTeamID, POLICY_STRINGS.ENTITY_VIEWERS.ID)}
            isSearchable
            noDataFoundMessage={NO_DATA_FOUND}
            errorMessage={errorList?.[POLICY_STRINGS.ENTITY_VIEWERS.ID]}
            allowedUserType={USER_TYPES_PARAMS.ALL_USERS}
            allowedTeamType={TEAM_TYPES_PARAMS.SYSTEM_ORGANISATION_TEAMS}
            cancelToken={policyViewersCancelToken}
            getPopperContainerClassName={(isOpen) => isOpen ? gClasses.ZIndex152 : EMPTY_STRING}
            popperPosition={EPopperPlacements.RIGHT}
        />
    </div>
    <Title content={ADVANCED_DATA_SECURITY} size={ETitleSize.xs} className={cx(gClasses.GrayV3, gClasses.MT24)} />
    <div>
      <div
        className={cx(
          gClasses.CenterVSpaceBetween,
          gClasses.W100,
          gClasses.MT12,
          securityPolicyErrorList?.policyList ? gClasses.MB8 : gClasses.MB16,
        )}
      >
        <Checkbox
          details={{
            label: DATA_ACCESS_STRINGS.TITLE,
            value: isRowSecurityEnabled,
          }}
          labelClassName={gClasses.FontWeight500}
          isValueSelected={isRowSecurityEnabled}
          onClick={handleEnableChange}
        />
        {/* <Label labelName={DATA_ACCESS_STRINGS.TITLE} innerLabelClass={cx(gClasses.FontWeight500)} /> */}
        {/* <ToggleButton
          label={DATA_ACCESS_STRINGS.DATA_ACCESS.LABEL}
          onChange={handleEnableChange}
          isActive={isRowSecurityEnabled}
          labelClassName={gClasses.MR4}
          toggleAlign="right"
        /> */}
      </div>

      {securityPolicyErrorList?.policyList && (
        <Text
          content={securityPolicyErrorList?.policyList}
          className={cx(gClasses.red22, gClasses.MB8)}
        />
      )}

      <SecurityPolicy
        flowId={flowId}
        moduleId={moduleId}
        moduleType={moduleType}
        policyList={policyList}
        policyListHasValidation={policyListHasValidation}
        onDataChange={onDataChange}
        onPolicyConditionUpdate={onPolicyConditionUpdate}
        userFieldOptionList={userFieldOptionList}
        userFieldPaginationData={userFieldPaginationData}
        userFieldPolicyErrorList={userFieldPolicyErrorList}
        onLoadMoreFields={onLoadMoreFields}
        isUserFieldsLoading={isUserFieldsLoading}
        securityPolicyErrorList={securityPolicyErrorList}
        onEntityViewerSelectHandler={onEntityViewerSelectHandler}
        entityViewerSelectedData={entityViewerSelectedData}
        onRemoveEntityViewer={onRemoveEntityViewer}
        entityViewerSuggestionData={entityViewerSuggestionData}
        entityViewerSearchValue={entityViewerSearchValue}
        setEntityViewerSearchValue={setEntityViewerSearchValue}
        errorList={errorList}
        isRowSecurityEnabled={isRowSecurityEnabled}
      />
    </div>
    </>
  );
}

export default DataAccess;
