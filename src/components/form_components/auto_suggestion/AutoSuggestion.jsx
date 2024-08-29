import React, { Component } from 'react';
import axios from 'axios';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { generateEventTargetObject } from 'utils/generatorUtils';
import ThemeContext from '../../../hoc/ThemeContext';

import { axiosGetUtils } from '../../../axios/AxiosHelper';

import AutoSuggestionView from './AutoSuggestionView';

import {
  LIST_CONTAINER_ID,
  AUTO_SUGGESTION_CONSTRUCTOR,
  NO_RESULTS_FOUND,
  NONE,
  NO_VALUE,
} from './AutoSuggestion.strings';
import { KEY_CODES } from '../../../utils/Constants';
import { API_CALL_STRINGS } from '../../list_and_filter/ListAndFilter.strings';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

import { generateGetServerErrorMessage } from '../../../server_validations/ServerValidation';
import jsUtils, { isEmpty, nullCheck } from '../../../utils/jsUtility';
import {
  GET_ALL_FILE_EXTENSIONS,
  GET_ALL_FILE_TYPES,
} from '../../../urls/ApiUrls';

const AUTO_SUGGESTION_TYPES = {
  TYPE_1: 1,
  TYPE_2: 2,
  TYPE_3: 3,
};
const { CancelToken } = axios;
let cancelForGetSuggesstion;
let cancelForGetTypes;
let cancelForAddMember;
class AutoSuggestion extends Component {
  state = {
    ...AUTO_SUGGESTION_CONSTRUCTOR,
    getAllFileTypes: false,
    isDataLoading: false,
    fileExtensionLength: 0,
    fileTypeLength: 0,
  };

  componentDidUpdate(prevProps, prevState) {
    const { activeSuggestion } = this.state;
    if (prevState.activeSuggestion !== activeSuggestion) {
      const element = this.activeRef;
      console.log('element element element', element, element.current);
      if (element && element.current) {
        element.current.scrollIntoView({ block: 'nearest' });
      }
    }
  }

  componentWillUnmount() {
    const { setSearchValue, clearTextOnUnmount } = this.props;
    if (cancelForGetSuggesstion) cancelForGetSuggesstion();
    if (clearTextOnUnmount) setSearchValue(generateEventTargetObject(this.listContainerId, EMPTY_STRING));
  }

  render() {
    // console.log('memberSearchValue member_search_value', this.props.searchValue);
    const {
      optionList,
      isDropdownVisible,
      activeSuggestion,
      isOptionSelected,
      hasMore,
      document_url_details,
      getAllFileTypes,
      isDataLoading,
      isTaskAssigneeSuggestion,
      fileTypeLength,
    } = this.state;
    const {
      children,
      selectedData,
      readOnlyPrefix,
      readOnlySuffix,
      searchValue,
      getAllCurrencyTypes,
      referencePopperElement,
      getAllowedCurrencyTypes,
      allowedCurrencyList,
      // isActive,
      suggestionData,
      // lastSignin,
      // hideMessage,
      popperFixedStrategy,
      popperClassName,
      responsiveClass,
      actionButtons,
      getOption,
      inputUserRef,
      readOnly,
      referenceName,
      assigneeIndex,
      isCustomFormFields,
      isCustomDropdownList,
      noDataFoundOptionLabel,
      inputAriaLabelledBy,
      disabled,
      focusOnError,
      focusOnErrorRefresher,
      userInputAutoFocus,
      addMember,
      addTeam,
    } = this.props;
    console.log('searchValuesearchValue', searchValue);
    const passedProps = { ...this.props };
    const dataLength = optionList ? optionList.length : 0;
    this.listContainerId = LIST_CONTAINER_ID;
    const ChildComponent = children;
    return (
      <ChildComponent
        data={{
          isDropdownVisible,
          activeSuggestion,
          searchValue,
          isOptionSelected,
          selectedData,
          isTaskAssigneeSuggestion,
        }}
        userOptionList={optionList}
        fileTypeLength={fileTypeLength}
        getAllowedCurrencyTypes={getAllowedCurrencyTypes}
        allowedCurrencyList={allowedCurrencyList}
        document_url_details={document_url_details}
        onChangeHandler={this.onChangeHandler}
        onKeyDownHandler={this.onKeyDown}
        onFocusHandler={this.onFocusHandler}
        onBlurHandler={this.onBlurHandler}
        onOptionSelectHandler={this.onSelectHandler}
        readOnlyPrefix={readOnlyPrefix}
        readOnlySuffix={readOnlySuffix}
        innerRef={this.activeRef}
        inputAriaLabelledBy={inputAriaLabelledBy}
        dataLength={dataLength}
        onLoadMoreCallHandler={this.onLoadMoreCallHandler}
        hasMore={hasMore}
        id={this.listContainerId}
        getAllCurrencyTypes={getAllCurrencyTypes}
        getAllFileTypes={getAllFileTypes}
        referencePopperElement={referencePopperElement}
        // isSingleSelect={this.props.isSingleSelect}
        {...passedProps}
        suggestionData={suggestionData}
        isDataLoading={isDataLoading}
        popperFixedStrategy={popperFixedStrategy}
        popperClassName={popperClassName}
        responsiveClass={responsiveClass}
        actionButtons={actionButtons}
        getOption={getOption}
        inputUserRef={inputUserRef}
        readOnly={readOnly}
        referenceName={referenceName}
        assigneeIndex={assigneeIndex}
        isCustomFormFields={isCustomFormFields}
        isCustomDropdownList={isCustomDropdownList}
        noDataFoundOptionLabe={noDataFoundOptionLabel}
        disabled={disabled}
        userInputAutoFocus={userInputAutoFocus}
        focusOnError={focusOnError}
        focusOnErrorRefresher={focusOnErrorRefresher}
        addMember={addMember}
        addTeam={addTeam}
      />
    );
  }

