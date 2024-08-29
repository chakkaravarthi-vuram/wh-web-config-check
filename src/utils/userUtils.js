const { store } = require('../Store');
const { ROLES } = require('./Constants');

const getCurrentUser = (user) => {
  let currentUser;
  switch (user.user_type) {
    case ROLES.ADMIN:
      currentUser = store.getState().AdminProfileReducer.adminProfile.email;
      break;
    case ROLES.MEMBER:
      currentUser = store.getState().MemberProfileReducer.memberProfile.email;
      break;
    case ROLES.FLOW_CREATOR:
      currentUser = store.getState().DeveloperProfileReducer.flowCreatorProfile.email;
      break;
    default:
      currentUser = null;
  }
  return currentUser;
};

const getCurrentUserId = () => {
  let currentUser;
  const { role } = store.getState().RoleReducer;
  switch (role) {
    case ROLES.ADMIN:
      currentUser = store.getState().AdminProfileReducer.adminProfile.id;
      break;
    case ROLES.MEMBER:
      currentUser = store.getState().MemberProfileReducer.memberProfile.id;
      break;
    case ROLES.FLOW_CREATOR:
      currentUser = store.getState().DeveloperProfileReducer.flowCreatorProfile.id;
      break;
    default:
      currentUser = null;
  }
  return currentUser;
};

const isCurrentUser = (user) => {
  if (user && user._id) {
    return getCurrentUserId() === user._id;
  }
  return false;
};

const getCurrentUserObject = (role) => {
  let currentUser;
  switch (role) {
    case ROLES.ADMIN:
      currentUser = store.getState().AdminProfileReducer.adminProfile;
      break;
    case ROLES.MEMBER:
      currentUser = store.getState().MemberProfileReducer.memberProfile;
      break;
    case ROLES.FLOW_CREATOR:
      currentUser = store.getState().DeveloperProfileReducer.flowCreatorProfile;
      break;
    default:
      currentUser = null;
  }
  return currentUser;
};

export { getCurrentUser, getCurrentUserId, isCurrentUser, getCurrentUserObject };
// exports.getCurrentUser = getCurrentUser;

// exports.getCurrentUserId = getCurrentUserId;

// exports.isCurrentUser = isCurrentUser;

// exports.getCurrentUserObject = getCurrentUserObject;
