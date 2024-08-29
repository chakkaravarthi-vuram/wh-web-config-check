import React, { useEffect, useState } from 'react';
import { Text, Label, Skeleton, UserDisplayGroup } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import Proptypes from 'prop-types';
import styles from './FlowSecurity.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';
import { FLOW_SECURITY_CONSTANTS } from './FlowSecurity.strings';
import { constructAvatarOrUserDisplayGroupList, setPointerEvent, somethingWentWrongErrorToast } from '../../../../../utils/UtilityFunctions';
import PolicyConditions from './PolicyConditions';
import { isEmpty } from '../../../../../utils/jsUtility';
import CustomUserInfoToolTipNew from '../../../../../components/form_components/user_team_tool_tip/custom_userinfo_tooltip/CustomUserInfoToolTipNew';
import { getFlowSecurityInfoApi } from '../../../../../axios/apiService/flow.apiService';
import UserPicker from '../../../../../components/user_picker/UserPicker';

function FlowSecurity(props) {
    const { metaData } = props;
    const { t } = useTranslation();
    const [securityData, setSecurityData] = useState({ isLoading: false, data: {} });
    const { isLoading, data: security } = securityData;
    const { VIEWERS, DATA_SECURITY, VIEW_PERMISSION, DATA_ACCESS_FOR_PARTICIPANTS,
      // ADMINISTRATIVE_PERMISSIONS,
      TRIGGER,
      // FLOW_ADMINS,
      // FLOW_OWNERS,
      FLOW_INITIATORS,
      SECURITY_POLICY } = FLOW_SECURITY_CONSTANTS(t);

    useEffect(() => {
      if (!metaData.flowId) return;

      const params = { flow_id: metaData.flowId };
      setSecurityData({ isLoading: true, data: {} });
      setPointerEvent(true);
      getFlowSecurityInfoApi(params).then((data) => {
        const _security = { ...data.security, fields: {}, policyFields: data?.policy_fields, hasAutoTrigger: data?.hasAutoTrigger };
        const policyFields = data.policyFields || [];
        policyFields.forEach((f) => { _security.fields[f.fieldUUID] = f; });
        console.log('xyz security', _security);
        setSecurityData({ isLoading: false, data: _security });
      }).catch((err) => {
        console.error('xyz security', err);
        setSecurityData({ isLoading: false, data: {} });
        somethingWentWrongErrorToast();
      }).finally(() => {
        setPointerEvent(false);
      });
    }, [metaData.flowId]);

    // resusable UI components
    const getNoDataText = () => (<Text content="-" className={gClasses.FTwo13Black18} isLoading={isLoading} />);
    const getLabel = (labelContent, customClass = null) => (
      <Label
        labelName={labelContent}
        className={customClass || cx(styles.Security)}
        isLoading={isLoading}
      />
    );
    const getHeading = (content) => <Text
        content={content}
        className={cx(gClasses.FTwo16GrayV3, gClasses.FontWeight500, gClasses.MB12)}
        isLoading={isLoading}
    />;

    const getUserDisplayGroupContent = (usersAndTeams = {}) => {
        const userTeamList = constructAvatarOrUserDisplayGroupList(usersAndTeams);
        if (isEmpty(userTeamList) || isLoading) return getNoDataText();
        const getPopperContent = (id, type, onShow, onHide) => (
          <CustomUserInfoToolTipNew
            id={id}
            contentClassName={gClasses.WhiteBackground}
            type={type}
            onMouseEnter={onShow}
            onMouseLeave={onHide}
            showCreateTask
          />
        );
        return (
            <UserDisplayGroup
              userAndTeamList={userTeamList}
              count={2}
              separator=", "
              getPopperContent={(id, type, onShow, onHide) =>
                getPopperContent(id, type, onShow, onHide)
              }
              className={gClasses.FontSize13}
              getRemainingPopperContent={(id, type, onShow, onHide) =>
                getPopperContent(id, type, onShow, onHide)
              }
            />
        );
    };

    const getUserGroup = (users, label, customClass = null) => {
        let content = null;
        if (users) {
        content = <UserPicker
        labelClassName={gClasses.FTwo12BlackV20}
        selectedValue={users}
        maxCountLimit={2}
        buttonClassName={gClasses.DisplayNone}
        className={gClasses.NoPointerEvent}
        disabled
        isLoading={isLoading}
        />;
      } else content = getNoDataText();
        return (
            <div className={cx(gClasses.MB16, customClass)}>
                {getLabel(label)}
                {content}
            </div>
        );
    };

    const getViewSecurityContent = () => {
        let content = null;
        if (!isEmpty(security?.viewers)) content = getUserDisplayGroupContent(security.viewers);
        else content = getNoDataText();
        return (
            <div className={gClasses.MB16}>
                {getLabel(VIEWERS.LABEL)}
                {content}
            </div>
        );
    };

    const getEntityViewersContent = () => {
        let content = null;
        if (!isEmpty(security?.entityViewers)) content = getUserDisplayGroupContent(security.entityViewers);
        else content = getNoDataText();
        return (
            <div className={gClasses.MB16}>
                {getLabel(SECURITY_POLICY.POLICY_ACCESS_TITLE)}
                {content}
            </div>
        );
    };

    const getParticipantsLevelSecurityContent = () => (
      <div className={gClasses.MB16}>
          {getLabel(DATA_ACCESS_FOR_PARTICIPANTS.LABEL)}
          {!isLoading &&
          <Text
              className={gClasses.FTwo13Black12}
              isLoading={isLoading}
              content={security?.isParticipantsLevelSecurity ? DATA_ACCESS_FOR_PARTICIPANTS.OPTION_LIST[0].label : DATA_ACCESS_FOR_PARTICIPANTS.OPTION_LIST[1].label}
          />}
      </div>
  );

  const getTriggerDataContent = () => (
    <>
      {getLabel(TRIGGER.LABEL)}
      {!isLoading &&
      <Text
        id={TRIGGER.ID}
        isLoading={isLoading}
        className={gClasses.FTwo13Black12}
        content={security?.hasAutoTrigger ? TRIGGER.OPTIONS[1].label : TRIGGER.OPTIONS[0].label}
      />}
    </>
  );

    // main content
    const getManageDataSecurity = () => (
        <div>
            {/* <div className={gClasses.MB24}>
                {getHeading(ADMINISTRATIVE_PERMISSIONS)}
                {getUserGroup(security.admins, FLOW_ADMINS)}
            </div> */}
            <div className={cx(gClasses.MB24)}>
                {getHeading(DATA_SECURITY)}
                {/* {getUserGroup(security.owners, FLOW_OWNERS)} */}
                <div className={cx(gClasses.MB16, gClasses.DisplayFlex)}>
                  <div className={gClasses.W50}>
                    {getTriggerDataContent()}
                  </div>
                  <div className={gClasses.W50}>
                    {getUserGroup(security.initiators, FLOW_INITIATORS, gClasses.MB0)}
                  </div>
                </div>
                {getParticipantsLevelSecurityContent()}
            </div>
        </div>
    );
    const getViewDataSecurity = () => (
      <div className={gClasses.MT24}>
        {getHeading(VIEW_PERMISSION)}
        {getViewSecurityContent()}
        {getEntityViewersContent()}
        {isLoading ? (
          <Skeleton height={200} />
        ) : (
          <PolicyConditions
            fields={security.fields}
            policyList={security.securityPolicies}
            policyFields={security?.policyFields}
          />
        )}
      </div>
    );

    return (
        <div className={styles.SecurityPage}>
            {getManageDataSecurity()}
            {getViewDataSecurity()}
        </div>
    );
}

export default FlowSecurity;

FlowSecurity.propTypes = {
    dataListID: Proptypes.string,
};
