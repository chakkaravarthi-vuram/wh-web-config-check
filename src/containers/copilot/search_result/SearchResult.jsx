import React, { useContext, useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Chip,
  ETitleHeadingLevel,
  Title,
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import ThemeContext from '../../../hoc/ThemeContext';
import { COLOR_CONSTANTS } from '../../../utils/UIConstants';
import { isEmpty } from '../../../utils/jsUtility';
import Instruction from './instruction/Instruction';
import ResultCard from './result_card/ResultCard';
import Task from './task/Task';
import {
  COPILOT_STRINGS,
  RESULT_TAB_LIST,
  RESULT_TAB_VALUES,
} from '../Copilot.strings';
import { generateInstructionList } from '../Copilot.utils';
import {
  setCopilotDataChange,
} from '../../../redux/reducer/CopilotReducer';

function SearchResult(props) {
  const { search, onSubmit, closeSearch } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState(null);
  const { colorScheme } = useContext(ThemeContext);
  const { RESULTS } = COPILOT_STRINGS(t);
  const isEmptySearch = isEmpty(search);

  const searchRecommend = generateInstructionList(t, search);

  const OnRecommendationSelect = (value) => {
    const ins = searchRecommend.find((item) => item.id === value);
    dispatch(setCopilotDataChange({ data: { search: ins?.name } }));
    onSubmit();
  };

  const getTabComponent = () => {
    const component = [];
    const isNotSelected = isEmpty(selectedTab?.toString());
    if (isNotSelected || selectedTab === RESULT_TAB_VALUES.AI_SEARCH) {
      component.push(
        <div>
          <Title
            content={RESULTS.AI_SEARCH_RECOMMEND}
            headingLevel={ETitleHeadingLevel.h5}
            className={cx(gClasses.FTwo12GrayV86, gClasses.MB3)}
          />
          <div>
            {searchRecommend.map((data) => (
              <ResultCard key={data.id} data={data} onClick={OnRecommendationSelect} isClickable />
            ))}
          </div>
        </div>,
      );
    }
    if (isNotSelected || selectedTab === RESULT_TAB_VALUES.TASKS) {
      component.push(<Task search={search} closeSearch={closeSearch} />);
    }
    return component;
  };

  return isEmptySearch ? (
    <Instruction />
  ) : (
    <div
      className={cx(
        gClasses.DisplayFlex,
        gClasses.FlexDirectionColumn,
        gClasses.Gap16,
      )}
    >
      <div className={cx(gClasses.DisplayFlex, gClasses.Gap8)}>
        {RESULT_TAB_LIST(t, selectedTab).map((data) => {
          const isSelected = data.value === selectedTab;
          return (
            <Chip
              key={data.text}
              text={data.text}
              avatar={data.avatar}
              textColor={
                isSelected ? COLOR_CONSTANTS.WHITE : COLOR_CONSTANTS.BLACK
              }
              borderColor={
                isSelected ? colorScheme.activeColor : COLOR_CONSTANTS.BLUE_V1
              }
              backgroundColor={
                isSelected ? colorScheme.activeColor : COLOR_CONSTANTS.WHITE
              }
              onClick={() => {
                setSelectedTab(isSelected ? null : data.value);
              }}
            />
          );
        })}
      </div>
      {getTabComponent()}
    </div>
  );
}

SearchResult.defaultProps = { search: EMPTY_STRING };
SearchResult.propTypes = {
  search: PropTypes.string,
};

export default SearchResult;
