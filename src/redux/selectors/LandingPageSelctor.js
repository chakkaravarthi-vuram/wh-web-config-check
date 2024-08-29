import { ROLES } from 'utils/Constants';
import jsUtility from '../../utils/jsUtility';

export const getUserPanelData = ({ RoleReducer, AdminProfileReducer, DeveloperProfileReducer, MemberProfileReducer, TaskReducer, UserProfileReducer = null }) => {
    const { role } = RoleReducer;
    console.log('RoleReducer', RoleReducer, AdminProfileReducer);
    let count = 0;
    let completedTaskCount = 0;
    let overdueTaskCount = 0;
    if (TaskReducer && TaskReducer.searchTaskCount) {
        count = TaskReducer.searchTaskCount?.active_task_count || 0;
        completedTaskCount = TaskReducer.searchTaskCount?.completedTaskCount || 0;
        overdueTaskCount = TaskReducer.searchTaskCount?.overdueTaskCount || 0;
    }
    let profileData = {};
    switch (role) {
        case ROLES.ADMIN:
            profileData = AdminProfileReducer.adminProfile;
            break;
        case ROLES.MEMBER:
            profileData = MemberProfileReducer.memberProfile;
            break;
        case ROLES.FLOW_CREATOR:
            profileData = DeveloperProfileReducer.flowCreatorProfile;
            break;
        default:
            break;
    }
    console.log(profileData, UserProfileReducer, 'ROlEEEE');
    return {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: profileData.email,
        profile_pic: profileData.profile_pic,
        // profile_pic: !jsUtils.isNull(UserProfileReducer.profile_pic) ? UserProfileReducer.profile_pic : profileData.profile_pic,
        role: role,
        username: profileData.user_name,
        pendingTaskCount: count,
        completedTaskCount: completedTaskCount,
        overdueTaskCount: overdueTaskCount,
        acc_logo: profileData.acc_logo,
        };
};

export const getProfileByRole = (state) => {
    let profileData = {};
    const role = state?.RoleReducer?.role || null;
    switch (role) {
        case ROLES.ADMIN:
            profileData = state?.AdminProfileReducer.adminProfile;
            break;
        case ROLES.MEMBER:
            profileData = state?.MemberProfileReducer.memberProfile;
            break;
        case ROLES.FLOW_CREATOR:
            profileData = state?.DeveloperProfileReducer.flowCreatorProfile;
            break;
        default:
            break;
    }
    return jsUtility.isEmpty(profileData) ? {} : profileData;
};
