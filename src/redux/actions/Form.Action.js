import { translate } from 'language/config';
import { EToastPosition, EToastType, toastPopOver } from '@workhall-pvt-lmt/wh-ui-library';
import {
  addNewCategoryApiService,
  checkFieldDependencyApi,
  deleteAction,
  deleteField,
  deleteFieldApiService,
  deleteSectionApi,
  deleteTable,
  getActionsApi,
  getCategoryApiService,
  getFieldDetails,
  getFormDetailsApi,
  getFormDetailsApiService,
  getFormDetailsByFilterApi,
  listDependencyAPI,
  saveAction,
  saveForm,
  saveFormApi,
  saveFormContentApi,
  saveFormHeader,
  saveSectionApi,
  sectionOrderApi,
  updateFormFieldOrderApi,
} from '../../axios/apiService/form.apiService';
import {
  rearrageStepOnStepId,
  setPointerEvent,
  showToastPopover,
  somethingWentWrongErrorToast,
  updatePostLoader,
} from '../../utils/UtilityFunctions';

import jsUtility, {
  isEmpty,
  isNull,
  nullCheck,
  set,
  cloneDeep,
} from '../../utils/jsUtility';
import { FORM_POPOVER_STATUS, MODULE_TYPES } from '../../utils/Constants';
import { getAllFlowStepsWithFormApiService } from '../../axios/apiService/flow.apiService';
import { normalizer } from '../../utils/normalizer.utils';
import { REQUEST_FIELD_KEYS, REQUEST_SAVE_FORM, RESPONSE_FIELD_KEYS, RESPONSE_SAVE_FORM } from '../../utils/constants/form/form.constant';
import { FIELD_TYPES } from '../../components/form_builder/FormBuilder.strings';
import { removeFieldAndDocIds } from '../../components/information_widget/InformationWidget.utils';
import { updateSomeoneIsEditingPopover as flowUpdateSomeoneIsEditingPopover } from '../../containers/edit_flow/EditFlow.utils';
import { updateSomeoneIsEditingPopover as taskUpdateSomeoneIsEditingPopover } from './CreateTask.Action';
import { updateSomeoneIsEditingPopover as datalistUpdateSomeoneIsEditingPopover } from './CreateDataList.action';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

