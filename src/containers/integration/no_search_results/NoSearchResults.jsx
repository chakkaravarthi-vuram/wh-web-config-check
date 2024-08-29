import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import { useTranslation } from 'react-i18next';
import NoSearchResultsIcon from 'assets/icons/integration/NoSearchResultsIcon';
import styles from './NoSearchResults.module.scss';
import { INTEGRATION_STRINGS } from '../Integration.utils';

function NoSearchResults(props) {
    const {
        className,
    } = props;
    const { t } = useTranslation();

    return (
        <div className={cx(gClasses.CenterVH, className, styles.Container)}>
            <div className={cx(gClasses.CenterVH, BS.FLEX_COLUMN)}>
                <NoSearchResultsIcon />
                <div className={cx(styles.Title, gClasses.MT16)}>
                    {t(INTEGRATION_STRINGS.NO_SEARCH_RESULTS.TITLE)}
                </div>
                <div className={cx(styles.Info, gClasses.MT8)}>
                    {t(INTEGRATION_STRINGS.NO_SEARCH_RESULTS.MESSAGE)}
                </div>
            </div>
        </div>
    );
}

export default NoSearchResults;
