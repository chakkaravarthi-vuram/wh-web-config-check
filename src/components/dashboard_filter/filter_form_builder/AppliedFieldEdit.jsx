import React, { useRef } from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  Popper,
  EPopperPlacements,
  Button,
  EButtonType,
} from '@workhall-pvt-lmt/wh-ui-library';
import { BS } from '../../../utils/UIConstants';
import gClasses from '../../../scss/Typography.module.scss';
import styles from '../Filter.module.scss';
import FILTER_STRINGS from '../Filter.strings';
import { useClickOutsideDetectorForFilters } from '../../../utils/UtilityFunctions';

function AppliedFieldEdit(props) {
  const {
    isAppliedFieldEdit,
    isApplied,
    children,
    onClickApply,
    onBlurClickHandler,
  } = props;
  const { t } = useTranslation();
  const { BUTTONS } = FILTER_STRINGS(t);
  const popperContentRef = useRef();

  useClickOutsideDetectorForFilters(popperContentRef, onBlurClickHandler);

  return isAppliedFieldEdit && isApplied ? (
    <Popper
      className={cx(gClasses.ZIndex1, gClasses.MT40, BS.D_FLEX, BS.P_ABSOLUTE)}
      open={isApplied}
      placement={EPopperPlacements.BOTTOM_START}
      content={
        <div className={cx(styles.FieldsContainer)} ref={popperContentRef}>
          <div
            className={cx(
              gClasses.PT12,
              gClasses.PL12,
              gClasses.PR12,
              styles.FieldContent,
            )}
          >
            {children}
          </div>
          <div
            className={cx(
              BS.D_FLEX,
              BS.JC_END,
              styles.AppliedFieldEditButtonContainer,
              BS.W100,
            )}
          >
            <div className={gClasses.CenterV}>
              <Button
                type={EButtonType.TERTIARY}
                onClickHandler={() => onBlurClickHandler()}
                buttonText={FILTER_STRINGS(t).ADD_FILTER_BUTTONS.DISCARD}
              />
              <Button
                type={EButtonType.PRIMARY}
                className={cx(BS.TEXT_NO_WRAP)}
                onClickHandler={() => onClickApply()}
                buttonText={BUTTONS.APPLY}
              />
            </div>
          </div>
        </div>
      }
    />
  ) : (
    children
  );
}

AppliedFieldEdit.propTypes = {
  isAppliedFieldEdit: PropTypes.bool,
  isApplied: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]),
  onClickApply: PropTypes.func,
  onBlurClickHandler: PropTypes.func,
};

export default AppliedFieldEdit;
