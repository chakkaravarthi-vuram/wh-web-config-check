import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { EButtonType, TextArea } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import jsUtility from '../../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { validate } from '../../../../../utils/UtilityFunctions';
import DateTimeWrapper from '../../../../../components/date_time_wrapper/DateTimeWrapper';
import ConfigurationModal from '../../../../../components/configuration_modal/ConfigurationModal';
import AddMembers from '../../../../../components/member_list/add_members/AddMembers';
import { getUserByIdApi } from '../../../../../axios/apiService/userProfile.apiService';
import { addNewRemainderApiThunk } from '../../../../../redux/actions/IndividualEntry.Action';
import { remaindersChanges } from '../../../../../redux/reducer/IndividualEntryReducer';
import NOTES_AND_REMAINDERS_STRINGS from '../NotesAndRemainders.strings';
import styles from './AddRemainders.module.scss';
import { addNewRemainderValidationSchema } from '../NotesAndRemainder.schema';
import { getAddRemainderPostData } from '../NotesAndRemainder.utils';
import { INDIVIDUAL_ENTRY_TYPE } from '../../IndividualEntry.strings';

function AddRemainders(props) {
  const {
    isModalOpen,
    onCloseClick,
    isRemainderListLoading,
    metaData: { instanceId, moduleUuid, moduleId },
    // datalistName,
    type,
    dispatch,
  } = props;
  const { t } = useTranslation();
  const { addNewRemainder } = useSelector(
    (state) => state.IndividualEntryReducer.notesAndRemainders.remainder,
  );
  const {
    instanceDetails: { system_identifier, custom_identifier, reference_id },
  } = useSelector((state) => state.IndividualEntryReducer);
  const userId = useSelector((state) => state.RoleReducer.user_id);
  const { remainder_message, scheduledDate, remainderErrorList } =
    addNewRemainder;
  const [remainderUserList, setRemainderUserList] = useState([]);
  const [remainderUserIdList, setRemainderUserIdList] = useState({});
  const [remainderUserSearchText, setRemainderUserSearchText] =
    useState(EMPTY_STRING);
  const [usersAndTeams, setUsersAndTeams] = useState([]);
  const [addMemberLoading, setAddMemberLoading] = useState(false);
  const [isUserOrTeamsError, setIsUserOrTeamsError] = useState(false);
  const {
    REMAINDERS: { ADD_REMAINDERS },
  } = NOTES_AND_REMAINDERS_STRINGS(t);

  const onAddRemaindersChange = (data) => {
    const cloneAddRemainder = { ...addNewRemainder, ...data };
    dispatch(remaindersChanges({ addNewRemainder: cloneAddRemainder }));
  };

  const addTeamOrUserToReminderList = (eventObject) => {
    let team_or_user;
    if (eventObject.isDefaultUser) team_or_user = eventObject;
    else team_or_user = eventObject.target.value;
    if (team_or_user.is_user) {
      if (remainderUserList && remainderUserList.users) {
        if (
          !jsUtility.find(remainderUserList.users, { _id: team_or_user._id })
        ) {
          remainderUserList.users.push(team_or_user);
        }
      } else {
        remainderUserList.users = [];
        remainderUserList.users.push(team_or_user);
      }
    } else if (remainderUserList && remainderUserList.teams) {
      if (!jsUtility.find(remainderUserList.teams, { _id: team_or_user._id })) {
        remainderUserList.teams.push(team_or_user);
      }
    } else {
      remainderUserList.teams = [];
      remainderUserList.teams.push(team_or_user);
    }

    return remainderUserList;
  };

  const getAddUserOrTeamId = (userTeamIdList, userOrTeamId) => {
    if (userTeamIdList) {
      if (
        !jsUtility.find(userTeamIdList, {
          _id: userOrTeamId,
        })
      ) {
        userTeamIdList.push(userOrTeamId);
      }
    } else {
      userTeamIdList = [];
      userTeamIdList.push(userOrTeamId);
    }
    return userTeamIdList;
  };
  const getReminderUserIdListHandler = (event) => {
    let reminderUserId;
    const cloneUserIdList = jsUtility.cloneDeep(remainderUserIdList);
    if (event.isDefaultUser) reminderUserId = event;
    else reminderUserId = event.target.value;
    if (reminderUserId && reminderUserId.is_user) {
      cloneUserIdList.users = getAddUserOrTeamId(
        cloneUserIdList?.users,
        reminderUserId._id,
      );
    } else {
      cloneUserIdList.teams = getAddUserOrTeamId(
        cloneUserIdList?.teams,
        reminderUserId._id,
      );
    }
    return cloneUserIdList;
  };

  const teamOrUserSelectHandler = (event) => {
    const remainderUserListDetail = addTeamOrUserToReminderList(event);
    if (remainderUserListDetail) {
      const sortedUsersOrTeamsList = jsUtility.union(
        remainderUserListDetail.teams,
        remainderUserListDetail.users,
      );
      sortedUsersOrTeamsList.sort((key, value) =>
        key?.email?.localeCompare(value?.email),
      );
      setUsersAndTeams(sortedUsersOrTeamsList);
    }
    setRemainderUserList(remainderUserListDetail);
    const reminderUserTeamsId = getReminderUserIdListHandler(event);
    setRemainderUserIdList(reminderUserTeamsId);
    setIsUserOrTeamsError(false);
  };
  useEffect(() => {
    setAddMemberLoading(true);
    getUserByIdApi(userId)
      .then((response) => {
        setAddMemberLoading(false);
        response.isDefaultUser = true;
        response.is_user = true;
        teamOrUserSelectHandler(response);
      })
      .catch((error) => {
        if (error && error.code === 'ERR_CANCELED') return;
        setAddMemberLoading(false);
      });
  }, []);

  const onChangeHandler = (event) => {
    const error_list = jsUtility.cloneDeep(remainderErrorList);
    const { value } = event.target;
    delete error_list.remainder_message;
    onAddRemaindersChange({
      remainder_message: value,
      remainderErrorList: error_list,
    });
  };
  const onChangeDate = (newDate) => {
    const error_list = jsUtility.cloneDeep(remainderErrorList);
    delete error_list.scheduledDate;
    onAddRemaindersChange({
      scheduledDate: newDate,
      remainderErrorList: error_list,
    });
  };
  const getAddNewRemainderValidateData = () => {
    return { remainder_message, scheduledDate };
  };

  const onAddNewRemainderClicked = () => {
    const error_list = validate(
      getAddNewRemainderValidateData(),
      addNewRemainderValidationSchema(t),
    );
    onAddRemaindersChange({ remainderErrorList: error_list });
    if (jsUtility.isEmpty(usersAndTeams)) {
      setIsUserOrTeamsError(true);
    }
    if (jsUtility.isEmpty(error_list) && !jsUtility.isEmpty(usersAndTeams)) {
      const postData = getAddRemainderPostData(addNewRemainder);
      if (type === INDIVIDUAL_ENTRY_TYPE.DATA_LIST) {
        postData.schedule_data.data_list_entry_id = instanceId;
        postData.schedule_data.data_list_uuid = moduleUuid;
        postData.schedule_data.data_list_id = moduleId;
      } else if (type === INDIVIDUAL_ENTRY_TYPE.FLOW) {
        postData.schedule_data.instance_id = instanceId;
        postData.schedule_data.flow_uuid = moduleUuid;
        postData.schedule_data.flow_id = moduleId;
      }
      postData.is_recursive = false; // hardcoded
      postData.schedule_data.recipients = remainderUserIdList;
      dispatch(addNewRemainderApiThunk(postData)).then((isSuccess) => {
        if (isSuccess) {
          onCloseClick();
        }
      });
      if (!isRemainderListLoading && !error_list) {
        setUsersAndTeams([]);
        setRemainderUserList([]);
        setRemainderUserIdList({});
        setRemainderUserSearchText(EMPTY_STRING);
      }
    }
  };
  const datePickerValidations = {
    allow_today: true,
    date_selection: [
      {
        sub_type: 'all_future',
        type: 'future',
      },
    ],
  };

  const removeReminderUserIdListHandler = (id) => {
    const cloneUserIdList = jsUtility.cloneDeep(remainderUserIdList);
    if (cloneUserIdList && cloneUserIdList.teams) {
      const reminderIndex = cloneUserIdList.teams.indexOf(id);
      cloneUserIdList.teams.splice(reminderIndex, 1);
      if (cloneUserIdList.teams.length === 0) {
        delete cloneUserIdList.teams;
      }
    }
    if (cloneUserIdList && cloneUserIdList.users) {
      const reminderIndex = cloneUserIdList.users.indexOf(id);
      cloneUserIdList.users.splice(reminderIndex, 1);
      if (cloneUserIdList.users.length === 0) {
        delete cloneUserIdList.users;
      }
    }
    return cloneUserIdList;
  };

  const removeTeamOrUserFromReminderUser = (id) => {
    if (remainderUserList && remainderUserList.teams) {
      if (jsUtility.find(remainderUserList.teams, { _id: id })) {
        jsUtility.remove(remainderUserList.teams, { _id: id });
        if (remainderUserList.teams.length === 0) {
          delete remainderUserList.teams;
        }
      }
    }
    if (remainderUserList && remainderUserList.users) {
      if (jsUtility.find(remainderUserList.users, { _id: id })) {
        jsUtility.remove(remainderUserList.users, { _id: id });
        if (remainderUserList.users.length === 0) {
          delete remainderUserList.users;
        }
      }
    }
    return remainderUserList;
  };

  const teamOrUserRemoveHandler = (id) => {
    const removed = removeTeamOrUserFromReminderUser(id);
    if (removed) {
      const sortedUsersOrTeamsList = jsUtility.union(
        removed.teams,
        removed.users,
      );
      sortedUsersOrTeamsList.sort((key, value) =>
        key?.email?.localeCompare(value?.email),
      );
      setUsersAndTeams(sortedUsersOrTeamsList);
    }
    setRemainderUserList(removed);
    const reminderUserTeamsId = removeReminderUserIdListHandler(id);
    setRemainderUserIdList(reminderUserTeamsId);
  };

  const setMemberOrTeamSearchValue = (event) => {
    setRemainderUserSearchText(event.target.value);

    if (!jsUtility.isEmpty(usersAndTeams)) {
      setIsUserOrTeamsError(false);
    }
  };

  const addMemberParams = {
    query_all_users: 0,
    is_team_included: 1,
    is_search_by_ids: 0,
  };
  if (type === INDIVIDUAL_ENTRY_TYPE.DATA_LIST) {
    addMemberParams.data_list_entry_id = instanceId;
    addMemberParams.data_list_uuid = moduleUuid;
  } else if (type === INDIVIDUAL_ENTRY_TYPE.FLOW) {
    addMemberParams.flow_instance_id = instanceId;
    addMemberParams.flow_uuid = moduleUuid;
  }

  const CONFIG_BUTTON_ARRAY = [
    {
      buttonText: ADD_REMAINDERS.BUTTONS.CANCEL,
      onButtonClick: () => onCloseClick(),
      buttonType: EButtonType.TERTIARY,
      buttonClassName: EMPTY_STRING,
    },
    {
      buttonText: ADD_REMAINDERS.BUTTONS.ADD,
      onButtonClick: () => onAddNewRemainderClicked(),
      buttonType: EButtonType.PRIMARY,
      buttonClassName: EMPTY_STRING,
    },
  ];

  return (
    <ConfigurationModal
      isModalOpen={isModalOpen}
      modalTitle={ADD_REMAINDERS.TITLE}
      onCloseClick={onCloseClick}
      tabOptions={[]}
      modalBodyContent={
        <>
          <div>
            {/* <div className={gClasses.MB10}>
            <span className={cx(styles.Header, gClasses.LabelStyle)}>
              {ADD_REMAINDERS.DATALIST}
            </span>
            <div className={cx(styles.Value)}>
              {datalistName}
            </div>
            </div> */}
            <div className={gClasses.MB10}>
              <span className={cx(styles.Header, gClasses.LabelStyle)}>
                {ADD_REMAINDERS.RECORD}
              </span>
              <div className={cx(styles.Value, gClasses.MB15)}>
                {reference_id
                  ? `${reference_id} | ${
                      custom_identifier || system_identifier
                    }`
                  : custom_identifier || system_identifier}
              </div>
            </div>
          </div>
          <div className={gClasses.MB15}>
            <div className={styles.MemberClass}>
              <AddMembers
                id={ADD_REMAINDERS.REMINDER_DATE_AND_TIME.ID}
                apiParams={addMemberParams}
                onUserSelectHandler={teamOrUserSelectHandler}
                selectedData={usersAndTeams}
                removeSelectedUser={teamOrUserRemoveHandler}
                errorText={
                  isUserOrTeamsError ? 'Reminder to is required' : null
                }
                selectedSuggestionData={usersAndTeams}
                memberSearchValue={remainderUserSearchText}
                setMemberSearchValue={setMemberOrTeamSearchValue}
                placeholder={ADD_REMAINDERS.REMINDER_USER_OR_TEAMS.PLACEHOLDER}
                label={ADD_REMAINDERS.REMINDER_USER_OR_TEAMS.LABEL}
                getUserSecurityByObject
                isRequired
                isDataLoading={addMemberLoading}
              />
            </div>
            <span className={cx(styles.Remainder, gClasses.MB5)} />
            <div
              className={cx(gClasses.DisplayFlex, gClasses.PositionRelative)}
            >
              <DateTimeWrapper
                id={ADD_REMAINDERS.REMINDER_DATE_AND_TIME.ID}
                label={ADD_REMAINDERS.REMINDER_DATE_AND_TIME.LABEL}
                enableTime
                date={scheduledDate}
                getDate={(selectedDate) => {
                  onChangeDate(selectedDate);
                }}
                validations={datePickerValidations}
                errorMessage={remainderErrorList?.scheduledDate}
                isRequired
              />
            </div>
            <div>
              <TextArea
                className={cx(styles.RemainderMessage, gClasses.MT10)}
                placeholder={ADD_REMAINDERS.REMINDER_MESSAGE.PLACEHOLDER}
                labelText={ADD_REMAINDERS.REMINDER_MESSAGE.LABEL}
                id={ADD_REMAINDERS.REMINDER_MESSAGE.ID}
                onChange={onChangeHandler}
                value={remainder_message}
                isRequired
                required
                errorMessage={
                  remainderErrorList
                    ? remainderErrorList[ADD_REMAINDERS.REMINDER_MESSAGE.ID]
                    : null
                }
              />
            </div>
          </div>
        </>
      }
      footerButton={CONFIG_BUTTON_ARRAY}
    />
  );
}

AddRemainders.propTypes = {
  isModalOpen: PropTypes.bool,
  onCloseClick: PropTypes.func,
  isRemainderListLoading: PropTypes.bool,
  metaData: PropTypes.object,
  // datalistName: PropTypes.string,
  type: PropTypes.string,
  dispatch: PropTypes.object,
};

export default AddRemainders;
