import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { Checkbox, ECheckboxSize } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import UserPicker from '../../../../../components/user_picker/UserPicker';
import style from '../AppPageSettings.module.scss';
import { ALLOWED_APP_TEAM_TYPE, APPLICATION_STRINGS } from '../../../application.strings';
import { CancelToken } from '../../../../../utils/UtilityFunctions';
import { APP_PAGE_SETTINGS } from '../../AppBuilder.strings';
import jsUtility from '../../../../../utils/jsUtility';
import { CREATE_APP_STRINGS } from '../../../create_app/CreateApp.strings';

const cancelAppViewerToken = new CancelToken();
const cancelPageViewerToken = new CancelToken();

function PageSettingsSecurity(props) {
    const {
        activeAppData,
        currentPageConfig: {
            inheritFromApp,
            viewers,
            errorList,
        },
        appPageConfigDataChange,
    } = props;

    const { t } = useTranslation();
    const { SECURITY } = APP_PAGE_SETTINGS(t);

      const onPageViewersTeamSelect = (member) => {
        const viewersData = jsUtility.cloneDeep(viewers);
        const errorData = jsUtility.cloneDeep(errorList);
        if (!jsUtility.find(viewersData?.teams, { _id: member?._id })) {
            const existingTeams = !jsUtility.isEmpty(viewersData.teams) ? [...viewersData.teams] : [];
            viewersData.teams = [...existingTeams, member];
            if (errorData?.[SECURITY.PAGE_VIEWERS.ID]) {
                delete errorData?.[SECURITY.PAGE_VIEWERS.ID];
            }
            appPageConfigDataChange({ viewers: viewersData, errorList: errorData });
        }
      };

      const onPageViewersTeamRemoveHandle = (removeId) => {
        const viewersData = jsUtility.cloneDeep(viewers);
        if (jsUtility.find(viewersData?.teams, { _id: removeId })) {
          jsUtility.remove(viewersData?.teams, { _id: removeId });
        }
        appPageConfigDataChange({ viewers: viewersData });
      };

    const onInheritChange = () => {
        const updateData = { inheritFromApp: !inheritFromApp };
        if (inheritFromApp) {
            updateData.viewers = activeAppData?.viewers;
        } else {
            updateData.viewers = { teams: [] };
        }
        appPageConfigDataChange(updateData);
    };

    return (
        <div className={cx(gClasses.MT25, gClasses.PL40, gClasses.PR40)}>
            <UserPicker
                isSearchable
                required
                selectedValue={activeAppData?.viewers}
                maxCountLimit={3}
                className={cx(gClasses.MB16)}
                labelClassName={gClasses.FTwo12BlackV20}
                labelText={CREATE_APP_STRINGS(t).APP_VIEWERS.LABEL}
                noDataFoundMessage={APPLICATION_STRINGS(t).SYSTEM_DIRECTORY.NO_TEAMS_ON_SEARCH}
                cancelToken={cancelAppViewerToken}
                allowedTeamType={ALLOWED_APP_TEAM_TYPE}
                isTeams
                disabled
            />
            <div
                className={cx(
                    style.InhertiSecurityContainer, gClasses.MB16, !inheritFromApp && style.CheckboxChecked,
                )}
            >
                <Checkbox
                    className={cx(gClasses.P16, gClasses.CenterV)}
                    isValueSelected={!inheritFromApp}
                    details={SECURITY.INHERIT_PAGE.OPTION}
                    size={ECheckboxSize.SM}
                    checkboxViewLabelClassName={cx(
                        gClasses.FTwo13BlackV12,
                        style.InheritOption,
                    )}
                    onClick={onInheritChange}
                />
            </div>
            {!inheritFromApp && (
            <UserPicker
                isSearchable
                required
                selectedValue={viewers}
                maxCountLimit={3}
                labelClassName={gClasses.FTwo12BlackV20}
                labelText={SECURITY.PAGE_VIEWERS.LABEL}
                onSelect={onPageViewersTeamSelect}
                onRemove={onPageViewersTeamRemoveHandle}
                noDataFoundMessage={APPLICATION_STRINGS(t).SYSTEM_DIRECTORY.NO_TEAMS_ON_SEARCH}
                cancelToken={cancelPageViewerToken}
                errorMessage={errorList[SECURITY.PAGE_VIEWERS.ID]}
                allowedTeamType={ALLOWED_APP_TEAM_TYPE}
                isTeams
                extraParams={{ team_ids: activeAppData?.viewers?.teams?.map((team) => team._id) || [] }}
            />)}
        </div>
    );
}
export default PageSettingsSecurity;
