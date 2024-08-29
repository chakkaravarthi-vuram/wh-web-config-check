/* eslint-disable default-case */
import NoDataFound from 'containers/landing_page/no_data_found/NoDataFound';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { randomNumberInRange } from 'utils/generatorUtils';
import Skeleton from 'react-loading-skeleton';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import { BS } from 'utils/UIConstants';
import { useTranslation } from 'react-i18next';
import gClasses from '../../scss/Typography.module.scss';
import styles from './SearchTabResults.module.scss';
import {
  FLOW_DROPDOWN,
} from '../flow/listFlow/listFlow.strings';
import { DATA_LIST_DROPDOWN } from '../data_list/listDataList/listDataList.strings';
import jsUtils from '../../utils/jsUtility';

import {
  TAB_CONSTANT_ID,
  getFlowTabNoSearchDataText,
  getDataListTabNoSearchDataText,
} from './SearchTab.utils';

function SearchTabResults(props) {
  const {
    isSearchResultLoading,
    searchResultList,
    tab_index,
    onCardClick,
    setSearchValue,
    tab_id,
    isSearchTabOpen,
    searchText,
    initiateFlowFromList,
    addNewDataListEntry,
    onClick,
  } = props;
  const { t } = useTranslation();
  const [noDataFoundText, setNoDataFoundText] = useState('');
  const [searchTabName, setSearchTabName] = useState('');
  const [AllCategoryList, setAllCategoryList] = useState([]);

  useEffect(() => {
    if (tab_id) {
      if (tab_id === TAB_CONSTANT_ID.FLOW_LIST_TAB_ID) {
        if (!jsUtils.isEmpty(searchResultList) && (tab_index === FLOW_DROPDOWN.PUBLISHED_FLOW || tab_index === FLOW_DROPDOWN.UNDER_TESTING)) {
          const searchList = searchResultList.map((data) => data.flows);
          if (searchList) setAllCategoryList([].concat(...searchList));
        }
        setNoDataFoundText(getFlowTabNoSearchDataText(tab_index));
        setSearchTabName('FLOW');
      }
      if (tab_id === TAB_CONSTANT_ID.DATA_LIST_TAB_ID) {
        if (!jsUtils.isEmpty(searchResultList) && ((tab_index === DATA_LIST_DROPDOWN.ALL_DATA_LIST) || (tab_index === DATA_LIST_DROPDOWN.DATA_LIST_I_OWN))) {
          const searchList = searchResultList.map((data) => data.data_lists);
          if (searchList) setAllCategoryList([].concat(...searchList));
        }
        setNoDataFoundText(getDataListTabNoSearchDataText(t, tab_index));
        setSearchTabName('DATALIST');
      }
    }
    if (isEmpty(searchText)) setSearchValue('');
  }, [tab_index, searchResultList]);

  let listItems = null;

  if (isSearchResultLoading) {
    listItems = Array(4)
      .fill()
      .map(() => {
        const MAX_LENGTH = 250;
        const MIN_LENGTH = 100;
        const taskNameLength = `${randomNumberInRange(
          MIN_LENGTH,
          MAX_LENGTH,
        )}px`;
        const statusLoaderWidth = 110;
        const statusLoaderHeight = 23;
        const skeletonTaskName = <Skeleton width={taskNameLength} />;
        const statusView = (
          <Skeleton width={statusLoaderWidth} height={statusLoaderHeight} />
        );
        return (
          <div>
            <div className={cx(styles.CardContainer)}>
              {isSearchResultLoading ? (
                <Skeleton width={taskNameLength} />
              ) : (
                <div className={cx(styles.NameContainer)}>{skeletonTaskName}</div>
              )}

              <div className={cx(gClasses.CenterV, styles.StatusContainer)}>
                <div className={cx(gClasses.MR15, styles.Status)}>
                  {statusView}
                </div>
              </div>
            </div>
          </div>
        );
      });
  } else if (isEmpty(searchResultList)) {
    listItems = [
      <NoDataFound
        NoSearchFoundLabelStyles={styles.NoSearchFoundLabel}
        dataText={noDataFoundText}
      />,
    ];
  } else if (!isEmpty(searchResultList)) {
    if (tab_id === TAB_CONSTANT_ID.FLOW_LIST_TAB_ID) {
      if (tab_index === FLOW_DROPDOWN.PUBLISHED_FLOW || tab_index === FLOW_DROPDOWN.UNDER_TESTING) {
        listItems = AllCategoryList.map((flow) => {
          if (flow) {
            const onCardClickHandler = (event) => {
              if (event.target.tagName !== 'BUTTON') {
                setSearchValue('');
                onCardClick(flow.flow_uuid, false);
              }
            };
            const onStartClick = () => {
              initiateFlowFromList(flow.flow_uuid);
            };
            const startButton = (
              <div className={styles.PrimaryButtonDiv}>
                <Button
                  buttonType={BUTTON_TYPE.PRIMARY}
                  className={cx(BS.TEXT_NO_WRAP)}
                  primaryButtonStyle={cx(gClasses.FTwo11BlueV24, gClasses.FontWeight600, styles.PrimaryButton)}
                  onClick={onStartClick}
                >
                  START
                </Button>
              </div>
            );

            return (
              <div>
                <div
                  onClick={onCardClickHandler}
                  className={cx(styles.CardContainer)}
                  role="presentation"
                >
                  <div className={cx(styles.NameContainer, gClasses.TextTransformCap)}>{flow.flow_name}</div>

                  <div className={cx(gClasses.CenterV, styles.StatusContainer)}>
                    <div className={cx(flow.is_initiate ? gClasses.MR15 : gClasses.MR80, styles.Status)}>
                      Version
                      {flow.version}
                    </div>
                    {flow.is_initiate && startButton}
                  </div>
                </div>
              </div>
            );
          } else {
            if (AllCategoryList.length <= 1) {
              return (
                <NoDataFound
                  NoSearchFoundLabelStyles={styles.NoSearchFoundLabel}
                  dataText={noDataFoundText}
                />
              );
            } else {
              return null;
            }
          }
        });
      } else {
        listItems = searchResultList.map((data) => {
          if (data) {
            const onCardClickHandler = (event) => {
              if (event.target.tagName !== 'BUTTON') {
                setSearchValue('');
                if (tab_index === FLOW_DROPDOWN.DRAFT_FLOW) onCardClick(data._id, true);
              }
            };
            const onStartClick = () => {
              initiateFlowFromList(data.flow_uuid);
            };
            const startButton = (
              <div className={styles.PrimaryButtonDiv}>
                <Button
                  buttonType={BUTTON_TYPE.PRIMARY}
                  className={cx(BS.TEXT_NO_WRAP)}
                  primaryButtonStyle={cx(gClasses.FTwo11BlueV24, gClasses.FontWeight600, styles.PrimaryButton)}
                  onClick={onStartClick}
                >
                  START
                </Button>
              </div>
            );
            return (
              <div>
                <div
                  onClick={onCardClickHandler}
                  className={cx(styles.CardContainer)}
                  role="presentation"
                >
                  <div className={cx(styles.NameContainer, gClasses.TextTransformCap)}>{data.flow_name}</div>
                  <div className={cx(gClasses.CenterV, styles.StatusContainer)}>
                    <div className={cx(data.is_initiate ? gClasses.MR15 : gClasses.MR80, styles.Status)}>
                      Version
                      {data.version}
                    </div>
                    {data.is_initiate && startButton}
                  </div>
                </div>
              </div>
            );
          } else {
            return null;
          }
        });
      }
    }

    if (tab_id === TAB_CONSTANT_ID.DATA_LIST_TAB_ID) {
      if ((tab_index === DATA_LIST_DROPDOWN.ALL_DATA_LIST) || (tab_index === DATA_LIST_DROPDOWN.DATA_LIST_I_OWN)) {
        listItems = AllCategoryList.map((data_list) => {
          if (data_list) {
            const onCardClickHandler = (event) => {
              if (event.target.tagName !== 'BUTTON') {
                setSearchValue('');
                onCardClick(data_list.data_list_uuid, false);
              }
            };
            const onAddClick = () => {
              onClick(data_list.data_list_uuid, false);
              addNewDataListEntry(data_list.data_list_uuid);
            };
            const addButton = (
              <div className={styles.PrimaryButtonDiv}>
                <Button
                  buttonType={BUTTON_TYPE.PRIMARY}
                  className={cx(BS.TEXT_NO_WRAP)}
                  primaryButtonStyle={cx(gClasses.FTwo11BlueV24, gClasses.FontWeight600, styles.PrimaryButton)}
                  onClick={onAddClick}
                >
                  ADD
                </Button>
              </div>
            );
            return (
              <div>
                <div
                  onClick={onCardClickHandler}
                  className={cx(styles.CardContainer)}
                  role="presentation"
                >
                  <div className={cx(styles.NameContainer, gClasses.TextTransformCap)}>{data_list.data_list_name}</div>

                  <div className={cx(gClasses.CenterV, styles.StatusContainer)}>
                    <div className={cx(data_list.is_add_entry ? gClasses.MR15 : gClasses.MR80, styles.Status)}>
                      Version
                      {data_list.version}
                    </div>
                    {data_list.is_add_entry && addButton}
                  </div>
                </div>
              </div>
            );
          } else {
            if (AllCategoryList.length <= 1) {
              return (
                <NoDataFound
                  NoSearchFoundLabelStyles={styles.NoSearchFoundLabel}
                  dataText={noDataFoundText}
                />
              );
            } else {
              return null;
            }
          }
        });
      } else {
        listItems = searchResultList.map((data) => {
          if (data) {
            const onCardClickHandler = () => {
              onCardClick(data._id, true);
            };
            return (
              <div>
                <div
                  onClick={onCardClickHandler}
                  className={cx(styles.CardContainer)}
                  role="presentation"
                >
                  <div className={cx(styles.NameContainer, gClasses.TextTransformCap)}>{data.data_list_name}</div>

                  <div className={cx(gClasses.CenterV, styles.StatusContainer)}>
                    <div className={cx(gClasses.MR80, styles.Status)}>
                      Version
                      {data.version}
                    </div>
                  </div>
                </div>
              </div>
            );
          } else {
            return null;
          }
        });
      }
    }
  }
  return (
    <div>
      {isSearchTabOpen && (
        <div className={styles.SearchMainContainer}>
          <span>
            <p className={styles.Head}>{searchTabName}</p>
          </span>
          <div>{listItems}</div>
        </div>
      )}
    </div>
  );
}

export default SearchTabResults;
