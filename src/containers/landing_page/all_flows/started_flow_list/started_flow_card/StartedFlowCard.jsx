import React from 'react';
import cx from 'classnames/bind';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import styles from './StartedFlowCard.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';
import { BS } from '../../../../../utils/UIConstants';
import { getStatusBoxClasses, getStatusTextClasses, getStatusTitleString } from '../StartedFlowList.utils';
import { PICKER_STRINGS } from '../../../../../components/form_components/gradient_picker/GradientPicker.strings';
import Thumbnail, { THUMBNAIL_TYPE } from '../../../../../components/thumbnail/Thumbnail';
import { STARTED_FLOW_LIST_LOADER_COLOR_STRINGS } from '../StartedFlowList.strings';
import { nullCheck } from '../../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { parseDateFromUTC } from '../../../../../utils/dateUtils';

export default function StartedProcecureCard(props) {
  const {
    isDataLoading,
    flow_name,
    identifier,
    processed_on,
    initiated_on,
    status,
    flow_color,
    statusDisplayText,
    flow_uuid,
    flow_id,
    onClickHandler,
  } = props;

  const flowColor = isDataLoading
    ? PICKER_STRINGS.COLOR_LIST[0]
    : nullCheck(flow_color, 'hex_codes.0')
      ? flow_color
      : PICKER_STRINGS.COLOR_LIST[0];

  const statusBox = isDataLoading ? (
    <SkeletonTheme
      color={STARTED_FLOW_LIST_LOADER_COLOR_STRINGS.COLOR}
      highlightColor={STARTED_FLOW_LIST_LOADER_COLOR_STRINGS.HIGHLIGHT_COLOR}
    >
      <Skeleton height={24} width={90} style={{ borderRadius: '12px' }} />
    </SkeletonTheme>
  ) : (
    <div className={cx(styles.StatusBox, gClasses.CenterVH, !isDataLoading && getStatusBoxClasses(status))}>
      <div className={cx(gClasses.FOne11, !isDataLoading && getStatusTextClasses(status))}>{statusDisplayText}</div>
    </div>
  );

  const flowName = isDataLoading ? (
    <SkeletonTheme
      color={STARTED_FLOW_LIST_LOADER_COLOR_STRINGS.COLOR}
      highlightColor={STARTED_FLOW_LIST_LOADER_COLOR_STRINGS.HIGHLIGHT_COLOR}
    >
      <Skeleton width="75%" />
    </SkeletonTheme>
  ) : (
    <div className={cx(gClasses.FTwo13White, styles.TextOpacity, gClasses.Ellipsis)}>{flow_name}</div>
  );

  const flowIdentifier = isDataLoading ? (
    <SkeletonTheme
      color={STARTED_FLOW_LIST_LOADER_COLOR_STRINGS.COLOR}
      highlightColor={STARTED_FLOW_LIST_LOADER_COLOR_STRINGS.HIGHLIGHT_COLOR}
    >
      <Skeleton width="20%" height={10} />
    </SkeletonTheme>
  ) : (
    <div className={cx(gClasses.FOne11White, gClasses.MT5, styles.TextOpacity, gClasses.Ellipsis)}>{identifier}</div>
  );

  const date = isDataLoading ? (
    <div style={{ marginBottom: '-8px' }}>
      <SkeletonTheme
        color={STARTED_FLOW_LIST_LOADER_COLOR_STRINGS.COLOR}
        highlightColor={STARTED_FLOW_LIST_LOADER_COLOR_STRINGS.HIGHLIGHT_COLOR}
      >
        <Skeleton height={10} width={55} />
      </SkeletonTheme>
    </div>
  ) : (
    <div className={cx(gClasses.FOne11White, styles.TextOpacity)}>
      {nullCheck(initiated_on, 'pref_tz_datetime') ? parseDateFromUTC(initiated_on.pref_tz_datetime) : EMPTY_STRING}
    </div>
  );

  return (
    <div
      role="button"
      tabIndex={0}
      className={cx(styles.Container, gClasses.CursorPointer)}
      style={{ borderColor: flowColor.hex_codes[1] }}
      onClick={() => onClickHandler(flow_uuid, flow_name, flow_id)}
      onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onClickHandler(flow_uuid, flow_name, flow_id)}
    >
      <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
        <div className={cx(gClasses.CenterV, gClasses.Flex1, gClasses.OverflowHidden)}>
          <Thumbnail
            type={THUMBNAIL_TYPE.TYPE_3}
            textClassName={styles.ThumbnailTextOpacity}
            title={flow_name}
            background={flowColor}
            isLoading={isDataLoading}
          />
          <div className={cx(gClasses.ML15, gClasses.MR15, gClasses.OverflowHidden, gClasses.Flex1)}>
            {flowName}
            {flowIdentifier}
          </div>
        </div>
        <div className={cx(gClasses.CenterV)} title={!isDataLoading && getStatusTitleString(initiated_on, processed_on)}>
          {date}
          <div className={cx(gClasses.ML15)}>{statusBox}</div>
        </div>
      </div>
    </div>
  );
}
