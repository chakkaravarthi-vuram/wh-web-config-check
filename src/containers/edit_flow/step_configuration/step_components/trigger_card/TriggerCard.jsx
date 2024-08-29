import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { isEmpty, isNull } from 'utils/jsUtility';
import EditIconV2 from 'assets/icons/form_fields/EditIconV2';
import styles from './TriggerCard.module.scss';
import Trash from '../../../../../assets/icons/application/Trash';
// import Tooltip from 'components/tooltip/Tooltip';

function TriggerCard(props) {
  const {
    title,
    subTitle1,
    subTitle2,
    iconElm,
    secondaryIconElm,
    onEditClick,
    onDeleteClick,
    editLabel,
    deleteLabel,
    triggerServerError = EMPTY_STRING,
    triggerIndex,
  } = props;
  const triggerId = `${title}-${triggerIndex}`;
  console.log('check tooltip id',
  triggerServerError,
  document.getElementById(triggerId),
  !isEmpty(triggerServerError) && !isEmpty(title) && !isNull(document.getElementById(triggerId)));
  return (
    <>
      <div id={triggerId} className={cx(styles.CardContainer, gClasses.MB8, !isEmpty(triggerServerError) && styles.ErrorCard)}>
        <div className={BS.D_FLEX}>
          <div className={cx(styles.IconContainer, gClasses.MR10, gClasses.MT6)}>
            {iconElm}
          </div>
          <div>
            <span className={cx(styles.Title, gClasses.Ellipsis)} title={title}>{title}</span>
            <div className={BS.D_FLEX}>
              <div
                className={cx(
                  styles.SubTitle1,
                  BS.P_RELATIVE,
                  BS.D_FLEX,
                  BS.ALIGN_ITEM_CENTER,
                  gClasses.MR8,
                  gClasses.PR8,
                )}
              >
                {secondaryIconElm}
                <span className={cx(gClasses.ML4, gClasses.Ellipsis)} title={subTitle1}>{subTitle1}</span>
                <div className={styles.BorderLine} />
              </div>
              <span className={cx(styles.SubTitle2, gClasses.Ellipsis)} title={subTitle2}>{subTitle2}</span>
            </div>
          </div>
        </div>
        <div className={cx(styles.ActionIconContainer, gClasses.MR10)}>
          <button
            className={cx(
              styles.EditIconContainer,
              gClasses.CenterVH,
              gClasses.CursorPointer,
              gClasses.ClickableElement,
              gClasses.MR4,
              gClasses.FlexShrink0,
            )}
            onClick={onEditClick}
            title={editLabel}
          >
            <EditIconV2 className={cx(styles.EditIcon)} title={editLabel} />
          </button>
          <button
            className={cx(
              styles.EditIconContainer,
              gClasses.CenterVH,
              gClasses.CursorPointer,
              gClasses.ClickableElement,
              gClasses.FlexShrink0,
            )}
            onClick={onDeleteClick}
            title={deleteLabel}
          >
            <Trash title={deleteLabel} />
          </button>
        </div>
      </div>
      {/* { !isEmpty(triggerServerError) && !isEmpty(title) && !isNull(document.getElementById(triggerId)) &&
      <Tooltip id={triggerId} content={triggerServerError} isCustomToolTip /> } */}
    </>
  );
}

export default TriggerCard;
