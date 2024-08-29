import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import styles from './UserOrTeamToolTip.module.scss';
import CustomUserInfoTooltip from './custom_userinfo_tooltip/CustomUserInfoTooltip';
import gClasses from '../../../scss/Typography.module.scss';
import ConditionalWrapper from '../../conditional_wrapper/ConditionalWrapper';
import AutoPositioningPopper, {
  POPPER_PLACEMENTS,
} from '../../auto_positioning_popper/AutoPositioningPopper';

function UserOrTeamToolTip(props) {
  const {
    id,
    userOrTeam,
    children,
    popperPlacement,
    fallbackPlacements,
    isPopoverCloseDelayRequired,
    isTabelView,
    className,
    user_type,
    isCustomInnerClass,
    hideTask = false,
  } = props;
  console.log('is_system_adminuser_type', user_type);
  const [isPopperOpen, setIsPopperOpen] = useState(false);
  const [referencePopperElement, setReferencePopperElement] = useState(null);
  let timer = null;
  const onToggleOpen = () => {
    if (!isPopoverCloseDelayRequired) {
      if (!isPopperOpen) {
        timer = setTimeout(() => {
          setIsPopperOpen(true);
        }, 200);
      }
    } else {
      !isPopperOpen && setIsPopperOpen(true);
    }
  };

  const onToggleClose = () => {
    !isPopoverCloseDelayRequired
      ? setTimeout(() => {
          setIsPopperOpen(false);
        }, 200)
      : setIsPopperOpen(false);
  };

  const PopperComponent = (
    <ConditionalWrapper
      condition={isPopperOpen}
      wrapper={(children) => (
        <AutoPositioningPopper
          referenceElement={referencePopperElement}
          placement={popperPlacement}
          fallbackPlacements={fallbackPlacements}
          className={gClasses.ZIndex7}
          isPopperOpen={isPopperOpen}
          fixedStrategy
        >
          {children}
        </AutoPositioningPopper>
      )}
    >
      <div>
        {isPopperOpen && (
          <CustomUserInfoTooltip id={id} userOrTeam={userOrTeam} user_type={user_type} isCustomInnerClass={isCustomInnerClass} hideTask={hideTask} />
        )}
      </div>
    </ConditionalWrapper>
  );

  return (
    <div
      className={cx(isTabelView && styles.Container, className)}
      onMouseEnter={onToggleOpen}
      onMouseLeave={() => {
        onToggleClose();
        clearTimeout(timer);
      }}
      ref={setReferencePopperElement}
    >
      {children}
      {PopperComponent}
    </div>
  );
}

UserOrTeamToolTip.defaultProps = {
  isPopperOpen: false,
  popperPlacement: POPPER_PLACEMENTS.AUTO,
  isPopoverCloseDelayRequired: false,
  isTabelView: false,
  id: EMPTY_STRING,
  userOrTeam: EMPTY_STRING,
  user_type: EMPTY_STRING,
  isCustomInnerClass: false,
};

UserOrTeamToolTip.propTypes = {
  isPopperOpen: PropTypes.bool,
  id: PropTypes.string,
  userOrTeam: PropTypes.string,
  popperPlacement: PropTypes.string,
  isPopoverCloseDelayRequired: PropTypes.bool,
  isTabelView: PropTypes.bool,
  user_type: PropTypes.string,
  isCustomInnerClass: PropTypes.bool,
};
export default UserOrTeamToolTip;
