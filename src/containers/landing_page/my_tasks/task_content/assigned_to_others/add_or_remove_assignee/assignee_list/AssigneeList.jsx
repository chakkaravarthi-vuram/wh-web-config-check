import React from 'react';
import Skeleton from 'react-loading-skeleton';
import UserCard, {
  USER_CARD_TYPES,
} from '../../../../../../../components/user_card/UserCard';
import PaginatedList from '../../../../../../../components/paginated_list/PaginatedList';
import gClasses from '../../../../../../../scss/Typography.module.scss';

function AssigneeList(props) {
  const { isDataLoading, list = [], onDeleteAssigneeHandler, itemsCountPerPage, className } = props;
  const assigneeCards = list.map((eachAssignee) => (
    <UserCard
      className={gClasses.MT10}
      type={USER_CARD_TYPES.TYPE_2}
      id={eachAssignee._id}
      firstName={eachAssignee.first_name || eachAssignee.email || eachAssignee.name}
      lastName={eachAssignee.last_name || ''}
      email={eachAssignee.email}
      onDeleteClickHandler={onDeleteAssigneeHandler}
      src={eachAssignee.profile_pic}
    />
  ));
  return (
    <PaginatedList
      className={className}
      list={assigneeCards}
      isDataLoading={isDataLoading}
      loaderElement={<Skeleton className={gClasses.MT10} height={34} />}
      loaderCount={itemsCountPerPage}
      disablePagination
    />
  );
}

export default AssigneeList;
