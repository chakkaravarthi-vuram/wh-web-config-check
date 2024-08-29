import {
  BorderRadiusVariant,
  ETitleSize,
  TextArea,
  TextInput,
  Title,
  EPopperPlacements,
} from '@workhall-pvt-lmt/wh-ui-library';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import UserPicker from 'components/user_picker/UserPicker';
import gClasses from '../../../../scss/Typography.module.scss';
import jsUtility, {
  capitalizeEachFirstLetter,
} from '../../../../utils/jsUtility';
import { REPORT_STRINGS } from '../../Report.strings';
import { setReportConfig } from '../../../../redux/reducer/ReportReducer';
import {
  CancelToken,
  getUserProfileData,
} from '../../../../utils/UtilityFunctions';
import { NON_PRIVATE_TEAM_TYPES, ROLES } from '../../../../utils/Constants';

const cancelTokenUsers = new CancelToken();
const cancelTokenUsersAndTeams = new CancelToken();

function Security(props) {
  const { reportId } = props;
  const dispatch = useDispatch();
  const {
    REPORT_CREATION: { SECURITY },
  } = REPORT_STRINGS();

  const { reportConfig } = useSelector((store) => store.ReportReducer);
  const userProfile = getUserProfileData();
  useEffect(() => {
    const clonedReportConfig = jsUtility.cloneDeep(reportConfig);
    if (!reportId && jsUtility.isEmpty(clonedReportConfig.admins.users)) {
      const label = capitalizeEachFirstLetter(
        `${userProfile?.first_name} ${userProfile?.last_name}`,
      );
      const value = {
        id: userProfile.id,
        _id: userProfile.id,
        username: userProfile.user_name,
        first_name: userProfile.first_name,
        last_name: userProfile.last_name,
        email: userProfile.email,
        profile_pic: userProfile.profile_pic,
        is_user: true,
        label,
        name: label,
      };
      clonedReportConfig.viewers.users.push(value);
      clonedReportConfig.admins.users.push(value);
      dispatch(setReportConfig(clonedReportConfig));
    }
  }, []);

  const onRemoveUserOrTeam = (id, adminOrViewer) => {
    if (id) {
      if (
        adminOrViewer &&
        adminOrViewer?.teams &&
        jsUtility.find(adminOrViewer?.teams, { _id: id })
      ) {
        jsUtility.remove(adminOrViewer?.teams, {
          _id: id,
        });
      } else if (
        adminOrViewer &&
        adminOrViewer?.users &&
        jsUtility.find(adminOrViewer?.users, { _id: id })
      ) {
        jsUtility.remove(adminOrViewer?.users, {
          _id: id,
        });
      }
    }
  };

  const onChangeAdminAndViewer = (target, adminOrViewer) => {
    if (target?.removeUserOrTeam) {
      onRemoveUserOrTeam(target.value, adminOrViewer);
    } else if (target?.option) {
      const selectedValue = target?.option;
      if (!adminOrViewer) adminOrViewer = {};
      const viewer_type = selectedValue.is_user ? 'users' : 'teams';
      if (adminOrViewer?.[viewer_type]) {
        if (
          !jsUtility.find(adminOrViewer?.[viewer_type], {
            _id: selectedValue._id,
          })
        ) {
          adminOrViewer?.[viewer_type].push(selectedValue);
        }
      } else {
        adminOrViewer[viewer_type] = [];
        adminOrViewer[viewer_type].push(selectedValue);
      }
    }
  };

  const onChangeHandler = (e, type) => {
    const clonedReportConfig = jsUtility.cloneDeep(reportConfig);
    switch (type) {
      case SECURITY.NAME.ID:
        clonedReportConfig.name = e.target.value;
        break;
      case SECURITY.DESCRIPTION.ID:
        clonedReportConfig.description = e.target.value;
        break;
      case SECURITY.ADMINS.ID:
        onChangeAdminAndViewer(e?.target, clonedReportConfig?.admins);
        break;
      case SECURITY.VIEWERS.ID:
        onChangeAdminAndViewer(e?.target, clonedReportConfig?.viewers);
        break;
      default:
        break;
    }
    dispatch(setReportConfig(clonedReportConfig));
  };

  const extraParamsUserAndTeam = {
    team_type: NON_PRIVATE_TEAM_TYPES,
  };

  return (
    <div className={cx(gClasses.W100, gClasses.PX45)}>
      <div className={gClasses.MB24}>
        <Title
          content={SECURITY.BASIC_DETAILS}
          size={ETitleSize.xs}
          className={gClasses.MB8}
        />
        <TextInput
          id={SECURITY.NAME.ID}
          labelText={SECURITY.NAME.LABEL}
          placeholder={SECURITY.NAME.PLACEHOLDER}
          required
          borderRadiusType={BorderRadiusVariant.rounded}
          onChange={(e) => onChangeHandler(e, SECURITY.NAME.ID)}
          value={reportConfig.name}
          errorMessage={reportConfig.errorList[SECURITY.NAME.ID]}
        />
        <TextArea
          id={SECURITY.DESCRIPTION.ID}
          labelText={SECURITY.DESCRIPTION.LABEL}
          placeholder={SECURITY.DESCRIPTION.PLACEHOLDER}
          borderRadiusType={BorderRadiusVariant.rounded}
          onChange={(e) => onChangeHandler(e, SECURITY.DESCRIPTION.ID)}
          value={reportConfig.description}
          errorMessage={reportConfig.errorList[SECURITY.DESCRIPTION.ID]}
        />
      </div>

      <div className={gClasses.MB24}>
        <Title
          content={SECURITY.ADMINS.LABEL}
          size={ETitleSize.xs}
          className={gClasses.MB8}
        />
        <UserPicker
          id={SECURITY.ADMINS.ID}
          selectedValue={[...get(reportConfig, ['admins', 'users'], [])]}
          onSelect={(option) => {
            const changeEvent = {
              target: {
                option: option,
              },
            };
            onChangeHandler(changeEvent, SECURITY.ADMINS.ID);
          }}
          onRemove={(removeUserOrTeamId) => {
            const event = {
              target: {
                value: removeUserOrTeamId,
                removeUserOrTeam: true,
              },
            };
            onChangeHandler(event, SECURITY.ADMINS.ID);
          }}
          isSearchable
          popperPosition={EPopperPlacements.RIGHT_END}
          maxCountLimit={3}
          allowedUserType={[ROLES.ADMIN, ROLES.FLOW_CREATOR]}
          isUsers
          isActive
          hideLabel
          errorMessage={reportConfig.errorList[SECURITY.ADMINS.ID]}
          cancelToken={cancelTokenUsers}
        />
      </div>

      <div className={gClasses.MB24}>
        <Title
          content={SECURITY.VIEWERS.LABEL}
          size={ETitleSize.xs}
          className={gClasses.MB8}
        />

        <UserPicker
          id={SECURITY.VIEWERS.ID}
          selectedValue={[
            ...get(reportConfig, ['viewers', 'users'], []),
            ...get(reportConfig, ['viewers', 'teams'], []),
          ]}
          onSelect={(option) => {
            const changeEvent = {
              target: {
                option: option,
              },
            };
            onChangeHandler(changeEvent, SECURITY.VIEWERS.ID);
          }}
          onRemove={(removeUserOrTeamId) => {
            const removeDetails = {
              target: {
                value: removeUserOrTeamId,
                removeUserOrTeam: true,
              },
            };
            onChangeHandler(removeDetails, SECURITY.VIEWERS.ID);
          }}
          isSearchable
          popperPosition={EPopperPlacements.RIGHT_END}
          maxCountLimit={3}
          extraParams={extraParamsUserAndTeam}
          isActive
          hideLabel
          errorMessage={reportConfig.errorList[SECURITY.VIEWERS.ID]}
          cancelToken={cancelTokenUsersAndTeams}
        />
      </div>
    </div>
  );
}

Security.propTypes = {
  reportId: PropTypes.string,
};

export default Security;
