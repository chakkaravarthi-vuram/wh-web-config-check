import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { ARIA_LABELS } from 'containers/landing_page/LandingPage.strings';
import Radium from 'radium';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { LOADER_STRINGS } from 'utils/Constants';
import Tooltip from 'components/tooltip/Tooltip';
import FlowBigIcon from 'assets/icons/FlowBigIcon';
import { LANDING_PAGE_TOPICS } from 'containers/landing_page/main_header/common_header/CommonHeader.strings';
import { useTranslation } from 'react-i18next';
import styles from '../Flows.module.scss';

function FlowCard(props) {
  const {
    isLoaderCard,
    index,
    flow_uuid,
    flow_name,
    _id,
    onClick,
    isMoreCard,
    moreCardCount,
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
        // className={cx(
        //   styles.FlowCard,
        //   styles.MoreCard,
        //   // gClasses.CenterVH,
        //   gClasses.CursorPointer,
        // )}
        key="flowMoreCard"
        className={cx(styles.MoreCard, gClasses.FontWeight500)}
      >
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onClick(e)}
          onClick={onClick}
          className={cx(styles.ContentSpacing, BS.ALIGN_ITEM_CENTER, BS.D_FLEX, gClasses.CursorPointer)}
          aria-label={ARIA_LABELS.LOAD_MORE_FLOWS}
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
        id={`tool${_id}`}
        className={cx(BS.D_FLEX, styles.FlowCardContainer)}
      >
        <div
          className={cx(
            gClasses.CenterVH,
            gClasses.CursorPointer,
            styles.ContentSpacing,
            styles.Max200,
          )}
          data-uuid={flow_uuid}
          data-name={flow_name}
          data-id={_id}
          aria-hidden="true"
          role="button"
          tabIndex={0}
          onClick={onClick}
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onClick(e)}
          aria-label={`${flow_name} Flow`}
        >
          <div className={cx(styles.FlowIconContainer, gClasses.MR8, gClasses.CenterVH)}>
            <FlowBigIcon />
          </div>
          {/* <div
            className={cx(
              gClasses.CenterVH,
            )}
            aria-hidden="true"
          >
            <FlowBigIcon className={styles.Thumbnail} />
          </div> */}
          <div
            role="button"
            className={cx(
              gClasses.Ellipsis,
              gClasses.FTwo13,
              BS.TEXT_CENTER,
              gClasses.MT5,
              gClasses.TextTransformCap,
              gClasses.CursorPointer,
            )}
            data-uuid={flow_uuid}
            data-name={flow_name}
            data-id={_id}
            tabIndex={-1}
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onClick(e)}
            onClick={onClick}
          >
            {flow_name}
          </div>
        </div>
      </li>
      <Tooltip id={`tool${_id}`} content={flow_name} isCustomToolTip customInnerClasss={gClasses.TextTransformCap} />
    </>
  );
}

export default Radium(FlowCard);
