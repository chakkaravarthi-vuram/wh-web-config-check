import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { LOADER_STRINGS } from 'utils/Constants';
import { BS } from 'utils/UIConstants';
import Tooltip from 'components/tooltip/Tooltip';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { ARIA_LABELS } from 'containers/landing_page/LandingPage.strings';
import DatalistMiniIcon from 'assets/icons/DatalistMiniIcon';
import { LANDING_PAGE_TOPICS } from 'containers/landing_page/main_header/common_header/CommonHeader.strings';
import { useTranslation } from 'react-i18next';
import styles from '../DataLists.module.scss';

function DataListCard(props) {
  const {
    isLoaderCard,
    isMoreCard,
    moreCardCount,
    index,
    data_list_name,
    onClick,
    id,
  } = props;
  const { t } = useTranslation();
  if (isLoaderCard) {
    return (
      <div key={index}>
        <SkeletonTheme
          color={LOADER_STRINGS.COLOR}
          highlightColor={LOADER_STRINGS.HIGHLIGHT_COLOR}
        >
          <Skeleton
            className={cx(gClasses.ML10)}
            height={44}
            width={130}
            style={{ borderRadius: '9px' }}
          />
        </SkeletonTheme>
      </div>
    );
  }

  if (isMoreCard) {
    return (
      <li
        key="dataListMoreCard"
        className={cx(
          styles.MoreCard,
          gClasses.FontWeight500,
        )}
      >
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onClick(e)}
          onClick={onClick}
          className={cx(styles.ContentSpacing, BS.ALIGN_ITEM_CENTER, BS.D_FLEX)}
          aria-label={ARIA_LABELS.LOAD_MORE_DATALISTS}
        >
          {`+${moreCardCount} ${t(LANDING_PAGE_TOPICS.MORE)}`}
        </div>
      </li>
    );
  }

  return (
    <>
      <li
        key={index}
        id={`tool${id}`}
      >
        <div className={cx(gClasses.CenterV, styles.ContentSpacing)} role="button" tabIndex={0} onClick={onClick} onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onClick(e)} aria-label={`${data_list_name} Datalist`}>
        <div className={cx(styles.DataListIconContainer, gClasses.MR8, gClasses.CenterVH)}>
          <DatalistMiniIcon className={styles.DatalistIcon} />
        </div>
          <div
            className={cx(
              gClasses.Flex1,
              gClasses.FTwo13,
              gClasses.Ellipsis,
              gClasses.TextTransformCap,
            )}
          >
            {data_list_name}
          </div>
        </div>
      </li>
      <Tooltip id={`tool${id}`} content={data_list_name} isCustomToolTip customInnerClasss={gClasses.TextTransformCap} />
    </>
  );
}

export default DataListCard;
