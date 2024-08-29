import { getAssignedOnDetails } from './ListDataList.utils';

export const DataListDataEntity = (dataListData) => {
  const data = { ...dataListData };
  return {
    getDataListId: () => data._id,
    getDataListColor: () => data.data_list_color,
    getHasPublished: () => data.has_published,
    getDataListDescription: () => data.data_list_description,
    getLastUpdateOnView: () => getAssignedOnDetails(data.last_updated_on),
    getDataListName: () => data.data_list_name,
    getDataListTechnicalReferenceName: () => data.technical_reference_name,
    getDataListCode: () => data.data_list_short_code,
    getDataLisUuid: () => data.data_list_uuid,
    getDataListStatus: () => data.status,
    getVersionNumberDisplay: () => `V${data.version}`,
    isPublished() {
      return this.getDataListStatus() === 'published';
    },
    getDatalistUsers: () => {
      if (data?.security?.admins?.users) {
        return data?.security?.admins?.users;
      }
      return [];
    },
    getDatalistTeams: () => {
      if (data?.security?.admins?.teams) {
        return data?.security?.admins?.teams;
      }
      return [];
    },
  };
};
