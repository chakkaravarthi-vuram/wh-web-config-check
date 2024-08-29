import { createSlice } from '@reduxjs/toolkit';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { SORT_BY } from '../../utils/Constants';

const teamsReducer = 'teamsReducer';

const initialTeamState = {
    createEditTeam: {
        createEditTeamModalOpen: true,
        currentTab: 2,
        manageMembersTab: 1,
        teamName: EMPTY_STRING,
        teamDesc: EMPTY_STRING,
        errorMessage: {},
        createdBy: [],
        blockRoute: false,
        isManageMembersModalOpen: false,
        isBasicDetailsBlockNavigate: true,
        manageMembersData: {
            searchValue: EMPTY_STRING,
            userArray: [],
            teamsArray: [],
            excludeUsers: [],
            excludeTeams: [],
            selectedUsers: [],
            selectedTeams: [],
            selectAllUsersChecked: false,
            selectAllTeamsChecked: false,
            memberLoading: false,
            manageMemberLoading: false,
            memberPaginationDetails: {},
            memberDocumentDetails: [],
        },
        currentMembersData: {
            userArray: [],
            teamsArray: [],
            memberUserPaginationDetails: {},
            memberUserDocumentDetails: [],
            memberTeamPaginationDetails: {},
            memberTeamDocumentDetails: [],
            currentUserPage: 1,
            currentTeamPage: 1,
            memberLoading: false,
            deletedMember: { users: [], teams: [] },
        },
        security: {
            owner: {
                allDevelopers: false,
                selectiveUsers: false,
                members: false,
                users: [],
            },
            visibility: {
                allUsers: false,
                selectiveUsers: false,
                members: false,
                others: {
                    users: [],
                    teams: [],
                },
            },
        },
    },
    teamListing: {
        teamName: EMPTY_STRING,
        description: EMPTY_STRING,
        teamsListData: [],
        teamsCount: 0,
        isTeamListLoading: false,
        membersDataCountPerCall: 15,
        membersCurrentPage: 1,
        isTeamDetailModalOpen: false,
        sortBy: 1,
        sortName: EMPTY_STRING,
        hasMore: false,
        selectedTabIndex: 2,
        totalTeams: 0,
        isInitialLoading: false,
    },
    teamDetails: {
        id: EMPTY_STRING,
        teamName: EMPTY_STRING,
        teamDesc: EMPTY_STRING,
        membersList: [],
        membersDataCountPerCall: 5,
        teamSearchText: EMPTY_STRING,
        membersCurrentPage: 1,
        membersTotalItemsCount: 0,
        isTeamMembersListLoading: false,
        createdOn: {},
        createdBy: {},
        documentUrlDetails: {},
        isEditTeam: false,
        selectedTabIndex: 1,
        teamDetails: {},
        isTeamDetailsLoading: false,
        isDependencyListLoading: false,
        dependencyData: {},
        deactivateTeamModalVisibility: false,
        sortBy: 1,
        sortField: SORT_BY.SORT_NAME,
        security: {
            owner: {
                allDevelopers: false,
                selectiveUsers: false,
                members: false,
                users: [],
            },
            visibility: {
                allUsers: false,
                selectiveUsers: false,
                members: false,
                others: {
                    users: [],
                    teams: [],
                },
            },
        },
    },
};

export const TeamsReducerSlice = createSlice({
    name: teamsReducer,
    initialState: initialTeamState,
    reducers: {
        createEditDataChange: (state, action) => {
            return {
                ...state,
                createEditTeam: { ...state.createEditTeam, ...action.payload },
            };
        },
        teamListingDataChange: (state, action) => {
            state.teamListing = { ...state.teamListing, ...action.payload };
        },
        teamDetailsDataChange: (state, action) => {
            state.teamDetails = { ...state.teamDetails, ...action.payload };
        },
        clearCreateEditDetails: (state) => {
            state.createEditTeam = initialTeamState.createEditTeam;
        },
        clearTeamListingDetails: (state) => {
            state.teamListing = initialTeamState.teamListing;
        },
        clearTeamDetails: (state) => {
            state.teamDetails = initialTeamState.teamDetails;
        },
        clearCreateEditTeamManageMembers: (state) => {
            return {
                ...state,
                createEditTeam: {
                    ...state.createEditTeam,
                    manageMembersData: initialTeamState.createEditTeam.manageMembersData,
                },
            };
        },
    },
});

export const {
    createEditDataChange,
    teamListingDataChange,
    teamDetailsDataChange,
    clearCreateEditDetails,
    clearTeamListingDetails,
    clearCreateEditTeamManageMembers,
    clearTeamDetails,
} = TeamsReducerSlice.actions;

export default TeamsReducerSlice.reducer;
