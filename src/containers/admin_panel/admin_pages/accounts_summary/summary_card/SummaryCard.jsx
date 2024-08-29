import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import Skeleton from 'react-loading-skeleton';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import { BS, SKELETON_LOADER_DIMENSION_CONSTANTS } from 'utils/UIConstants';
import { useTranslation } from 'react-i18next';
import CustomGranularity from './custom_granularity/CustomGranularity';
import styles from './SummaryCard.module.scss';
import ADMIN_ACCOUNTS_SUMMARY_STRINGS from '../AccountsSummary.strings';

function SummaryCard(props) {
  const {
    isLoading,
    isData,
    title,
    children,
    hideRightDropDown,
    ddIdGranularity,
    ddSelectedValueGranularity,
    ddOnChangeGranularity,
  } = props;

  const { t } = useTranslation();

  const elementNoData = (
    <div
      className={cx(
        BS.W100,
        BS.H100,
        gClasses.CenterVH,
        gClasses.FTwo36GrayV1,
        styles.NoData,
      )}
    >
      No Data
    </div>
  );

  const elementLoading = (
    <div className={gClasses.MT20}>
      <Skeleton width={SKELETON_LOADER_DIMENSION_CONSTANTS.PERCENTAGE100} />
      <Skeleton width={SKELETON_LOADER_DIMENSION_CONSTANTS.PERCENTAGE50} />
      <Skeleton width={SKELETON_LOADER_DIMENSION_CONSTANTS.PERCENTAGE100} />
      <Skeleton width={SKELETON_LOADER_DIMENSION_CONSTANTS.PERCENTAGE50} />
      <Skeleton width={SKELETON_LOADER_DIMENSION_CONSTANTS.PERCENTAGE100} />
      <Skeleton width={SKELETON_LOADER_DIMENSION_CONSTANTS.PERCENTAGE50} />
      <Skeleton width={SKELETON_LOADER_DIMENSION_CONSTANTS.PERCENTAGE100} />
      <Skeleton width={SKELETON_LOADER_DIMENSION_CONSTANTS.PERCENTAGE50} />
      <Skeleton width={SKELETON_LOADER_DIMENSION_CONSTANTS.PERCENTAGE100} />
    </div>
  );

  const optionListGranularity =
    ADMIN_ACCOUNTS_SUMMARY_STRINGS.GRANULARITY.OPTION_LIST(
      <CustomGranularity {...props} />,
      t,
    );

  return (
    <div className={cx(styles.Container, gClasses.PY30, gClasses.PX30)}>
      <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
        <h3>
          {!isLoading ? (
            title
          ) : (
            <Skeleton width={SKELETON_LOADER_DIMENSION_CONSTANTS.PX150} />
          )}
        </h3>
        <div className={cx(BS.D_FLEX)}>
          {!hideRightDropDown && (
            <Dropdown
              id={ddIdGranularity}
              className={styles.DDWidthGranularity}
              hideMessage
              hideLabel
              optionList={optionListGranularity}
              selectedValue={ddSelectedValueGranularity || null}
              onChange={(event) => ddOnChangeGranularity(event)}
              isDataLoading={isLoading}
              isElementOption
              isForceDropDownClose={isLoading}
              fixedPopperStrategy
              popperClasses={cx(styles.DDWidthGranularity, gClasses.ZIndex2)}
            />
          )}
        </div>
      </div>
      {!isLoading ? (
        isData ? (
          <div className={cx(gClasses.MT15, BS.H100)}>{children}</div>
        ) : (
          elementNoData
        )
      ) : (
        elementLoading
      )}
    </div>
  );
}

export default SummaryCard;
