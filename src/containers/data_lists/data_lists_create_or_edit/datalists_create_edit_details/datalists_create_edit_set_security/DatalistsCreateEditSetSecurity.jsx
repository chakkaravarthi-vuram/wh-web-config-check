import React, { useEffect } from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import {
    ETitleSize,
    SingleDropdown,
    Title,
    CheckboxGroup,
    RadioGroup,
    RadioGroupLayout,
    EPopperPlacements,
    // TableWithPagination,
    // Text,
    // TableColumnWidthVariant,
} from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import styles from '../../DatalistsCreateEdit.module.scss';
import UserPicker from '../../../../../components/user_picker/UserPicker';
import PolicyBasedDataSecurity from './policy_based_data_security/PolicyBasedDataSecurity';
import { DATALISTS_CREATE_EDIT_CONSTANTS, DATALIST_SECURITY_CONSTANTS } from '../../DatalistsCreateEdit.constant';
import { isEmpty, cloneDeep, isNull } from '../../../../../utils/jsUtility';
import { DL_ACTIONS } from '../../useDatalistReducer';
import { filterCurrentUser, getErrorMessage } from '../../DatalistsCreateEdit.utils';
import { EDIT_BASIC_DETAILS } from '../../../data_list_landing/DatalistsLanding.constant';
import { TEAM_TYPES_PARAMS, USER_TYPES_PARAMS } from '../../../../../utils/Constants';
import { CancelToken } from '../../../../../utils/UtilityFunctions';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';

