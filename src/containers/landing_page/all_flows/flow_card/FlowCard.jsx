import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import styles from './FlowCard.module.scss';
import gClasses from '../../../../scss/Typography.module.scss';
import { BS } from '../../../../utils/UIConstants';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { ALL_FLOWS_STRINGS } from '../../LandingPage.strings';
import { LOADER_STRINGS } from './FlowCard.strings';

function FlowCard(props) {
  const {
    firstName,
    lastName,
    isMoreCard,
    flow_uuid,
    flow_name,
    flow_color,
    remaining_count,
    onMoreClick,
    onClick,
    isDataLoading,
    flow_id,
  } = props;

  let firstInitial = null;
  let lastInitial = null;
  let displayText = null;
  let cardComponent = null;
  let flowName = null;

  const getGradientValue = (colorObj) => {
    if (colorObj && Object.prototype.hasOwnProperty.call(colorObj, 'method')) { return `${colorObj.method}(${colorObj.degree}deg,${colorObj.hex_codes[0]} ,${colorObj.hex_codes[1]})`; } else return `linear-gradient(135deg,${colorObj})`;
  };

  const getOutlineColor = (colorObj) => {
    if (colorObj && Object.prototype.hasOwnProperty.call(colorObj, 'hex_codes')) return colorObj.hex_codes[1];
    else return colorObj;
  };

  if (isDataLoading) {
    cardComponent = (
      <SkeletonTheme color={LOADER_STRINGS.COLOR} highlightColor={LOADER_STRINGS.HIGHLIGHT_COLOR}>
        <Skeleton
          height={ALL_FLOWS_STRINGS.FLOW_CARD_HEIGHT}
          width={ALL_FLOWS_STRINGS.FLOW_CARD_WIDTH}
        />
      </SkeletonTheme>
    );
    flowName = LOADER_STRINGS.LABEL;
  } else {
    if (isMoreCard) {
      displayText = remaining_count;
    } else {
      firstInitial = firstName ? firstName.toString()[0].toUpperCase() : EMPTY_STRING;
      lastInitial = lastName ? lastName.toString()[0].toUpperCase() : EMPTY_STRING;
      displayText = firstInitial + lastInitial;
    }
    flowName = flow_name;
    cardComponent = <span className={cx(gClasses.FTwo24White, gClasses.FontWeight600)}>{displayText}</span>;
  }

  const bgImage = getGradientValue(flow_color);
  const outlineColor = getOutlineColor(flow_color);

  return (
    <button
      className={cx(styles.Container, gClasses.ClickableElement, gClasses.CursorPointer)}
      data-uuid={flow_uuid}
      data-name={flow_name}
      data-id={flow_id}
      onClick={onClick || onMoreClick}
    >
      <div className={cx(gClasses.CenterVH, styles.Outline)} style={{ borderColor: outlineColor }}>
        <div
          className={cx(gClasses.CenterVH, styles.FlowCard, gClasses.CursorPointer, BS.P_RELATIVE)}
          style={{ background: !isDataLoading && bgImage }}
        >
          {cardComponent}
        </div>
      </div>
      <div
        className={cx(
          gClasses.TwoLineEllipsis,
          gClasses.FTwo13White,
          gClasses.FontWeight500,
          styles.FlowName,
          BS.TEXT_CENTER,
          gClasses.MT5,
        )}
      >
        {flowName}
      </div>
    </button>
  );
}

export default FlowCard;

FlowCard.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  isMoreCard: PropTypes.bool,
  remaining_count: PropTypes.number,
  onMoreClick: PropTypes.func,
  onClick: PropTypes.func,
  isDataLoading: PropTypes.bool,
};
FlowCard.defaultProps = {
  firstName: EMPTY_STRING,
  lastName: EMPTY_STRING,
  isMoreCard: false,
  remaining_count: 0,
  onMoreClick: null,
  onClick: null,
  isDataLoading: false,
};
