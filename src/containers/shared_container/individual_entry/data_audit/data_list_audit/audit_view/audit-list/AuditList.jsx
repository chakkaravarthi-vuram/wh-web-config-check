import React from 'react';
import cx from 'classnames/bind';
import { RESPONSE_TYPE } from 'utils/Constants';
import ResponseHandler from 'components/response_handlers/ResponseHandler';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { BS } from '../../../../../../../utils/UIConstants';
import AuditCard from './audit_card/AuditCard';
import styles from './AuditList.module.scss';
import gClasses from '../../../../../../../scss/Typography.module.scss';
import jsUtils from '../../../../../../../utils/jsUtility';
import { AUDIT_CARD_STRINGS } from '../AuditView.utils';

const ReactInfiniteScrollComponent =
  require('react-infinite-scroll-component').default;

function AuditList(props) {
  const {
    onDetailedViewClick,
    auditList,
    hasMore,
    onLoadMoreHandler,
    isIntialLoading,
    filterquerryLoading,
  } = props;
  const { t } = useTranslation();
  const getCardList = (list) => {
    const listItem = [];
    list.forEach((data) => {
      if (!jsUtils.isEmpty(data.editedfieds)) {
        listItem.push(
        <AuditCard
              onDetailedViewClick={onDetailedViewClick}
              auditDetails={data}
        />,
        );
      }
    });
    // const listItem = list.map((data) => (
    //   <AuditCard
    //     onDetailedViewClick={onDetailedViewClick}
    //     auditDetails={data}
    //   />
    // ));
    return listItem;
  };
  let listItem = [];
  if (isIntialLoading && filterquerryLoading) {
    listItem = Array(6)
      .fill()
      .map((eachCard, index) => <AuditCard isDataLoading key={index} />);
  } else {
    listItem = getCardList(auditList);
  }
  if ((!filterquerryLoading && !isIntialLoading) && jsUtils.isEmpty(listItem)) {
    return (
      <ResponseHandler
        className={gClasses.MT90}
        messageObject={{
          type: RESPONSE_TYPE.NO_DATA_FOUND,
          title: AUDIT_CARD_STRINGS(t).NO_DATA_TITLE,
          subTitle: AUDIT_CARD_STRINGS(t).NO_DATA_SUBTITLE,
        }}
      />
    );
  }
  return (
    <div
      className={cx(
        BS.D_FLEX,
        BS.FLEX_COLUMN,
        styles.CardListContainer,
        gClasses.MT27,
      )}
      id="audit-list-container"
    >
      <ReactInfiniteScrollComponent
        dataLength={auditList.length}
        next={onLoadMoreHandler}
        hasMore={hasMore}
        scrollableTarget="modal-content-view-datalist-modal"
        scrollThreshold={0.4}
        loader={Array(6)
          .fill()
          .map((eachCard, index) => (
            <AuditCard isDataLoading key={index} />
          ))}
      >
        {listItem}
      </ReactInfiniteScrollComponent>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    filterquerryLoading: state.DataListReducer.filterquerryLoading,
  };
};

export default connect(mapStateToProps, null)(AuditList);
