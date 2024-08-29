import React from 'react';
import { ETitleAlign, ETitleHeadingLevel, ETitleSize, Title } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import NoTaskIcon from '../../../../../assets/icons/application/NoTaskIcon';
import { TASK_CONTENT_STRINGS } from '../../../LandingPage.strings';
import gClasses from '../../../../../scss/Typography.module.scss';

function EmptyTaskHistory() {
    const { t } = useTranslation();

    return (
        <div
          className={cx(gClasses.DisplayFlex, gClasses.CenterVH, gClasses.H100, gClasses.MR24)}
        >
          <div
            className={cx(
              gClasses.CenterV,
              gClasses.JustifyContentCenter,
              gClasses.FlexDirectionColumn,
            )}
          >
            <NoTaskIcon />
            <Title
                content={t(TASK_CONTENT_STRINGS.HISTORY.EMPTY_ACTION_HISTORY.TITLE)}
                alignment={ETitleAlign.middle}
                headingLevel={ETitleHeadingLevel.h5}
                size={ETitleSize.xs}
                className={cx(gClasses.FTwo14Black, gClasses.FontWeight500)}
            />
            <Title
                content={t(TASK_CONTENT_STRINGS.HISTORY.EMPTY_ACTION_HISTORY.SUBTITLE)}
                alignment={ETitleAlign.middle}
                headingLevel={ETitleHeadingLevel.h5}
                size={ETitleSize.xs}
                className={cx(gClasses.FTwo13GrayV86, gClasses.FontWeight400, gClasses.MT10)}
            />
          </div>
        </div>
    );
}

export default EmptyTaskHistory;
