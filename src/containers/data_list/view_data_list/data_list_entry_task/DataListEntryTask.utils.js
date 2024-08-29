import { translateFunction, isNaN } from '../../../../utils/jsUtility';

export const DATE_TIME_DURATION_DISPLAY = (t = translateFunction) => {
  return {
    AN: t('date_time_duration_display.an'),
    YEAR: t('date_time_duration_display.year'),
    MONTH: t('date_time_duration_display.month'),
    A: t('date_time_duration_display.a'),
    DAY: t('date_time_duration_display.day'),
    HOUR: t('date_time_duration_display.hour'),
    FEW: t('date_time_duration_display.few'),
    MINUTE: t('date_time_duration_display.minute'),
    SECONDS: t('date_time_duration_display.seconds'),
    YEARS: t('date_time_duration_display.years'),
    MONTHS: t('date_time_duration_display.months'),
    DAYS: t('date_time_duration_display.days'),
    HOURS: t('date_time_duration_display.hours'),
    MINUTES: t('date_time_duration_display.minutes'),
    AGO: t('date_time_duration_display.ago'),
    IN: t('date_time_duration_display.in'),
    YR: t('date_time_duration_display.yr'),
    YRS: t('date_time_duration_display.yrs'),
    MO: t('date_time_duration_display.mo'),
    MOS: t('date_time_duration_display.mos'),
    D: t('date_time_duration_display.d'),
    HR: t('date_time_duration_display.hr'),
    HRS: t('date_time_duration_display.hrs'),
    M: t('date_time_duration_display.m'),
    SECOND: t('date_time_duration_display.second'),
    DUE: t('date_time_duration_display.due'),
  };
};

const durationTextDisplay = (duration_display, t) => {
  let dateText;
  switch (duration_display) {
    case 'an':
      dateText = DATE_TIME_DURATION_DISPLAY(t).AN;
      break;
    case 'year':
      dateText = DATE_TIME_DURATION_DISPLAY(t).YEAR;
      break;
    case 'month':
      dateText = DATE_TIME_DURATION_DISPLAY(t).MONTH;
      break;
    case 'a':
      dateText = DATE_TIME_DURATION_DISPLAY(t).A;
      break;
    case 'day':
      dateText = DATE_TIME_DURATION_DISPLAY(t).DAY;
      break;
    case 'hour':
      dateText = DATE_TIME_DURATION_DISPLAY(t).HOUR;
      break;
    case 'few':
      dateText = DATE_TIME_DURATION_DISPLAY(t).FEW;
      break;
    case 'minute':
      dateText = DATE_TIME_DURATION_DISPLAY(t).MINUTE;
      break;
    case 'seconds':
      dateText = DATE_TIME_DURATION_DISPLAY(t).SECONDS;
      break;
    case 'years':
      dateText = DATE_TIME_DURATION_DISPLAY(t).YEARS;
      break;
    case 'months':
      dateText = DATE_TIME_DURATION_DISPLAY(t).MONTHS;
      break;
    case 'days':
      dateText = DATE_TIME_DURATION_DISPLAY(t).DAYS;
      break;
    case 'hours':
      dateText = DATE_TIME_DURATION_DISPLAY(t).HOURS;
      break;
    case 'minutes':
      dateText = DATE_TIME_DURATION_DISPLAY(t).MINUTES;
      break;
    case 'ago':
      dateText = DATE_TIME_DURATION_DISPLAY(t).AGO;
      break;
    case 'in':
      dateText = DATE_TIME_DURATION_DISPLAY(t).IN;
      break;
    case 'yr':
      dateText = DATE_TIME_DURATION_DISPLAY(t).YR;
      break;
    case 'yrs':
      dateText = DATE_TIME_DURATION_DISPLAY(t).YRS;
      break;
    case 'mo':
      dateText = DATE_TIME_DURATION_DISPLAY(t).MO;
      break;
    case 'mos':
      dateText = DATE_TIME_DURATION_DISPLAY(t).MOS;
      break;
    case 'd':
      dateText = DATE_TIME_DURATION_DISPLAY(t).D;
      break;
    case 'hr':
      dateText = DATE_TIME_DURATION_DISPLAY(t).HR;
      break;
    case 'hrs':
      dateText = DATE_TIME_DURATION_DISPLAY(t).HRS;
      break;
    case 'm':
      dateText = DATE_TIME_DURATION_DISPLAY(t).M;
      break;
    case 'second':
      dateText = DATE_TIME_DURATION_DISPLAY(t).SECOND;
      break;
    case 'due':
      dateText = DATE_TIME_DURATION_DISPLAY(t).DUE;
      break;
    default:
      break;
  }
  return dateText;
};

export const dateDuration = (duration_display, t) => {
  if (!duration_display) return null;
  const parts = duration_display.split(' ');
  const modifiedParts = parts.map((value) => {
    if (!isNaN(Number(value))) {
      return value;
    } else {
      return durationTextDisplay(value, t);
    }
  });
  const modifiedString = modifiedParts.join(' ');
  return modifiedString;
};
