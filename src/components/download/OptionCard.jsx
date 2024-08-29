import React from 'react';
import cx from 'classnames/bind';

import { useTranslation } from 'react-i18next';
import gClasses from '../../scss/Typography.module.scss';
import CheckboxGroup, {
  CHECK_BOX_GROUP_TYPE,
} from '../form_components/checkbox_group/CheckboxGroup';
import { BS } from '../../utils/UIConstants';
import { getRankingWordsAdded, joinWordsInString } from '../../utils/UtilityFunctions';

import styles from './Download.module.scss';
import { DOWNLOAD_WINDOW_STRINGS } from './Download.strings';

function OptionCard(props) {
  const {
    isLoading,
    options,
    onCheckboxDownloadSelectChangeHandler,
  } = props;

  const { t } = useTranslation();

  return (
    <div
      className={cx(
        BS.D_FLEX,
        BS.JC_BETWEEN,
        styles.listCheckBox,
      )}
    >
      <CheckboxGroup
        label={joinWordsInString(options.label)}
        className={gClasses.MB0}
        optionList={[options]}
        onClick={(value) =>
          onCheckboxDownloadSelectChangeHandler(value, options)
        }
        selectedValues={[1]}
        hideLabel
        hideMessage
        type={CHECK_BOX_GROUP_TYPE.TYPE_2}
        isDataLoading={isLoading}
      />
      <div className={styles.dimensionDisplayOrder}>
        {options.value === 1 && options.count &&
          `${getRankingWordsAdded(options.count)} ${t(DOWNLOAD_WINDOW_STRINGS.COLUMN)}`}
      </div>
    </div>
  );
}

export default OptionCard;
