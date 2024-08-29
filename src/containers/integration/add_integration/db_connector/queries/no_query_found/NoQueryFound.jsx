import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import {
  Text,
  Button,
  EButtonType,
  ETextSize,
  EButtonSizeType,
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import NoDataFoundIcon from 'assets/icons/integration/listing/NoDataFoundIcon';
import PlusIconV2 from 'assets/icons/PlusIconV2';
import WarningOrangeIcon from 'assets/icons/integration/WarningOrangeIcon';
import { DB_CONNECTION_QUERIES_STRINGS } from '../../DBConnector.strings';
import styles from '../Queries.module.scss';

function NoQueryFound(props) {
  const { isEditView, openQueryConfigModel, isShowError } = props;
  const { t } = useTranslation();
  const { NO_QUERY_FOUND, ADD_QUERY } = DB_CONNECTION_QUERIES_STRINGS(t);

  const errorComponent = isShowError && (
    <div
      className={cx(
        styles.ErrorContainer,
        gClasses.CenterV,
        gClasses.MB28,
        gClasses.DisplayFlex,
      )}
    >
      <WarningOrangeIcon />
      <div className={cx(styles.ErrorMsg, gClasses.ML8)}>
        {NO_QUERY_FOUND.ERROR_VALUE}
      </div>
    </div>
  );

  return (
    <div
      className={cx(
        BS.D_FLEX,
        BS.FLEX_COLUMN,
        BS.JC_CENTER,
        BS.ALIGN_ITEM_CENTER,
        BS.H100,
      )}
    >
      <NoDataFoundIcon />
      <Text
        content={NO_QUERY_FOUND.TITLE}
        size={ETextSize.MD}
        className={cx(
          gClasses.BlackV12,
          gClasses.FontWeight500,
          gClasses.MT30,
          gClasses.MB8,
        )}
      />
      <Text
        content={NO_QUERY_FOUND.DESCRIPTION}
        size={ETextSize.SM}
        className={cx(gClasses.FTwo12BlackV21, gClasses.MB20)}
      />
      {errorComponent}
      {isEditView && (
        <Button
          buttonText={ADD_QUERY}
          type={EButtonType.PRIMARY}
          size={EButtonSizeType.MD}
          onClickHandler={openQueryConfigModel}
          icon={<PlusIconV2 className={styles.CreateIcon} />}
        />
      )}
    </div>
  );
}

export default NoQueryFound;
