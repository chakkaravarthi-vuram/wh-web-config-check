import {
    ETabVariation,
    Tab,
    Thumbnail,
    Title,
    ETitleSize,
    ETitleHeadingLevel,
    Text,
    ETextSize,
  } from '@workhall-pvt-lmt/wh-ui-library';
  import React, { useContext, useEffect, useState } from 'react';
  import cx from 'classnames/bind';
  import gClasses from 'scss/Typography.module.scss';
  import { connect } from 'react-redux';
  import { useTranslation } from 'react-i18next';
  import { useHistory } from 'react-router';
  import ThemeContext from 'hoc/ThemeContext';
  import styles from '../ModelDetails.module.scss';
  import MLModelIcon from '../../../../assets/icons/side_bar/MLModelIcon';
  import { BS, DEFAULT_COLORS_CONSTANTS } from '../../../../utils/UIConstants';
  import {
    createEditDataChange,
    teamDetailsDataChange,
  } from '../../../../redux/reducer/TeamsReducer';
  import {
    getTeamDetailsThunk,
    getDependencyListThunk,
    deactivateTeamApiThunk,
  } from '../../../../redux/actions/Teams.action';
  import {
    EMPTY_STRING,
    PERCENTAGE,
  } from '../../../../utils/strings/CommonStrings';
  import { isBasicUserMode } from '../../../../utils/UtilityFunctions';
  import { ML_MODEL_STRINGS } from '../../MLModels.strings';
  import { generateContent } from '../../MLModels.utils';
  import { ML_MODEL_DESC_ELLIPSIS_CHARS } from '../../MlModels.constants';

  function ModelDetailsHeader(props) {
    const {
      selectedTeamId,
      teamDetailsDataChange,
      getTeamDetailsThunk,
      modelData,
      onTabHandler,
      disabled,
      isModelDetailLoading,
    } = props;

    const history = useHistory();
    const isNormalMode = isBasicUserMode(history);
    const { t } = useTranslation();
    const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
    const { TAB, VIEW_LESS, VIEW_MORE, VALIDATION_ACCURACY } = ML_MODEL_STRINGS(t).MODEL_DETAILS;
    const [showFullText, setShowFullText] = useState(false);
    const [selectedTabIndex, setSelectedTabIndex] = useState(
      TAB.OPTIONS[0].tabIndex,
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

    // model desc - view more or less click
    const toggleShowFullText = () => {
      setShowFullText(!showFullText);
    };

    const buttonText = (
      <button className={cx(gClasses.BlueV39, gClasses.ML3)} onClick={toggleShowFullText}>
        {showFullText ? VIEW_LESS : VIEW_MORE }
      </button>
    );

    // Header Tabs
    const headerTabs = (
      <Tab
        options={TAB.OPTIONS}
        selectedTabIndex={Number(selectedTabIndex)}
        variation={ETabVariation.primary}
        bottomSelectionClass={gClasses.ActiveBar}
        onClick={!disabled ? onTabChange : () => null}
        textClass={styles.TabText}
        className={styles.Tab}
        colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
        disabled={disabled}
        isLoading={isModelDetailLoading}
        tabContainerClass={gClasses.ZIndex5}
      />
    );

    return (
      <div>
        <div className={cx(BS.D_FLEX, gClasses.PY10)}>
          <div
            className={cx(gClasses.CenterV, styles.TeamIcon, styles.HeaderBlock)}
          >
            <Thumbnail
              showIcon
              // isDataLoading={isModelDetailLoading}
              className={styles.Thumbnail}
              icon={
                <MLModelIcon
                  fillColor={
                    isNormalMode
                      ? colorScheme?.activeColor
                      : DEFAULT_COLORS_CONSTANTS.BLUE_V39
                  }
                />
              }
              backgroundColor={
                isNormalMode
                  ? `${colorScheme?.activeColor}20`
                  : `${DEFAULT_COLORS_CONSTANTS.BLUE_V39}20`
              }
            />
            <div className={cx(gClasses.ML20, gClasses.MR20, styles.Description, gClasses.W100)}>
              <Title
                isDataLoading={isModelDetailLoading}
                content={modelData?.model_name}
                size={ETitleSize.sm}
                headingLevel={ETitleHeadingLevel.h4}
              />
              <Text
                isLoading={isModelDetailLoading}
                content={generateContent(modelData?.model_description, ML_MODEL_DESC_ELLIPSIS_CHARS, buttonText, showFullText)}
                className={cx(gClasses.FontSize12, styles.TeamDesc)}
              />
            </div>
          </div>
          <div>
          {
            modelData?.validation_accuracy &&

            <div className={cx(BS.D_FLEX, BS.JC_CENTER, gClasses.MT8, styles.ValidationAccuracyBG)}>
              <div className={cx(styles.ValidationAccuracy)}>
                <Text
                  content={t(VALIDATION_ACCURACY)}
                  size={ETextSize.XS}
                  isLoading={isModelDetailLoading}
                />
              </div>
              <div className={cx(styles.ValidationAccuracyScore)}>
                <Text
                  content={`${modelData?.validation_accuracy} ${PERCENTAGE}`}
                  size={ETextSize.XS}
                  isLoading={isModelDetailLoading}
                />
              </div>
            </div>
          }
          </div>
        </div>
        {headerTabs}
      </div>
    );
  }

  const mapStateToProps = (state) => {
    return {
      modelList: state.MlModelListReducer.modelList,
      modelData: state.MlModelListReducer.modelData,
    isModelDetailLoading: state.MlModelListReducer.isModelDetailLoading,

    };
  };

  const mapDispatchToProps = {
    getTeamDetailsThunk,
    getDependencyListThunk,
    deactivateTeamApiThunk,
    teamDetailsDataChange,
    createEditDataChange,
  };

  export default connect(mapStateToProps, mapDispatchToProps)(ModelDetailsHeader);
