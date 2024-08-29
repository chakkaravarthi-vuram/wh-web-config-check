// security reducer

import { convertBeToFeKeys } from '../../../../../utils/normalizer.utils';

const EMPTY_USERS_TEAMS = {
  users: [],
  teams: [],
};

export const DATALIST_SECURITY_INITIAL_REDUCER_STATE = {
addSecurity: EMPTY_USERS_TEAMS,
editSecurity: {
  sameAsAdd: false,
  isAllEntries: true,
  members: EMPTY_USERS_TEAMS,
},
deleteSecurity: {
  sameAsAdd: false,
  isAllEntries: true,
  members: EMPTY_USERS_TEAMS,
},
viewers: EMPTY_USERS_TEAMS,
entityViewers: EMPTY_USERS_TEAMS,
isRowSecurity: false,
isRowSecurityPolicy: false,
securityPolicies: [],
};

export const ACTION_LIST = {
ERROR_CHANGE: 'error_change',
DATA_CHANGE: 'data_change',
CLEAR_REDUCER: 'clear',
};
export const dataListSecurityReducer = (state, action) => {
const payload = action?.payload;
switch (action.type) {
  case ACTION_LIST.DATA_CHANGE:
     return {
       ...state,
       ...(payload || {}),
     };
    case ACTION_LIST.ERROR_CHANGE:
        return {
        ...state,
        errorList: payload || {},
        };
  case ACTION_LIST.CLEAR_REDUCER:
      return DATALIST_SECURITY_INITIAL_REDUCER_STATE;
  default: break;
}
return state;
};

export const DUMMY_SECURITY_DATA = convertBeToFeKeys({
    admins: {
        users: [
            {
                _id: '659f7b533def9173367b8540',
                username: 'dixonloc@workhall',
                first_name: 'dixonloc',
                last_name: 'a',
                email: 'dixonloc@workhall.com',
                is_active: true,
                user_type: 1,
            },
        ],
        teams: null,
    },
    owners: {
        users: [
            {
                _id: '659f7b533def9173367b8540',
                username: 'dixonloc@workhall',
                first_name: 'dixonloc',
                last_name: 'a',
                email: 'dixonloc@workhall.com',
                is_active: true,
                user_type: 1,
            },
        ],
        teams: null,
    },
    initiators: {
        users: [
            {
                _id: '659f7b533def9173367b8540',
                username: 'dixonloc@workhall',
                first_name: 'dixonloc',
                last_name: 'a',
                email: 'dixonloc@workhall.com',
                is_active: true,
                user_type: 1,
            },
        ],
        teams: null,
    },
    isParticipantsLevelSecurity: false,
    isRowSecurityPolicy: true,
    securityPolicies: [
        {
            type: 'condition',
            policy_uuid: '5754c406-f8dc-47ba-8fff-19ede5083ba0',
            policy: {
                expression_uuid: '5754c406-f8dc-47ba-8fff-19ede5083ba0',
                logical_operator: 'and',
                conditions: [
                    {
                        condition_type: 'direct',
                        condition_uuid: '6a053499-acdb-44da-9e60-7ec7e0fe620f',
                        l_field: '01cdd768-2fd9-425e-9d0c-095d9499141c',
                        operator: 'numberEqualsTo',
                        r_value: 12,
                    },
                ],
            },
            access_to: {
                user_team: {
                    users: [
                        {
                            _id: '65dc2e8b3ee6057bebbfd635',
                            username: 'Spidey',
                            first_name: 'Spiderman',
                            last_name: 'X',
                            email: 'spiderman@sony.io',
                            is_active: true,
                            is_user: true,
                            label: 'Spiderman X',
                            name: 'Spiderman X',
                            id: '65dc2e8b3ee6057bebbfd635',
                            avatar: null,
                        },
                    ],
                    teams: [],
                },
            },
        },
        {
            type: 'user_field',
            policy_uuid: 'ec380145-9301-4146-9ac4-934333e0993f',
            access_to: {
                field_uuids: [
                    {
                        key: '278623e7-a104-45d1-8e35-6a819b1eab82',
                        label: 'Manager name',
                    },
                ],
            },
        },
    ],
    entityViewers: {
        users: [
            {
                _id: '659f7b533def9173367b8540',
                username: 'dixonloc@workhall',
                first_name: 'dixonloc',
                last_name: 'a',
                email: 'dixonloc@workhall.com',
                is_active: true,
                is_user: true,
            },
            {
                _id: '65c49d222d8a895e8e13cd87',
                username: 'NewLocalAcc',
                first_name: 'New',
                last_name: 'Local',
                email: 'dixona+456@workhall.com',
                is_active: true,
                is_user: true,
            },
        ],
    },
}, {}, [], ['users', 'teams', 'securityPolicies']);