export const saveActionApiThunk = (data) =>
  new Promise((resolve, reject) => {
    console.log('save action api called');
    saveAction(data)
      .then((response) => {
        const { actions } = response;
        const matchingAction = actions.find(
          (action) => action.button_label === data.button_label,
        );
        if (matchingAction) {
          data.action_uuid = matchingAction.action_uuid;

          resolve(data);
        } else {
          reject(new Error('No matching action found')); // Reject if no matching action is found
        }
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });

export const deleteActionAPiThunk = (data) => () =>
  new Promise((resolve, reject) => {
    deleteAction(data)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });

export const saveFormHeaderApiThunk = async (data, onSuccess) => {
  try {
    const res = await saveFormHeader(data);
    console.log(res);
    if (res) {
      onSuccess?.();
    }
  } catch (err) {
    console.log(err);
  }
};

export const deleteFieldApiThunk = async (data, onSuccess) => {
  try {
    const response = await deleteFieldApiService(data);
    setPointerEvent(true); // Pointer events disabled onSave Button Click
    updatePostLoader(true); // Loader set to true onSave Button Click
    if (response) {
      setPointerEvent(false); // Events reverted on Success
      updatePostLoader(false);
      onSuccess?.();
    }
  } catch (err) {
    setPointerEvent(false); // Events reverted on Success
    updatePostLoader(false);
    console.log(err);
    return err.response.data.errors;
  }
  return null;
};

export const checkFieldDependencyApiThunk = (data) => () =>
  new Promise((resolve, reject) => {
    checkFieldDependencyApi(data)
      .then((response) => {
        if (!isNull(response)) {
          resolve(response);
        } else {
          // const err = {
          //   response: {
          //     status: 500,
          //   },
          // };
          // const errors = generatePostServerErrorMessage(err);
          // dispatch(saveFormApiFailure(errors.common_server_error));
          reject();
        }
      })
      .catch((error) => {
        // const errors = generateGetServerErrorMessage(error);
        // dispatch(accountConfigurationApiFailure(errors.common_server_error));
        reject(error);
      });
  });

const errorPopover = () => {
  showToastPopover(
    translate('error_popover_status.error'),
    translate('error_popover_status.error_in_delete_field'),
    FORM_POPOVER_STATUS.SERVER_ERROR,
    true,
  );
};
export const checkDependencyAndDeleteSectionApiAction =
  (
    dependencyCheckApiData,
    dependencyDetails,
    setDependencyData,
    callSaveFormApiIfNonBlocker = false,
    deleteFormCallBack,
  ) =>
    () =>
      new Promise((resolve) => {
        setPointerEvent(true);
        updatePostLoader(true);
        checkFieldDependencyApi(dependencyCheckApiData)
          .then((dependencyCheckResponse) => {
            setPointerEvent(false);
            updatePostLoader(false);
            const { type, name, sectionIndex } = dependencyDetails;
            if (
              !callSaveFormApiIfNonBlocker ||
              !isEmpty(dependencyCheckResponse.dependency_list)
            ) {
              setDependencyData({
                dependency_data: dependencyCheckResponse,
                dependency_type: type,
                dependency_name: name,
                showSectionDependencyDialog: {
                  isVisible: true,
                  sectionIndex,
                },
              });
            }
            // calling save form if non blocker
            if (
              callSaveFormApiIfNonBlocker &&
              isEmpty(dependencyCheckResponse.dependency_list)
            ) {
              if (deleteFormCallBack) deleteFormCallBack();
            }
          })
          .catch(() => {
            setPointerEvent(false);
            updatePostLoader(false);
            resolve(false);
            errorPopover();
          });
      });

export const deleteFormFieldOrFieldListApiAction =
  (
    postData,
    updatedSections,
    prevSectionsData,
    setState,
    deleteFormCallBack,
    deleteFieldMetaData,
    isDeleteFieldAPI,
  ) =>
    () =>
      new Promise((resolve) => {
        setPointerEvent(true);
        updatePostLoader(true);
        if (isDeleteFieldAPI && !isEmpty(deleteFieldMetaData)) {
          deleteField(deleteFieldMetaData)
            .then((response) => {
              setPointerEvent(false);
              updatePostLoader(false);
              setState({
                form_details: response,
                sections: updatedSections,
                showFieldDependencyDialog: false,
                dependency_data: {},
                dependency_type: '',
                dependency_name: '',
                error_list: {},
                server_error: [],
              });
              if (deleteFormCallBack) deleteFormCallBack();
              resolve(true);
            })
            .catch(() => {
              setPointerEvent(false);
              updatePostLoader(false);
              resolve(false);
              setState({
                sections: prevSectionsData,
              });
              errorPopover();
            });
        } else {
          deleteTable(postData)
            .then((response) => {
              setPointerEvent(false);
              updatePostLoader(false);
              setState({
                form_details: response,
                sections: updatedSections,
                showFieldDependencyDialog: false,
                dependency_data: {},
                dependency_type: '',
                dependency_name: '',
                error_list: {},
                server_error: [],
              });
              if (deleteFormCallBack) deleteFormCallBack();
              resolve(true);
            })
            .catch(() => {
              setPointerEvent(false);
              updatePostLoader(false);
              resolve(false);
              setState({
                sections: prevSectionsData,
              });
              errorPopover();
            });
        }
      });

export const checkDependencyAndDeleteFieldApiAction =
  (
    dependencyCheckApiData,
    dependencyDetails,
    setDependencyData,
    callSaveFormApiIfNonBlocker = false,
    saveFormApiData,
    updatedSections,
    prevSectionsData,
    setSaveFormData,
    deleteFormCallBack,
    deleteFieldMetaData,
    isDeleteFieldAPI,
    isDeleteFieldListAPI = false,
  ) =>
    (dispatch) =>
      new Promise((resolve) => {
        setPointerEvent(true);
        updatePostLoader(true);
        checkFieldDependencyApi(dependencyCheckApiData)
          .then((dependencyCheckResponse) => {
            const { type, name, sectionIndex, fieldListIndex, fieldIndex } =
              dependencyDetails;
            if (
              !callSaveFormApiIfNonBlocker ||
              !isEmpty(dependencyCheckResponse.dependency_list)
            ) {
              setPointerEvent(false);
              updatePostLoader(false);
              setDependencyData({
                dependency_data: dependencyCheckResponse,
                dependency_type: type,
                dependency_name: name,
                showFieldDependencyDialog: {
                  isVisible: true,
                  sectionIndex,
                  fieldListIndex,
                  fieldIndex,
                },
              });
            }
            // calling save form if non blocker
            if (
              callSaveFormApiIfNonBlocker &&
              isEmpty(dependencyCheckResponse.dependency_list)
            ) {
              if (isDeleteFieldAPI) {
                deleteField(deleteFieldMetaData)
                  .then((response) => {
                    setPointerEvent(false);
                    updatePostLoader(false);
                    setSaveFormData({
                      form_details: response,
                      sections: updatedSections,
                      showFieldDependencyDialog: false,
                      dependency_data: {},
                      dependency_type: '',
                      dependency_name: '',
                      error_list: {},
                      server_error: [],
                    });
                    if (deleteFormCallBack) deleteFormCallBack();
                    resolve(true);
                  })
                  .catch(() => {
                    setPointerEvent(false);
                    updatePostLoader(false);
                    resolve(false);
                    setSaveFormData({
                      sections: prevSectionsData,
                      // error_list: {},
                      // server_error: [],
                    });
                    errorPopover();
                  });
              } else if (isDeleteFieldListAPI) {
                dispatch(deleteFormFieldOrFieldListApiAction(
                  deleteFieldMetaData,
                  updatedSections,
                  prevSectionsData,
                  setDependencyData,
                ));
              } else {
                saveForm(saveFormApiData)
                  .then((response) => {
                    setPointerEvent(false);
                    updatePostLoader(false);
                    setSaveFormData({
                      form_details: response,
                      sections: updatedSections,
                      showFieldDependencyDialog: false,
                      dependency_data: {},
                      dependency_type: '',
                      dependency_name: '',
                      error_list: {},
                      server_error: [],
                    });
                    if (deleteFormCallBack) deleteFormCallBack();
                    resolve(true);
                  })
                  .catch(() => {
                    setPointerEvent(false);
                    updatePostLoader(false);
                    resolve(false);
                    setSaveFormData({
                      sections: prevSectionsData,
                      // error_list: {},
                      // server_error: [],
                    });
                    errorPopover();
                  });
              }
            }
            setPointerEvent(false);
            updatePostLoader(false);
          })
          .catch(() => {
            setPointerEvent(false);
            updatePostLoader(false);
            resolve(false);
            errorPopover();
          });
      });

export const listDependencyApiThunk =
  (
    params,
    path,
    dependencyData,
    setDependencyData,
  ) => {
    setPointerEvent(true);
    updatePostLoader(true);
    const currentDependencyData = cloneDeep(dependencyData);
    set(currentDependencyData, [...path.split(','), 'is_child_loading'], true);
    setDependencyData([{
      message: currentDependencyData,
    }]);
    listDependencyAPI(params)
      .then((res) => {
        const { data_list_details = [], flow_details = [], flow_steps = [], related_actions = [] } = res;
        const childDependencyList = [];
        data_list_details.forEach((data) => {
          childDependencyList.push({
            name: data.data_list_name,
            uuid: data.data_list_uuid,
            type: 'datalist',
          });
        });
        flow_details.forEach((data) => {
          childDependencyList.push({
            name: data.flow_name,
            uuid: data.flow_uuid,
            type: 'flow',
          });
        });
        flow_steps.forEach((data) => {
          childDependencyList.push({
            name: data.step_name,
            uuid: data.step_uuid,
            type: 'flow_step',
          });
        });
        related_actions.forEach((data) => {
          childDependencyList.push({
            name: data.action_name,
            uuid: data.action_uuid,
            type: 'action_uuid',
          });
        });
        const currentDependencyData = cloneDeep(dependencyData);
        set(currentDependencyData, [...path.split(','), 'child_dependency'], childDependencyList);
        set(currentDependencyData, [...path.split(','), 'is_child_loading'], false);
        setDependencyData([{
          message: currentDependencyData,
        }]);
        setPointerEvent(false);
        updatePostLoader(false);
      })
      .catch(() => {
        setPointerEvent(false);
        updatePostLoader(false);
        // resolve(false);
        set(currentDependencyData, [...path.split(','), 'is_child_loading'], false);
        setDependencyData([{
          message: currentDependencyData,
        }]);
        showToastPopover(
          translate('error_popover_status.error'),
          translate('error_popover_status.error_in_getting_delete_dependency'),
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      });
    };

export const getAllFlowStepsWithFormApiAction =
  (
    params,
    setStepsData,
    setErrors,
    apiStartAction = false,
    apiFailureAction = false,
    currentStepId,
    rearrangeStepList,
  ) =>
    () =>
      new Promise((resolve) => {
        if (apiStartAction) apiStartAction();
        getAllFlowStepsWithFormApiService(params)
          .then((response) => {
            if (!isNull(response)) {
              const stepsList = rearrangeStepList
                ? rearrageStepOnStepId(response.pagination_data, currentStepId)
                : response.pagination_data;
              const currentStepIndex = stepsList.findIndex(
                (step) => step._id === currentStepId,
              );
              if (currentStepIndex > -1) stepsList.splice(currentStepIndex, 1);
              setStepsData({
                stepList: stepsList,
                page: response.pagination_details.page,
                hasMore:
                  response.pagination_details.total_count >
                  response.pagination_details.page *
                  response.pagination_details.size,
              });
              resolve(stepsList);
            } else {
              // const err = {
              //   response: {
              //     status: 500,
              //   },
              // };
              // const errors = generatePostServerErrorMessage(err);
              // dispatch(saveFormApiFailure(errors.common_server_error));
              showToastPopover(
                translate('error_popover_status.somthing_went_wrong'),
                EMPTY_STRING,
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
              );
              resolve(false);
            }
          })
          .catch((err) => {
            console.log('importformerror', err);
            if (apiFailureAction) apiFailureAction();
            // const errors = generateGetServerErrorMessage(error);
            // dispatch(accountConfigurationApiFailure(errors.common_server_error));
            showToastPopover(
              translate('error_popover_status.somthing_went_wrong'),
              EMPTY_STRING,
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
            resolve(false);
          });
      });

export const getFormDetailsApiAction =
  (params, setFormDetails, setErrros, apiStartAction, apiFailureAction) => () =>
    new Promise((resolve) => {
      if (apiStartAction) apiStartAction();
      getFormDetailsApiService(params)
        .then((response) => {
          if (!isNull(response)) {
            setFormDetails(response);
            resolve(response);
          } else {
            // const err = {
            //   response: {
            //     status: 500,
            //   },
            // };
            // const errors = generatePostServerErrorMessage(err);
            // dispatch(saveFormApiFailure(errors.common_server_error));
            resolve(response);
          }
        })
        .catch(() => {
          if (apiFailureAction) apiFailureAction();
          // const errors = generateGetServerErrorMessage(error);
          // dispatch(accountConfigurationApiFailure(errors.common_server_error));
          showToastPopover(
            translate('error_popover_status.somthing_went_wrong'),
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          resolve(false);
        });
    });

// category apis used in flow and datalist settings
export const getCategoryApiAction = (params, setResponse) => () =>
  new Promise((resolve) => {
    getCategoryApiService(params)
      .then((response) => {
        const dropdownOptionList = response.paginationData.map(
          (eachCategory) => {
            return {
              label: eachCategory.category_name,
              value: eachCategory.category_name,
              id: eachCategory._id,
            };
          },
        );
        setResponse([
          dropdownOptionList,
          response.paginationDetails[0].total_count,
          response.paginationDetails[0].page,
        ]);
        resolve(true);
      })
      .catch(() => {
        resolve(false);
      });
  });
export const addNewCategoryApiAction =
  (params, updateCategoryListInReduxAction, categoryData, setErrros) =>
    (dispatch) =>
      new Promise((resolve) => {
        setPointerEvent(true);
        updatePostLoader(true);
        addNewCategoryApiService(params)
          .then((response) => {
            toastPopOver({
              title: translate(
                'error_popover_status.category_added_successfully',
              ),
              toastType: EToastType.success,
            });
            dispatch(
              getCategoryApiAction(
                {
                  page: 1,
                  size: 100,
                },
                (res) => {
                  const category = {
                    category_name: params.category_name,
                    category_id: response.result.data._id,
                  };
                  dispatch(
                    updateCategoryListInReduxAction({
                      category: category,
                      categoryData: {
                        newCategoryValue: '',
                        categoryValueError: '',
                        categoryList: res[0],
                      },
                    }),
                  );
                },
              ),
            );
            setPointerEvent(false);
            updatePostLoader(false);
            resolve(true);
          })
          .catch((error) => {
            if (
              nullCheck(error, 'response.data.errors.length', true) &&
              error.response.data.errors.some(
                (eachError) =>
                  eachError.field === 'category_name' &&
                  eachError.type === 'exist',
              )
            ) {
              setErrros(translate('error_popover_status.category_already_exist'));
              toastPopOver({
                title: translate('error_popover_status.category_already_exist'),
                toastType: EToastType.error,
              });
            } else {
              somethingWentWrongErrorToast();
            }
            setPointerEvent(false);
            updatePostLoader(false);
            resolve(false);
          });
      });

export const getActions = (params) => () =>
  new Promise((resolve, reject) => {
    getActionsApi(params)
      .then((data) => {
        console.log('data', data);
        resolve(data);
      })
      .catch((err) => {
        console.log('error', err);
        reject(err);
      });
  });

export const updateFormFieldOrder = (postData, moduleType) => () =>
  new Promise((resolve, reject) => {
    setPointerEvent(true);
    updatePostLoader(true);
    updateFormFieldOrderApi(postData)
      .then((data) => {
        setPointerEvent(false);
        updatePostLoader(false);
        console.log('data', data);
        resolve(data);
      })
      .catch((err) => {
        setPointerEvent(false);
        updatePostLoader(false);
        const errors = err?.response?.data?.errors;
        if (errors[0]?.type === 'someone_editing') {
          switch (moduleType) {
            case MODULE_TYPES.TASK:
              taskUpdateSomeoneIsEditingPopover(errors[0].message);
            break;
            case MODULE_TYPES.FLOW:
              flowUpdateSomeoneIsEditingPopover(errors[0].message);
            break;
            case MODULE_TYPES.DATA_LIST:
              datalistUpdateSomeoneIsEditingPopover(errors[0].message);
            break;
            case MODULE_TYPES.SUMMARY:
              if (!jsUtility.isEmpty(postData.data_list_id)) {
                datalistUpdateSomeoneIsEditingPopover(errors[0].message);
              } else if (!jsUtility.isEmpty(postData.isEmpty(postData.flow_id))) {
                flowUpdateSomeoneIsEditingPopover(errors[0].message);
              }
            break;
            default:
            break;
          }
        } else if (errors.length > 0) {
          errors.forEach((error) => {
            toastPopOver({
              title: error.type,
              subtitle: error.message,
              toastType: EToastType.error,
              toastPosition: EToastPosition.BOTTOM_LEFT,
            });
          });
        }
        console.log('error', err);
        reject(err);
      });
  });

export const saveSectionApiThunk = async (postData, moduleType) => {
  setPointerEvent(true);
  updatePostLoader(true);
  // const _postData = normalizer(
  //   postData,
  //   RESPONSE_SAVE_SECTION,
  //   REQUEST_SAVE_SECTION,
  // );
  let data;
  try {
    const res = await saveSectionApi(postData);
    console.log('data', res);
    if (res) {
      setPointerEvent(false);
      updatePostLoader(false);
      data = res;
    }
  } catch (err) {
    setPointerEvent(false);
    updatePostLoader(false);
    const errors = err?.response?.data?.errors;
    if (errors[0]?.type === 'someone_editing') {
      switch (moduleType) {
        case MODULE_TYPES.TASK:
          taskUpdateSomeoneIsEditingPopover(errors[0].message);
        break;
        case MODULE_TYPES.FLOW:
          flowUpdateSomeoneIsEditingPopover(errors[0].message);
        break;
        case MODULE_TYPES.DATA_LIST:
          datalistUpdateSomeoneIsEditingPopover(errors[0].message);
        break;
        default:
        break;
      }
    } else if (errors.length > 0) {
      errors.forEach((error) => {
        toastPopOver({
          title: error.type,
          subtitle: error.message,
          toastType: EToastType.error,
          toastPosition: EToastPosition.BOTTOM_LEFT,
        });
      });
    }
    console.log('errorx', errors);
  }
  return data;
};

export const deleteSectionApiThunk = async (data, moduleType, onSuccess) => {
  setPointerEvent(true);
  updatePostLoader(true);
  try {
    const res = await deleteSectionApi(data);
    console.log(res);
    if (res) {
      setPointerEvent(false);
      updatePostLoader(false);
      onSuccess?.();
    }
  } catch (err) {
    setPointerEvent(false);
    updatePostLoader(false);
    const errors = err?.response?.data?.errors;
    setPointerEvent(false);
    updatePostLoader(false);
    if (errors[0]?.type === 'someone_editing') {
      switch (moduleType) {
        case MODULE_TYPES.TASK:
          taskUpdateSomeoneIsEditingPopover(errors[0].message);
        break;
        case MODULE_TYPES.FLOW:
          flowUpdateSomeoneIsEditingPopover(errors[0].message);
        break;
        case MODULE_TYPES.DATA_LIST:
          datalistUpdateSomeoneIsEditingPopover(errors[0].message);
        break;
        default:
        break;
      }
    } else if (errors[0]?.type === 'field_dependency') {
      return errors;
    } else if (errors.length > 0) {
      errors.forEach((error) => {
        toastPopOver({
          title: error.type,
          subtitle: error.message,
          toastType: EToastType.error,
          toastPosition: EToastPosition.BOTTOM_LEFT,
        });
      });
    }
  }
  return null;
};

export const sectionOrderApiThunk = async (data, moduleType, onSuccess) => {
  setPointerEvent(true);
  updatePostLoader(true);
  try {
    const res = await sectionOrderApi(data);
    if (res) {
      setPointerEvent(false);
      updatePostLoader(false);
      onSuccess?.();
      console.log(res);
    }
  } catch (err) {
    setPointerEvent(false);
    updatePostLoader(false);
    const errors = err?.response?.data?.errors;
    if (errors[0]?.type === 'someone_editing') {
      switch (moduleType) {
        case MODULE_TYPES.TASK:
          taskUpdateSomeoneIsEditingPopover(errors[0].message);
        break;
        case MODULE_TYPES.FLOW:
          flowUpdateSomeoneIsEditingPopover(errors[0].message);
        break;
        case MODULE_TYPES.DATA_LIST:
          datalistUpdateSomeoneIsEditingPopover(errors[0].message);
        break;
        default:
        break;
      }
    } else if (errors.length > 0) {
      errors.forEach((error) => {
        toastPopOver({
          title: error.type,
          subtitle: error.message,
          toastType: EToastType.error,
          toastPosition: EToastPosition.BOTTOM_LEFT,
        });
      });
    }
    console.log(err);
  }
};

export const getFieldDetailsApiThunk = async (data, moduleType) => {
  setPointerEvent(true);
  updatePostLoader(true);
  try {
    const res = await getFieldDetails(data);
    if (res) {
      setPointerEvent(false);
      updatePostLoader(false);
    }
    const fieldDetails = normalizer(res, REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS);

    if (fieldDetails?.fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.INFORMATION) {
      const { rawHtml, renderedTemplate } = removeFieldAndDocIds({ data: fieldDetails?.fieldDetails?.[RESPONSE_FIELD_KEYS.INFORMATION_CONTENT]?.[RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE], isPostData: false });

      fieldDetails.fieldDetails[RESPONSE_FIELD_KEYS.INFORMATION_CONTENT] = {
        [RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE]: rawHtml,
        [RESPONSE_FIELD_KEYS.RENDERING_TEMPLATE]: renderedTemplate,
      };
    }

    return fieldDetails;
  } catch (err) {
    setPointerEvent(false);
    updatePostLoader(false);
    const errors = err?.response?.data?.errors;
    if (errors[0]?.type === 'someone_editing') {
      switch (moduleType) {
        case MODULE_TYPES.TASK:
          taskUpdateSomeoneIsEditingPopover(errors[0].message);
        break;
        case MODULE_TYPES.FLOW:
          flowUpdateSomeoneIsEditingPopover(errors[0].message);
        break;
        case MODULE_TYPES.DATA_LIST:
          datalistUpdateSomeoneIsEditingPopover(errors[0].message);
        break;
        default:
        break;
      }
    } else if (errors.length > 0) {
      errors.forEach((error) => {
        toastPopOver({
          title: error.type,
          subtitle: error.message,
          toastType: EToastType.error,
          toastPosition: EToastPosition.BOTTOM_LEFT,
        });
      });
    }
    console.log(err);
    return err;
  }
};

export const getFormDetails = (params) => () =>
  new Promise((resolve, reject) => {
    getFormDetailsApi(params)
      .then((data) => {
        console.log('data', data);
        resolve(data);
      })
      .catch((err) => {
        console.log('error', err);
        reject(err);
      });
  });

export const saveFormNew = (postData) => () =>
  new Promise((resolve, reject) => {
    const _postData = normalizer(
      postData,
      RESPONSE_SAVE_FORM,
      REQUEST_SAVE_FORM,
    );
    saveFormApi(_postData)
      .then((data) => {
        console.log('data', data);
        resolve(data);
      })
      .catch((err) => {
        console.log('error', err);
        reject(err);
      });
  });

export const getFormDetailsByFilter = (params) => () =>
  new Promise((resolve, reject) => {
    getFormDetailsByFilterApi(params)
      .then((data) => {
        console.log('data', data);
        resolve(data);
      })
      .catch((err) => {
        console.log('error', err);
        reject(err);
      });
  });

export const saveFormContent = (data, moduleType) =>
  new Promise((resolve, reject) => {
    setPointerEvent(true);
    updatePostLoader(true);
    saveFormContentApi(data)
      .then((data) => {
        setPointerEvent(false);
        updatePostLoader(false);
        resolve(data?.data?.result?.data);
      })
      .catch((err) => {
        console.log('error', err);
        setPointerEvent(false);
        updatePostLoader(false);
        const errors = err?.response?.data?.errors;
        if (errors[0]?.type === 'someone_editing') {
          switch (moduleType) {
            case MODULE_TYPES.TASK:
              taskUpdateSomeoneIsEditingPopover(errors[0].message);
            break;
            case MODULE_TYPES.FLOW:
              flowUpdateSomeoneIsEditingPopover(errors[0].message);
            break;
            case MODULE_TYPES.DATA_LIST:
              datalistUpdateSomeoneIsEditingPopover(errors[0].message);
            break;
            default:
            break;
          }
        } else if (errors.length > 0) {
          errors.forEach((error) => {
            toastPopOver({
              title: error.type,
              subtitle: error.message,
              toastType: EToastType.error,
              toastPosition: EToastPosition.BOTTOM_LEFT,
            });
          });
        }
        reject(err);
      });
  });

export default deleteFormFieldOrFieldListApiAction;
