import React, { useEffect } from 'react';
import cx from 'classnames/bind';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Table, Text, TableColumnWidthVariant, TableVariant, Chip, EChipSize } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from '../../../../../../scss/Typography.module.scss';
import { DATALIST_ADDON_STRINGS } from '../DatalistAddOn.strings';
import styles from './Translation.module.scss';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import { getTranslationChipStyles } from './Translation.utils';
import jsUtility, { isEmpty } from '../../../../../../utils/jsUtility';
import { getLocaleLookUpDataThunk } from '../../../../../../redux/actions/LocaleLookUp.Action';

const DUMMY_TRANSLATE_INFO = {
    'en-IN': {
        translationAvailability: false,
        translatedPercentage: 0,
    },
    'es-MX': {
        translationAvailability: true,
        translatedPercentage: 60,
    },
};

function Translation(props) {
    const {
        translationAvailabilityInfo = DUMMY_TRANSLATE_INFO,
    } = props;
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const localeList = useSelector((state) => state.LocaleLookUpReducer.locale_list);
    useEffect(() => {
        isEmpty(localeList) && dispatch(getLocaleLookUpDataThunk({ acc_locale: 1 }));
    }, []);

    // const localeList = DUMMY_LOCALE_LIST.filter((locale) => locale.language !== 'English');

    const { TITLE, HEADERS, STATUS } = DATALIST_ADDON_STRINGS(t).TRANSLATION;

    const getTableRowText = (dataText) => <Text content={dataText} className={cx(gClasses.FTwo12BlackV18, gClasses.FontWeight500)} />;

    const translationData = jsUtility.compact(Object.keys(translationAvailabilityInfo)?.map((locale) => {
        if (!locale.includes('en')) {
            const currentLocaleDetails = localeList?.find?.((eachLocale) => locale === eachLocale.value);
            // comments - Use optional chaining for locale in both places
            const translatedPercentage = `${((translationAvailabilityInfo[locale].translatedPercentage / 100) * 100).toFixed(2)}%`;
            console.log('ccc', translationAvailabilityInfo[locale].translatedPercentage);
            const translationAvailabilityStatus = translationAvailabilityInfo?.[locale]?.translationAvailability ? STATUS.AVAILABLE : STATUS.NOT_AVAILABLE;
            const progressStyle = {
                width: translatedPercentage,
            };
            return {
                component: [
                    getTableRowText(currentLocaleDetails?.label || locale),
                    <div className={cx(gClasses.CenterV, gClasses.Gap4)}>
                        <Chip
                            text={translationAvailabilityStatus}
                            textColor={getTranslationChipStyles(translationAvailabilityStatus, t).textColor}
                            backgroundColor={getTranslationChipStyles(translationAvailabilityStatus, t).backgroundColor}
                            size={EChipSize.sm}
                            className={cx(gClasses.WhiteSpaceNoWrap, gClasses.PR6, gClasses.MR4)}
                            textClassName={cx(gClasses.FTwo12BlackV20, gClasses.FontWeight500)}
                        />
                        <div className={cx(styles.ProgressContainer, gClasses.ML3)}>
                            <div className={styles.ProgressBar} style={progressStyle} />
                        </div>
                        <div className={gClasses.ML12}>
                            {translatedPercentage}
                        </div>
                    </div>,
                ],
                id: EMPTY_STRING,
            };
        }
        return null;
    }));
    console.log('ooox', translationAvailabilityInfo, localeList);

    return (
        <div className={gClasses.MB24}>
            <Text
                content={TITLE}
                className={cx(gClasses.FontWeight500, gClasses.FTwo16GrayV3, gClasses.MB12)}
            />
            <Table
                tableClassName={styles.TableSecuritySummary}
                header={HEADERS}
                data={translationData}
                widthVariant={TableColumnWidthVariant.CUSTOM}
                tableVariant={TableVariant.NORMAL}
            />
        </div>
    );
}

export default Translation;
