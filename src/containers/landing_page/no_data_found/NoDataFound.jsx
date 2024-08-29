/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext } from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { get } from 'utils/jsUtility';
import styles from './NoDataFound.module.scss';
import EmptyTrayIcon from '../../../assets/icons/EmptyTray';
import ThemeContext from '../../../hoc/ThemeContext';
import { NO_DATA_FOUND_STRINGS } from './NoDataFound.strings';
import { routeNavigate } from '../../../utils/UtilityFunctions';
import { ROUTE_METHOD } from '../../../utils/Constants';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function NoDataFound(props) {
  const { dataText, linkText, originalLocation, NoSearchFoundLabelStyles } = props;
  const { buttonColor } = useContext(ThemeContext);

  const history = useHistory();
  const onRedirectClick = () => {
    let historyObj = {};
    const currentParams = queryString.parseUrl(history.location.pathname);
    if (originalLocation === 'Home Tasks') {
      const newParams = { ...get(currentParams, ['query'], {}), create: 'task' };
      historyObj = {
        state: {
          originalLocation: originalLocation,
          createModalOpen: true,
        },
        search: new URLSearchParams(newParams).toString(),
      };
    } else if (originalLocation === 'Home Flows') {
      const newParams = { ...get(currentParams, ['query'], {}), create: 'flow' };
      historyObj = {
        state: {
          originalLocation: originalLocation,
          createFlowModalOpen: true,
        },
        search: new URLSearchParams(newParams).toString(),
      };
    } else if (originalLocation === 'Home Datalists') {
      const newParams = { ...get(currentParams, ['query'], {}), create: 'datalist' };
      historyObj = {
        state: {
          originalLocation: originalLocation,
          createDatalistModalOpen: true,
        },
        search: new URLSearchParams(newParams).toString(),
      };
    } else {
      historyObj = {
        state: {
          originalLocation: originalLocation,
          createModalOpen: true,
        },
      };
    }
    routeNavigate(history, ROUTE_METHOD.PUSH, EMPTY_STRING, historyObj?.search, historyObj?.state);
  };
  const noCreateLink = history.location.pathname.includes('ManagedByOthers');

  return (
    <div
      className={cx(
        styles.Container,
        BS.FLEX_ROW,
        gClasses.CenterVH,
        NoSearchFoundLabelStyles,
      )}
      id="NoDataFound"
    >
      <EmptyTrayIcon ariaLabel={NO_DATA_FOUND_STRINGS.ARIALABEL_TEXT.NO_DATA} />
      <p className={cx(gClasses.ML10, gClasses.FTwo13, gClasses.FontWeight500)}>
        {dataText}
        {linkText && !noCreateLink && (
          <span className={gClasses.CursorPointer} onClick={onRedirectClick} style={({ color: buttonColor })}>
            {linkText}
          </span>
        )}
      </p>
    </div>
  );
}

export default NoDataFound;
