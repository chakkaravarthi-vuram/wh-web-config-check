import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import styles from './RemainingUsersTooltip.module.scss';
import gClasses from '../../../scss/Typography.module.scss';
import ConditionalWrapper from '../../conditional_wrapper/ConditionalWrapper';
import AutoPositioningPopper, {
  POPPER_PLACEMENTS,
} from '../../auto_positioning_popper/AutoPositioningPopper';
import CustomRemainingUsersTooltip from './customRemainingUsersTooltip/CustomRemainingUsersTooltip';

function RemainingUsersTooltip(props) {
  const {
    id,
    userOrTeam,
    children,
    popperPlacement,
    isPopoverCloseDelayRequired,
    isTabelView,
    className,
    user_type,
    isCustomInnerClass,
    remainingUsers,
    isText,
    userListClassName,
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
          <CustomRemainingUsersTooltip
            isText={isText}
            remainingUsers={remainingUsers}
            id={id}
            userOrTeam={userOrTeam}
            user_type={user_type}
            isCustomInnerClass={isCustomInnerClass}
            userListClassName={userListClassName}
          />
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

RemainingUsersTooltip.defaultProps = {
  isPopperOpen: false,
  popperPlacement: POPPER_PLACEMENTS.AUTO,
  isPopoverCloseDelayRequired: false,
  isTabelView: false,
  id: EMPTY_STRING,
  userOrTeam: EMPTY_STRING,
  user_type: EMPTY_STRING,
  isCustomInnerClass: false,
};

RemainingUsersTooltip.propTypes = {
  isPopperOpen: PropTypes.bool,
  id: PropTypes.string,
  userOrTeam: PropTypes.string,
  popperPlacement: PropTypes.string,
  isPopoverCloseDelayRequired: PropTypes.bool,
  isTabelView: PropTypes.bool,
  user_type: PropTypes.string,
  isCustomInnerClass: PropTypes.bool,
};
export default RemainingUsersTooltip;
