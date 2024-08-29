import { TextArea, TextInput } from '@workhall-pvt-lmt/wh-ui-library';
import React from 'react';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import jsUtility from '../../../../utils/jsUtility';
import { validate } from '../../../../utils/UtilityFunctions';
import { TEAMS_STRINGS } from '../../teams.strings';
import { createTeamBasicDetailsValidationSchema } from '../../teams.validation';

function BasicDetails(props) {
    const { createEditDataChange, errorMessage, teamCreateEditState } = props;
    const { teamName, teamDesc } = teamCreateEditState;
    const { t } = useTranslation();
    const { LABEL_TEXT, FORM_ID } = TEAMS_STRINGS(t);

    // On Edit Team Name and Team Description
    const onChangeHandle = (id, event) => {
        const { value } = event.target;
        const updateData = {};
        updateData[id] = value;
        if (!jsUtility.isEmpty(errorMessage)) {
            const errorList = validate({ teamName, teamDesc, [id]: value }, createTeamBasicDetailsValidationSchema(t));
            if (!jsUtility.isEmpty(errorList)) updateData.errorMessage = errorList;
            else updateData.errorMessage = {};
        }
        createEditDataChange(updateData);
    };

    return (
        <div>
            <TextInput
                labelText={LABEL_TEXT.TEAM_NAME}
                required
                onChange={(event) => onChangeHandle(FORM_ID.TEAM_NAME, event)}
                errorMessage={errorMessage[FORM_ID.TEAM_NAME]}
                value={teamName}
                placeholder={LABEL_TEXT.TEAM_NAME_PLACEHOLDER}
                autoFocus
            />
            <TextArea
                labelText={LABEL_TEXT.TEAM_DESC}
                className={gClasses.MT16}
                inputInnerClassName={gClasses.FontWeightNormal}
                onChange={(event) => onChangeHandle(FORM_ID.TEAM_DESC, event)}
                errorMessage={errorMessage[FORM_ID.TEAM_DESC]}
                value={teamDesc}
                placeholder={LABEL_TEXT.TEAM_DESC_PLACEHOLDER}
            />
        </div>
    );
}

export default BasicDetails;
