import {
    ETabVariation,
    Tab,
  } from '@workhall-pvt-lmt/wh-ui-library';
  import React, { useContext, useEffect, useState } from 'react';
  import gClasses from 'scss/Typography.module.scss';
  import { connect } from 'react-redux';
  import { useTranslation } from 'react-i18next';
  import { useHistory } from 'react-router';
  import ThemeContext from 'hoc/ThemeContext';
  import styles from './ModelResultHeader.module.scss';

  import {
    createEditDataChange,
    teamDetailsDataChange,
  } from '../../../../../redux/reducer/TeamsReducer';
  import {
    getTeamDetailsThunk,
    getDependencyListThunk,
    deactivateTeamApiThunk,
  } from '../../../../../redux/actions/Teams.action';
  import {
    EMPTY_STRING,
  } from '../../../../../utils/strings/CommonStrings';

  import { isBasicUserMode } from '../../../../../utils/UtilityFunctions';
  import { ML_MODEL_STRINGS } from '../../../MLModels.strings';

  function ModelResultHeader(props) {
    const {
      selectedTeamId,
      teamDetailsDataChange,
      getTeamDetailsThunk,
      onTabHandler,
    } = props;
    const history = useHistory();
    const isNormalMode = isBasicUserMode(history);
    const { t } = useTranslation();
    const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
    const { RESULT_TAB } = ML_MODEL_STRINGS(t).MODEL_DETAILS;
    const [selectedTabIndex, setSelectedTabIndex] = useState(
      RESULT_TAB.OPTIONS[0].tabIndex,
    );

    useEffect(() => {
      if (selectedTeamId) {
        const params = { _id: selectedTeamId };
        teamDetailsDataChange({
          teamSearchText: EMPTY_STRING,
          isTeamMembersListLoading: true,
          isTeamDetailsLoading: true,
        });
        getTeamDetailsThunk(params);
      }
    }, [selectedTeamId]);

    // Called when tab switch
    const onTabChange = (value) => {
      console.log('onTabChange ', value);
      setSelectedTabIndex(value);
      onTabHandler(value);
      teamDetailsDataChange({
        selectedTabIndex: value,
      });
    };

    // Result Tabs
    const resultTabs = (
      <Tab
        options={RESULT_TAB.OPTIONS}
        selectedTabIndex={Number(selectedTabIndex)}
        variation={ETabVariation.primary}
        bottomSelectionClass={gClasses.ActiveBar}
        onClick={onTabChange}
        className={styles.Tab}
        textClass={styles.TabText}
        colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
        tabContainerClass={gClasses.ZIndex5}
      />
    );

    return (
      <div>
          {resultTabs}
      </div>
    );
  }

  const mapStateToProps = (state) => {
    return {
      state: state.TeamsReducer.teamDetails,
      teamCreateEditState: state.TeamsReducer.createEditTeam,
      modelList: state.MlModelListReducer.modelList,
      modelData: state.MlModelListReducer.modelData,
    };
  };

  const mapDispatchToProps = {
    getTeamDetailsThunk,
    getDependencyListThunk,
    deactivateTeamApiThunk,
    teamDetailsDataChange,
    createEditDataChange,
  };

  export default connect(mapStateToProps, mapDispatchToProps)(ModelResultHeader);
