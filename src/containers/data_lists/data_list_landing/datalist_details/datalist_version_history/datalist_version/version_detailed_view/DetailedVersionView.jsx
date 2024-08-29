import React from 'react';
import cx from 'classnames/bind';
import { ETextSize, Text } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import { BS } from '../../../../../../../utils/UIConstants';
import gClasses from '../../../../../../../scss/Typography.module.scss';
import styles from './DetailedVersionView.module.scss';
import BackIcon from '../../../../../../../assets/icons/BackIcon';
import { DETAILED_AUDIT_VIEW_STRINGS } from './DetailedVersionView.utils';
import { keydownOrKeypessEnterHandle } from '../../../../../../../utils/UtilityFunctions';

function DetailedAuditView(props) {
  console.log('DetailedAuditView', props);
  const {
    isDataLoading,
    selectedVersionHistory,
    toogleDetailedView,
  } = props;
  const { t } = useTranslation();
  return (
    <div>
      detailed view
      {!isDataLoading && (
        <div
          className={cx(
            gClasses.MT15,
            gClasses.MB10,
            gClasses.CursorPointer,
          )}
        >
          <div
            className={cx(BS.D_FLEX, gClasses.CenterV, gClasses.CursorPointer)}
            onClick={toogleDetailedView}
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && toogleDetailedView()}
            role="button"
            tabIndex={0}
          >
            <BackIcon />
            <div className={cx(gClasses.FTwo13BlueV39, gClasses.ML7, gClasses.FontWeight500)}>
              {DETAILED_AUDIT_VIEW_STRINGS(t).BACK_TO_DATA_AUDIT}
            </div>
          </div>
          <div className={cx(BS.D_FLEX, styles.ModelCardData, gClasses.MT16)}>
          <div className={styles.ModelCardColumn}>
              <Text
                  content="LastUpdated By"
                  size={ETextSize.MD}
                  className={cx(gClasses.FontWeight500, styles.MFALabel)}
              />
              <Text
                  content={`${selectedVersionHistory?.last_updated_by?.first_name} ${selectedVersionHistory?.last_updated_by?.last_name}`}
                  size={ETextSize.SM}
              />
          </div>
          <div className={styles.ModelCardColumn}>
              <Text
                  content="LastUpdated On"
                  size={ETextSize.MD}
                  className={cx(gClasses.FontWeight500, styles.MFALabel)}
              />
              <Text
                  content={selectedVersionHistory.last_updated_on.pref_datetime_display}
                  size={ETextSize.SM}
              />
          </div>
          </div>
          <div className={cx(BS.D_FLEX, styles.ModelCardData, gClasses.MT16)}>
          <div className={styles.ModelCardColumn}>
              <Text
                  content="Published By"
                  size={ETextSize.MD}
                  className={cx(gClasses.FontWeight500, styles.MFALabel)}
              />
              <Text
                  content={`${selectedVersionHistory?.published_by?.first_name} ${selectedVersionHistory?.published_by?.last_name}`}
                  size={ETextSize.SM}
              />
          </div>
          <div className={styles.ModelCardColumn}>
              <Text
                  content="Published On"
                  size={ETextSize.MD}
                  className={cx(gClasses.FontWeight500, styles.MFALabel)}
              />
              <Text
                  content={selectedVersionHistory.published_on.pref_datetime_display}
                  size={ETextSize.SM}
              />
          </div>
          </div>
          <div className={cx(BS.D_FLEX, styles.ModelCardData, gClasses.MT16)}>
          <div className={styles.ModelCardColumn}>
              <Text
                  content="Version Created By"
                  size={ETextSize.MD}
                  className={cx(gClasses.FontWeight500, styles.MFALabel)}
              />
              <Text
                  content={`${selectedVersionHistory?.version_created_by?.first_name} ${selectedVersionHistory?.version_created_by?.last_name}`}
                  size={ETextSize.SM}
              />
          </div>
          <div className={styles.ModelCardColumn}>
              <Text
                  content="Version Created On"
                  size={ETextSize.MD}
                  className={cx(gClasses.FontWeight500, styles.MFALabel)}
              />
              <Text
                  content={selectedVersionHistory.version_created_on.pref_datetime_display}
                  size={ETextSize.SM}
              />
          </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailedAuditView;
