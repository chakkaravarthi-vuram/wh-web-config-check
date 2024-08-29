import React, { useState } from 'react';
import cx from 'classnames/bind';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import DownArrowIcon from 'assets/icons/chat/DownArrowIcon';
import Skeleton from 'react-loading-skeleton';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import gClasses from 'scss/Typography.module.scss';
import { ETextSize, Text } from '@workhall-pvt-lmt/wh-ui-library';
import styles from './VersionCard.module.scss';

function AuditCard(props) {
  const { isDataLoading, auditDetails } = props;
  const [expand, setExpand] = useState(false);
  console.log('AuditCard', props);
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
                {`Version ${auditDetails.version}`}
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
                {`Published by ${auditDetails?.published_by?.first_name} ${auditDetails?.published_by?.last_name} on ${auditDetails?.published_on.pref_datetime_display}`}
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
            gClasses.PT14,
            gClasses.MT14,
            styles.DetailedView,
          )}
        >
          <div className={cx(BS.D_FLEX, styles.ModelCardData, gClasses.MT16)}>
            <div className={styles.ModelCardColumn}>
              <Text
                content="Datalist Name"
                size={ETextSize.MD}
                className={cx(gClasses.FontWeight500)}
              />
              <Text
                content={`${auditDetails?.data_list_name}`}
                size={ETextSize.SM}
              />
            </div>
            <div className={styles.ModelCardColumn}>
              <Text
                content="DataList Shortcode"
                size={ETextSize.MD}
                className={cx(gClasses.FontWeight500)}
              />
              <Text
                content={auditDetails.data_list_short_code}
                size={ETextSize.SM}
              />
            </div>
          </div>
          <div className={cx(BS.D_FLEX, styles.ModelCardData, gClasses.MT16)}>
            <div className={styles.ModelCardColumn}>
              <Text
                content="Last Updated By"
                size={ETextSize.MD}
                className={cx(gClasses.FontWeight500)}
              />
              <Text
                content={`${auditDetails?.last_updated_by?.first_name} ${auditDetails?.last_updated_by?.last_name}`}
                size={ETextSize.SM}
              />
            </div>
            <div className={styles.ModelCardColumn}>
              <Text
                content="Last Updated On"
                size={ETextSize.MD}
                className={cx(gClasses.FontWeight500)}
              />
              <Text
                content={auditDetails.last_updated_on.pref_datetime_display}
                size={ETextSize.SM}
              />
            </div>
          </div>

          <div className={cx(BS.D_FLEX, styles.ModelCardData, gClasses.MT16)}>
            <div className={styles.ModelCardColumn}>
              <Text
                content="Version Created By"
                size={ETextSize.MD}
                className={cx(gClasses.FontWeight500)}
              />
              <Text
                content={`${auditDetails?.version_created_by?.first_name} ${auditDetails?.version_created_by?.last_name}`}
                size={ETextSize.SM}
              />
            </div>
            <div className={styles.ModelCardColumn}>
              <Text
                content="Version Created On"
                size={ETextSize.MD}
                className={cx(gClasses.FontWeight500)}
              />
              <Text
                content={auditDetails.version_created_on.pref_datetime_display}
                size={ETextSize.SM}
              />
            </div>
          </div>
          <div>
          <div
            className={cx(
              gClasses.FTwo13GrayV3,
              gClasses.MT20,
            )}
          >
            {`Status: ${auditDetails.status}`}
          </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuditCard;
