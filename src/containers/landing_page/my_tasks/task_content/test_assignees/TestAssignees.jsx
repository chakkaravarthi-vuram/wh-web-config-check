import React, { lazy } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import Skeleton from 'react-loading-skeleton';
import {
  AVATAR_GROUP_TYPE,
} from 'components/avatar_group/AvatarGroup';
import gClasses from 'scss/Typography.module.scss';
import jsUtils from 'utils/jsUtility';
import {
  memberTeamSearchValueChange,
  setSelectedAssigneeData,
  taskContentDataChange,
} from 'redux/actions/TaskActions';
import { useTranslation } from 'react-i18next';
import {
  TEST_FLOW_ASSIGNEES,
  TEST_ASSIGNEES_INPUT,
} from './TestAssignees.strings';
import styles from './TestAssignees.module.scss';
import { getUserImagesForAvatar } from '../../../../../utils/UtilityFunctions';

// lazy imports
const AddMembers = lazy(() => import('components/member_list/add_members/AddMembers'));
const AvatarGroup = lazy(() => import('components/avatar_group/AvatarGroup'));

function TestAssignees(props) {
  const {
    isLoading,
    member_team_search_value,
    memberTeamSearchValueChange,
    selectedTestAssignee,
    setSelectedAssigneeData,
    taskAssignees = {},
    taskId,
    test_bed_error_list,
    setState,
    document_url_details,
  } = props;
  const { t } = useTranslation();
  const handleAddMemberSelect = (value) => {
    console.log('chcekc events', value);
    setSelectedAssigneeData(value);
  };

  const handleAddMemberRemove = () => {
    setSelectedAssigneeData({});
  };

  const handleAddMemberChange = (event) => {
    if (!jsUtils.isEmpty(test_bed_error_list)) {
      setState({
        test_bed_error_list: {},
      });
    }
    memberTeamSearchValueChange(event.target.value);
  };

  return (
    <div className={cx(styles.TestAssigneeContainer)}>
      {/* {isLoading ? (
        <Skeleton width={25} />
      ) : (
        <div className={cx(gClasses.PB5, gClasses.SectionSubTitle)}>
          {TEST_FLOW_ASSIGNEES.TEST_ASSIGNEES.TITLE}
        </div>
      )} */}
      {isLoading ? (
        <Skeleton width={25} />
      ) : (
        <AvatarGroup
          isDataLoading={false}
          type={AVATAR_GROUP_TYPE.TYPE_2}
          className={cx(gClasses.PB15, gClasses.MT3)}
          userImages={getUserImagesForAvatar(
            taskAssignees.users,
            taskAssignees.teams,
            document_url_details,
          )}
          isToolTipRequired={false}
        />
      )}
      {isLoading ? (
        <Skeleton width={25} />
      ) : (
        <AddMembers
          id={TEST_ASSIGNEES_INPUT.ID}
          label={t(TEST_FLOW_ASSIGNEES.TEST_ASSIGNEES.LABEL)}
          onUserSelectHandler={(event) => {
            const { value } = event.target;
            handleAddMemberSelect(value);
          }}
          selectedData={
            !jsUtils.isEmpty(selectedTestAssignee.email)
              ? [selectedTestAssignee]
              : []
          }
          removeSelectedUser={handleAddMemberRemove}
          errorText={
            test_bed_error_list.complete_as_user &&
            t(TEST_ASSIGNEES_INPUT.ERROR_TEXT)
          }
          selectedSuggestionData={[]}
          memberSearchValue={member_team_search_value}
          setMemberSearchValue={handleAddMemberChange}
          placeholder={t(TEST_ASSIGNEES_INPUT.PLACEHOLDER)}
          isRequired
          isActive
          suggestionData={
            {
              // assigneeSuggestionList,
              // isAssigneeSuggestionLoading,
            }
          }
          className={styles.AddMemberContainerWidth}
          innerClassName={gClasses.WhiteBackground}
          // popperFixedStrategy
          // popperClassName={styles.AddDropdown}
          apiParams={{
            id: taskId,
          }}
          getTestBedAssignees
          allowOnlySingleSelection
        />
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    member_team_search_value: state.TaskContentReducer.member_team_search_value,
    selectedTestAssignee: state.TaskContentReducer.selectedTestAssignee,
    test_bed_error_list: state.TaskContentReducer.test_bed_error_list,
    document_url_details: state.TaskContentReducer.document_url_details,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    memberTeamSearchValueChange: (searchValue) => {
      dispatch(memberTeamSearchValueChange(searchValue));
    },
    setSelectedAssigneeData: (assigneeData) => {
      dispatch(setSelectedAssigneeData(assigneeData));
    },
    setState: (value) => dispatch(taskContentDataChange(value)),
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TestAssignees);
