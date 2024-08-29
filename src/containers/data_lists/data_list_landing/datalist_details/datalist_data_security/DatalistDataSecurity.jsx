import React, { useEffect, useState } from 'react';
import { Text, Chip, Label, EChipSize, Skeleton, UserDisplayGroup } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import Proptypes from 'prop-types';
import styles from './DatalistDataSecurity.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';
import { DATALIST_SECURITY_CONSTANTS } from './DatalistDataSecurity.strings';
import { constructAvatarOrUserDisplayGroupList, setPointerEvent, somethingWentWrongErrorToast } from '../../../../../utils/UtilityFunctions';
import { COLOR_CONSTANTS, DEFAULT_COLORS_CONSTANTS } from '../../../../../utils/UIConstants';
import PolicyConditions from './PolicyConditions';
import { getDataListSecurityInfoApi } from '../../../../../axios/apiService/dataList.apiService';
import { isEmpty } from '../../../../../utils/jsUtility';
import CustomUserInfoToolTipNew from '../../../../../components/form_components/user_team_tool_tip/custom_userinfo_tooltip/CustomUserInfoToolTipNew';
import UserPicker from '../../../../../components/user_picker/UserPicker';

function DatalistDataSecurity(props) {
    const { dataListID } = props;
    const { t } = useTranslation();

    const [securityData, setSecurityData] = useState({});
    const [policyFields, setPolicyFields] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { ADD_ENTRY, EDIT_ENTRY, DELETE_ENTRY, VIEWERS, DATALIST_SECURITY, DATA_SECURITY, VIEW_PERMISSIONS,
        // ADMINISTRATIVE_PERMISSIONS,
        SECURITY_POLICY } = DATALIST_SECURITY_CONSTANTS(t);

    useEffect(() => {
        if (dataListID) {
            const params = { data_list_id: dataListID };
            // loaders to prevent user interacion when api is called
            setIsLoading(true);
            setPointerEvent(true);
            getDataListSecurityInfoApi(params).then((data) => {
                setSecurityData(data?.security);
                setPolicyFields(data?.policy_fields || []);
            }).catch((err) => {
                somethingWentWrongErrorToast();
                console.log('dl security info err', err);
            }).finally(() => {
                // loaders reset
                setIsLoading(false);
                setPointerEvent(false);
            });
        }
    }, [dataListID]);

    // resusable UI components
    const getNoDataText = () => (<Text content="-" className={gClasses.FTwo13Black18} isLoading={isLoading} />);
    const getLabel = (labelContent, customClass = null) => (<Label
        labelName={labelContent}
        className={customClass || cx(styles.Security, gClasses.PB4)}
        isLoading={isLoading}
    />);
    const getHeading = (content) => <Text
        content={content}
        className={cx(gClasses.FTwo16GrayV3, gClasses.FontWeight500, gClasses.MB12)}
        isLoading={isLoading}
    />;
    const getChipText = (isAllEntries) => isAllEntries ? EDIT_ENTRY.SAME_AS_ADD_ENTRY.OPTIONS[0].LABEL : EDIT_ENTRY.SAME_AS_ADD_ENTRY.OPTIONS[1].LABEL;
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

    // security sub components
    const getAddSecurityContent = () => {
        let content = null;
        if (securityData?.addSecurity) {
        content =
            <UserPicker
            labelClassName={gClasses.FTwo12BlackV20}
            selectedValue={securityData?.addSecurity}
            maxCountLimit={2}
            buttonClassName={gClasses.DisplayNone}
            className={gClasses.NoPointerEvent}
            disabled
            isLoading={isLoading}
            />;
        } else content = getNoDataText();
        return (
            <>
                {getLabel(ADD_ENTRY.LABEL)}
                {content}
            </>
        );
    };

    const getEditSecurityContent = () => (
        // comments - Using conditions to render the security data and no data
        <div className={cx(gClasses.MT16, gClasses.W50)}>
            {getLabel(EDIT_ENTRY.LABEL)}
            <div className={cx(gClasses.DisplayFlex, gClasses.FlexDirectionColumn, gClasses.GAP8)}>
                {securityData?.editSecurity?.sameAsAdd &&
                <div className={cx(styles.ResponsiveFlexContainer)}>
                    <Text // Edit data securtiy
                        content={EDIT_ENTRY.SAME_AS_ADD_ENTRY.LABEL}
                        className={gClasses.FTwo13Black12}
                        isLoading={isLoading}
                    />
                    {!isLoading &&
                    <Chip
                        text={getChipText(securityData?.editSecurity?.isAllEntries)}
                        className={cx(gClasses.CursorPointer, gClasses.ML8)}
                        textColor={COLOR_CONSTANTS.BLACK_V1}
                        backgroundColor={DEFAULT_COLORS_CONSTANTS.GRAY_103}
                        size={EChipSize.md}
                    />}
                </div>
                }
                {/* Specified users */}
                {securityData?.editSecurity?.members &&
                <>
                    {getLabel(EDIT_ENTRY.SPECIFIED_USERS.LABEL, styles.SpecifiedUserLabel)}
                    {getUserDisplayGroupContent(securityData?.editSecurity?.members)}
                </>
                }
            </div>
            {!securityData?.editSecurity && getNoDataText()}
        </div>
    );

    const getDeleteSecurityContent = () => (
        // comments - Using conditions to render the security data and no data

        <div className={cx(gClasses.MT16, gClasses.W50)}>
            {getLabel(DELETE_ENTRY.LABEL)}
            <div className={cx(gClasses.DisplayFlex, gClasses.FlexDirectionColumn, gClasses.GAP8)}>
                {securityData?.deleteSecurity?.sameAsAdd &&
                <div className={cx(styles.ResponsiveFlexContainer)}>
                    <Text // Delete data securtiy
                        content={DELETE_ENTRY.SAME_AS_ADD_ENTRY.LABEL}
                        className={gClasses.FTwo13Black12}
                        isLoading={isLoading}
                    />
                    {!isLoading &&
                    <Chip
                        text={getChipText(securityData?.deleteSecurity?.isAllEntries)}
                        className={cx(gClasses.CursorPointer, gClasses.ML8)}
                        textColor={COLOR_CONSTANTS.BLACK_V1}
                        backgroundColor={DEFAULT_COLORS_CONSTANTS.GRAY_103}
                        size={EChipSize.md}
                    />}
                </div>
                }
                {/* Specified users */}
                {securityData?.deleteSecurity?.members &&
                <>
                    {getLabel(DELETE_ENTRY.SPECIFIED_USERS.LABEL, styles.SpecifiedUserLabel)}
                    {getUserDisplayGroupContent(securityData?.deleteSecurity?.members)}
                </>
                }
            </div>
            {!securityData?.deleteSecurity && getNoDataText()}
        </div>
    );

    const getViewSecurityContent = () => {
        let content = null;
        if (!isEmpty(securityData?.viewers?.users) || !isEmpty(securityData?.viewers?.teams)) content = getUserDisplayGroupContent(securityData?.viewers);
        else content = getNoDataText();
        return (
            <>
                {getLabel(VIEWERS.LABEL)}
                {content}
            </>
        );
    };

    const getEntityViewersContent = () => {
        let content = null;
        if (!isEmpty(securityData?.entityViewers?.users) || !isEmpty(securityData?.entityViewers?.teams)) content = getUserDisplayGroupContent(securityData?.entityViewers);
        else content = getNoDataText();
        return (
            <>
                {getLabel(SECURITY_POLICY.POLICY_ACCESS_TITLE)}
                {content}
            </>
        );
    };

    const getParticipantsLevelSecurityContent = () => (
        <div>
            {getLabel(DATA_SECURITY.LABEL)}
            {!isLoading &&
            <Text
                className={gClasses.FTwo13Black12}
                isLoading={isLoading}
                content={securityData?.isParticipantsLevelSecurity ? DATA_SECURITY.OPTION_LIST[0].label : DATA_SECURITY.OPTION_LIST[1].label}
            />}
        </div>
    );

    // main content
    const getManageDataSecurity = () => (
        <div>
            {/* <div className={gClasses.MB24}>
                {getHeading(ADMINISTRATIVE_PERMISSIONS)}
            </div> */}
            <div className={gClasses.MB24}>
                {getHeading(DATALIST_SECURITY)}
                {getAddSecurityContent()}
                <div className={cx(gClasses.DisplayFlex, gClasses.MB16)}>
                    {getEditSecurityContent()}
                    {getDeleteSecurityContent()}
                </div>
                {getParticipantsLevelSecurityContent()}
            </div>
        </div>
    );
    const getViewDataSecurity = () => (
        <div className={gClasses.MB24}>
            {getHeading(VIEW_PERMISSIONS)}
            <div className={gClasses.MB16}>
                {getViewSecurityContent()}
            </div>
            <div className={gClasses.MB16}>
                {getEntityViewersContent()}
            </div>
        </div>
    );

    return (
        <div className={styles.SecurityPage}>
            {getManageDataSecurity()}
            {getViewDataSecurity()}
            {/* comments - isLoading to be handled withing policy condition component */}
            {isLoading ? <Skeleton height={200} /> :
            <PolicyConditions
                policyList={securityData?.security_policies && securityData.security_policies}
                isLoading={isLoading}
                policyFields={policyFields}
            />}
            {/* <SecuritySummary /> */}
        </div>
    );
}

export default DatalistDataSecurity;

DatalistDataSecurity.propTypes = {
    dataListID: Proptypes.string,
};
