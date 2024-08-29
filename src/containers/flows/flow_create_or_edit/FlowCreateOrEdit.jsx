import React, { useContext, useEffect, useRef, useState } from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames';
import { Prompt, useHistory } from 'react-router-dom';
import { EToastType, WorkHallPageLoader, toastPopOver } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { invert } from 'lodash';
import FlowCreateOrEditDetails from './flow_create_edit_details/FlowCreateOrEditDetails';
import FlowCreateOrEditHeader from './flow_create_edit_header/FlowCreateOrEditHeader';
import { EDIT_FLOW_HEADER_TYPE, FLOW_CREATE_EDIT_CONSTANTS, VALIDATE_FLOW_HEADER_KEY_MAP } from './FlowCreateOrEdit.constant';
import useFlow, { FLOW_ACTIONS, FlowReducer } from '../useFlow';
import jsUtility, { get, isEmpty } from '../../../utils/jsUtility';
import { saveFlow, getFlowDetailsById, validateFlow, publishFlow as publishFlowApi } from '../../../axios/apiService/flow.apiService';
import { getShortCode, handleBlockedNavigation, isBasicUserMode, routeNavigate, setLoaderAndPointerEvent, somethingWentWrongErrorToast } from '../../../utils/UtilityFunctions';
import { ROUTE_METHOD } from '../../../utils/Constants';
import { ADMIN_HOME, ALL_PUBLISHED_FLOWS, EDIT_FLOW, FLOW_DRAFT_MANAGED_BY_YOU, LIST_FLOW } from '../../../urls/RouteConstants';
import { constructSaveFlowForSecurity, validateFlowSecurity } from './flow_create_edit_details/flow_security/FlowCreateEditSecurity.utils';
import { clearEditFlowData } from '../../../redux/reducer/EditFlowReducer';
import { constructSaveFlowForAddOn, validateFlowAddOn } from './flow_create_edit_details/language_and_others/LanguageAndOther.utils';
import { ERROR_TYPE_PATTERN_BASE_ERROR, SOMEONE_EDITING } from '../../../utils/ServerValidationUtils';
import { updateSomeoneIsEditingPopover } from '../../edit_flow/EditFlow.utils';
import { PUBLISH_FLOW } from '../../../urls/ApiUrls';
import { deconstructBasicFlowData, formatPublishError } from './FlowCreateEdit.utils';
import { dataListStateChangeAction } from '../../../redux/reducer/CreateDataListReducer';
import ThemeContext from '../../../hoc/ThemeContext';
import { validateFormDetails } from '../../shared_container/individual_entry/summary_builder/SummaryBuilder.utils';
import { displayErrorToast } from '../../../utils/flowErrorUtils';
import { FLOW_STRINGS } from '../../edit_flow/EditFlow.strings';

// comments - update i18n
import styles from './FlowCreateOrEdit.module.scss';
import { INDIVIDUAL_ENTRY_TAB_TYPES } from '../../shared_container/individual_entry/IndividualEntry.strings';
import { CREATE_APP_STRINGS } from '../../application/create_app/CreateApp.strings';