  onFocusHandler = () => {
    const { searchValue, getAllFileExtensions, customAddmemberDropdownList, isCustomDropdownList, isMultiSectionView, getOption, getTestBedAssignees, isCustomFormFields } =
      this.props;
    const { getAllFileTypes } = this.state;
    if (isCustomDropdownList) {
      this.setState({
        optionList: customAddmemberDropdownList,
        isDropdownVisible: true,
      });
    }
    if (
      jsUtils.isEmpty(searchValue) &&
      getAllFileExtensions &&
      !getAllFileTypes
    ) {
      this.currentPage = 1;
      this.setState({ isOptionSelected: false, hasMore: true, isTaskAssigneeSuggestion: true }, () => {
        this.getFileExtensionsApi(API_CALL_STRINGS.INPUT_HANDLER);
      });
    }
    if ((isMultiSectionView || getOption || getTestBedAssignees || isCustomFormFields) && jsUtils.isEmpty(searchValue)) {
      this.setState({ isDataLoading: true }, () =>
        this.getDataFromAPI(API_CALL_STRINGS.INPUT_HANDLER));
    }
  };

  onChangeHandler = (event) => {
    const { setSearchValue, getAllFileExtensions, searchValue } = this.props;
    if (getAllFileExtensions) {
      if (event.target.value !== searchValue) {
        this.currentPage = 1;
        setSearchValue(event);
        this.setState({ isOptionSelected: false, hasMore: true }, () => {
          this.getFileExtensionsApi(API_CALL_STRINGS.INPUT_HANDLER);
        });
        return;
      }
      return;
    }
    this.getDataFromAPI(API_CALL_STRINGS.INPUT_HANDLER, event);
    setSearchValue(event);
    this.setState({ isOptionSelected: false, activeSuggestion: 0 });
    // this.setState({ isOptionSelected: false }, () => {
    //   this.getDataFromAPI(API_CALL_STRINGS.INPUT_HANDLER, event);
    // });
  };

  onLoadMoreCallHandler = () => {
    const totalCardsRendered =
      this.dataCountPerCall * (this.currentPage - 1) + this.currentPageCount;
    console.debug(
      'on load more',
      totalCardsRendered,
      this.state,
      this.count,
      this.currentPage,
    );
    if (this.count > totalCardsRendered) {
      this.loadData();
    } else {
      this.setState({
        hasMore: false,
      });
    }
  };

