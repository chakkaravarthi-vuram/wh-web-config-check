import React, { useContext, useEffect, useRef, useState } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { Chip, EChipSize } from '@workhall-pvt-lmt/wh-ui-library';
import { cloneDeep } from 'lodash';
import { useHistory } from 'react-router';
import gClasses from 'scss/Typography.module.scss';
import { getWelcomeMessageThunk } from 'redux/actions/Layout.Action';
import { useTranslation } from 'react-i18next';
import WelcomeMessage from './welcome_message/WelcomeMessage';
import { BS, COLOR_CONSTANTS, DEFAULT_COLORS_CONSTANTS } from '../../../utils/UIConstants';
import styles from './AppHome.module.scss';
import TaskListing from '../app_components/task_listing/TaskListing';
import { getFreqUsedApiThunk } from '../../../redux/actions/Appplication.Action';
import jsUtility from '../../../utils/jsUtility';
import ThemeContext from '../../../hoc/ThemeContext';
import { DATA_LIST_DASHBOARD, FLOW_DASHBOARD } from '../../../urls/RouteConstants';
import DatalistIconNew from '../../../assets/icons/DatalistIconNew';
import { TAB_ROUTE } from '../app_components/dashboard/flow/Flow.strings';
import { convertHexToHslBasedOnOpacity, routeNavigate } from '../../../utils/UtilityFunctions';
import { ROUTE_METHOD } from '../../../utils/Constants';
import { STATIC_CHIP_LIST } from '../application.strings';
import { TASK_CREATION_NLP } from '../../landing_page/my_tasks/MyTasks.strings';
import PromptInput from '../../../components/prompt_input/PromptInput';
import { postTaskCreationPromptThunk } from '../../../redux/actions/TaskCreationPrompt.Action';

 function AppHome(props) {
    const { welcomeApiCall, getFreqUsedApi, freqUsedData = [] } = props;
    const [freqUsed, setFreqUsed] = useState(freqUsedData);
    const [counter, setCounter] = useState(0);
    const { t } = useTranslation();

    const [activeStaticChip, setActiveStaticChip] = useState(null);
    const history = useHistory();

    const pref_locale = localStorage.getItem('application_language');

    const homeContainerRef = useRef();
    const welcomeMessageRef = useRef();
    const frequentActionRef = useRef();
    const taskListRef = useRef();

    useEffect(() => {
        welcomeApiCall();
        getFreqUsedApi();
    }, []);

    useEffect(() => {
      setFreqUsed(freqUsedData);
    }, [JSON.stringify(freqUsedData)]);

    const onHoverChange = (index) => {
      let freqData = cloneDeep(freqUsed);
      freqData = freqData.map((freq, indexData) => {
        if (indexData === index) freq.hovered = true;
        else freq.hovered = false;
        return freq;
      });

      setFreqUsed(freqData);
      setCounter(counter + 1);
    };

    const onMouseOut = (index) => {
      const freqData = cloneDeep(freqUsed);
      freqData[index].hovered = false;
      setFreqUsed(freqData);
      setCounter(counter + 1);
    };

    const onClickHandle = (flowUuid = null, dataListUuid = null) => {
      if (flowUuid) {
        routeNavigate(history, ROUTE_METHOD.PUSH, `${FLOW_DASHBOARD}/${flowUuid}/${TAB_ROUTE.ALL_REQUEST}`);
      }

      if (dataListUuid) {
        routeNavigate(history, ROUTE_METHOD.PUSH, `${DATA_LIST_DASHBOARD}/${dataListUuid}/${TAB_ROUTE.ALL_REQUEST}`);
      }
    };

    const { colorScheme } = useContext(ThemeContext);

    const getFrequentlyUsedChipList = () => {
        if (jsUtility.isEmpty(freqUsed)) return null;

       return freqUsed?.map((freq, index) => (
              <Chip
                key={freq?.flow_uuid || freq?.data_list_uuid}
                text={
                  freq?.translation_data?.[pref_locale]?.flow_name ||
                  freq?.flow_name ||
                  freq?.translation_data?.[pref_locale]?.data_list_name ||
                  freq.data_list_name
                }
                textColor={freq.hovered ? colorScheme?.activeColor : COLOR_CONSTANTS.BLACK_V1}
                borderColor={
                  freq.hovered
                    ? `${colorScheme?.activeColor}40`
                    : DEFAULT_COLORS_CONSTANTS.GRAY_V3
                }
                backgroundColor={COLOR_CONSTANTS.WHITE}
                avatar={
                  freq?.flow_uuid ? (
                    <freq.icon
                      fillColor={freq.hovered && colorScheme?.activeColor}
                    />
                  ) : (
                    <DatalistIconNew
                      className={styles.H16}
                      fillColor={freq.hovered && colorScheme?.activeColor}
                    />
                  )
                }
                size={EChipSize.lg}
                className={cx(gClasses.P8, gClasses.CursorPointer, styles.Chip)}
                textClassName={gClasses.FTwo12}
                onHover={() => onHoverChange(index)}
                onMouseOut={() => onMouseOut(index)}
                onClick={() => onClickHandle(freq?.flow_uuid, freq?.data_list_uuid)}
              />
        ));
    };

    const getConstantChipList = () => {
      const options = STATIC_CHIP_LIST.OPTIONS;
      const onHover = (index) => setActiveStaticChip(index);
      const onMouseOut = () => setActiveStaticChip(null);

      return (
           options.map((option) => (
            <Chip
              key={option.tabIndex}
              text={t(option?.labelText)}
              textColor={(option.tabIndex === activeStaticChip) ? colorScheme?.activeColor : COLOR_CONSTANTS.BLACK_V1}
              backgroundColor={convertHexToHslBasedOnOpacity(colorScheme?.activeColor, 97)}
              borderColor={COLOR_CONSTANTS.BLUE_V1}
              avatar={
                <option.icon
                   className={styles.H16}
                   fillColor={(option.tabIndex === activeStaticChip) && colorScheme?.activeColor}
                />
              }
              size={EChipSize.lg}
              className={cx(gClasses.P8, gClasses.CursorPointer, styles.Chip)}
              textClassName={gClasses.FTwo12}
              onHover={() => onHover(option.tabIndex)}
              onMouseOut={() => onMouseOut()}
              onClick={() => {
               history.push(history?.location?.path, {
                  [STATIC_CHIP_LIST.KEYS.TAB_INDEX]: option?.tabIndex,
                  [STATIC_CHIP_LIST.KEYS.SHOW_SYSTEM_DIRECTORY]: true,
               });
              }}
            />
           ))
        );
    };

    const postPromptDataToCreateTask = (data, controller) => {
      const { postTaskCreationPrompt } = props;
      postTaskCreationPrompt(data, controller, history, { pathname: history.location.pathname, search: '?create=task' }, t);
    };

    return (
      <div
        className={styles.AppHome}
        ref={homeContainerRef}
        style={{ backgroundColor: colorScheme?.appBg }}
      >
        <div
          className={cx(gClasses.PT40, BS.P_RELATIVE, styles.AppHomeContainer)}
          style={{ background: colorScheme?.highlight }}
          ref={welcomeMessageRef}
        >
          <WelcomeMessage />
          <div className={cx(gClasses.CenterH, styles.SearchPosition)}>
            <PromptInput
              postDataToCreateSource={postPromptDataToCreateTask}
              placeholder={t(TASK_CREATION_NLP.PLACEHOLDER)}
              wrapperClassName={styles.SearchContainer}
              userTheme
            />
          </div>
        </div>
        <div
          className={cx(
            gClasses.CenterVH,
            gClasses.MT60,
            gClasses.MB8,
            styles.FreqUsed,
          )}
          ref={frequentActionRef}
        >
          {getConstantChipList()}
          {getFrequentlyUsedChipList()}
        </div>
        <div className={styles.TaskList} ref={taskListRef}>
          <TaskListing />
        </div>
      </div>
    );
}

const mapStateToProps = (state) => {
  return {
    freqUsedData: state.ApplicationReducer.FreqUsed,
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
      welcomeApiCall: () => {
        dispatch(getWelcomeMessageThunk());
      },
      getFreqUsedApi: () => {
        dispatch(getFreqUsedApiThunk());
      },
      postTaskCreationPrompt: (...params) => {
        dispatch(postTaskCreationPromptThunk(...params));
      },
      dispatch,
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(AppHome);
