import { getAssignedOnDetails } from './ListFlow.utils';

export const flowDataEntity = (flowData) => {
  const data = { ...flowData };
  return {
    getFlowId: () => data._id,
    getFlowColor: () => data.flow_color,
    getHasPublished: () => data.has_published,
    getFlowDescription: () => data.flow_description,
    getLastUpdateOnView: () => getAssignedOnDetails(data.last_updated_on),
    getFlowName: () => data.flow_name,
    getFlowCode: () => data.flow_short_code,
    getFlowUuid: () => data.flow_uuid,
    getFlowStatus: () => data.status,
    getVersionNumberDisplay: () => `V${data.version}`,
    isPublished() {
      return this.getFlowStatus() === 'published';
    },
    getFlowUsers: () => {
      if (data?.security?.admins?.users) {
        return data?.security?.admins?.users;
      }
      return [];
    },
    getFlowTeams: () => {
      if (data?.security?.admins?.teams) {
        return data?.security?.admins?.teams;
      }
      return [];
    },
  };
};
