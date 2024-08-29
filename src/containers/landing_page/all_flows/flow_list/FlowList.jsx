import React from 'react';
import PropTypes from 'prop-types';
import FlowCard from '../flow_card/FlowCard';
import styles from './FlowList.module.scss';

function FlowList(props) {
  const {
    flowList,
    total_count,
    onClick,
    onMoreClick,
    isDataLoading,
    dataLength,
    searchText,
  } = props;
  const remaining_count = Math.max(flowList.length === 0 ? 0 : total_count - flowList.length, 0);
  let moreCard = null;
  let flowCardList = null;
  flowCardList = flowList.map((flow, index) => (
    <FlowCard
      firstName={flow.flow_name.split(' ')[0]}
      lastName={flow.flow_name.split(' ')[1]}
      flow_uuid={flow.flow_uuid}
      flow_name={flow.flow_name}
      flow_color={flow.flow_color}
      flow_id={flow._id}
      onClick={onClick}
      key={`flow_card_${index}`}
    />
  ));
  let loader = null;
  if (isDataLoading) {
    let loaderCount = dataLength < remaining_count ? dataLength : remaining_count;
    loaderCount = loaderCount === 0 ? dataLength : loaderCount;
    loader = Array(searchText.length ? dataLength : loaderCount)
      .fill()
      .map((iterator, index) => (
        <FlowCard isDataLoading key={`flow_card_loader_${index}`} />
      ));
  } else {
    moreCard =
      remaining_count > 0 ? (
        <FlowCard isMoreCard remaining_count={remaining_count} onMoreClick={onMoreClick} />
      ) : null;
  }
  if (isDataLoading && remaining_count > 0) {
    flowCardList.push(loader);
  } else flowCardList = loader || flowCardList;
  return (
    <div className={styles.Grid}>
      {flowCardList}
      {moreCard}
    </div>
  );
}

export default FlowList;

FlowList.propTypes = {
  flowList: PropTypes.arrayOf(PropTypes.any),
  total_count: PropTypes.number,
  onMoreClick: PropTypes.func,
  isDataLoading: PropTypes.bool,
  dataLength: PropTypes.number,
  hasMore: PropTypes.bool,
};
FlowList.defaultProps = {
  flowList: [],
  total_count: 0,
  onMoreClick: null,
  isDataLoading: false,
  dataLength: 12,
  hasMore: false,
};