  onKeyDown = (e) => {
    const { activeSuggestion, optionList } = this.state;
    const { selectedUserData, suggestedTaskAssignee } = this.props;
    const filteredOptionList = optionList.filter((option) => {
      if (!jsUtils.isEmpty(selectedUserData) && !jsUtils.isEmpty(option)) {
        if (!jsUtils.isEmpty(option._id) && this.isUserAreadySelected(option._id)) {
          return false;
        }
      }
      return true;
    });
    console.log(filteredOptionList[activeSuggestion], 'optionList[activeSuggestion]', filteredOptionList, activeSuggestion);
    if (e.keyCode === KEY_CODES.ENTER) {
      this.onSelectHandler(suggestedTaskAssignee?.[activeSuggestion]);
    } else if (e.keyCode === KEY_CODES.UP_ARROW) {
      e.preventDefault();
      if (activeSuggestion !== 0) {
        this.setState({ activeSuggestion: activeSuggestion - 1 });
      }
    } else if (e.keyCode === KEY_CODES.DOWN_ARROW) {
      if (activeSuggestion !== filteredOptionList.length - 1) {
        this.setState({ activeSuggestion: activeSuggestion + 1 });
      }
    }
  };

  onBlurHandler = () => {
    const { setSearchValue } = this.props;
    this.setState({
      isDropdownVisible: false,
      getAllFileTypes: false,
      hasMore: true,
      activeSuggestion: 0,
    }, () => {
      setSearchValue(generateEventTargetObject(this.listContainerId, EMPTY_STRING));
    });
    this.currentPage = 1;
    this.currentPageCount = 0;
  };

  onSelectHandler = (optionValue) => {
    const { optionList, activeSuggestion } = this.state;
    const { id, onSelectHandler, selectedUserData } = this.props;
    let value;
    if (optionValue) value = optionValue;
    else {
      const filteredOptionList = optionList.filter((option) => {
        if (!jsUtils.isEmpty(selectedUserData) && !jsUtils.isEmpty(option)) {
          if (!jsUtils.isEmpty(option._id) && this.isUserAreadySelected(option._id)) {
            return false;
          }
        }
        return true;
      });
      value = filteredOptionList[activeSuggestion];
    }
    const data = { target: { id, value } };
    if (value && !jsUtils.has(value, NO_VALUE) && value.value !== NONE) {
      this.setState(() => {
        onSelectHandler(data);
      });
    }
    this.setState({
      activeSuggestion: 0,
      isOptionSelected: true,
      isDropdownVisible: false,
      optionList: AUTO_SUGGESTION_CONSTRUCTOR.optionList,
    });
  };

  activeRef = React.createRef();

  isUserAreadySelected = (uniqueId) => {
    const { selectedUserData } = this.props;
    return selectedUserData.find((user) => user._id === uniqueId || user.value === uniqueId);
  };

  getCancelTokenAddMember = (cancelToken) => {
    cancelForAddMember = cancelToken;
  };

  dataCountPerCall = 5;

  count = 0;

  currentPageCount = 0;

  currentPage = 1;

  loadData = () => {
    const { getAllFileExtensions } = this.props;
    this.currentPage += 1;
    if (getAllFileExtensions) this.getFileExtensionsApi(API_CALL_STRINGS.LOAD_DATA);
    else this.getDataFromAPI(API_CALL_STRINGS.LOAD_DATA);
  };

