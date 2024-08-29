/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState, lazy } from 'react';
import { validate, clearAlertPopOverStatus, updateAlertPopverStatus } from 'utils/UtilityFunctions';
import {
  changeBillingEditType,
  BillingApicallSucess,
  setPaymentCustomizedDetails,
  setPaymentState,
  setPaymentSpecificData,
  billingModulePageChangeAction,
  setMemberTeamSearchValue,
  setPaymentRedirectShow,
} from 'redux/reducer/BillingModuleReducer';
import cx from 'classnames/bind';
import { FORM_POPOVER_STATUS } from 'utils/Constants';
import { getAccountConfigurationDetailsApiService } from 'axios/apiService/accountConfigurationDetailsAdmin.apiService';
import { connect } from 'react-redux';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import UpdateConfirmPopover from 'components/update_confirm_popover/UpdateConfirmPopover';
import { useHistory } from 'react-router-dom';
import { createTaskSetState } from 'redux/reducer/CreateTaskReducer';
import { useTranslation } from 'react-i18next';
import jsUtils, { isEmpty, isNull } from '../../utils/jsUtility';
import gClasses from '../../scss/Typography.module.scss';
import styles from './BillingModule.module.scss';
import {
  getPaymentProfileOriginalData,
  getPaymentUsers,
  getPaymentMethodOriginalData,
  validBillingUserRole,
  getDate,
  validateExpiryMonthYear,
} from './BillingModule.utils';
import {
  BILLING_EDITABLE_VIEW, USER_DET, INVOICE_PERIOD, PAYMENT_DETAILS, BILLLING_VALIDATION_ERROR, PAY_PROFILE } from './BillingModule.string';
import {
  paymentDataThunk,
  editpaymentDataThunk,
  getSubscriptionDataThunk,
  updatePaymentProfileThunk,
  saveOrUpdatePaymentMethodProfileThunk,
  getInvoiceListThunk,
} from '../../redux/actions/BillingModule.Action';
import { getPaymentUserDetailsSelctors } from '../../redux/selectors/BillingModule.selectors';
import {
  getPayProfileVadidateData,
  paymentProfileValidationSchema,
  paymentMethodValidationSchema,
  getPayMethodVadidateData,
} from './BillingModule.validation.schema';
import { getTimeZoneLookUpDataThunk } from '../../redux/actions/TimeZoneLookUp.Action';
import FilePreview from '../../components/file_preview/FileViewer';
import PaymentCard from './billing_card/PaymentCard';
import { showToastPopover } from '../../utils/UtilityFunctions';
// lazy imports
const BillingCard = lazy(() => import('./billing_card/BillingCard'));

