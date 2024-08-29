import React, { useState, useEffect } from 'react';
import {
  ETitleSize,
  Text,
  Title,
  InputDropdown,
  SingleDropdown,
  RadioGroup,
  RadioGroupLayout,
  EButtonType,
  Button,
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import styles from './WaitStepConfig.module.scss';
import ConfigModal from '../../../../../components/config_modal/ConfigModal';
import {
  INITIAL_TIMER_DETAILS,
  SEARCH_DATE_FIELDS,
  SPECIFIED_DROPDOWN_OPTIONS,
  WAITSTEP_CONFIG_STRINGS,
  WAITSTEP_CONFIG_TAB,
  WAITSTEP_RADIO_OPTIONS,
  WAIT_CONFIG_INITIAL,
} from './WaitStepConfig.strings';
import { DATE_FIELDS_SCROLL_ID, EVENT_TYPE, TIMER_DETAILS_CONSTANTS, TIMER_TYPE } from './WaitStepConfig.constants';
import StatusDropdown from '../status_dropdown/StatusDropdown';
import { NODE_CONFIG_TABS } from '../../../node_configuration/NodeConfiguration.constants';
import { apiGetAllFieldsList } from '../../../../../axios/apiService/flow.apiService';
import { RESPONSE_FIELD_KEYS } from '../end_step/EndStepConfig.constants';
import { nodeConfigDataChange, useFlowNodeConfig } from '../../../node_configuration/use_node_reducer/useNodeReducer';
import { generateEventTargetObject } from '../../../../../utils/generatorUtils';
import { cloneDeep, get, isEmpty, set } from '../../../../../utils/jsUtility';
import {
  WaitStepCommonValidateData,
  constructGetApiTimerDetails,
  constructWaitStepPostData,
} from './WaitStepConfig.utils';
import { waitStepValidationSchema } from './WaitStepConfig.validation.schema';
import { validate } from '../../../../../utils/UtilityFunctions';
import {
  CANCEL_LABEL,
  DELETE_STEP_LABEL,
  EMPTY_STRING,
  SAVE_LABEL,
} from '../../../../../utils/strings/CommonStrings';
import { FIELD_LIST_TYPE, FIELD_TYPE, INITIAL_PAGE, MAX_PAGINATION_SIZE } from '../../../../../utils/constants/form.constant';
import { DEFAULT_STEP_STATUS } from '../../../EditFlow.constants';
import { DIGITS_REGEX } from '../../../../../utils/strings/Regex';
import { displayErrorBasedOnActiveTab, getErrorTabsList } from '../../../node_configuration/NodeConfiguration.utils';
import { constructJoiObject } from '../../../../../utils/ValidationConstants';
import { basicNodeValidationSchema } from '../../../node_configuration/NodeConfiguration.schema';
import NodeConfigError from '../../../node_configuration/node_config_error/NodeConfigError';

function WaitStepConfig(props) {
  const {
    onDeleteStepClick,
    stepId,
    metaData: {
      flowId,
    },
    getStepNodeDetails,
    saveStepNode,
    isLoadingNodeDetails = true,
    isErrorInLoadingNodeDetails,
    updateFlowStateChange,
  } = props;
  const { t } = useTranslation();
  console.log('WaitStepConfigProps', props);
  const [paginationDetails, setPaginationDetails] = useState([]);
  const [searchText, setSearchText] = useState(EMPTY_STRING);

  const { TIMER_DATA, CHOOSE_FIELD, TIMER_TYPE_ID } = TIMER_DETAILS_CONSTANTS;
  const {
    state,
    dispatch,
  } = useFlowNodeConfig();

  const {
    stepStatus,
    selectedDateField,
    errorList,
    timerDetails,
    timerDetails: { timerType, timerData },
    dateFieldsList,
  } = state;

  const [tabIndex, setTabIndex] = useState(NODE_CONFIG_TABS.GENERAL);

  let tabContent = null;

  const getWaitNodeDetails = async () => {
    try {
      const response = await getStepNodeDetails(stepId);
      console.log('WaitStep_getAPIresponse', response);
      dispatch(nodeConfigDataChange({
        flowId: response?.flow_id,
        stepUuid: response?.step_uuid,
        stepId: response?._id,
        stepName: response?.step_name,
        stepOrder: response?.step_order,
        stepStatus: response?.step_status || DEFAULT_STEP_STATUS,
        selectedDateField: {},
        timerDetails: constructGetApiTimerDetails(response?.timer_details),
      },
      ));
    } catch (error) {
      console.log(error, 'waitStep_getAPIError');
    }
  };

  useEffect(() => {
    getWaitNodeDetails();
  }, []);

  const onTabChange = (value) => {
    setTabIndex(value);
  };

  const getAllDateFields = async (params) => {
    try {
      const apiParams = {
        ...params,
        size: MAX_PAGINATION_SIZE,
        sort_by: 1,
        flow_id: flowId,
        field_list_type: FIELD_LIST_TYPE.DIRECT,
        allowed_field_types: [FIELD_TYPE.DATE, FIELD_TYPE.DATETIME],
        include_property_picker: 1,
      };
      if (isEmpty(apiParams?.search)) delete apiParams.search;
      const response = await apiGetAllFieldsList(apiParams);
      console.log('responsegetWaitSTepFields', response, 'dateFieldsListResponse', response?.pagination_data);
      const { pagination_details = {}, pagination_data = [] } = response;
      pagination_data.map((field) => {
        field.value = field?.field_uuid;
        return field;
      });
      let newFieldList = [];
      if (params?.page > 1) {
        newFieldList = ([...dateFieldsList, ...pagination_data || []]);
        setPaginationDetails(pagination_details);
      } else {
        newFieldList = ([...pagination_data || []]);
        setPaginationDetails(pagination_details);
      }
      console.log('dateFieldsListNew', newFieldList);
      dispatch(
        nodeConfigDataChange({
          dateFieldsList: newFieldList,
        }),
      );
    } catch (e) {
      console.log('errorGetDataFIelds', e);
    }
  };

  const loadMoreFields = () => {
    console.log('loadMoreFieldsdateee');
    const params = {
      page: paginationDetails[0].page + 1,
    };
    if (!isEmpty(searchText)) params.search = searchText;
    getAllDateFields({
      ...params,
    });
  };

  const onSearchField = (event) => {
    const searchValue = event?.target?.value;
    console.log('searchValueonSearchField', searchValue);
    setSearchText(searchValue);
    const params = { page: INITIAL_PAGE };
    if (!isEmpty(searchValue)) params.search = searchValue;
    getAllDateFields(params);
  };

  const onDateFieldChange = (event) => {
    const {
      target: { id, value },
    } = event;

    console.log('onDateFieldChangeValue', value, 'id', id, 'event', event);
    const selectedField = dateFieldsList.find((field) => field?.field_uuid === value);
    const clonedDetails = cloneDeep(timerDetails);
    clonedDetails.timerData.fieldUuid = value;

    dispatch(
      nodeConfigDataChange({
        selectedDateField: selectedField,
        errorList: {},
        timerDetails: clonedDetails,
      }),
    );
  };

  const onStatusChangeHandler = (id, value) => {
    dispatch(
      nodeConfigDataChange({
        [id]: value,
      }),
    );
  };

  const onWaitTimeChange = (event) => {
    const { id, value } = event.target;
    let clonedDetails = cloneDeep(timerDetails);
    let dateFieldValue = selectedDateField;
    switch (id) {
      case TIMER_DATA.DURATION:
        let formattedValue = value;
        formattedValue = value?.replace(DIGITS_REGEX, EMPTY_STRING);
        set(clonedDetails,
          ['timerData', id],
          !isEmpty(formattedValue) ? Number(formattedValue) : formattedValue);
        break;
      case TIMER_DATA.DURATION_TYPE:
        timerData.durationType = value;
        set(clonedDetails, ['timerData', id], value);
        break;
      case TIMER_TYPE_ID:
        clonedDetails = {};
        clonedDetails[id] = value;
        if (value === TIMER_TYPE.FORM_FIELD_VALUE) {
          set(clonedDetails, 'timerData', {
            eventType: EVENT_TYPE.ON_TIME,
            fieldUuid: EMPTY_STRING,
          });
        } else {
          dateFieldValue = {};
          set(clonedDetails, 'timerData', cloneDeep(INITIAL_TIMER_DETAILS).timerData);
        }
        break;
      default: break;
    }
    dispatch(
      nodeConfigDataChange({
        timerDetails: clonedDetails,
        dateFieldValue,
        errorList: {},
      }),
    );
  };

  useEffect(() => {
    getAllDateFields({
      page: INITIAL_PAGE,
    });
    setSearchText(EMPTY_STRING);
  }, []);

  const onCloseWaitStep = () => {
    dispatch(
      nodeConfigDataChange({
        ...WAIT_CONFIG_INITIAL,
      },
      ));
      updateFlowStateChange({
        isNodeConfigOpen: false,
        activeStepId: null,
      });
  };

  const onStepNameChangeHandler = (e, isOnBlur) => {
    const { target: { id } } = e;
    let { target: { value } } = e;
    let errors = {};
    const { errorList = {} } = cloneDeep(state);
    if (isOnBlur) {
      value = value?.trim?.();
    }
    if (errorList?.[id] || isOnBlur) {
      errors = validate({ stepName: value?.trim?.() }, constructJoiObject({ [id]: basicNodeValidationSchema(t)?.[id] }));
    }
    if (isEmpty(errors)) {
      delete errorList?.[id];
    }
    dispatch(
      nodeConfigDataChange({
        [id]: value,
        errorList: {
          ...errorList,
          ...errors,
        },
      }),
    );
  };

  const handleServerErrors = (errorList) => {
    dispatch(nodeConfigDataChange({
      errorList,
    }));
  };

  const onSaveWaitStep = () => {
    const commonStepData = WaitStepCommonValidateData(state);
    const dataToBeValidated = { ...commonStepData, timerDetails };
    const errorList = validate(dataToBeValidated, waitStepValidationSchema(t));
    dispatch(
      nodeConfigDataChange({
        errorList: errorList,
        isSaveClicked: true,
      }),
    );
    console.log('waitnodeerrorList', errorList);
    if (isEmpty(errorList)) {
      const postData = constructWaitStepPostData(state);
      saveStepNode(
        postData,
        handleServerErrors,
      )
        .then((response) => {
          console.log('WaitNodeSaveStepResponse', response);
            updateFlowStateChange({
              isNodeConfigOpen: false,
              activeStepId: null,
            });
        })
        .catch((error) => {
          console.log('saveendnodeApiError', error);
        });
    } else {
      displayErrorBasedOnActiveTab(tabIndex, state?.stepType, errorList, t);
    }
  };

  const onDropdownBlur = () => {
    console.log('onDropdownBlurWaitstep');
    setSearchText(EMPTY_STRING);
    getAllDateFields({
      page: INITIAL_PAGE,
    });
  };

  const footerContent = (
    <div className={gClasses.MRA}>
      <Button
        buttonText={t(DELETE_STEP_LABEL)}
        noBorder
        className={styles.DeleteStepButton}
        onClickHandler={() => onDeleteStepClick(stepId)}
      />
    </div>
  );

  const getRadioOptions = () =>
    WAITSTEP_RADIO_OPTIONS(t).map((radioOptionsList) => {
      switch (radioOptionsList?.value) {
        case TIMER_TYPE.INTERVAL_VALUE:
          return {
            ...radioOptionsList,
            customElement: (
              <div className={cx(gClasses.MT12, gClasses.ML28)}>
                <InputDropdown
                  id={TIMER_DATA.ID}
                  className={cx(styles.SpecifiedMaxWidth)}
                  reverseLayout
                  optionList={SPECIFIED_DROPDOWN_OPTIONS(t)}
                  dropdownViewClass={styles.InputDropDownMaxWidth}
                  errorMessage={get(errorList, ['timerDetails,timerData,duration'], null)}
                  inputValue={timerData?.duration}
                  selectedValue={timerData?.durationType}
                  onInputChange={(e) => onWaitTimeChange(generateEventTargetObject(TIMER_DATA.DURATION, e?.target?.value))}
                  onDropdownClick={(value, label) => onWaitTimeChange(generateEventTargetObject(TIMER_DATA.DURATION_TYPE, value, { label }))}
                  selectedLabel={(SPECIFIED_DROPDOWN_OPTIONS(t).find((option) => option.value === timerData?.durationType))?.label}
                  placeholder="00"
                />
              </div>
            ),
          };
        case TIMER_TYPE.FORM_FIELD_VALUE:
          return {
            ...radioOptionsList,
            customElement: (
              <div className={cx(gClasses.MT12, gClasses.ML28)}>
                <SingleDropdown
                  id={CHOOSE_FIELD.ID}
                  selectedValue={timerData?.fieldUuid}
                  dropdownViewProps={{
                    selectedLabel: selectedDateField?.label,
                    onBlur: onDropdownBlur,
                  }}
                  className={cx(styles.DropDownMaxWidth)}
                  errorMessage={get(errorList, ['timerDetails,timerData,fieldUuid'], null)}
                  optionList={cloneDeep(dateFieldsList)}
                  infiniteScrollProps={{
                    dataLength: dateFieldsList?.length,
                    next: loadMoreFields,
                    hasMore: dateFieldsList?.length < paginationDetails[0]?.total_count,
                    scrollableId: DATE_FIELDS_SCROLL_ID,
                  }}
                  searchProps={{
                    searchPlaceholder: t(SEARCH_DATE_FIELDS),
                    searchValue: searchText,
                    onChangeSearch: onSearchField,
                  }}
                  placeholder={
                    WAITSTEP_CONFIG_STRINGS(t).GENERAL_TAB_CONTENT
                      .ATLEAST_PLACEHOLDER
                  }
                  onClick={(value, label, _list, id) => {
                    console.log('valueonsingleddclicl', value);
                    onDateFieldChange(generateEventTargetObject(id, value, { label }));
                  }}
                />
              </div>
            ),
          };
        default:
          return { ...radioOptionsList };
      }
    });
  if (!isLoadingNodeDetails) {
    if (isErrorInLoadingNodeDetails) {
      tabContent = (
        <NodeConfigError />
      );
    } else {
      if (tabIndex === NODE_CONFIG_TABS.ADDITIONAL) {
        tabContent = (
          <StatusDropdown
            contentTitle={WAITSTEP_CONFIG_STRINGS(t).ADDITIONAL_TAB_CONTENTS.TITLE}
            selectedValue={stepStatus}
            onChangeHandler={onStepNameChangeHandler}
            stepName={state?.stepName}
            stepNameError={errorList?.stepName}
            onClickHandler={
              (value) => onStatusChangeHandler(RESPONSE_FIELD_KEYS.STEP_STATUS, value)}
            textClassName={styles.textClass}
          />
        );
      } else {
        tabContent = (
          <>
            <Title
              content={WAITSTEP_CONFIG_STRINGS(t).GENERAL_TAB_CONTENT.TITLE_CONTENT}
              size={ETitleSize.xs}
              className={cx(styles.ContentTitleClass)}
            />
            <Text
              content={
                WAITSTEP_CONFIG_STRINGS(t).GENERAL_TAB_CONTENT.RADIO_GROUP_LABEL
              }
              className={cx(
                gClasses.MB8,
                gClasses.FontSize13,
                styles.ContentClassSubTitle,
              )}
            />
            <RadioGroup
              id={TIMER_TYPE_ID}
              selectedValue={timerType}
              options={getRadioOptions()}
              optionClassName={styles.RadioLabelClass}
              onChange={(_event, _id, value) => onWaitTimeChange(generateEventTargetObject(TIMER_TYPE_ID, value))}
              layout={RadioGroupLayout.stack}
            />
          </>
        );
      }
    }
  }
  return (
    <ConfigModal
      isModalOpen
      errorTabList={state?.isSaveClicked && getErrorTabsList(
        state?.stepType,
        state?.errorList,
    )}
      modalTitle={WAITSTEP_CONFIG_STRINGS(t).MODAL_TITLE}
      modalBodyContent={tabContent}
      onCloseClick={onCloseWaitStep}
      tabOptions={WAITSTEP_CONFIG_TAB(t)}
      currentTab={tabIndex}
      footercontent={footerContent}
      onTabSelect={(value) => onTabChange(value)}
      footerButton={[
        {
          buttonText: t(CANCEL_LABEL),
          onButtonClick: onCloseWaitStep,
          buttonType: EButtonType.TERTIARY,
        },
        {
          buttonText: t(SAVE_LABEL),
          onButtonClick: onSaveWaitStep,
          buttonType: EButtonType.PRIMARY,
        },
      ]}
    />
  );
}

export default WaitStepConfig;
