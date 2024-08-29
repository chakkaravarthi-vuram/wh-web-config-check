import React, { useContext, useEffect, useState } from 'react';
import {
    BorderRadiusVariant,
    Button,
    ButtonContentVaraint,
    Checkbox,
    Chip,
    EButtonSizeType,
    EButtonType,
    ECheckboxSize,
    EInputIconPlacement,
    ETabVariation,
    ETextSize,
    ETitleHeadingLevel,
    ETitleSize,
    Input,
    PaginationButtonPlacement,
    Size,
    Tab,
    TableColumnWidthVariant,
    TableWithPagination,
    Text,
    Title,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import { language } from 'language/config';
import { getFormattedMemberData, getSelectedTeamMembersHeader, getTeamButtonTitleText, memberDetailsCard, setEditTeamData, teamManageMembersTab } from '../../teams.utils';
import styles from '../CreateEditTeam.module.scss';
import gClasses from '../../../../scss/Typography.module.scss';
import UserPlus from '../../../../assets/icons/UserPlus';
import AddTeamMembers from './add_members/AddTeamMembers';
import { TEAMS_STRINGS } from '../../teams.strings';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { GET_ALL_TEAMS, GET_USERS, REMOVE_TEAM_MEMBER } from '../../../../urls/ApiUrls';
import jsUtility from '../../../../utils/jsUtility';
import NoTeamsFoundIcon from '../../../../assets/icons/NoTeamsFound';
import DeleteIcon from '../../../../assets/icons/apps/DeleteIcon';
import { isBasicUserMode, isMobileScreen, onWindowResize } from '../../../../utils/UtilityFunctions';
import ThemeContext from '../../../../hoc/ThemeContext';
import { DEFAULT_COLORS_CONSTANTS } from '../../../../utils/UIConstants';
import AddTeamsIcon from '../../../../assets/icons/AddTeams';
import SearchTeamsIcon from '../../../../assets/icons/teams/SearchTeams';
import { CHIP_COLOR, USER_ROLE } from '../../../../utils/Constants';
import DeleteConfirmModal from '../../../application/delete_comfirm_modal/DeleteConfirmModal';
import NoUsersIcon from '../../../../assets/icons/teams/NoUsersIcon';

function ManageMembers(props) {
    const {
        createEditDataChange,
        teamCreateEditState,
        teamCreateEditState: {
            isManageMembersModalOpen,
            security: {
                owner,
                visibility,
            },
            manageMembersData: {
                selectAllChecked,
                excludeUsers,
                selectedUsers,
                excludeTeams,
                selectedTeams,
                selectAllUsersChecked,
                selectAllTeamsChecked,
            },
            currentMembersData,
            currentMembersData: {
                userArray,
                teamsArray,
                memberUserPaginationDetails,
                memberTeamPaginationDetails,
                currentUserPage,
                currentTeamPage,
                deletedMember,
            },
            manageMembersTab,
            errorMessage,
            manageMemberLoading,
        },
        getSeparateAllUserOrTeamsDataThunk,
        clearCreateEditTeamManageMembers,
        addOrRemoveTeamMemberApiThunk,
        getTeamDetailsThunk,
        updateStatusInfo,
    } = props;
    const { t, i18n } = useTranslation();
    const history = useHistory();
    const { teamDetails } = useSelector((state) => state.TeamsReducer);
    const { COMMON_STRINGS, TEAMS_LISTING, TEAMS_LISTING: { SEARCH }, ACTION_STRINGS, UTILS_CONSTANTS } = TEAMS_STRINGS(t);
    const isNormalUser = isBasicUserMode(history);
    const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
    const [isSearchFocus, setIsSearchFocus] = useState(false);
    const [teamSearchText, setTeamSearchText] = useState(EMPTY_STRING);
    const [deleteStatus, setDeleteStatus] = useState(false);
    const [isMobileView, setMobileView] = useState(isMobileScreen());
    const [directDelete, setDirectDelete] = useState(false);
    const isUser = manageMembersTab === 1;
    const { teamid } = useParams();

    const windowResize = () => {
        setMobileView(isMobileScreen());
    };

    useEffect(() => {
        onWindowResize(windowResize);
        return () => window.removeEventListener('resize', windowResize);
      });

    // Get users or team members API call
    const getUsersOrTeamMemberData = (page, search = EMPTY_STRING, defaultParams = {}, callAPi, strictMemberType = false, isStrictUser, currentDetails = {}, initialCallTeamsApi) => {
        let isUserMember = jsUtility.cloneDeep(isUser);
        const params = {
          page: page || 1,
          size: 5,
          is_active: 1,
          search: search || null,
          ...defaultParams,
        };
        if (strictMemberType) {
            isUserMember = isStrictUser;
        }
        let checkIfAnyIsSelected = false;
        if (isUserMember) {
            if (selectAllUsersChecked || !jsUtility.isEmpty(selectedUsers)) checkIfAnyIsSelected = true;
            params.is_last_signin = 0;
            if (selectAllUsersChecked) {
                if (!jsUtility.isEmpty(excludeUsers)) {
                    params.omit_users = excludeUsers;
                }
            } else if (!jsUtility.isEmpty(selectedUsers) && !teamid) params.user_ids = selectedUsers;
        } else {
            if (selectAllTeamsChecked || !jsUtility.isEmpty(selectedTeams)) checkIfAnyIsSelected = true;
            params.team_type = [2];
            if (selectAllTeamsChecked) {
                if (!jsUtility.isEmpty(excludeTeams)) {
                    params.omit_teams = excludeTeams;
                }
            } else if (!jsUtility.isEmpty(selectedTeams) && !teamid) params.team_ids = selectedTeams;
        }
        if (callAPi) checkIfAnyIsSelected = true;
        const currentData = { ...currentMembersData, currentUserPage: 1, currentTeamPage: 1, ...currentDetails };
        if (checkIfAnyIsSelected) {
            getSeparateAllUserOrTeamsDataThunk(params, isUserMember ? GET_USERS : GET_ALL_TEAMS, isUserMember, createEditDataChange, currentData, true, initialCallTeamsApi);
        } else {
            let memberInitialData = {};
            if (isUserMember) {
                memberInitialData = {
                    memberUserPaginationDetails: {},
                    memberUserDocumentDetails: [],
                    userArray: [],
                };
            } else {
                memberInitialData = {
                    memberTeamPaginationDetails: {},
                    memberTeamDocumentDetails: [],
                    teamsArray: [],
                };
            }
            createEditDataChange({ currentMembersData: { ...currentMembersData, ...memberInitialData } });
        }
    };

    useEffect(() => {
        if (teamid && jsUtility.isEmpty(teamDetails?.id)) {
            getTeamDetailsThunk({ _id: teamid }, isNormalUser)
            .then((response) => {
                const { ownerData, visibilityData, common } = setEditTeamData(response, isNormalUser);
                createEditDataChange({ ...common, security: { owner: { ...owner, ...ownerData }, visibility: { ...visibility, ...visibilityData } } });
            });
        }
        if (teamid) {
            getUsersOrTeamMemberData(1, EMPTY_STRING, { include_team_member: teamid }, true, false, false, {}, (currentData) => getUsersOrTeamMemberData(1, EMPTY_STRING, { include_team_member: teamid }, true, true, false, { ...currentData, deletedMember: { users: [], teams: [] } }));
        }
    }, []);

    // Callback after delete members
    const onDeleteAction = () => {
        getUsersOrTeamMemberData(1, EMPTY_STRING, { include_team_member: teamid }, true, false, false, { ...currentMembersData, currentUserPage: 1, deletedMember: { users: [], teams: [] } });
        createEditDataChange({ currentMembersData: { ...currentMembersData, deletedMember: { users: [], teams: [] } } });
    };

    // On Delete members handle
    const onRemoveMemberHandle = () => {
        const deletedId = { users: [], teams: [] };
        if (manageMembersTab === 1) {
            deletedId?.users?.push(directDelete);
        } else deletedId?.teams?.push(directDelete);
        if (jsUtility.isEmpty(deletedId?.users)) delete deletedId?.users;
        if (jsUtility.isEmpty(deletedId?.teams)) delete deletedId?.teams;
        setDeleteStatus(false);
        setDirectDelete(false);
        addOrRemoveTeamMemberApiThunk({ members: deletedId, _id: teamid }, onDeleteAction, REMOVE_TEAM_MEMBER, t, isNormalUser);
    };

    // On Members delete selection
    const onMemberDeleteSelect = (member) => {
        const deleteUserTeamId = jsUtility.cloneDeep(deletedMember) || { users: [], teams: [] };
        if (manageMembersTab === 1) {
            if (deleteUserTeamId?.users?.some((value) => value === member?.id)) {
                deleteUserTeamId.users = deleteUserTeamId?.users?.filter((memberDetails) => memberDetails !== member?.id);
              } else deleteUserTeamId?.users?.push(member.id);
        } else {
            if (deleteUserTeamId?.teams?.some((value) => value === member?.id)) {
                deleteUserTeamId.teams = deleteUserTeamId?.teams?.filter((memberDetails) => memberDetails !== member?.id);
              } else deleteUserTeamId?.teams?.push(member.id);
        }
        createEditDataChange({ currentMembersData: { ...currentMembersData, deletedMember: deleteUserTeamId } });
    };

    // Direct delete on page click
    const onDeleteCheckedButtonClick = () => {
        const deleteUserTeamId = jsUtility.cloneDeep(deletedMember);
        if (jsUtility.isEmpty(deleteUserTeamId?.users)) delete deleteUserTeamId?.users;
        if (jsUtility.isEmpty(deleteUserTeamId?.teams)) delete deleteUserTeamId?.teams;
        setDeleteStatus(false);
        setDirectDelete(false);
        addOrRemoveTeamMemberApiThunk({ members: deleteUserTeamId, _id: teamid }, onDeleteAction, REMOVE_TEAM_MEMBER, t, isNormalUser);
    };

    // Delete Popup open
    const DeletePopupOpen = (isDirect = false) => {
        setDeleteStatus(true);
        setDirectDelete(isDirect);
    };

    // Get Table row data
    const getTeamMembersRowData = () => {
        const rows = [];
        const membersData = {};
        if (isUser) {
            membersData.members = userArray;
            membersData.selectedMembers = selectedUsers;
            membersData.excludeMembers = excludeUsers;
        } else {
            membersData.members = teamsArray;
            membersData.selectedMembers = selectedTeams;
            membersData.excludeMembers = excludeTeams;
        }
        getFormattedMemberData(membersData?.members, isUser, selectAllChecked, membersData?.selectedMembers, membersData?.excludeMembers, deletedMember, t)?.forEach((member) => {
            const rowData = { component: [], id: EMPTY_STRING };
            if (teamid) {
                rowData.component.push(<Checkbox color={isNormalUser ? colorScheme?.activeColor : colorSchemeDefault?.activeColor} isValueSelected={member?.deleteChecked} onClick={() => onMemberDeleteSelect(member)} details={{ label: '', value: '' }} labelText="" />);
            }
            rowData.component.push(memberDetailsCard(member, isNormalUser && colorScheme));
            rowData.component.push(
                <Chip
                textClassName={gClasses.FontSize12}
                textColor={member?.memberType === USER_ROLE.ADMIN ? CHIP_COLOR.BLUE_10 : CHIP_COLOR.BLACK_10}
                backgroundColor={member?.memberType === USER_ROLE.ADMIN ? CHIP_COLOR.BLUE_01 : CHIP_COLOR.GRAY_10}
                text={member?.memberType}
                borderRadiusType={BorderRadiusVariant.circle}
                className={gClasses.WhiteSpaceNoWrap}
                />,
            );
            if (teamid && (jsUtility.isEmpty(deletedMember?.users) && jsUtility.isEmpty(deletedMember?.teams))) {
                rowData.component.push(
                <button>
                    <DeleteIcon
                        onClick={() => DeletePopupOpen(member.id)}
                        className={styles.DeleteIcon}
                        size={ECheckboxSize.LG}
                        checkboxViewLabelClassName={gClasses.MT2}
                        color={isNormalUser ? colorScheme?.activeColor : DEFAULT_COLORS_CONSTANTS.BLUE_V39}
                    />
                </button>,
                );
            } else {
                rowData.component.push(<div className={gClasses.DisplayNone}>{COMMON_STRINGS.MANAGE_MEMBERS}</div>);
            }
            rowData.id = member?._id;
            rows.push(rowData);
        });
        return rows;
    };

    // Handle page change
    const handlePageChange = (page) => {
        if (manageMembersTab === 1 && currentUserPage === page) return;
        else if (manageMembersTab === 2 && currentTeamPage === page) return;
        let currentData = {};
        let allowOnlyCurrentTeam = {};
        if (manageMembersTab === 1) {
            currentData = { ...currentMembersData, currentUserPage: page };
        } else currentData = { ...currentMembersData, currentTeamPage: page };
        if (teamid) allowOnlyCurrentTeam = { include_team_member: teamid };
        getUsersOrTeamMemberData(page, EMPTY_STRING, allowOnlyCurrentTeam, true, false, false, currentData);
    };

    // User or Team tab change
    const onTabChange = (tabValue) => {
        createEditDataChange({ manageMembersTab: tabValue, currentMembersData: { ...currentMembersData, deletedMember: { users: [], teams: [] } } });
        setIsSearchFocus(false);
        setTeamSearchText(EMPTY_STRING);
        if (teamid && tabValue === 2) {
            getUsersOrTeamMemberData(1, EMPTY_STRING, { include_team_member: teamid }, true, true, false, { ...currentMembersData, deletedMember: { users: [], teams: [] } });
        } else if (teamid && tabValue === 1) {
            getUsersOrTeamMemberData(1, EMPTY_STRING, { include_team_member: teamid }, true, true, true, { ...currentMembersData, deletedMember: { users: [], teams: [] } });
        }
    };

    // Showing Results data
    const totalMembers = manageMembersTab === 1 ? memberUserPaginationDetails?.total_count || 0 : memberTeamPaginationDetails?.total_count || 0;
    const isSingular = totalMembers === 1;

    const countText = isSingular
    ? manageMembersTab === 1
        ? TEAMS_STRINGS(t).TEAMS_LISTING.USER
        : TEAMS_STRINGS(t).TEAMS_LISTING.TEAM
    : manageMembersTab === 1
    ? TEAMS_STRINGS(t).TEAMS_LISTING.USERS
    : TEAMS_STRINGS(t).TEAMS_LISTING.TEAMS;

    const showingResultsText = (
        <Title
            content={`${TEAMS_STRINGS(t).TEAMS_LISTING.SHOWING} ${totalMembers} ${countText}`}
            size={ETitleSize.xs}
            headingLevel={ETitleHeadingLevel.h5}
            className={styles.ResponsiveAlign}
        />
    );

    // Search Team Change
    const onSearchChangeHandler = (event) => {
        const { value } = event.target;
        setTeamSearchText(value);
        getUsersOrTeamMemberData(1, value, { include_team_member: teamid }, true);
    };

    // Search Icon
    const getSearchIcon = () => (
        <button
            aria-label={SEARCH}
            className={styles.SearchIconClass}
            onClick={() => setIsSearchFocus(!isSearchFocus)}
        >
            <SearchTeamsIcon />
        </button>
    );

    return (
        <>
            <DeleteConfirmModal
                isModalOpen={deleteStatus}
                content={`${ACTION_STRINGS.DELETE} ${isUser ? UTILS_CONSTANTS.USERS : UTILS_CONSTANTS.TEAMS}`}
                firstLine={isUser ? ACTION_STRINGS.DELETE_SURE_USERS : ACTION_STRINGS.DELETE_SURE_TEAMS}
                cancelButton={ACTION_STRINGS.DONT_DELETE}
                DeleteButton={ACTION_STRINGS.YES_DELETE}
                onDelete={() => !jsUtility.isEmpty(directDelete) ? onRemoveMemberHandle() : onDeleteCheckedButtonClick()}
                onCloseModal={() => { setDeleteStatus(false); setDirectDelete(false); }}
                languageStyle={(i18n.language === language.solvene) ? styles.SloveneText : null}
            />
            {isManageMembersModalOpen && (
                <AddTeamMembers
                    createEditDataChange={createEditDataChange}
                    teamCreateEditState={teamCreateEditState}
                    getSeparateAllUserOrTeamsDataThunk={getSeparateAllUserOrTeamsDataThunk}
                    clearCreateEditTeamManageMembers={clearCreateEditTeamManageMembers}
                    getUsersOrTeamMemberDetails={getUsersOrTeamMemberData}
                    isUser={isUser}
                    addOrRemoveTeamMemberApiThunk={addOrRemoveTeamMemberApiThunk}
                />
            )}
            <Tab
                selectedTabIndex={manageMembersTab}
                variation={ETabVariation.folder}
                options={teamManageMembersTab(t, isNormalUser)}
                bottomSelectionClass={styles.ActiveBar}
                onClick={onTabChange}
                className={cx(gClasses.PositionAbsolute, styles.TabPosition)}
                colorScheme={isNormalUser ? colorScheme : colorSchemeDefault}
            />
            <div className={cx(styles.ManageContainer, gClasses.MT40)}>
                {teamid && updateStatusInfo}
                <div className={cx(gClasses.CenterV, gClasses.JusSpaceBtw, styles.ResponsiveTeamDetailsHeader)}>
                    {(!manageMemberLoading) ? showingResultsText : <Skeleton width={100} />}
                    <div className={cx(gClasses.CenterVH, styles.ResponsiveAlign)}>
                        {teamid && (
                            isSearchFocus ? (
                                <div className={gClasses.M16}>
                                    <Input
                                        content={teamSearchText || EMPTY_STRING}
                                        prefixIcon={getSearchIcon()}
                                        onChange={onSearchChangeHandler}
                                        iconPosition={EInputIconPlacement.left}
                                        className={styles.Search}
                                        placeholder={SEARCH}
                                        size={Size.md}
                                        borderRadiusType={BorderRadiusVariant.rounded}
                                    />
                                </div>
                            ) : (
                                getSearchIcon()
                            )
                        )}
                        <div className={cx(gClasses.DisplayFlex, styles.ManageButtonContainer, gClasses.ML12)}>
                            {(!jsUtility.isEmpty(deletedMember?.users) || !jsUtility.isEmpty(deletedMember?.teams)) && (
                                <Button
                                    icon={<DeleteIcon />}
                                    buttonText={COMMON_STRINGS.DELETE_SELECTED}
                                    size={EButtonSizeType.SM}
                                    type={EButtonType.OUTLINE_SECONDARY}
                                    className={cx(styles.DeleteButton)}
                                    onClickHandler={() => DeletePopupOpen()}
                                />
                            )}
                            {!(!jsUtility.isEmpty(deletedMember?.users) || !jsUtility.isEmpty(deletedMember?.teams)) && (
                                <Button
                                    colorSchema={isNormalUser ? colorScheme : colorSchemeDefault}
                                    icon={manageMembersTab === 1 ? (
                                        <UserPlus strokeColor={isNormalUser ? colorScheme.activeColor : colorSchemeDefault.activeColor} />
                                    ) : <AddTeamsIcon fillColor={isNormalUser ? colorScheme.activeColor : colorSchemeDefault.activeColor} />}
                                    buttonText={getTeamButtonTitleText(isUser, COMMON_STRINGS, teamid)}
                                    className={manageMembersTab === 1 ? styles.AddMemberButton : styles.TeamIconContainer}
                                    type={EButtonType.SECONDARY}
                                    size={EButtonSizeType.SM}
                                    onClickHandler={() => createEditDataChange({ isManageMembersModalOpen: true })}
                                />
                            )}
                        </div>
                    </div>
                </div>
            {errorMessage?.members && <Text size={ETextSize.SM} className={styles.MemberValidation} content={`* ${errorMessage?.members}`} />}
            {!jsUtility.isEmpty(getTeamMembersRowData()) && (
            <TableWithPagination
                tableClassName={cx(styles.TableManageMember, gClasses.MT16)}
                header={getSelectedTeamMembersHeader(teamid, t, isUser)}
                data={getTeamMembersRowData()}
                isLoading={!isManageMembersModalOpen && manageMemberLoading}
                widthVariant={TableColumnWidthVariant.CUSTOM}
                colorScheme={isNormalUser && colorScheme}
                paginationProps={{
                    totalItemsCount: manageMembersTab === 1 ? memberUserPaginationDetails?.total_count : memberTeamPaginationDetails?.total_count,
                    itemsCountPerPage: 5,
                    activePage: manageMembersTab === 1 ? currentUserPage : currentTeamPage,
                    constructItemsCountMessage: (itemStart, itemEnd, totalCount) =>
                        `${TEAMS_LISTING.SHOWING} ${itemStart} - ${itemEnd} ${TEAMS_LISTING.OF} ${totalCount}`,
                    prevAndNextButtonContentVariant: ButtonContentVaraint.icon,
                    prevAndNextButtonPlacement: PaginationButtonPlacement.connected,
                    shape: BorderRadiusVariant.square,
                    onChange: (_event, page) => handlePageChange(page),
                    paginationBoxesCount: 1,
                    totalBoxes: isMobileView ? 3 : 7,
                    breakPoint: isMobileView ? 1 : 4,
                }}
            />)}
            {jsUtility.isEmpty(getTeamMembersRowData()) && !isManageMembersModalOpen && !manageMemberLoading && (
                <div className={cx(gClasses.CenterVH, gClasses.FlexDirectionColumn)}>
                    {isUser ? <NoUsersIcon /> : <NoTeamsFoundIcon />}
                    <Text size={ETextSize.SM} content={isUser ? COMMON_STRINGS.NO_USERS_FOUND : COMMON_STRINGS.NO_TEAMS_FOUND} />
                </div>
            )}
            </div>
        </>
    );
}

export default ManageMembers;