function DatalistsCreateEditSetSecurity(props) {
    // do not remove - to be used in next sprint
    // const getTableRowText = (dataText) => <Text content={dataText} className={cx(gClasses.FTwo12BlackV18, gClasses.FontWeight500)} />;

    const { dataListID, onDataChangeHandler, securityData, errorList } = props;
    const { t } = useTranslation();

    const isEmptyUsersTeams = (members) => isEmpty(members?.users) && isEmpty(members?.teams);
    const currentLoggedInUser = useSelector((state) => state.RoleReducer.user_id);

    const setSecurityData = (data) => {
        onDataChangeHandler(data, DL_ACTIONS.SECURITY_DATA_CHANGE);
    };

    const adminsCancelToken = new CancelToken();
    const ownersCancelToken = new CancelToken();
    const addersCancelToken = new CancelToken();
    const editorsCancelToken = new CancelToken();
    const deletorsCancelToken = new CancelToken();
    const viewersCancelToken = new CancelToken();

    useEffect(() => {
        const clonedSecurityData = cloneDeep(securityData);
        let isEditSpecifiedMembers = false;
        let isDeleteSpecifiedMembers = false;
        if (!isEmptyUsersTeams(clonedSecurityData?.editSecurity?.members)) isEditSpecifiedMembers = true;
        if (!isEmptyUsersTeams(clonedSecurityData?.deleteSecurity?.members)) isDeleteSpecifiedMembers = true;
        setSecurityData({
            ...clonedSecurityData,
            editSecurity: {
                ...clonedSecurityData?.editSecurity,
                specifiedMembers: isEditSpecifiedMembers,
            },
            deleteSecurity: {
                ...clonedSecurityData?.deleteSecurity,
                specifiedMembers: isDeleteSpecifiedMembers,
            },
        });
    }, []);

    const {
        SECURITY: {
            DATALIST_SECURITY,
            ADD_NEW_DATA,
            EDIT_DATA,
            EDIT_DATA_SAME_AS,
            EDIT_DATA_SPECIFIED,
            DELETE_DATA,
            DELETE_DATA_SAME_AS,
            VIEW_DATA_SECURITY,
            VIEW_ALL_DATA,
            // SECURITY_SUMMARY,
            // SECURITY_SUMMARY_HEADER,
            ENTRIES_OPTIONS,
            DATA_SECURITY,
            ADMINISTRATIVE_PERMISSIONS,
            // USER_PERMISSIONS,
            // ADVANCED_DATA_SECURITY,
            OWNERS_TOOLTIP,
            ADMINS_TOOLTIP,
        },
        NO_DATA_FOUND,
    } = DATALISTS_CREATE_EDIT_CONSTANTS(t);

    const {
        DATALIST_ADMINS,
        DATALIST_VIEWERS,
    } = EDIT_BASIC_DETAILS(t);

    const {
        ADD_SECURITY,
        EDIT_SECURITY,
        DELETE_SECURITY,
        VIEWERS,
        SAME_AS_ADD,
        SPECIFIED_MEMBERS,
    } = DATALIST_SECURITY_CONSTANTS;

    // functional handlers
    const onUserSelectHandler = (newData, id, isEditOrDelete = false) => {
        const isUser = newData?.is_user;
        let clonedUsers = [];
        let clonedTeams = [];

        if (isEditOrDelete) {
            // clonedData
            clonedUsers = securityData?.[id]?.members?.users || [];
            clonedTeams = securityData?.[id]?.members?.teams || [];
            isUser ? clonedUsers.push(newData) : clonedTeams.push(newData);
            setSecurityData({
                ...securityData,
                [id]: {
                    ...securityData?.[id],
                    members: {
                        users: clonedUsers,
                        teams: clonedTeams,
                    },
                },
            });
        } else {
            // clonedData
            clonedUsers = securityData?.[id]?.users || [];
            clonedTeams = securityData?.[id]?.teams || [];
            isUser ? clonedUsers.push(newData) : clonedTeams.push(newData);
            setSecurityData({
                ...securityData,
                [id]: {
                    ...securityData?.[id],
                    users: clonedUsers,
                    teams: clonedTeams,
                },
            });
        }
    };

    const onUserRemoveHandler = (removableId, id, isEditOrDelete = false) => {
        let clonedUsers = [];
        let clonedTeams = [];

        if (isEditOrDelete) {
            // clonedData
            clonedUsers = securityData?.[id]?.members?.users || [];
            clonedTeams = securityData?.[id]?.members?.teams || [];
            clonedUsers = clonedUsers?.filter((user) => user._id !== removableId);
            clonedTeams = clonedTeams?.filter((team) => team._id !== removableId);
            setSecurityData({
                ...securityData,
                [id]: {
                    ...securityData?.[id],
                    members: {
                        users: clonedUsers,
                        teams: clonedTeams,
                    },
                },
            });
        } else {
            // clonedData
            clonedUsers = securityData?.[id]?.users || [];
            clonedTeams = securityData?.[id]?.teams || [];
            clonedUsers = clonedUsers?.filter((user) => user._id !== removableId);
            clonedTeams = clonedTeams?.filter((team) => team._id !== removableId);
            setSecurityData({
                ...securityData,
                [id]: {
                    ...securityData?.[id],
                    users: clonedUsers,
                    teams: clonedTeams,
                },
            });
        }
    };

    const onEntriesChangeHandler = (value, id) => {
        setSecurityData({
            ...securityData,
            [id]: {
                ...securityData?.[id],
                isAllEntries: value,
            },
        });
    };

    const onCheckBoxClickHandler = (value, id) => {
        setSecurityData({
            ...securityData,
            [id]: {
                ...securityData?.[id],
                [value]: !securityData?.[id]?.[value],
                ...((securityData?.[id]?.[value] && value === SPECIFIED_MEMBERS) && { members: { users: [], teams: [] } }),
            },
        });
    };

    const EDIT_DELETE_OPTIONS = (id) => [
        {
            label: id === EDIT_SECURITY ? EDIT_DATA_SAME_AS : DELETE_DATA_SAME_AS,
            value: SAME_AS_ADD,
            selected: securityData?.[id]?.sameAsAdd,
            childrenContainerClass: gClasses.ML12,
            children: (
            <SingleDropdown
                className={styles.DropdownWidth}
                selectedValue={securityData?.[id]?.isAllEntries}
                optionList={ENTRIES_OPTIONS}
                dropdownViewProps={{
                    selectedLabel: securityData?.[id]?.isAllEntries ? ENTRIES_OPTIONS[0].label : ENTRIES_OPTIONS[1].label,
                    disabled: !securityData?.[id]?.sameAsAdd,
                }}
                onClick={(value) => onEntriesChangeHandler(value, id)}
            />),
        }, {
            label: EDIT_DATA_SPECIFIED,
            value: SPECIFIED_MEMBERS,
            selected: securityData?.[id]?.specifiedMembers,
            customChildElement: (<UserPicker
                selectedValueContainerClassName={gClasses.MT4Imp}
                selectedValue={securityData?.[id]?.members}
                onSelect={(selectedUserorTeam) => onUserSelectHandler(selectedUserorTeam, id, true)}
                onRemove={(selectedUserorTeamID) => onUserRemoveHandler(selectedUserorTeamID, id, true)}
                isSearchable
                noDataFoundMessage={NO_DATA_FOUND}
                disabled={!securityData?.[id]?.specifiedMembers}
                errorMessage={getErrorMessage(errorList, [id, 'members'])}
                allowedTeamType={TEAM_TYPES_PARAMS.SYSTEM_ORGANISATION_TEAMS}
                cancelToken={id === EDIT_SECURITY ? editorsCancelToken : deletorsCancelToken}
                popperPosition={EPopperPlacements.RIGHT}
            />),
            customChildElementClassName: gClasses.ML28,
        },
    ];

    return (
        // comments - remove inline onchange handlers and handle it as seperate functions
        <div className={cx(gClasses.P24, gClasses.BackgroundWhite)}>
            <div className={gClasses.MB24}>
                <Title
                    content={ADMINISTRATIVE_PERMISSIONS}
                    size={ETitleSize.xs}
                    className={cx(gClasses.GrayV3, gClasses.MB12)}
                />
                <div className={gClasses.DisplayFlex}>
                <UserPicker
                    id={DATALIST_ADMINS.ID}
                    labelClassName={styles.FieldLabel}
                    labelText={DATALIST_ADMINS.LABEL}
                    className={cx(gClasses.W50)}
                    selectedValue={filterCurrentUser(securityData?.dataListAdmins, currentLoggedInUser)}
                    onSelect={(selectedUserorTeam) => onUserSelectHandler(selectedUserorTeam, DATALIST_ADMINS.ID)}
                    onRemove={(selectedUserorTeamID) => onUserRemoveHandler(selectedUserorTeamID, DATALIST_ADMINS.ID)}
                    isSearchable
                    noDataFoundMessage={NO_DATA_FOUND}
                    required
                    errorMessage={getErrorMessage(errorList, 'dataListAdmins')}
                    allowedUserType={USER_TYPES_PARAMS.DEVELOPER_ADMIN_USERS}
                    isUsers
                    helpTooltip={ADMINS_TOOLTIP}
                    cancelToken={adminsCancelToken}
                    getPopperContainerClassName={(isOpen) => isOpen ? gClasses.ZIndex152 : EMPTY_STRING}
                    popperPosition={EPopperPlacements.RIGHT}
                />
                </div>
            </div>
            <div>
                <Title content={DATALIST_SECURITY} size={ETitleSize.xs} className={cx(gClasses.GrayV3, gClasses.MB12)} />
                <UserPicker
                    id={DATALIST_VIEWERS.ID}
                    labelClassName={styles.FieldLabel}
                    labelText={DATALIST_VIEWERS.LABEL}
                    className={gClasses.MB16}
                    selectedValue={securityData?.dataListOwners}
                    onSelect={(selectedUserorTeam) => onUserSelectHandler(selectedUserorTeam, DATALIST_VIEWERS.ID)}
                    onRemove={(selectedUserorTeamID) => onUserRemoveHandler(selectedUserorTeamID, DATALIST_VIEWERS.ID)}
                    isSearchable
                    noDataFoundMessage={NO_DATA_FOUND}
                    required
                    errorMessage={getErrorMessage(errorList, 'dataListOwners')}
                    allowedTeamType={TEAM_TYPES_PARAMS.SYSTEM_ORGANISATION_TEAMS}
                    helpTooltip={OWNERS_TOOLTIP}
                    cancelToken={ownersCancelToken}
                    getPopperContainerClassName={(isOpen) => isOpen ? gClasses.ZIndex152 : EMPTY_STRING}
                    popperPosition={EPopperPlacements.RIGHT}
                />
                <UserPicker
                    labelClassName={styles.FieldLabel}
                    labelText={ADD_NEW_DATA}
                    className={gClasses.MB16}
                    selectedValue={securityData?.addSecurity}
                    onSelect={(selectedUserorTeam) => onUserSelectHandler(selectedUserorTeam, ADD_SECURITY)}
                    onRemove={(selectedUserorTeamID) => onUserRemoveHandler(selectedUserorTeamID, ADD_SECURITY)}
                    isSearchable
                    noDataFoundMessage={NO_DATA_FOUND}
                    errorMessage={getErrorMessage(errorList, 'addSecurity')}
                    allowedTeamType={TEAM_TYPES_PARAMS.SYSTEM_ORGANISATION_TEAMS}
                    required
                    cancelToken={addersCancelToken}
                    getPopperContainerClassName={(isOpen) => isOpen ? gClasses.ZIndex152 : EMPTY_STRING}
                    popperPosition={EPopperPlacements.RIGHT}
                />
                <div className={gClasses.DisplayFlex}>
                    <CheckboxGroup
                        className={cx(gClasses.MB16, gClasses.W50)}
                        labelText={EDIT_DATA}
                        labelClassName={styles.FieldLabel}
                        checkboxGroupClassName={gClasses.gap12}
                        options={EDIT_DELETE_OPTIONS(EDIT_SECURITY)}
                        onClick={(value) => onCheckBoxClickHandler(value, EDIT_SECURITY)}
                        required
                        errorMessage={getErrorMessage(errorList, 'editSecurity')}
                    />
                    <CheckboxGroup
                        className={cx(gClasses.MB16, gClasses.W50)}
                        labelText={DELETE_DATA}
                        checkboxGroupClassName={gClasses.gap12}
                        labelClassName={styles.FieldLabel}
                        options={EDIT_DELETE_OPTIONS(DELETE_SECURITY)}
                        onClick={(value) => onCheckBoxClickHandler(value, DELETE_SECURITY)}
                        required
                        errorMessage={getErrorMessage(errorList, 'deleteSecurity')}
                    />
                </div>
                <div className={gClasses.MB24}>
                    <RadioGroup
                        required
                        labelText={DATA_SECURITY.LABEL}
                        options={DATA_SECURITY.OPTION_LIST}
                        onChange={(e, id, value) => {
                            if (!isNull(value)) {
                                setSecurityData({
                                    ...securityData,
                                    isParticipantsLevelSecurity: !securityData?.isParticipantsLevelSecurity,
                                });
                            }
                        }}
                        selectedValue={securityData?.isParticipantsLevelSecurity}
                        layout={RadioGroupLayout.stack}
                    />
                </div>
            </div>
            <div>
                <Title content={VIEW_DATA_SECURITY} size={ETitleSize.xs} className={cx(gClasses.GrayV3, gClasses.MB12)} />
                <UserPicker
                    labelText={VIEW_ALL_DATA}
                    labelClassName={styles.FieldLabel}
                    selectedValue={securityData?.viewers}
                    onSelect={(selectedUserorTeam) => onUserSelectHandler(selectedUserorTeam, VIEWERS)}
                    onRemove={(selectedUserorTeamID) => onUserRemoveHandler(selectedUserorTeamID, VIEWERS)}
                    isSearchable
                    noDataFoundMessage={NO_DATA_FOUND}
                    allowedTeamType={TEAM_TYPES_PARAMS.SYSTEM_ORGANISATION_TEAMS}
                    cancelToken={viewersCancelToken}
                    getPopperContainerClassName={(isOpen) => isOpen ? gClasses.ZIndex152 : EMPTY_STRING}
                    popperPosition={EPopperPlacements.RIGHT}
                />
            </div>
            <div>
                <PolicyBasedDataSecurity
                    dataListID={dataListID}
                    securityData={securityData}
                    setSecurityData={setSecurityData}
                    errorList={errorList}
                    onUserSelectHandler={onUserSelectHandler}
                    onUserRemoveHandler={onUserRemoveHandler}
                />
            </div>
            {/* Do not remove - To be implemented in next sprint */}
            {/* <div className={gClasses.MT24}>
                <Title content={SECURITY_SUMMARY} size={ETitleSize.xs} className={cx(gClasses.GrayV3, gClasses.MB12)} />
                <TableWithPagination
                    tableClassName={styles.TableSecuritySummary}
                    header={SECURITY_SUMMARY_HEADER}
                    data={DependantData}
                    widthVariant={TableColumnWidthVariant.CUSTOM}
                />
            </div> */}
        </div>
    );
}

export default DatalistsCreateEditSetSecurity;

DatalistsCreateEditSetSecurity.propTypes = {
    dataListID: PropTypes.string,
    onDataChangeHandler: PropTypes.func,
    securityData: PropTypes.object,
    errorList: PropTypes.object,
};
