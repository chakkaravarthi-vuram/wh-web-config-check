import React, { useContext, useEffect, useState } from 'react';
import gClasses from 'scss/Typography.module.scss';
import {
  BorderRadiusVariant,
  Button,
  ButtonContentVaraint,
  Checkbox,
  EButtonType,
  EInputIconPlacement,
  ETextSize,
  ETitleSize,
  Input,
  Modal,
  ModalSize,
  ModalStyleType,
  PaginationButtonPlacement,
  TableColumnWidthVariant,
  TableWithPagination,
  Text,
  Title,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import CloseIconV2 from 'assets/icons/CloseIconV2';
import { useHistory, useParams } from 'react-router-dom';
import { TEAMS_STRINGS } from '../../../teams.strings';
import SearchIconNew from '../../../../../assets/icons/SearchIconNew';
import styles from '../../CreateEditTeam.module.scss';
import { ADD_TEAM_MEMBER, GET_ALL_TEAMS, GET_USERS } from '../../../../../urls/ApiUrls';
import { constructCreateEditPostData, getFormattedMemberData, getTableMembersTeamsHeader, getTeamButtonTitleText, isManageMembersButtonDeactivated, memberDetailsCard } from '../../../teams.utils';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import jsUtility from '../../../../../utils/jsUtility';
import { ARIA_LABEL } from '../../../../search_tab/SearchTab.utils';
import CloseIconNew from '../../../../../assets/icons/CloseIconNew';
import { ICON_STRINGS } from '../../../../../components/list_and_filter/ListAndFilter.strings';
import NoTeamsFoundIcon from '../../../../../assets/icons/NoTeamsFound';
import { isBasicUserMode } from '../../../../../utils/UtilityFunctions';
import ThemeContext from '../../../../../hoc/ThemeContext';

function AddTeamMembers(props) {
  const {
    createEditDataChange,
    teamCreateEditState,
    teamCreateEditState: {
      // isManageMembersModalOpen,
      manageMembersData,
      errorMessage,
      manageMembersData: {
        userArray,
        teamsArray,
        memberPaginationDetails,
        excludeUsers,
        selectedUsers,
        selectedTeams,
        excludeTeams,
        selectAllUsersChecked,
        selectAllTeamsChecked,
      },
      memberLoading,
    },
    getSeparateAllUserOrTeamsDataThunk,
    addOrRemoveTeamMemberApiThunk,
    clearCreateEditTeamManageMembers,
    getUsersOrTeamMemberDetails,
    isUser,
  } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
  const [clonedState] = useState(manageMembersData);
  const { COMMON_STRINGS, BUTTON_TEXT, KEYS, TEAMS_LISTING } = TEAMS_STRINGS(t);
  const isNormalUser = isBasicUserMode(history);
  const [currentPage, setCurrentPage] = useState(1);
  const [teamSearchText, setTeamSearchText] = useState(EMPTY_STRING);
  const { teamid } = useParams();
  const selectAllChecked = isUser ? selectAllUsersChecked : selectAllTeamsChecked;

  // Get Users and Teams Data
  const getUsersOrTeamMemberData = (page, search = EMPTY_STRING) => {
    const params = {
      page: page || 1,
      size: 5,
      is_active: 1,
      search: search || null,
    };
    if (!isUser) {
      params.team_type = [2];
    } else {
      params.is_last_signin = 0;
    }
    if (teamid) {
      params.exclude_team_member = teamid;
      if (!isUser) {
        params.omit_teams = [teamid];
      }
    }
    getSeparateAllUserOrTeamsDataThunk(params, isUser ? GET_USERS : GET_ALL_TEAMS, isUser, createEditDataChange, { ...manageMembersData });
  };

  useEffect(() => {
    getUsersOrTeamMemberData();
  }, []);

  // Selecting the Members
  const onMemberSelected = (member) => {
    if (!selectAllChecked) {
      let selectedData = isUser ? jsUtility.cloneDeep(selectedUsers) : jsUtility.cloneDeep(selectedTeams);
      if (selectedData?.some((value) => value === member?.id)) {
        selectedData = selectedData.filter((memberDetails) => memberDetails !== member?.id);
      } else selectedData.push(member.id);
      createEditDataChange({ manageMembersData: { ...manageMembersData, [isUser ? KEYS.SELECTED_USERS : KEYS.SELECTED_TEAMS]: selectedData } });
    } else {
      let excludeData = isUser ? jsUtility.cloneDeep(excludeUsers) : jsUtility.cloneDeep(excludeTeams);
      if (excludeData?.some((value) => value === member?.id)) {
        excludeData = excludeData.filter((memberDetails) => memberDetails !== member?.id);
      } else excludeData.push(member.id);
      createEditDataChange({ manageMembersData: { ...manageMembersData, [isUser ? KEYS.EXCLUDE_USERS : KEYS.EXCLUDE_TEAMS]: excludeData } });
    }
  };

  // On Close modal click handle
  const onModalCloseClick = () => {
    createEditDataChange({ isManageMembersModalOpen: false, manageMembersData: { ...clonedState } });
  };

  // Modal Header content
  const modalHeaderContent = () => (
    <div className={cx(gClasses.CenterV, gClasses.JusSpaceBtw, gClasses.P24, gClasses.PB16)}>
      <Title content={getTeamButtonTitleText(isUser, COMMON_STRINGS, teamid)} size={ETitleSize.small} />
      <button onClick={onModalCloseClick} aria-label={COMMON_STRINGS.CLOSE}>
        <CloseIconV2
          className={cx(
            gClasses.CursorPointer,
          )}
          height={COMMON_STRINGS.ICON_SIZE}
          width={COMMON_STRINGS.ICON_SIZE}
        />
      </button>
    </div>
  );

  // Table Row data
  const getMembersRowData = () => {
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
    getFormattedMemberData(membersData?.members, isUser, selectAllChecked, membersData?.selectedMembers, membersData?.excludeMembers, {}, t)?.forEach((member) => {
      const rowData = { component: [], id: EMPTY_STRING };
      rowData.component.push(<Checkbox color={isNormalUser ? colorScheme?.activeColor : colorSchemeDefault?.activeColor} isValueSelected={member?.isChecked} onClick={() => onMemberSelected(member)} details={{ label: '', value: '' }} labelText="" />);
      rowData.component.push(memberDetailsCard(member, isNormalUser && colorScheme));
      rowData.id = member?.id;
      rows.push(rowData);
    });
    return rows;
  };

  // Page Change function
  const handlePageChange = (page) => {
    setCurrentPage(page);
    getUsersOrTeamMemberData(page, teamSearchText);
  };

  // On Table Row click
  const onAddTeamRowClick = (rowId) => {
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
    const memberArray = getFormattedMemberData(membersData?.members, isUser, selectAllChecked, membersData?.selectedMembers, membersData?.excludeMembers, {}, t);
    const currentMemberData = memberArray?.find((member) => member.id === rowId) || {};
    onMemberSelected(currentMemberData);
  };

  // On select all header clicked
  const onSelectAllClicked = (isChecked) => {
    let manageData = {};
    if (isUser) {
      manageData = { manageMembersData: { ...manageMembersData, selectAllUsersChecked: !isChecked } };
    } else manageData = { manageMembersData: { ...manageMembersData, selectAllTeamsChecked: !isChecked } };
    let initialSelectExcludeMembers = {};
    if (!isChecked) {
      if (isUser) initialSelectExcludeMembers = { selectedUsers: [], excludeUsers: [] };
      else initialSelectExcludeMembers = { selectedTeams: [], excludeTeams: [] };
    }
    manageData.manageMembersData = { ...manageData.manageMembersData, ...initialSelectExcludeMembers };
    createEditDataChange(manageData);
  };

  // Table Members
  const getMembersData = () =>
  (
    !jsUtility.isEmpty(getMembersRowData()) && (
    <TableWithPagination
      tableClassName={styles.Table}
      header={getTableMembersTeamsHeader(selectAllChecked, onSelectAllClicked, t, isNormalUser ? colorScheme.activeColor : colorSchemeDefault.activeColor, teamSearchText)}
      data={getMembersRowData()}
      isLoading={memberLoading}
      // onSortClick={onSortHandler}
      widthVariant={TableColumnWidthVariant.CUSTOM}
      isRowClickable
      onRowClick={(rowId) => onAddTeamRowClick(rowId)}
      colorScheme={isNormalUser && colorScheme}
      paginationProps={{
        totalItemsCount: memberPaginationDetails?.total_count,
        itemsCountPerPage: 5,
        activePage: currentPage,
        constructItemsCountMessage: (itemStart, itemEnd, totalCount) =>
          `${TEAMS_LISTING.SHOWING} ${itemStart} - ${itemEnd} ${TEAMS_LISTING.OF} ${totalCount}`,
        prevAndNextButtonContentVariant: ButtonContentVaraint.icon,
        prevAndNextButtonPlacement: PaginationButtonPlacement.connected,
        shape: BorderRadiusVariant.square,
        onChange: (_event, page) => handlePageChange(page),
      }}
    />)
  );

  // On Member Search handle
  const onSearchChangeHandler = (event) => {
    const { value } = event.target;
    setTeamSearchText(value);
    createEditDataChange({ manageMembersData: { ...manageMembersData } });
    setCurrentPage(1);
    getUsersOrTeamMemberData(1, value);
  };

  // Modal Body Content
  const modalBodyContent = () => (
    <div className={gClasses.P24}>
      <Input
        placeholder={isUser ? COMMON_STRINGS.SEARCH_MEMBERS : COMMON_STRINGS.SEARCH_TEAMS}
        prefixIcon={
          <SearchIconNew
            className={styles.SearchIcon}
            tabIndex={0}
          />}
        iconPosition={EInputIconPlacement.right}
        content={teamSearchText}
        onChange={onSearchChangeHandler}
        suffixIcon={!jsUtility.isEmpty(teamSearchText) && (
          <button onClick={() => onSearchChangeHandler({ target: { value: EMPTY_STRING } })} ariaLabel={ARIA_LABEL.CLEAR_SEARCH}>
            <CloseIconNew
              title={ICON_STRINGS.CLEAR}
              className={cx(styles.CloseIcon, gClasses.CursorPointer)}
            />
          </button>
        )}
      />
      <div className={gClasses.MT16}>
        {getMembersData()}
        {jsUtility.isEmpty(getMembersRowData()) && !memberLoading && (
          <div className={cx(gClasses.CenterVH, gClasses.FlexDirectionColumn)}>
            <NoTeamsFoundIcon />
            <Text size={ETextSize.SM} content={isUser ? COMMON_STRINGS.NO_USERS_FOUND : COMMON_STRINGS.NO_TEAMS_FOUND} />
          </div>
        )}
      </div>
    </div>
  );

  // Callback after adding members
  const onAddCallBack = () => {
    getUsersOrTeamMemberDetails(1, EMPTY_STRING, { include_team_member: teamid }, true);
    clearCreateEditTeamManageMembers();
  };

  // Add Api call
  const onAddTeamMemberClick = () => {
    createEditDataChange({ isManageMembersModalOpen: false });
    if (teamid) {
      const { members, all_members } = constructCreateEditPostData(teamCreateEditState, isNormalUser);
      addOrRemoveTeamMemberApiThunk({ _id: teamid, members, all_members }, onAddCallBack, ADD_TEAM_MEMBER, t, isNormalUser);
    } else {
      const existingError = jsUtility.cloneDeep(errorMessage);
      delete existingError?.members;
      createEditDataChange({ errorMessage: existingError });
      getUsersOrTeamMemberDetails();
    }
  };

  // Define Modal Footer Content
  const modalFooterContent = () => (
    <div className={cx(gClasses.CenterV, styles.FooterContainer)}>
      <Button
        buttonText={BUTTON_TEXT.CANCEL}
        noBorder
        className={cx(gClasses.MR24, gClasses.FontWeight500, styles.CancelButton)}
        onClickHandler={onModalCloseClick}
      />
      <Button
        type={EButtonType.PRIMARY}
        buttonText={BUTTON_TEXT.ADD}
        onClickHandler={() => onAddTeamMemberClick()}
        colorSchema={isNormalUser && colorScheme}
        disabled={isManageMembersButtonDeactivated(manageMembersData, isUser)}
      />
    </div>
  );

  return (
    <Modal
      modalStyle={ModalStyleType.modal}
      modalSize={ModalSize.md}
      headerContent={modalHeaderContent()}
      mainContent={modalBodyContent()}
      footerContent={modalFooterContent()}
      isModalOpen
    />
  );
}

export default AddTeamMembers;