  getDataFromAPI = (type, event = {}) => {
    const {
      apiUrl,
      apiParams = {},
      // getAllCurrencyTypes,
      searchValue,
      isActive,
      lastSignin,
      isMultiSectionView,
      getAllowedCurrencyTypes,
      allowedCurrencyList,
      getTestBedAssignees,
      t,
    } = this.props;
    let searchVal = nullCheck(event, 'target.value')
      ? event.target.value
      : '';
    if (isEmpty(searchVal)) searchVal = searchValue;
    if (getAllowedCurrencyTypes) {
      if (searchVal) {
        let optionList = allowedCurrencyList.filter((currency) =>
          jsUtils.startsWith(currency, jsUtils.upperCase(searchVal)));
        optionList = optionList.map((option) => {
          return { _id: option, code: option, currency: option };
        });
        if (isEmpty(optionList)) optionList = [{ _id: 'None', value: 'None' }];
        const isDropdownVisible = this.setDropdownVisibility(optionList);
        this.setState({
          optionList,
          isDropdownVisible,
          isDataLoading: false,
        });
        return true;
      }
      let optionList = allowedCurrencyList;
      optionList = optionList.map((option) => {
        return { _id: option, code: option, currency: option };
      });
      const isDropdownVisible = this.setDropdownVisibility(optionList);
      this.setState({
        optionList,
        isDropdownVisible,
        isDataLoading: false,
      });
      return true;
    }
    // let searchValueLimit = 1;
    // if (getAllCurrencyTypes) {
    //   searchValueLimit = 1;
    // }
    if (
      isMultiSectionView ||
      !jsUtils.isEmpty(searchVal) ||
      (searchVal || []).length >= 0 ||
      getTestBedAssignees
    ) {
      const params = {
        size: this.dataCountPerCall,
        page: this.currentPage,
        ...apiParams,
        // search: searchValue,
      };
      if (cancelForAddMember) cancelForAddMember();
      console.log('searchValsearchVal', searchVal);
      if (searchVal) params.search = searchVal;
      if (isActive) {
        params.is_active = 1;
      }
      if (lastSignin) {
        params.is_last_signin = 0;
      }
      delete params?.entry_id;
      axiosGetUtils(apiUrl, {
        params,
        cancelToken: new CancelToken((c) => {
          this.getCancelTokenAddMember(c);
        }),
      })
        .then((response) => {
          const { setErrorMessage } = this.props;
          let optionList = [];
          let isDropdownVisible = false;
          let document_url_details = {};

          if (setErrorMessage) setErrorMessage('');
          if (type === API_CALL_STRINGS.INPUT_HANDLER) {
            if (getTestBedAssignees) {
              optionList = jsUtils.isEmpty(
                response.data.result.data.pagination_data,
              )
                ? [{ noValue: t(NO_RESULTS_FOUND) }]
                : [...response.data.result.data.pagination_data];
            } else {
              this.count =
                response.data.result.data.pagination_details[0].total_count;
              this.currentPageCount =
                response.data.result.data.pagination_data.length;
              optionList = jsUtils.isEmpty(
                response.data.result.data.pagination_data,
              )
                ? [{ noValue: t(NO_RESULTS_FOUND) }]
                : [...response.data.result.data.pagination_data];
            }
            isDropdownVisible = true;
            document_url_details = response.data.result.data.document_url_details || {};
            this.setState({
              optionList,
              isDropdownVisible,
              document_url_details,
              isDataLoading: false,
            });
          } else if (type === API_CALL_STRINGS.LOAD_DATA) {
             const { optionList: stateOptionList } = this.state;
            if (getTestBedAssignees) {
              optionList = stateOptionList;
              const reponseDataList = response.data.result.data.pagination_data;
              optionList = [...optionList, ...reponseDataList];
            } else {
              optionList = stateOptionList;
              const reponseDataList = response.data.result.data.pagination_data;
              optionList = [...optionList, ...reponseDataList];
              this.currentPageCount =
                response.data.result.data.pagination_data.length;
            }
            isDropdownVisible = this.setDropdownVisibility(optionList);
            document_url_details = response.data.result.data.document_url_details || {};

            this.setState({
              optionList,
              isDropdownVisible,
              document_url_details,
            });
          }
        })
        .catch((error) => {
          const errors = generateGetServerErrorMessage(error);
          const { setErrorMessage } = this.props;
          if (setErrorMessage) setErrorMessage(errors.common_server_error, error);
          this.setState({
            common_server_error: errors.common_server_error,
            isDataLoading: false,
          });
        });
    } else {
      this.setState({
        isDropdownVisible: false,
      });
    }
    return null;
  };

