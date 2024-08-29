import React from 'react';
import cx from 'classnames/bind';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import Tag from 'components/form_components/tag/Tag';
import { BS } from 'utils/UIConstants';
import { translateFunction } from 'utils/jsUtility';
import gClasses from 'scss/Typography.module.scss';
import { LANGAUGE_SETTINGS_STRINGS } from './LanguageSettings.strings';
import styles from './LanguageSettings.module.scss';

export const getLanguageTableData = (translateLanguagesList, t = translateFunction, onClickTranslate, localeList) => {
    const tableData = Object.keys(translateLanguagesList)?.map((locale) => {
        const currentLocaleDetails = localeList?.find?.((eachLocale) => locale === eachLocale.value);
        const translatedPercentage = `${((translateLanguagesList[locale].translated_percentage / 100) * 100).toFixed(2)}%`;
        const progressStyle = {
            width: translatedPercentage,
          };
        return [
            <div className={cx(gClasses.FTwo12GrayV89, gClasses.PT6)}>
                {currentLocaleDetails?.label || locale}
            </div>,
            (
                <div className={cx(gClasses.CenterV, gClasses.PT6)}>
                    {translateLanguagesList?.[locale]?.translation_availability ?
                        (
                            <Tag className={cx(styles.AvailableTranslationStatus, gClasses.FTwo12GreenV27, gClasses.FontWeight500)}>
                                {LANGAUGE_SETTINGS_STRINGS(t).TRANSLATE_STATUS.AVAILABLE}
                            </Tag>
                        ) :
                        (
                            <Tag className={cx(styles.TranslationStatus, gClasses.FTwo12BlackV20, gClasses.FontWeight500)}>
                                {LANGAUGE_SETTINGS_STRINGS(t).TRANSLATE_STATUS.NOT_AVAILABLE}
                            </Tag>
                        )
                    }
                    <div className={cx(styles.ProgressContainer, gClasses.ML3)}>
                        <div className={styles.ProgressBar} style={progressStyle} />
                    </div>
                    <div className={gClasses.ML12}>
                        {translatedPercentage}
                    </div>
                </div>
            ),
            (
                <div>
                {translateLanguagesList?.[locale]?.translation_availability ?
                    (
                        <Button
                        buttonType={BUTTON_TYPE.OUTLINE_PRIMARY}
                        className={cx(BS.TEXT_NO_WRAP, styles.PrimaryButton)}
                        onClick={() => onClickTranslate(currentLocaleDetails?.label || locale, locale)}
                        >
                            {LANGAUGE_SETTINGS_STRINGS(t).TRANSLATE.TRANSLATE_AGAIN}
                        </Button>
                    ) :
                    (
                        <Button
                        buttonType={BUTTON_TYPE.LIGHT}
                        className={cx(BS.TEXT_NO_WRAP, styles.BackButton, gClasses.FTwo13GrayV93)}
                        onClick={() => onClickTranslate(currentLocaleDetails?.label || locale, locale)}
                        >
                            {LANGAUGE_SETTINGS_STRINGS(t).TRANSLATE.TRANSLATE}
                        </Button>
                    )
                }
                </div>
            ),
        ];
    });
    return tableData || [];
};
