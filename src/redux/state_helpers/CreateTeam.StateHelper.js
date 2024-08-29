import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
import { SECURITY_STRINGS } from '../../utils/strings/CommonStrings';
import { SECURITY_TYPES } from '../../utils/Constants';

export const compareTeamDetailsAndState = (team_details, stateData) => {
    const state = {
        _id: stateData._id,
        team_name: _isEmpty(stateData.team_name) ? null : stateData.team_name,
        description: _isEmpty(stateData.description) ? null : stateData.description,
        security: stateData.security === SECURITY_TYPES.PRIVATE
            ? SECURITY_STRINGS[SECURITY_TYPES.PRIVATE]
            : SECURITY_STRINGS[SECURITY_TYPES.PUBLIC],
        team_pic: _isEmpty(stateData.team_pic) ? null : stateData.team_pic,
        owners: _isEmpty(stateData.owners) ? null : stateData.owners,
        team_type: [2],
    };

    return _isEqual(state, team_details);
};

export const getUpdatedTeamData = (postData, responseData, stateData) => {
    const { team_details, document_details, team_pic } = stateData;

    Object.keys(postData).forEach((id) => {
        team_details[id] = postData[id];
    });

    const docDetails = !_isEmpty(document_details) ? {
        team_pic_id: document_details.file_metadata[0]._id,
        team_pic: responseData.document_url_details ? responseData.document_url_details[0].signedurl : team_pic,
    } : null;

    return {
        ...team_details,
        ...docDetails,
    };
};
