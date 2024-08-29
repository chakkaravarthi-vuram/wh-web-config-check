import React from 'react';
import {
  Button,
  Chip,
  EButtonType,
  EChipSize,
  Table,
  Text,
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import styles from '../../DatalistsCreateEdit.module.scss';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { DATALIST_ADDON_STRINGS } from '../../../data_list_landing/datalist_details/datalist_add_on/DatalistAddOn.strings';
import { getTranslationChipStyles } from '../../../data_list_landing/datalist_details/datalist_add_on/translation/Translation.utils';
import { LANGUAGE_AND_OTHERS } from '../../DatalistsCreateEdit.constant';

function Translation() {
  const getTableRowText = (dataText) => (
    <Text
      content={dataText}
      className={cx(gClasses.FTwo12BlackV18, gClasses.FontWeight500)}
    />
  );
  const { t } = useTranslation();
  const { TITLE, STATUS } = DATALIST_ADDON_STRINGS(t).TRANSLATION;
  const TranslationData = [
    {
      component: [
        getTableRowText('Spanish'),
        <div className={cx(gClasses.CenterV, gClasses.Gap4)}>
          <Chip
            text={STATUS.AVAILABLE}
            textColor={getTranslationChipStyles(STATUS.AVAILABLE, t).textColor}
            backgroundColor={
              getTranslationChipStyles(STATUS.AVAILABLE, t).backgroundColor
            }
            size={EChipSize.sm}
            className={cx(
              gClasses.WhiteSpaceNoWrap,
              gClasses.PR6,
              gClasses.MR4,
            )}
            textClassName={cx(gClasses.FTwo12BlackV20, gClasses.FontWeight500)}
          />
          {/* <div className={cx(styles.ProgressContainer, gClasses.ML3)} /> */}
          {/* <ProgressBar
            progressType={EProgressType.horizontal}
            percentage={100}
          /> */}
          <div className={cx(styles.ProgressContainer, gClasses.ML3)}>
            <div className={styles.ProgressBar} />
          </div>
          <div className={cx(gClasses.ML12, gClasses.WhiteSpaceNoWrap)}>100 %</div>
        </div>,
        <div
          className={cx(gClasses.W100, gClasses.DisplayFlex, gClasses.JusEnd)}
        >
          <Button
            type={EButtonType.SECONDARY}
            buttonText={LANGUAGE_AND_OTHERS(t).TRANSLATE_AGAIN}
            className={styles.TranslateAgain}
          />
        </div>,
      ],
      id: EMPTY_STRING,
    },
    {
      component: [
        getTableRowText('French'),
        <div className={cx(gClasses.CenterV, gClasses.Gap4)}>
          <Chip
            text={STATUS.AVAILABLE}
            textColor={getTranslationChipStyles(STATUS.AVAILABLE, t).textColor}
            backgroundColor={
              getTranslationChipStyles(STATUS.AVAILABLE, t).backgroundColor
            }
            size={EChipSize.sm}
            className={cx(
              gClasses.WhiteSpaceNoWrap,
              gClasses.PR6,
              gClasses.MR4,
            )}
            textClassName={cx(gClasses.FTwo12BlackV20, gClasses.FontWeight500)}
          />
          {/* <ProgressBar
            progressType={EProgressType.horizontal}
            percentage={90}
          /> */}
           <div className={cx(styles.ProgressContainer, gClasses.ML3)}>
            <div className={styles.ProgressBar} />
           </div>
          <div className={cx(gClasses.ML12, gClasses.WhiteSpaceNoWrap)}>100 %</div>
        </div>,
        <div
          className={cx(gClasses.W100, gClasses.DisplayFlex, gClasses.JusEnd)}
        >
          <Button
            type={EButtonType.SECONDARY}
            buttonText={LANGUAGE_AND_OTHERS(t).TRANSLATE_AGAIN}
            className={styles.TranslateAgain}
          />
        </div>,
      ],
      id: EMPTY_STRING,
    },
    {
      component: [
        getTableRowText('Arabic'),
        <div className={cx(gClasses.CenterV, gClasses.Gap4)}>
          <Chip
            text={STATUS.NOT_AVAILABLE}
            textColor={
              getTranslationChipStyles(STATUS.NOT_AVAILABLE, t).textColor
            }
            backgroundColor={
              getTranslationChipStyles(STATUS.NOT_AVAILABLE, t).backgroundColor
            }
            size={EChipSize.sm}
            className={cx(
              gClasses.WhiteSpaceNoWrap,
              gClasses.PR6,
              gClasses.MR4,
            )}
            textClassName={cx(gClasses.FTwo12BlackV20, gClasses.FontWeight500)}
          />
          {/* <ProgressBar
            progressType={EProgressType.horizontal}
            percentage={30}
          /> */}
           <div className={cx(styles.ProgressContainer, gClasses.ML3)}>
            <div className={styles.ProgressBar} />
           </div>
          <div className={cx(gClasses.ML12, gClasses.WhiteSpaceNoWrap)}>100 %</div>
        </div>,
        <div
          className={cx(gClasses.W100, gClasses.DisplayFlex, gClasses.JusEnd)}
        >
          <Button
            type={EButtonType.OUTLINE_SECONDARY}
            buttonText={LANGUAGE_AND_OTHERS(t).TRANSLATE}
            className={styles.TranslateAgain}
          />
        </div>,
      ],
      id: EMPTY_STRING,
    },
    {
      component: [
        getTableRowText('German'),
        <div className={cx(gClasses.CenterV, gClasses.Gap4)}>
          <Chip
            text={STATUS.NOT_AVAILABLE}
            textColor={
              getTranslationChipStyles(STATUS.NOT_AVAILABLE, t).textColor
            }
            backgroundColor={
              getTranslationChipStyles(STATUS.NOT_AVAILABLE, t).backgroundColor
            }
            size={EChipSize.sm}
            className={cx(
              gClasses.WhiteSpaceNoWrap,
              gClasses.PR6,
              gClasses.MR4,
            )}
            textClassName={cx(gClasses.FTwo12BlackV20, gClasses.FontWeight500)}
          />
          {/* <ProgressBar
            progressType={EProgressType.horizontal}
            percentage={30}
          /> */}
           <div className={cx(styles.ProgressContainer, gClasses.ML3)}>
            <div className={styles.ProgressBar} />
           </div>
          <div className={cx(gClasses.ML12, gClasses.WhiteSpaceNoWrap)}>100 %</div>
        </div>,
        <div
          className={cx(gClasses.W100, gClasses.DisplayFlex, gClasses.JusEnd)}
        >
          <Button
            type={EButtonType.OUTLINE_SECONDARY}
            buttonText={LANGUAGE_AND_OTHERS(t).TRANSLATE}
            className={styles.TranslateAgain}
          />
        </div>,
      ],
      id: EMPTY_STRING,
    },
  ];
  return (
    <div className={gClasses.MT24}>
      <Text
        content={TITLE}
        className={cx(
          gClasses.FontWeight500,
          gClasses.FTwo16GrayV3,
          gClasses.MB12,
        )}
      />
      <div className={gClasses.OverflowXAuto}>
      <Table
        className={styles.TranslationTable}
        header={LANGUAGE_AND_OTHERS(t).LANGUAGE_HEADERS}
        data={TranslationData}
        tableVariant="normal"
      />
      </div>
    </div>
  );
}
export default Translation;
