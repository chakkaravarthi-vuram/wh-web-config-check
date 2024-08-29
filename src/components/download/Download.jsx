import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import Skeleton from 'react-loading-skeleton';
import { connect } from 'react-redux';

import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import modalStyles from 'components/form_components/modal_layout/CustomClasses.module.scss';
import UpdateConfirmPopover from 'components/update_confirm_popover/UpdateConfirmPopover';
import { useTranslation } from 'react-i18next';
import gClasses from '../../scss/Typography.module.scss';
import CheckboxGroup from '../form_components/checkbox_group/CheckboxGroup';
import Button, { BUTTON_TYPE } from '../form_components/button/Button';
import { BS } from '../../utils/UIConstants';
import jsUtils from '../../utils/jsUtility';
import {
  updateAlertPopverStatus,
  clearAlertPopOverStatus,
  keydownOrKeypessEnterHandle,
} from '../../utils/UtilityFunctions';

import OptionCard from './OptionCard';
import styles from './Download.module.scss';
import getDownloadString, { DOWNLOAD_WINDOW_STRINGS } from './Download.strings';

function Download(props) {
  const { t } = useTranslation();
  const {
    isFlow,
    isLoading,
    filter,
    filter: { download_select_all, downloadInputField, selectedCount = 0 },
    onSetFilterAction,
    onDownloadClickHandler,
    id,
    isModalOpen,
    download_list,
    onCloseClick,
  } = props;
  const { TITLE, SUB_TITLE, SELECT_FIELD, BUTTONS } = getDownloadString(isFlow);

  // Download Button Disabled based on Selected and Un-Selected Fields.
  const isDownloadBtnDisable =
    downloadInputField &&
    downloadInputField.length > 0 &&
    downloadInputField.filter((dimension) => dimension.value).length > 0;

  const onCheckboxDownloadSelectChangeHandler = (
    selectedData,
    optionObject,
  ) => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    const clonedDownloadSelectAll = jsUtils.cloneDeep(download_select_all);
    const clonedDownloadInputField = jsUtils.cloneDeep(downloadInputField);
    let cloneSelectedCount = jsUtils.cloneDeep(selectedCount);

    clonedDownloadInputField.map((dimension) => {
      if (optionObject.dimension_field === dimension.dimension_field) {
        if (selectedData) {
          dimension.value = 0;
          cloneSelectedCount--;
          dimension.count = null;
        } else {
          dimension.value = 1;
          cloneSelectedCount++;
          dimension.count = cloneSelectedCount;
        }
      } else if (selectedData && optionObject.count < dimension.count) {
        dimension.count--;
      }
      return dimension;
    });

    // Check Select All.
    const selectedList = clonedDownloadInputField.filter(
      (objLst) => objLst.value === 1,
    );
    if (clonedDownloadSelectAll.length > 0) {
      if (selectedList.length === clonedDownloadInputField.length) {
        clonedDownloadSelectAll[0].value = 1;
      }
      if (selectedList.length !== clonedDownloadInputField.length) {
        clonedDownloadSelectAll[0].value = 0;
      }
    }

    clonedFilter.download_select_all = clonedDownloadSelectAll;
    clonedFilter.downloadInputField = clonedDownloadInputField;
    clonedFilter.selectedCount = cloneSelectedCount;
    onSetFilterAction(clonedFilter);
  };

  const onCheckboxDownloadAllChangeHandler = () => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    const clonedDownloadSelectAll = jsUtils.cloneDeep(download_select_all);
    const clonedDownloadInputField = jsUtils.cloneDeep(downloadInputField);
    let cloneSelectedCount = 0;
    const isSelect = clonedDownloadSelectAll[0].value;
    clonedDownloadSelectAll[0].value = isSelect ? 0 : 1;
    clonedDownloadInputField.map((dimension) => {
      dimension.value = isSelect ? 0 : 1;
      if (!isSelect) {
        cloneSelectedCount++;
        dimension.count = cloneSelectedCount;
      } else {
        dimension.count = null;
      }
      return dimension;
    });
    clonedFilter.download_select_all = clonedDownloadSelectAll;
    clonedFilter.downloadInputField = clonedDownloadInputField;
    clonedFilter.selectedCount = cloneSelectedCount;
    onSetFilterAction(clonedFilter);
  };

  const onClickDownloadCheckPrompt = () => {
    const objDownloadData =
      download_list && download_list.length > 0 && download_list[0];
    const { status = null } = objDownloadData;
    if (objDownloadData && status === DOWNLOAD_WINDOW_STRINGS.STATUS.CREATED) {
      updateAlertPopverStatus({
        isVisible: true,
        customElement: (
          <UpdateConfirmPopover
            onYesHandler={async () => {
              onDownloadClickHandler();
              clearAlertPopOverStatus();
            }}
            onNoHandler={() => clearAlertPopOverStatus()}
            title={t(DOWNLOAD_WINDOW_STRINGS.ACTIVITY.ALREADY_IN_PROGRESS)}
          />
        ),
      });
    } else {
      onDownloadClickHandler();
    }
  };

  const fieldOptionListElement = downloadInputField?.map((options) => (
    <OptionCard
      key={options.output_key}
      isLoading={isLoading}
      options={options}
      onCheckboxDownloadSelectChangeHandler={
        onCheckboxDownloadSelectChangeHandler
      }
    />
  ));

  return (
    <div
      className={cx(
        BS.W100,
        BS.D_FLEX,
        gClasses.FlexDirectionColumn,
        BS.P_RELATIVE,
      )}
    >
      <ModalLayout
        id={id}
        isModalOpen={isModalOpen}
        onCloseClick={onCloseClick}
        headerClassName={cx(modalStyles.ModalHeader, styles.HeaderContainer)}
        headerContent={
          <div className={modalStyles.ModalHeaderContainer}>
            <div>
              <span className={cx(modalStyles.PageTitle)}>{t(TITLE)}</span>
              <div>
                {isLoading ? (
                  <Skeleton width={300} />
                ) : (
                  <div className={cx(gClasses.FTwo13GrayV9)}>
                    {t(SUB_TITLE)}
                  </div>
                )}
              </div>
            </div>
          </div>
        }
        mainContent={
          <div className={cx(styles.BodyContainer, gClasses.Flex1)}>
            <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
              <div className={BS.D_FLEX}>
                <div
                  className={cx(styles.SelectField, gClasses.TextTransformCap)}
                >
                  {isLoading ? (
                    <Skeleton height={12} width={300} />
                  ) : (
                    t(SELECT_FIELD.TITLE)
                  )}
                </div>
                <div>
                  <div className={gClasses.HorizontalLine} />
                </div>
              </div>
              <div className={BS.D_FLEX}>
                <span
                  className={cx(
                    gClasses.MR5,
                    styles.SelectField,
                    gClasses.TextTransformCap,
                  )}
                  id="select_all_label"
                >
                  {!isLoading && t(SELECT_FIELD.ALL)}
                </span>
                <CheckboxGroup
                  id="select_all"
                  optionList={download_select_all}
                  onClick={onCheckboxDownloadAllChangeHandler}
                  selectedValues={[1]}
                  hideLabel
                  hideMessage
                  hideOptionLabel
                  isDataLoading={isLoading}
                />
              </div>
            </div>
            <div className={cx(gClasses.MT10, styles.listDiv)}>
              {isLoading ? (
                <Skeleton
                  count={5}
                  height={14}
                  className={cx(gClasses.MB15)}
                  width="100%"
                />
              ) : (
                fieldOptionListElement
              )}
            </div>
          </div>
        }
        footerContent={
          <div
            className={cx(BS.W100, BS.D_FLEX, BS.JC_END, BS.ALIGN_ITEM_CENTER)}
          >
            <Button
              id={BUTTONS.DOWNLOAD.ID}
              buttonType={BUTTON_TYPE.PRIMARY}
              onClick={(e) => {
                if (e.detail && e.detail === 1) {
                  onClickDownloadCheckPrompt();
                }
              }}
              onKeyDown={(e) => {
                keydownOrKeypessEnterHandle(e) && onClickDownloadCheckPrompt();
              }}
              isDataLoading={isLoading}
              disabled={!isDownloadBtnDisable}
            >
              {t(BUTTONS.DOWNLOAD.LABEL)}
            </Button>
          </div>
        }
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    download_list: state.DownloadWindowReducer.download_list,
  };
};

export default connect(mapStateToProps, null)(Download);
Download.propTypes = {
  onCheckboxSelectAllChangeHandler: PropTypes.func,
  onDeleteDownloadClickHandler: PropTypes.func,
  isLoading: PropTypes.bool,
  downloadFieldOptionList: PropTypes.objectOf(PropTypes.any),
  downloadFieldSelectAll: PropTypes.objectOf(PropTypes.any),
};

Download.defaultProps = {
  onCheckboxSelectAllChangeHandler: null,
  onDeleteDownloadClickHandler: null,
  isLoading: false,
  downloadFieldOptionList: [],
  downloadFieldSelectAll: [],
};