  getFileExtensionsApi = async (type) => {
    const { searchValue, t } = this.props;
    const params = {
      size: this.dataCountPerCall,
      page: this.currentPage,
      // search: searchValue,
    };
    if (searchValue) params.search = searchValue;
    if (cancelForGetSuggesstion) cancelForGetSuggesstion();
    if (cancelForGetTypes) cancelForGetTypes();
    if (type === API_CALL_STRINGS.INPUT_HANDLER) {
      const { getAllFileTypes } = this.state;
      const results = [];
      const getTypesParams = {
        size: 25,
        page: 1,
        // search: searchValue,
      };
      if (searchValue) getTypesParams.search = searchValue;

      results.push(
        axiosGetUtils(GET_ALL_FILE_TYPES, {
          params: getTypesParams,
          cancelToken: new CancelToken((c) => {
            cancelForGetTypes = c;
          }),
        }),
      );
      results.push(
        axiosGetUtils(GET_ALL_FILE_EXTENSIONS, {
          params,
          cancelToken: new CancelToken((c) => {
            cancelForGetSuggesstion = c;
          }),
        }),
      );
      try {
        const resolvedResults = await Promise.all(results);
        this.count =
          resolvedResults[1].data.result.data.pagination_details[0].total_count;
        this.currentPageCount =
          resolvedResults[1].data.result.data.pagination_data.length;
        const optionList =
          jsUtils.isEmpty(
            ...resolvedResults[0].data.result.data.pagination_data,
          ) &&
            jsUtils.isEmpty(
              ...resolvedResults[1].data.result.data.pagination_data,
            )
            ? [{ noValue: t(NO_RESULTS_FOUND) }]
            : [
              ...resolvedResults[0].data.result.data.pagination_data,
              ...resolvedResults[1].data.result.data.pagination_data,
            ];
        const isDropdownVisible = this.setDropdownVisibility(optionList);
        this.setState({
          fileTypeLength: resolvedResults[0].data.result.data.pagination_details[0].total_count,
          fileExtensionLength: resolvedResults[0].data.result.data.pagination_data.length,
          optionList,
          isDropdownVisible,
          getAllFileTypes: jsUtils.isEmpty(searchValue)
            ? true
            : getAllFileTypes,
        });
      } catch (error) {
        const errors = generateGetServerErrorMessage(error);
        this.setState({
          common_server_error: errors.common_server_error,
          isDataLoading: false,
        });
      }
    } else if (type === API_CALL_STRINGS.LOAD_DATA) {
      try {
        const resolvedResults = await axiosGetUtils(GET_ALL_FILE_EXTENSIONS, {
          params,
          cancelToken: new CancelToken((c) => {
            cancelForGetSuggesstion = c;
          }),
        });
        let { optionList } = this.state;
        const responseDataList =
          resolvedResults.data.result.data.pagination_data;
        const length = optionList[Object.getOwnPropertySymbols(optionList)[0]];
        optionList = [...optionList, ...responseDataList];
        console.log(
          'file extension load more handler',
          JSON.stringify([...optionList]),
          JSON.stringify([...responseDataList]),
          length,
        );
        this.currentPageCount =
          resolvedResults.data.result.data.pagination_data.length;
        const isDropdownVisible = this.setDropdownVisibility(optionList);
        this.setState({
          fileExtensionLength: length,
          optionList,
          isDropdownVisible,
        });
      } catch (error) {
        const errors = generateGetServerErrorMessage(error);
        this.setState({
          common_server_error: errors.common_server_error,
          isDataLoading: false,
        });
      }
    }
  };

  setDropdownVisibility = (optionList) => {
    const {
      searchValue,
      getAllFileExtensions,
      getAllowedCurrencyTypes,
      getOption,
      getTestBedAssignees,
      isCustomFormFields,
    } = this.props;
    if (getAllFileExtensions && optionList) return true;
    if (getAllowedCurrencyTypes && optionList) return true;
    if (getOption && optionList) return true;
    if (getTestBedAssignees && optionList) return true;
    if (!searchValue || !searchValue.trim()) return false;
    if (isCustomFormFields && optionList) return true;
    return true;
    // if (optionList.length > 0) {
    // return true;
    // }
    // return false;
  };
}

export default withTranslation()(React.forwardRef((props, ref) => (
  <AutoSuggestion containerRef={ref} {...props} />
)));
export { AutoSuggestionView };
export { AUTO_SUGGESTION_TYPES };
AutoSuggestion.contextType = ThemeContext;

AutoSuggestion.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.node,
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  selectedData: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  readOnlyPrefix: PropTypes.string,
  readOnlySuffix: PropTypes.string,
  id: PropTypes.string.isRequired,
  onSelectHandler: PropTypes.func.isRequired,
  setSearchValue: PropTypes.func.isRequired,
  searchValue: PropTypes.string,
  apiUrl: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  lastSignin: PropTypes.bool,
  getAllFileExtensions: PropTypes.bool,
  getAllCurrencyTypes: PropTypes.bool,
  isMultiSectionView: PropTypes.func,
  suggestedTaskAssignee: PropTypes.element,
  isCustomFormFields: PropTypes.bool,
  clearTextOnUnmount: PropTypes.bool,
};

AutoSuggestion.defaultProps = {
  selectedData: EMPTY_STRING,
  readOnlyPrefix: null,
  readOnlySuffix: null,
  searchValue: EMPTY_STRING,
  isActive: false,
  lastSignin: false,
  getAllFileExtensions: false,
  getAllCurrencyTypes: false,
  isMultiSectionView: false,
  suggestedTaskAssignee: null,
  isCustomFormFields: false,
  clearTextOnUnmount: true,
};
