import React from 'react';
import cx from 'classnames/bind';
import { RESPONSE_TYPE } from 'utils/Constants';
import ResponseHandler from 'components/response_handlers/ResponseHandler';
import { useTranslation } from 'react-i18next';
import { BS } from '../../../../../../../../utils/UIConstants';
import VersionCard from './version_card/VersionCard';
import styles from './VersionList.module.scss';
import gClasses from '../../../../../../../../scss/Typography.module.scss';
import jsUtils from '../../../../../../../../utils/jsUtility';
import { AUDIT_CARD_STRINGS } from '../VersionView.utils';

const ReactInfiniteScrollComponent =
  require('react-infinite-scroll-component').default;

function AuditList(props) {
  const {
    onDetailedViewClick,
    versionHistory,
    hasMore,
    onLoadMoreHandler,
    isIntialLoading,
  } = props;
  console.log('AuditListprops', props);
  const { t } = useTranslation();
  const getCardList = (list) => {
    const listItem = [];
    list?.forEach((data) => {
        listItem.push(
        <VersionCard
              onDetailedViewClick={onDetailedViewClick}
              auditDetails={data}
        />,
        );
    });
    return listItem;
  };
  let listItem = [];
  if (isIntialLoading) {
    listItem = Array(6)
      .fill()
      .map((eachCard, index) => <VersionCard isDataLoading key={index} />);
  } else {
    listItem = getCardList(versionHistory);
  }
  if ((!isIntialLoading) && jsUtils.isEmpty(listItem)) {
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
        dataLength={versionHistory.length}
        next={onLoadMoreHandler}
        hasMore={hasMore}
        scrollableTarget="modal-content-view-datalist-modal"
        scrollThreshold={0.4}
        loader={Array(6)
          .fill()
          .map((eachCard, index) => (
            <VersionCard isIntialLoading key={index} />
          ))}
      >
        {listItem}
      </ReactInfiniteScrollComponent>
    </div>
  );
}

export default AuditList;
