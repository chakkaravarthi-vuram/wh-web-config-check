import React, { useContext } from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { LANDING_PAGE } from 'containers/landing_page/LandingPageTranslation.strings';
import jsUtility from 'utils/jsUtility';
import { Size, TextArea } from '@workhall-pvt-lmt/wh-ui-library';
import styles from './SnoozeTask.module.scss';
import ThemeContext from '../../../../../hoc/ThemeContext';
import DateTimeWrapper from '../../../../../components/date_time_wrapper/DateTimeWrapper';

function SnoozeTask(props) {
    const {
    onSnoozeDataChange,
    snoozeDate,
    snoozeComments,
    snoozeDateError,
    snoozeCommentsError,
    isBasicUser,
    } = props;
    const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);

    const colorSchema = isBasicUser ? colorScheme : colorSchemeDefault;

    return (
      <div className={gClasses.PT16}>
        <div>
        <DateTimeWrapper
          id={LANDING_PAGE.SNOOZE_DATE.ID}
          label={LANDING_PAGE.SNOOZE_UNTIL}
          getDate={(value) => {
            onSnoozeDataChange(value, LANDING_PAGE.SNOOZE_DATE.ID);
          }}
          date={snoozeDate}
          errorMessage={snoozeDateError}
          enableTime
          defaultTime={LANDING_PAGE.SNOOZE_DATE.DEFAULT_TIME}
          isRequired
          className={gClasses.ZIndex10}
          validations={{
            allow_today: true,
            date_selection: [
              {
                type: LANDING_PAGE.SNOOZE_DATE.VALIDATIONS.TYPE,
                sub_type: LANDING_PAGE.SNOOZE_DATE.VALIDATIONS.SUBTYPE,
                start_day: LANDING_PAGE.SNOOZE_DATE.VALIDATIONS.START,
              },
            ],
          }}
          colorScheme={colorSchema}
        />
        </div>
        <div>
          <TextArea
            id={LANDING_PAGE.SNOOZE_COMMENTS.ID}
            value={snoozeComments}
            labelText={LANDING_PAGE.SNOOZE_COMMENTS.LABEL}
            isLoading={false}
            placeholder={LANDING_PAGE.SNOOZE_COMMENTS_PLACEHOLDER}
            className={cx(jsUtility.isEmpty(snoozeDateError) && gClasses.MT15)}
            labelClassName={styles.SnoozeTaskComments}
            onChange={(event) => onSnoozeDataChange(event.target.value, LANDING_PAGE.SNOOZE_COMMENTS.ID)}
            errorMessage={snoozeCommentsError}
            size={Size.sm}
          />
        </div>
        <div className={cx(gClasses.FontWeight400, gClasses.FTwo13GrayV87, gClasses.SnoozeMessage, gClasses.MT8)}>
          {LANDING_PAGE.SNOOZE_TASK_DESC}
        </div>
      </div>
    );
}
export default SnoozeTask;
