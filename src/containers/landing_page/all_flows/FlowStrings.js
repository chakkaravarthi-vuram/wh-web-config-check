import React from 'react';
import cx from 'classnames/bind';

import gClasses from '../../../scss/Typography.module.scss';
import { RESPONSE_TYPE } from '../../../utils/Constants';
// eslint-disable-next-line import/named
import { LANDING_PAGE_NO_FLOW_FOUND } from '../main_header/common_header/CommonHeader.strings';

export const NO_FLOW = {
  type: RESPONSE_TYPE.NO_DATA_FOUND,
  title: (
    <div className={cx(gClasses.FTwo14GrayV3, gClasses.Opactiy5)}>
      No flow available to display!
    </div>
  ),
};

export const NO_SEARCH_RESULT = (searchText) => {
 return {
  type: RESPONSE_TYPE.NO_DATA_FOUND,
  title: (
    <div>
      <span className={cx(gClasses.FTwo14GrayV3, gClasses.Opacity5)}>
        There is no Flow called
      </span>
      <span className={gClasses.FTwo14GrayV3}>{searchText}</span>
    </div>
  ),
  subTitle: (
    <div className={cx(gClasses.FTwo14GrayV3, gClasses.Opacity5)}>
      Do you want to create this flow?
    </div>
  ),
};
};

export const getSearchTextResponseHandler = (searchText) => (
  <div id="noResultsFound">
    <span className={cx(gClasses.FTwo12GrayV3, gClasses.Opacity5)}>
      There is no Flow called
    </span>
    <span className={gClasses.FTwo12GrayV3}>{` ${searchText}`}</span>
  </div>
);

export const getDefaultResponseHandler = (t) => (
  <div className={cx(gClasses.FTwo14GrayV3, gClasses.Opactiy5, gClasses.MT15)}>
    {t(LANDING_PAGE_NO_FLOW_FOUND.LABEL)}
  </div>
);

export const CREATE_SEARCH_FLOW = 'Yes';

export const STARTED_FLOW_CARD_HEIGHT = 68;