function FlowCreateEdit() {
    const history = useHistory();
    const flowUUID = get(history, ['location', 'state', 'flow_uuid']);
    const { state, dispatch } = useFlow({});
    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState(false);
    const [currentTab, setCurrentTab] = useState(0);
    const [dashboardErrors, setDashboardErrors] = useState({});
    const [dashboardValidateError, setDashboardValidateError] = useState({});
    const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
    const isBasicUser = isBasicUserMode(history);
    const colorSchema = isBasicUser ? colorScheme : colorSchemeDefault;
    const { pageMetadata } = useSelector((store) => store.IndividualEntryReducer);
    const { t } = useTranslation();
    const metaData = {
      flowId: state.id,
      flowUUID: flowUUID,
    };

    const reduxDispatch = useDispatch();
    const blockNavigationRef = useRef(true);

    const promptBeforeLeaving = (location) => {
      if (
        !location.pathname.includes(EDIT_FLOW) &&
        blockNavigationRef.current
      ) {
        handleBlockedNavigation(
          t,
          () => {
            blockNavigationRef.current = false;
          },
          history,
          location,
        );
        return false;
      }
      return true;
    };

    const onSaveFlow = (postData, options = {}, setBasicErrorList) => {
      setLoaderAndPointerEvent(true);
      return saveFlow(postData, false)
        .then((res) => {
          options?.onSuccess?.(res);
        })
        .catch((err) => {
          options?.onError?.(err);
          const error = get(err, ['response', 'data', 'errors', 0], {});
          console.log('xyz err', err, error);
          if (error?.field === 'flow_name' && error.type === ERROR_TYPE_PATTERN_BASE_ERROR) {
            setBasicErrorList?.({ name: CREATE_APP_STRINGS(t).APP_NAME.ALPHANUMBERIC_ERROR });
          } else if (error?.type === SOMEONE_EDITING) {
            updateSomeoneIsEditingPopover(error.message, options);
          } else {
            const { ERRORS } = FLOW_CREATE_EDIT_CONSTANTS(t);
            somethingWentWrongErrorToast(
              ERRORS.SAVE_FLOW_FAIL_TITLE,
              ERRORS.SAVE_FLOW_FAIL_SUBTITLE,
            );
          }
        })
        .finally(() => setLoaderAndPointerEvent(false));
    };

    const getFlowBasedInfo = async () => {
      setLoaderAndPointerEvent(true);
      // comments - can we use single variable for params?
      const params = { flow_uuid: flowUUID };
      const someoneEditingParams = { flow_uuid: flowUUID };

      try {
        const res = await getFlowDetailsById(params);
        const postData = { flow_uuid: res.flow_uuid, flow_name: res.flow_name };
        postData.flow_short_code = res?.flow_short_code || getShortCode(res.flow_name);
        postData.technical_reference_name = res?.technical_reference_name;
        if (res.flow_description) postData.flow_description = res.flow_description;
        someoneEditingParams.flow_id = res._id;
        const _res = await saveFlow(postData);

        const flowData = deconstructBasicFlowData(_res);
        dispatch(FLOW_ACTIONS.DATA_CHANGE, flowData);
        setLoaderAndPointerEvent(false);
        setLoading(false);
      } catch (err) {
        const error = get(err, ['response', 'data', 'errors', 0], {});
        console.log('xyz err', err, error);
        if (error?.type === SOMEONE_EDITING) {
          updateSomeoneIsEditingPopover(error.message, someoneEditingParams);
        } else {
          somethingWentWrongErrorToast();
        }
        setLoaderAndPointerEvent(false);
      }
    };

    useEffect(() => {
      if (!flowUUID) {
        routeNavigate(history, ROUTE_METHOD.REPLACE, ADMIN_HOME, null, null);
      } else {
        // comments - to be clarified
        reduxDispatch(dataListStateChangeAction({}, 'category'));
        getFlowBasedInfo();
      }
      return () => {
        reduxDispatch(clearEditFlowData()); // to clear reducer state of Capture Data tab
      };
    }, []);

    const navigateBack = (toDraft = false) => {
      blockNavigationRef.current = false;
      routeNavigate(history, ROUTE_METHOD.PUSH, `${LIST_FLOW}${toDraft ? FLOW_DRAFT_MANAGED_BY_YOU : ALL_PUBLISHED_FLOWS}`);
    };

    const validateFlowSteps = async () => {
      try {
        setLoaderAndPointerEvent(true);
        const params = { flow_uuid: state.uuid };
        await validateFlow(params);
        setLoaderAndPointerEvent(false);
      } catch (err) {
        const error = get(err, ['response', 'data', 'errors', 0], {});
        console.log('xyz validateFlow', err, error);
        setLoaderAndPointerEvent(false);
        if (!isEmpty(error)) {
          const { isErrorInFlowSteps } = formatPublishError(error, { t, dispatch, reduxDispatch }, true);
          return isErrorInFlowSteps ? {
            isErrorInFlowSteps,
          } : {};
        } else {
          somethingWentWrongErrorToast();
        }
      }
      return {};
    };

    const validateCurrenTab = async () => {
        let validations = {};
        switch (currentTab) {
          case EDIT_FLOW_HEADER_TYPE.DATA:
            validations = await validateFlowSteps();
            break;
          case EDIT_FLOW_HEADER_TYPE.SECURITY: {
            const { errors, validatedPolicyList } = validateFlowSecurity(state.security, t);
            const security = { errorList: errors };
            if (validatedPolicyList) security.securityPolicies = validatedPolicyList;
            dispatch(FLOW_ACTIONS.UPDATE_SECURITY, security);
            validations = { ...errors };
            break;
          }
          case EDIT_FLOW_HEADER_TYPE.LANGUAGE: {
            const errorList = validateFlowAddOn(state.addOn, t);
            dispatch(FLOW_ACTIONS.UPDATE_ADD_ON, { errorList });
            validations = { ...errorList };
          }
            break;
          case EDIT_FLOW_HEADER_TYPE.ALL_DATA_REPORT:
            validations = dashboardValidateError?.dataReportErrors || null;
            break;
          case EDIT_FLOW_HEADER_TYPE.DATA_DASHBOARD: {
            const clonePageMetadata = jsUtility.cloneDeep(pageMetadata);
            if (
              clonePageMetadata.type === INDIVIDUAL_ENTRY_TAB_TYPES.PAGE_BUILDER
            ) {
              validations = validateFormDetails?.(
                jsUtility.cloneDeep(
                  clonePageMetadata?.formMetadata?.sections || [],
                ),
                t,
              );
              if (!jsUtility.isEmpty(validations)) {
                displayErrorToast(
                  FLOW_STRINGS.SERVER_RESPONSE.FORM_CONFIGURATION_VALIDATION,
                );
              }
              setDashboardErrors({ sectionError: validations });
            }
          }
            break;
          case EDIT_FLOW_HEADER_TYPE.RELATED_ACTIONS:
            break;
          default: break;
        }
        return validations;
    };

    const getPostDataBasedOnTab = () => {
      let postData = {};
      switch (currentTab) {
        case EDIT_FLOW_HEADER_TYPE.DATA:
          break;
        case EDIT_FLOW_HEADER_TYPE.SECURITY:
          postData = constructSaveFlowForSecurity(state);
          break;
        case EDIT_FLOW_HEADER_TYPE.LANGUAGE:
          postData = constructSaveFlowForAddOn(state);
          break;
        case EDIT_FLOW_HEADER_TYPE.ALL_DATA_REPORT:
          break;
        case EDIT_FLOW_HEADER_TYPE.DATA_DASHBOARD:
          break;
        case EDIT_FLOW_HEADER_TYPE.RELATED_ACTIONS:
          break;
        default:
          break;
      }

      postData.flow_uuid = state.uuid;
      postData.flow_name = state.name;
      if (state.description) postData.flow_description = state.description;

      return postData;
    };

    const onTabChange = async (idx) => {
      if (idx === currentTab) return;

      const validations = await validateCurrenTab();
      if (!isEmpty(validations)) return;
      // remove publishErrors of the tab
      const publishErrors = { ...(state.publishErrors || {}) };
      const invertedFlowTabHeaderObj = invert(VALIDATE_FLOW_HEADER_KEY_MAP);
      delete publishErrors[invertedFlowTabHeaderObj[currentTab]];
      dispatch(FLOW_ACTIONS.DATA_CHANGE, { publishErrors });

      const postData = getPostDataBasedOnTab();
      const options = { onSuccess: () => setCurrentTab(idx) };
      onSaveFlow(postData, options);
    };

    const onSaveAndClose = () => {
      const { TOAST_MESSAGES } = FLOW_CREATE_EDIT_CONSTANTS(t);
      const postData = getPostDataBasedOnTab();
      const options = {
        onSuccess: () => {
          blockNavigationRef.current = false;
          toastPopOver({
            title: TOAST_MESSAGES.FLOW_SAVED,
            toastType: EToastType.success,
          });
          navigateBack(true);
        },
      };
      onSaveFlow(postData, options);
    };

    const onPublish = async () => {
      const { TOAST_MESSAGES, ERRORS } = FLOW_CREATE_EDIT_CONSTANTS(t);
      const errors = await validateCurrenTab();
      if (!isEmpty(errors) || !isEmpty(dashboardValidateError?.dataReportErrors)) return;

      setPublishing(true);
      setLoaderAndPointerEvent(true);
      // 1. saveFlow
      try {
        const postData = getPostDataBasedOnTab();
        await onSaveFlow(postData, {});
      } catch (e) {
        console.log('xyz saveFlow', e);
        setLoaderAndPointerEvent(false);
        somethingWentWrongErrorToast(
          ERRORS.SAVE_FLOW_FAIL_TITLE,
          ERRORS.SAVE_FLOW_FAIL_SUBTITLE,
        );
        setPublishing(false);
        return;
      }

      // 2. validate Flow
      try {
        const params = { flow_uuid: state.uuid };
        await validateFlow(params);
      } catch (err) {
        const error = get(err, ['response', 'data', 'errors', 0], {});
        console.log('xyz validateFlow', err, error);
        if (!isEmpty(error)) {
          const { errors: publishErrors, dashboardErrors } = formatPublishError(error, { t, dispatch, reduxDispatch });
          dispatch(FLOW_ACTIONS.DATA_CHANGE, { publishErrors });
          setDashboardErrors(dashboardErrors);
          toastPopOver({
            title: ERRORS.VALIDATE_FLOW_TITLE,
            subtitle: ERRORS.VALIDATE_FLOW_SUBTITLE,
            toastType: EToastType.error,
          });
        } else {
          somethingWentWrongErrorToast();
        }
        setLoaderAndPointerEvent(false);
        setPublishing(false);
        return;
      }

      // 3. publish Flow
      try {
        const postData = { flow_uuid: state.uuid };
        await publishFlowApi(postData, PUBLISH_FLOW);
        blockNavigationRef.current = false;
        navigateBack();
        toastPopOver({
          title: TOAST_MESSAGES.FLOW_PUBLISHED,
          toastType: EToastType.success,
        });
      } catch (err) {
        console.log('xyz publish error', err);
        somethingWentWrongErrorToast(
          ERRORS.SAVE_FLOW_FAIL_TITLE,
          ERRORS.SAVE_FLOW_FAIL_SUBTITLE,
        );
      } finally {
        setLoaderAndPointerEvent(false);
        setPublishing(false);
      }
    };

    // comments - refactor and return in a much informative way
    if (loading) {
      return <WorkHallPageLoader color={colorSchema?.activeColor && colorSchema?.activeColor} className={gClasses.H100} />;
    }

    return (
      <div
        className={cx(
          gClasses.DisplayFlex,
          gClasses.FlexDirectionColumn,
          gClasses.Height100Vh,
          gClasses.PositionRelative,
        )}
      >
        <Prompt when message={promptBeforeLeaving} />
        <FlowCreateOrEditHeader
          state={state}
          metaData={metaData}
          currentTab={currentTab}
          onTabChange={onTabChange}
          dispatch={dispatch}
          onPublish={onPublish}
          onSaveAndClose={onSaveAndClose}
          onSaveFlow={onSaveFlow}
          onDiscardDelete={navigateBack}
        />
        <FlowCreateOrEditDetails
          state={state}
          metaData={metaData}
          dispatch={dispatch}
          currentTab={currentTab}
          dashboardErrors={dashboardErrors}
          onUpdateError={setDashboardValidateError}
        />
        {publishing && (
          <div className={styles.PublishingLoader}>
            <WorkHallPageLoader color={colorSchema?.activeColor && colorSchema?.activeColor} className={gClasses.H100} />
          </div>
        )}
      </div>
    );
}

function ProviderFlowCreateEdit(props) {
  return (
    <FlowReducer initialState={{}}>
      <FlowCreateEdit {...props} />
    </FlowReducer>
  );
}

export default ProviderFlowCreateEdit;
