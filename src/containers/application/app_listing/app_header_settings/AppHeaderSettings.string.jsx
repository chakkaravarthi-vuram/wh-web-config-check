import React from 'react';
import OneAppAtATime from 'assets/icons/application/OneAppAtATime';
import MultipleAppAtATime from 'assets/icons/application/MultipleAppAtATime';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';

export const APP_HEADER_DISPLAY = {
  SINGLE: 'single',
  MULTIPLE: 'multiple',
};

export const APP_HEADER_SETTINGS = (t) => {
  return {
    TITLE: t('app_strings.app_header_settings.title'),
    DISPLAY_SETTINGS: {
      LABEL: t('app_strings.app_header_settings.display_settings.label'),
      ID: t('app_strings.app_header_settings.display_settings.id'),
      OPTIONS: [
        {
          label: t(
            'app_strings.app_header_settings.display_settings.one_at_a_time',
          ),
          value: APP_HEADER_DISPLAY.SINGLE,
          image: <OneAppAtATime className={cx(gClasses.H100, gClasses.W100)} />,
        },
        {
          label: t(
            'app_strings.app_header_settings.display_settings.multiple_at_a_time',
          ),
          value: APP_HEADER_DISPLAY.MULTIPLE,
          image: <MultipleAppAtATime className={cx(gClasses.H100, gClasses.W100)} />,
        },
      ],
    },
  };
};

export const DEFAULT_APP_NAME = 'app_strings.app_header_settings.display_settings.default';
