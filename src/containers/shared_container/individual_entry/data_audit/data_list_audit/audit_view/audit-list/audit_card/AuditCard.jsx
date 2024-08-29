import React, { useState } from 'react';
import cx from 'classnames/bind';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import DownArrowIcon from 'assets/icons/chat/DownArrowIcon';
import Skeleton from 'react-loading-skeleton';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { useTranslation } from 'react-i18next';
import styles from './AuditCard.module.scss';
import gClasses from '../../../../../../../../scss/Typography.module.scss';
import { AUDIT_CARD_STRINGS } from '../../AuditView.utils';

function AuditCard(props) {
  const { onDetailedViewClick, isDataLoading, auditDetails } = props;
  const [expand, setExpand] = useState(false);
  const { t } = useTranslation();
  const getEditedFields = (fields) => {
    const list = fields.map((data) => {
      let backgroundColor;
      switch (data.type) {
        case 'edit':
          backgroundColor = styles.EditedBackground;
          break;
        case 'delete':
          backgroundColor = styles.DeletedBackground;
          break;
        case 'add':
          backgroundColor = styles.AddedBackgroung;
          break;
        default:
          break;
      }
      return (
        <li className={cx(gClasses.MB5)}>
          <div className={cx(BS.D_FLEX, gClasses.CenterV)}>
            <div className={cx(styles.indicator, backgroundColor)} />
            <div
              className={cx(
                gClasses.FTwo13GrayV3,
                gClasses.ML5,
              )}
            >
              {data && data.fieldname && data.fieldname}
            </div>
          </div>
        </li>
      );
    });
    return list;
  };
  return (
    <div
      className={cx(
        styles.CardContainer,
        expand && styles.DetailedContainer,
        gClasses.MB6,
      )}
    >
      {isDataLoading ? (
        <div
          className={cx(
            gClasses.ML32,
            gClasses.MR30,
            gClasses.MT10,
            gClasses.MB10,
          )}
        >
          <Skeleton width={600} height={20} />
        </div>
      ) : (
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
          <div className={cx(gClasses.ML14)}>
            {isDataLoading ? (
              <Skeleton width={80} height={40} />
            ) : (
              <div
                className={cx(
                  gClasses.FTwo13GrayV3,
                  gClasses.FontWeight500,
                  gClasses.MT14,
                )}
              >
                {auditDetails.time}
              </div>
            )}
            {isDataLoading ? (
              <div className={gClasses.MR5}>
                <Skeleton width={40} height={20} />
              </div>
            ) : (
              <div
                className={cx(
                  gClasses.FTwo12BlackV13,
                  gClasses.MT3,
                )}
              >
                {`${AUDIT_CARD_STRINGS(t).EDITED} ${auditDetails.fieldCount} ${AUDIT_CARD_STRINGS(t).FIELDS}`}
              </div>
            )}
          </div>
          {isDataLoading ? (
            <Skeleton width={50} height={30} />
          ) : (
            <div
              className={cx(
                BS.D_FLEX,
                gClasses.CenterV,
                styles.UserNameContainer,
                gClasses.CursorPointer,
              )}
                onClick={() => {
                  setExpand(!expand);
                }}
                role="combobox"
                tabIndex={0}
                onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && setExpand(!expand)}
                aria-expanded={expand}
                aria-controls=""
                aria-label="View More Details"
            >
              <div
                className={cx(gClasses.FTwo13GrayV3)}
              >
                {auditDetails.editorName}
              </div>

              <div className={cx(styles.Rotate)}>
                <DownArrowIcon
                  className={cx(
                    styles.DownArrowIcon,
                    expand && gClasses.Rotate180,
                  )}
                  role={ARIA_ROLES.IMG}
                  ariaHidden
                />
              </div>
            </div>
          )}
        </div>
      )}
      {expand && (
        <div
          className={cx(
            BS.D_FLEX,
            BS.JC_BETWEEN,
            gClasses.PT14,
            gClasses.MT14,
            styles.DetailedView,
          )}
        >
          <div className={cx(gClasses.ML15)}>
            <ul>{getEditedFields(auditDetails.editedfieds)}</ul>
          </div>
          <div
            className={cx(
              gClasses.FTwo13BlueV39,
              gClasses.FontWeight500,
              gClasses.MR15,
              gClasses.CursorPointer,
              gClasses.HeightFitContent,
            )}
            onClick={() => {
              onDetailedViewClick(
                auditDetails.actionHistoryId,
                auditDetails.time,
                auditDetails.editorName,
                auditDetails.fieldCount,
                auditDetails.editorId,
                auditDetails.flowId,
                auditDetails.flowUuid,
              );
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) &&
              onDetailedViewClick(
                auditDetails.actionHistoryId,
                auditDetails.time,
                auditDetails.editorName,
                auditDetails.fieldCount,
                auditDetails.editorId,
                auditDetails.flowId,
                auditDetails.flowUuid,
              )
            }
          >
            {' '}
            {AUDIT_CARD_STRINGS(t).VIEW_DETAILS}
          </div>
        </div>
      )}
    </div>
  );
}

export default AuditCard;
