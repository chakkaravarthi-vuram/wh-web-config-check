import React from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { Checkbox, ECheckboxSize, TextInput, EPopperPlacements } from '@workhall-pvt-lmt/wh-ui-library';
import { VALIDATION_CONFIG_STRINGS } from '../ValidationConfiguration.strings';
import gClasses from '../../../../../../../scss/Typography.module.scss';
import { CancelToken } from '../../../../../../../utils/UtilityFunctions';
import { cloneDeep, find, remove, isNaN, isEmpty } from '../../../../../../../utils/jsUtility';
import styles from './UserSelectorValidationConfiguration.module.scss';
import UserPicker from '../../../../../../../components/user_picker/UserPicker';
import { getFieldValidationErrorMessage } from '../ValidationConfiguration.utils';
import { RESPONSE_FIELD_KEYS, RESPONSE_VALIDATION_KEYS } from '../../../../../../../utils/constants/form/form.constant';
import { FIELD_TYPES } from '../../../FieldConfiguration.strings';
import { getSharedPropertyWarningText } from '../../../FieldConfiguration.utils';

const cancelToken = new CancelToken();

function UserSelectorValidationConfiguration(props) {
    const { setFieldDetails, fieldDetails = {} } = props;
    const { errorList = {} } = fieldDetails;
    console.log('UserSelectorValidationConfiguration',
    fieldDetails,
    fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.USER_TEAM_PICKER]?.ALLOW_MULTIPLE],
    );

    const { t } = useTranslation();

    const allowMultiplePick = fieldDetails?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.USER_TEAM_PICKER]?.ALLOW_MULTIPLE];

    const onUserSelectorValidationChangeHandler = (value, id) => {
        const validationData = cloneDeep(fieldDetails)?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA] || {};
        switch (id) {
            case VALIDATION_CONFIG_STRINGS(t).MIN_USER_SELECTION.ID:
                if (value.includes('-') || value.includes('+')) return;
                const minValidationValue = parseInt(value, 10);
                if (isNaN(minValidationValue)) delete validationData[id];
                if (isEmpty(minValidationValue)) delete validationData[id];
                if (!isNaN(minValidationValue)) validationData.minimumSelection = Number(minValidationValue);
            break;
            case VALIDATION_CONFIG_STRINGS(t).MAX_USER_SELECTION.ID:
                if (value.includes('-') || value.includes('+')) return;
                const maxValidationValue = parseInt(value, 10);
                if (isNaN(maxValidationValue)) delete validationData[id];
                if (isEmpty(maxValidationValue)) delete validationData[id];
                if (!isNaN(maxValidationValue)) validationData.maximumSelection = Number(maxValidationValue);
            break;
            case VALIDATION_CONFIG_STRINGS(t).ALLOW_MULTIPLE_DATA_LIST.ID:
                validationData.allowMultiple = !validationData?.allowMultiple;
                if (!validationData?.allowMultiple) {
                    delete validationData.minimumSelection;
                    delete validationData.maximumSelection;
                }
            break;
            case VALIDATION_CONFIG_STRINGS(t).IS_RESTRICTED.ID:
                validationData.isRestricted = !validationData?.isRestricted;
                validationData.restrictedUserTeam = {
                    users: [],
                    teams: [],
                };
            break;
            default:
            break;
        }
        setFieldDetails({
          ...fieldDetails,
          [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: validationData,
        });
    };

    const onRestrictedUserOrTeamSelect = (member) => {
        const restrictedUserTeam = cloneDeep(fieldDetails)?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.USER_TEAM_PICKER]?.RESTRICTED_USER_TEAM] || {};
        console.log('membermembermembermember', restrictedUserTeam);
        if (member?.username && restrictedUserTeam?.users && !find(restrictedUserTeam?.users, { _id: member?._id })) {
          restrictedUserTeam.users = [...restrictedUserTeam.users, member];
        } else if (restrictedUserTeam?.teams && !find(restrictedUserTeam?.teams, { _id: member?._id })) {
          restrictedUserTeam.teams = [...restrictedUserTeam.teams, member];
        }
        setFieldDetails({
            ...fieldDetails,
            [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: {
                ...fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA],
                [RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.USER_TEAM_PICKER]?.RESTRICTED_USER_TEAM]: restrictedUserTeam,
            },
        });
    };

    const onRestrictedUserOrTeamRemove = (removeId) => {
        const restrictedUserTeam = cloneDeep(fieldDetails)?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.USER_TEAM_PICKER]?.RESTRICTED_USER_TEAM] || {};
        if (find(restrictedUserTeam?.users, { _id: removeId })) {
            remove(restrictedUserTeam?.users, { _id: removeId });
          } else if (find(restrictedUserTeam?.teams, { _id: removeId })) {
            remove(restrictedUserTeam?.teams, { _id: removeId });
          }
        setFieldDetails({
            ...fieldDetails,
            [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: {
                ...fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA],
                [RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.USER_TEAM_PICKER]?.RESTRICTED_USER_TEAM]: restrictedUserTeam,
            },
        });
    };

    return (
        <div>
            {fieldDetails[RESPONSE_FIELD_KEYS.FORM_COUNT] > 1 && getSharedPropertyWarningText()}
            {allowMultiplePick && (
            <div className={cx(gClasses.DisplayFlex, gClasses.JusSpaceBtw)}>
                <TextInput
                    id={VALIDATION_CONFIG_STRINGS(t).MIN_USER_SELECTION.ID}
                    labelText={VALIDATION_CONFIG_STRINGS(t).MIN_USER_SELECTION.LABEL}
                    onChange={(event) =>
                        onUserSelectorValidationChangeHandler(
                            event?.target?.value,
                            VALIDATION_CONFIG_STRINGS(t).MIN_USER_SELECTION.ID,
                        )
                    }
                    value={fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.USER_TEAM_PICKER]?.MINIMUM_SELECTION]}
                    errorMessage={getFieldValidationErrorMessage(errorList, VALIDATION_CONFIG_STRINGS(t).MIN_USER_SELECTION.ID)}
                    className={cx(gClasses.MT16, styles.TextClass)}
                />
                <TextInput
                    id={VALIDATION_CONFIG_STRINGS(t).MAX_USER_SELECTION.ID}
                    labelText={VALIDATION_CONFIG_STRINGS(t).MAX_USER_SELECTION.LABEL}
                    onChange={(event) =>
                        onUserSelectorValidationChangeHandler(
                            event?.target?.value,
                            VALIDATION_CONFIG_STRINGS(t).MAX_USER_SELECTION.ID,
                        )
                    }
                    value={fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.USER_TEAM_PICKER]?.MAXIMUM_SELECTION]}
                    className={cx(gClasses.MT16, styles.TextClass)}
                    errorMessage={getFieldValidationErrorMessage(errorList, VALIDATION_CONFIG_STRINGS(t).MAX_USER_SELECTION.ID)}
                />
            </div>
            )}
            <Checkbox
                className={cx(gClasses.MT16, gClasses.CenterV)}
                isValueSelected={fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.USER_TEAM_PICKER]?.IS_RESTRICTED]}
                details={VALIDATION_CONFIG_STRINGS(t).IS_RESTRICTED.OPTION_LIST[0]}
                size={ECheckboxSize.SM}
                onClick={() =>
                    onUserSelectorValidationChangeHandler(
                        !fieldDetails?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.USER_TEAM_PICKER]?.IS_RESTRICTED],
                        VALIDATION_CONFIG_STRINGS(t).IS_RESTRICTED.ID,
                    )
                }
                checkboxViewLabelClassName={cx(gClasses.FTwo13BlackV20, gClasses.CheckboxClass, styles.CheckboxClass)}
            />
            {fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.USER_TEAM_PICKER]?.IS_RESTRICTED] ? (
                <UserPicker
                    id={VALIDATION_CONFIG_STRINGS(t).RESTRICTED_USER_TEAM.ID}
                    popperPosition={EPopperPlacements.AUTO}
                    isSearchable
                    labelClassName={gClasses.FTwo12BlackV20}
                    selectedValue={(() => {
                        const data = fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.USER_TEAM_PICKER]?.RESTRICTED_USER_TEAM];
                        data?.users && data?.users.forEach((user) => {
                            user.is_user = true;
                        });
                        return data;
                    })()}
                    maxCountLimit={3}
                    className={gClasses.MT16}
                    errorMessage={getFieldValidationErrorMessage(errorList, VALIDATION_CONFIG_STRINGS(t).RESTRICTED_USER_TEAM.ID)}
                    onSelect={onRestrictedUserOrTeamSelect}
                    onRemove={onRestrictedUserOrTeamRemove}
                    noDataFoundMessage={VALIDATION_CONFIG_STRINGS(t).RESTRICTED_USER_TEAM.NO_SEARCH_RESULTS}
                    cancelToken={cancelToken}
                />
            ) : null}
        </div>
    );
}

  export default UserSelectorValidationConfiguration;