function BillingModule(props) {
  const {
    paymentAPIDetails,
    onEditOpenClick,
    editTypeValue,
    paymentDataThunk,
    paymentCustomizedDetails,
    setPaymentCustomizedDetails,
    editData,
    getSubscriptionDataThunk,
    SubscriptionCustomizedDetails,
    isSubscriptionApiDetailsLoading,
    isPaymentMethodDataLoading,
    isPaymentUserDataLoading,
    isPaymentProfileDataLoading,
    paymentProfileErrorList,
    updatePaymentProfileCall,
    updatePaymentMethodCall,
    paymentMethodErrorList,
    setPaymentStateChange,
    stateChangeSpecific,
    getInvoiceList,
    billingModulePageChange,
    invoiceTotalCount,
    invoiceDataLoading,
    getTimeZoneLookUpData,
    invoiceCurrentPage,
    setMemberSearchValue,
    setPaymentRedirectShow,
    flowData,
    dataListState,
  } = props;
  const { t } = useTranslation();

  useEffect(() => {
    getAccountConfigurationDetailsApiService().then((response) => {
      paymentDataThunk(t).then(() => {
        stateChangeSpecific(response);
        getSubscriptionDataThunk(t);
      });
    });
    return () => {
      setMemberSearchValue(EMPTY_STRING);
    };
  }, []);
const [previewUrl, setPreviewUrl] = useState('');
const [isopen, setIsOpen] = useState(false);
const [fileName, setFileName] = useState('');
const [tableIssue, setTableIssue] = useState(EMPTY_STRING);

const onPreviewCloseHandler = () => {
  setIsOpen(false);
  setPreviewUrl('');
};

  const refreshPaymentData = () => {
    getAccountConfigurationDetailsApiService().then((response) => {
      paymentDataThunk(t).then(() => {
        stateChangeSpecific(response);
        getSubscriptionDataThunk();
      });
    });
  };

  const onEditActionClick = (type) => {
    setMemberSearchValue(EMPTY_STRING);
    type !== BILLING_EDITABLE_VIEW.PAYMENT_METHOD && onEditOpenClick(type);
    setMemberSearchValue(EMPTY_STRING);
    setPaymentCustomizedDetails(getPaymentUsers(paymentAPIDetails, t));
    if (type === BILLING_EDITABLE_VIEW.PAYMENT_PROFILE) {
      getTimeZoneLookUpData();
    }
    if (type === BILLING_EDITABLE_VIEW.PAYMENT_METHOD) {
      setPaymentRedirectShow(true);
    }
  };
  const onUpdateClickHandler = () => {
    const userDetails = getPaymentUserDetailsSelctors(paymentCustomizedDetails, t);
    const validRoleString = validBillingUserRole(userDetails.billing_owners, t);
    if (!isEmpty(validRoleString)) {
      setTableIssue(validRoleString);
      showToastPopover(
        validRoleString,
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    } else {
      setTableIssue(EMPTY_STRING);
      editData(userDetails, 'Edited', t);
      onEditActionClick(' ');
    }
  };
  const onPaymentUserValueChangeHandler = (value, index, key) => {
    const editedData = jsUtils.cloneDeep(paymentCustomizedDetails);
    editedData.paymentUsers.DETAILS[index][key] = value;
    setPaymentCustomizedDetails(editedData);
  };
  const onDeletClickHandler = (index) => {
      updateAlertPopverStatus({
        isVisible: true,
        customElement: (
          <UpdateConfirmPopover
            onYesHandler={async () => {
              const editedData = jsUtils.cloneDeep(paymentCustomizedDetails);
              editedData.paymentUsers.DETAILS[index].is_active = false;
              editData(
                getPaymentUserDetailsSelctors(
                  editedData,
                  t,
                ),
                'Deleted',
                t,
              );
              clearAlertPopOverStatus();
            }}
            onNoHandler={() => clearAlertPopOverStatus()}
            title={t(BILLLING_VALIDATION_ERROR.DELETE_CONFIRMATION)}
            subTitle={t(BILLLING_VALIDATION_ERROR.PAYMENT_USER_DELETE)}
          />
        ),
      });
  };
  const editCancelHandler = () => {
    setPaymentCustomizedDetails(getPaymentUsers(paymentAPIDetails, t));
    onEditActionClick(' ');
    setTableIssue(EMPTY_STRING);
    if (editTypeValue === BILLING_EDITABLE_VIEW.PAYMENT_PROFILE) setPaymentStateChange({ payment_profile_error: {} });
  };
  const onEditSubmitPaymentProfile = () => {
    const originalData = getPaymentProfileOriginalData(
      paymentCustomizedDetails.paymentProfileCustomizedDetails.DETAILS, t,
    );
    const error = validate(
      getPayProfileVadidateData(originalData, t),
      paymentProfileValidationSchema(t),
    );
    console.log('fdsafsaf', error);
    setPaymentStateChange({ payment_profile_error: error });
    if (isEmpty(error)) {
      updatePaymentProfileCall(originalData, t);
    }
  };

  const onProfileMethodEditSubmit = () => {
    const originalData = getPaymentMethodOriginalData(paymentCustomizedDetails.paymentMethodDetails.DETAILS, paymentAPIDetails);
    delete originalData.is_active;
    const validExpiry = validateExpiryMonthYear(originalData.card.exp_month, originalData.card.exp_year);
    originalData.card.exp_month = parseInt(originalData.card.exp_month, 10);
    originalData.card.exp_year = parseInt(originalData.card.exp_year, 10);
    const error = validate(
      getPayMethodVadidateData(originalData),
      paymentMethodValidationSchema,
    );
    if (validExpiry) error.expiryMonth = validExpiry || EMPTY_STRING;

    setPaymentStateChange({ payment_method_error: error });
    if (isEmpty(error)) {
      updatePaymentMethodCall(originalData);
    }
  };

  const onChangeHandler = (type, value, index, isRadio) => {
    const editedData = jsUtils.cloneDeep(paymentCustomizedDetails);

    if (type === t(PAY_PROFILE.TITLE)) {
      if (isRadio) {
        if (!isNull(value)) {
          editedData.paymentProfileCustomizedDetails.DETAILS[index].VALUE = value;
          editedData.paymentProfileCustomizedDetails.DETAILS[index].FORM_VALUE = value;
        }
      } else {
        editedData.paymentProfileCustomizedDetails.DETAILS[index].VALUE = value;
      }
    } else {
      if (index === 1) {
        let val = value;
        const valArray = val.split(' ').join('').split('');
        const valSpace = val.split('');
        // to work with backspace
        if (valSpace[valSpace.length - 1] === ' ') {
          const valSpaceN = valSpace.slice(0, -1);
            val = valSpaceN.join('');
            editedData.paymentMethodDetails.DETAILS[index].VALUE = val;
            setPaymentCustomizedDetails(editedData);
            return;
        }
        if (Number.isNaN(valArray.join(''))) return;
        if (valArray.length === 17) return;
        if (valArray.length % 4 === 0 && valArray.length <= 15) {
          console.log('fgasfgs');
          editedData.paymentMethodDetails.DETAILS[index].VALUE = `${value} `;
          console.log('fgasfgs', editedData.paymentMethodDetails.DETAILS[index].VALUE);
        } else {
          editedData.paymentMethodDetails.DETAILS[index].VALUE = value;
        }
      } else {
        console.log('gfsagvf', editedData.paymentMethodDetails.DETAILS);
        editedData.paymentMethodDetails.DETAILS[index].VALUE = value;
      }
    }
    setPaymentCustomizedDetails(editedData);
  };

  const onExpiryDateSelect = (type, value, index) => {
    const editedData = jsUtils.cloneDeep(paymentCustomizedDetails);
    if (type === 'month') {
      editedData.paymentMethodDetails.DETAILS[index].MONTH_VALUE = value;
    } else {
      editedData.paymentMethodDetails.DETAILS[index].YEAR_VALUE = value;
    }
    setPaymentCustomizedDetails(editedData);
  };

  const onInvoicesPageChamgeHandler = (pageNo, date = '') => {
    billingModulePageChange(pageNo);
    const params = { page: pageNo, size: '10' };
    if (date) {
      params.greater_than_date = date;
    }
    getInvoiceList(params);
  };

  const onDropDownSelect = (type, value, index) => {
    const paymentData = jsUtils.cloneDeep(paymentCustomizedDetails);
      paymentData.paymentProfileCustomizedDetails.DETAILS[index].VALUE = value;
      setPaymentCustomizedDetails(paymentData);
  };
 const setPreviewData = (data, fileName) => {
 setPreviewUrl(data);
 setIsOpen(true);
 setFileName(fileName);
 };
 const updateInviceList = (period) => {
   let date;
   if (period !== INVOICE_PERIOD.ALL) {
    date = getDate(period);
  }
    onInvoicesPageChamgeHandler(1, date);
 };
 const history = useHistory();
 const URLParams = new URLSearchParams(jsUtils.get(history, ['location', 'search'], ''));
  return (URLParams.get('create') === 'flow' && flowData.isFlowModalDisabled) ||
  (URLParams.get('create') === 'datalist' && dataListState.isDataListModalDisabled) ? null : (
    <>
    <FilePreview
    isOpen={isopen}
    fileUrl={previewUrl}
    filetype="pdf"
    fileName={fileName}
    fileDetail={{ type: 'pdf' }}
    fileDownloadUrl={previewUrl}
    onCloseFile={onPreviewCloseHandler}
    />
    <div className={styles.GlobalContainer}>
      <div
        className={cx(styles.Container, gClasses.DisplayFlex, gClasses.MB30)}
      >
        <div className={styles.CardMargin}>
          <BillingCard
            details={SubscriptionCustomizedDetails}
            isDataLoading={isSubscriptionApiDetailsLoading}
            editDataType={BILLING_EDITABLE_VIEW.SUBSCRIPTION_DETAILS}
            onEditActionClick={onEditActionClick}
            editTypeValue={editTypeValue}
          />
        </div>
        <div className={styles.CardMargin}>
          <BillingCard
            details={USER_DET}
            isDataLoading={isSubscriptionApiDetailsLoading}
            editDataType={BILLING_EDITABLE_VIEW.USER_DETAILS}
            onEditActionClick={onEditActionClick}
            editTypeValue={editTypeValue}
            activeCount={SubscriptionCustomizedDetails.ACTIVE_USERS}
          />
        </div>
      </div>
      <div className={cx(gClasses.MB30)}>
        <BillingCard
          details={paymentCustomizedDetails.paymentUsersIvoiceCustomData}
          isTableView
          tableType={t(PAYMENT_DETAILS.INVOICES)}
          editDataType={BILLING_EDITABLE_VIEW.INVOICES}
          onEditActionClick={onEditActionClick}
          editTypeValue={editTypeValue}
          isDataLoading={invoiceDataLoading}
          onPageChandler={onInvoicesPageChamgeHandler}
          invoiceTotalCount={invoiceTotalCount}
          invoiceCurrentPage={invoiceCurrentPage}
          periodicChangeHandler={updateInviceList}
          onPreviewClick={setPreviewData}
          refreshPaymentData={refreshPaymentData}
        />
      </div>
      <div className={cx(gClasses.PT30, gClasses.PX30, styles.PaymentDetailsContainer)}>
        <div className={cx(gClasses.FontWeight600)}>
          {t(PAYMENT_DETAILS.PAYMENT_DETAILS)}
        </div>
      <div
        className={cx(styles.Container, gClasses.DisplayFlex, gClasses.MB30)}
      >
        <div className={cx(styles.CardMargin, gClasses.MR0)}>
          <PaymentCard
            details={paymentCustomizedDetails.paymentMethodDetails}
            isDataLoading={isPaymentMethodDataLoading}
            editDataType={BILLING_EDITABLE_VIEW.PAYMENT_METHOD}
            onEditActionClick={onEditActionClick}
            editTypeValue={editTypeValue}
            onChangeHandler={onChangeHandler}
            onCancelClickHandler={editCancelHandler}
            onUpdateClick={onProfileMethodEditSubmit}
            onExpiryDateSelect={onExpiryDateSelect}
            errorList={paymentMethodErrorList}
            isVerified={paymentCustomizedDetails && paymentCustomizedDetails.paymentMethodDetails && paymentCustomizedDetails.paymentMethodDetails.is_verified}
            paymentMethodId={paymentCustomizedDetails && paymentCustomizedDetails.paymentMethodDetails && paymentCustomizedDetails.paymentMethodDetails.payment_method_id}
            methodCurrency={paymentAPIDetails.billing_currency}
            paymentCustomizedDetails={paymentCustomizedDetails}
            setPaymentCustomizedDetails={setPaymentCustomizedDetails}
          />
        </div>
        {!(BILLING_EDITABLE_VIEW.PAYMENT_PROFILE === editTypeValue) ? <div className={cx(gClasses.PL15, styles.CenterMargin)} /> : <div className={cx(gClasses.PL15, styles.CenterMarginEdit)} />}
        <div className={styles.CardMargin}>
          <PaymentCard
            details={paymentCustomizedDetails.paymentProfileCustomizedDetails}
            isDataLoading={isPaymentProfileDataLoading}
            editDataType={BILLING_EDITABLE_VIEW.PAYMENT_PROFILE}
            onEditActionClick={onEditActionClick}
            editTypeValue={editTypeValue}
            onChangeHandler={onChangeHandler}
            onUpdateClick={onEditSubmitPaymentProfile}
            errorList={paymentProfileErrorList}
            onCancelClickHandler={editCancelHandler}
            onDropDownSelect={onDropDownSelect}
          />
        </div>
      </div>
      </div>

      <div className={cx(gClasses.MB30)}>
        <BillingCard
          details={paymentCustomizedDetails.paymentUsers}
          onChangeHandlerforPaymentUser={onPaymentUserValueChangeHandler}
          onCancelClickHandler={editCancelHandler}
          onUpdateClick={onUpdateClickHandler}
          isTableView
          tableType={t(PAYMENT_DETAILS.PAYMENT_DETAILS)}
          editDataType={BILLING_EDITABLE_VIEW.PAYMENT_USERS}
          isDataLoading={isPaymentUserDataLoading}
          editTypeValue={editTypeValue}
          onEditActionClick={onEditActionClick}
          onDeletClickHandler={onDeletClickHandler}
          tableIssue={tableIssue}
        />
      </div>

      {/* <div className={cx(styles.CancelContainer, gClasses.CenterV, gClasses.MB30)}> */}
        {/* <div className={cx(styles.WarnSign, gClasses.MR15)}> */}
        {/* {isSubscriptionApiDetailsLoading?<Skeleton width={FORM_FIELD_DIMENSIONS.SKELETON_40}/>:  */}
        {/* <BigAlert /> */}
        {/* } */}
        {/* </div> */}
        {/* <div> */}
        {/* {isSubscriptionApiDetailsLoading?<Skeleton width={FORM_FIELD_DIMENSIONS.QUARTER_WIDTH}/>:  */}
        {/* <h4>Cancel Subscription</h4> */}
        {/* // } */}
          {/* <h5>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry
          </h5> */}
        {/* </div> */}
        {/* <div className={cx(styles.CancelSub, gClasses.CursorPointer)} onClick={() => stateChangeSpecific({ cancelModalOpenStatus: true })}>
          CANCEL SUBSCRIPTION
        </div> */}
      {/* </div> */}
    </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    mockData: state.BillingModuleReducer.mockData,
    paymentAPIDetails: state.BillingModuleReducer.paymentAPIDetails,
    paymentCustomizedDetails: state.BillingModuleReducer.paymentCustomizedDetails,
    editTypeValue: state.BillingModuleReducer.editType,
    is_data_loading: state.BillingModuleReducer.is_data_loading,
    paymentProfileCustomizedDetails: state.BillingModuleReducer.paymentProfileCustomizedDetails,
    SubscriptionCustomizedDetails: state.BillingModuleReducer.SubscriptionCustomizedDetails,
    common_server_error: state.BillingModuleReducer.common_server_error,
    account_id: state.BillingModuleReducer.paymentAPIDetails.account_id,
    isSubscriptionApiDetailsLoading: state.BillingModuleReducer.isSubscriptionApiDetailsLoading,
    isPaymentMethodDataLoading: state.BillingModuleReducer.isPaymentMethodDataLoading,
    isPaymentUserDataLoading: state.BillingModuleReducer.isPaymentUserDataLoading,
    isPaymentProfileDataLoading: state.BillingModuleReducer.isPaymentProfileDataLoading,
    paymentProfileErrorList: state.BillingModuleReducer.payment_profile_error,
    paymentMethodErrorList: state.BillingModuleReducer.payment_method_error,
    cancelModalStatus: state.BillingModuleReducer.paymentAPIDetails.cancelModalOpenStatus,
    invoiceTotalCount: state.BillingModuleReducer.invoiceTotalCount,
    invoiceCurrentPage: state.BillingModuleReducer.invoiceCurrentPage,
    invoiceDataLoading: state.BillingModuleReducer.invoiceDataLoading,
    isSubscriptionDataLoading: state.BillingModuleReducer.BillingModuleReducer,
    flowData: state.EditFlowReducer.flowData,
    dataListState: state.CreateDataListReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onEditOpenClick: (value) => dispatch(changeBillingEditType(value)),
    initalloading: () => dispatch(BillingApicallSucess()),
    paymentDataThunk: (t) => dispatch(paymentDataThunk(t)),
    setPaymentCustomizedDetails: (data) =>
    dispatch(setPaymentCustomizedDetails(data)),
    editData: (data, message, t) => dispatch(editpaymentDataThunk(data, message, t)),
    getSubscriptionDataThunk: (t) => dispatch(getSubscriptionDataThunk(t)),
    setPaymentStateChange: (data) => dispatch(setPaymentState(data)),
    updatePaymentProfileCall: (data, t) => dispatch(updatePaymentProfileThunk(data, t)),
    updatePaymentMethodCall: (data) => dispatch(saveOrUpdatePaymentMethodProfileThunk(data)),
    stateChangeSpecific: (data) => dispatch(setPaymentSpecificData(data)),
    getInvoiceList: (data) => dispatch(getInvoiceListThunk(data)),
    billingModulePageChange: (data) => dispatch(billingModulePageChangeAction(data)),
    getTimeZoneLookUpData: (params) => dispatch(getTimeZoneLookUpDataThunk(params)),
    setMemberSearchValue: (searchValue) => dispatch(setMemberTeamSearchValue(searchValue)),
    setPaymentRedirectShow: (value) => dispatch(setPaymentRedirectShow(value)),
    taskSetState: (value) => dispatch(createTaskSetState(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BillingModule);
