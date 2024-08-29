import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import styles from './member_card/MemberCard.module.scss';
import MemberCard from './member_card/MemberCard';
import UserManagementListContentLoader from '../content_loaders/admin_settings_content_loaders/UserManagementListContentLoader';
import ResponseHandler from '../response_handlers/ResponseHandler';

import { MEMBER_CARD_TYPE } from './member_card/MemberCard.strings';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import gClasses from '../../scss/Typography.module.scss';
import HeaderDownArrow from '../../assets/icons/HeaderDownArrow';
import HeaderUpArrow from '../../assets/icons/HeaderUpArrow';

function MemberList(props) {
  const {
    memberList,
    onActivateOrDeactivateClick,
    onDropdownChange,
    type,
    placeholder,
    isDataLoading,
    messageObject,
    emptyListClassName,
    className,
    teamDetails,
    isTeamComponent,
    customMemberListContainer,
    onSortHandler,
    isAscending,
  } = props;
  let memberListView = null;
  if (memberList && memberList.length > 0) {
    memberListView = memberList.map((memberDetails, index) => (
      <MemberCard
        onActivateOrDeactivateClick={onActivateOrDeactivateClick}
        onDropdownChange={onDropdownChange}
        memberDetails={memberDetails}
        type={type}
        placeholder={placeholder}
        teamDetails={teamDetails}
        key={index}
        isTeamComponent={isTeamComponent}
        customMemberListContainer={customMemberListContainer}
      />
    ));
  } else if (isDataLoading) {
    return <UserManagementListContentLoader count={10} />;
  } else if (messageObject) {
    return <ResponseHandler className={emptyListClassName} messageObject={messageObject} />;
  }
  return (
    <>
      <div className={styles.TableHeader}>
          <div
            className={gClasses.CursorPointer}
            onClick={() => {
              onSortHandler('name', isAscending ? 'desc' : 'asc');
            }}
            onKeyDown={() => {}}
            role="button"
            tabIndex="0"
          >
            <span className={cx(gClasses.ML5, styles.Arrow)}>{isAscending ? <HeaderUpArrow /> : <HeaderDownArrow />}</span>
          </div>
      </div>
      <ul className={className}>
        {memberListView}
      </ul>
    </>
  );
}
// }
export default MemberList;

MemberList.defaultProps = {
  placeholder: EMPTY_STRING,
  isDataLoading: false,
  messageObject: {},
  emptyListClassName: EMPTY_STRING,
  className: EMPTY_STRING,
  teamDetails: {},
  onDropdownChange: null,
};
MemberList.propTypes = {
  memberList: PropTypes.arrayOf(PropTypes.any).isRequired,
  onActivateOrDeactivateClick: PropTypes.func.isRequired,
  onDropdownChange: PropTypes.func,
  type: PropTypes.number.isRequired,
  placeholder: PropTypes.string,
  isDataLoading: PropTypes.bool,
  messageObject: PropTypes.objectOf(PropTypes.any),
  emptyListClassName: PropTypes.string,
  className: PropTypes.string,
  teamDetails: PropTypes.objectOf(PropTypes.any),
};
export { MEMBER_CARD_TYPE };
