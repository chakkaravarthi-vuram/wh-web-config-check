import {
  Button,
  EButtonSizeType,
  EButtonType,
  ETextSize,
  ETitleHeadingLevel,
  ETitleSize,
  RadioGroup,
  SingleDropdown,
  Title,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import React, { useEffect, useState, useTransition } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { validate } from 'utils/UtilityFunctions';
import { getOptionalList } from '../../../../redux/actions/Report.Action';
import {
  dataChange,
  clearAdditionalData,
} from '../../../../redux/reducer/ReportReducer';
import gClasses from '../../../../scss/Typography.module.scss';
import {
  CREATE_REPORT,
  CREATE_REPORT_CONFIG,
  REPORT,
} from '../../../../urls/RouteConstants';
import { BS } from '../../../../utils/UIConstants';
import jsUtility, { cloneDeep } from '../../../../utils/jsUtility';
import { EMPTY_STRING, SPACE } from '../../../../utils/strings/CommonStrings';
import {
  LIST_API_TYPE,
  DROPDOWN_TYPES,
  REPORT_STRINGS,
} from '../../Report.strings';
import {
  constructReportData,
  constructSourceData,
  getReportValidationData,
} from '../../Report.utils';
import styles from './BasicDetails.module.scss';
import OtherDataSource from '../OtherDataSource/OtherDataSource';
import { routeNavigate } from '../../../../utils/UtilityFunctions';
import PlusIconBlueNew from '../../../../assets/icons/PlusIconBlueNew';
import { CREATE_REPORT_VALIDATION_SCHEMA } from '../../Reports.validation';
import { ROUTE_METHOD } from '../../../../utils/Constants';

function BasicDetails(props) {
  const { onCloseClick } = props;
  const { t } = useTransition();
  const dispatch = useDispatch();
  const history = useHistory();
  const matchParams = useParams();
  const [searchText, setSearchText] = useState(EMPTY_STRING);

  const {
    reportConfig,
    primaryDataSource = EMPTY_STRING,
    secondaryDataSource = EMPTY_STRING,
    primarySourceType = EMPTY_STRING,
    secondaryDataSourceType = EMPTY_STRING,
    primaryField = EMPTY_STRING,
    secondaryField = EMPTY_STRING,
    primaryDataSourceOptionList = [],
    primaryFieldOptionList = [],
    secondaryFieldOptionList = [],
    secondaryDataSourceOptionList = [],
    reportCategory,
    primaryDataSourceName,
    primaryFieldName,
    secondaryFieldName,
    secondaryDataSourceName,
    errorList,
  } = useSelector((store) => store.ReportReducer);
  const isEmpty = jsUtility.isEmpty(secondaryDataSource);
  const [isShowCommonField, setIsShowCommonField] = useState(!isEmpty);
  const state = useSelector((store) => store.ReportReducer);

  const { isLoading } = reportConfig;
  const {
    REPORT_CONFIG: { MAIN_CONTENT },
    SOURCES,
    PRIMARY_SOURCE,
    SOURCE_TYPE,
    SELECT,
    SEARCH,
    OTHER_DATA_SOURCE,
    ADD_MORE_DATA_SOURCE,
    REPORT_VIEW,
    REPORTVIEW,
    NEXT,
    CANCEL,
    ERRORS,
  } = REPORT_STRINGS(t);

  useEffect(() => {
    if (!isEmpty) {
      dispatch(dataChange({ data: { isAddOneMore: true } }));
    }
  }, []);
  const size = 100;
  const isEdit = !jsUtility.isEqual(
    matchParams.reportActionType,
    CREATE_REPORT_CONFIG,
  );
  const title = isEdit ? MAIN_CONTENT.TITLE_EDIT : MAIN_CONTENT.TITLE_CREATE;
  let selectedSourceLabel = EMPTY_STRING;
  if (primarySourceType === SOURCE_TYPE[0].value) {
    selectedSourceLabel = SOURCES.FLOW;
  } else if (primarySourceType === SOURCE_TYPE[1].value) {
    selectedSourceLabel = SOURCES.DATA_LIST;
  }

  /** This function is common for getting option List for data Sources and Data Sources Fields */
  const getOptionList = (
    search = EMPTY_STRING,
    type = EMPTY_STRING,
    dropDownType = EMPTY_STRING,
  ) => {
    const params = {
      page: 1,
      size,
    };
    if (search !== EMPTY_STRING) {
      params.search = search;
    }
    if (
      type === LIST_API_TYPE.FIELD_LIST &&
      dropDownType === DROPDOWN_TYPES.PRIMARY_FIELD
    ) {
      const sourceSelectedValue = primaryDataSource;
      const id = sourceSelectedValue?.split(SPACE)[0];
      if (primarySourceType === LIST_API_TYPE.FLOW) {
        params.flow_id = id;
      } else {
        params.data_list_id = id;
      }
    } else if (
      type === LIST_API_TYPE.FIELD_LIST &&
      dropDownType === DROPDOWN_TYPES.SECONDARY_FIELD
    ) {
      const sourceSelectedValue = secondaryDataSource;
      const id = sourceSelectedValue?.split(SPACE)[0];
      if (secondaryDataSourceType === LIST_API_TYPE.FLOW) {
        params.flow_id = id;
      } else {
        params.data_list_id = id;
      }
    }
    dispatch(getOptionalList(type, params, dropDownType));
  };

  const onSearchTextChangeHandler = (event, type, DropDownType) => {
    const searchText = event?.target?.value;
    setSearchText(searchText);
    getOptionList(searchText, type, DropDownType);
  };

  const setSearchTextValue = (value) => {
    setSearchText(value);
  };
  /** This function is common for handling onChange for data Sources and Data Sources Fields */
  const onDropDownChangeHandler = (dropDownType, value, label) => {
    const updatedData = { errorList: { ...errorList } };
    switch (dropDownType) {
      case DROPDOWN_TYPES.PRIMARY_SOURCE:
        updatedData.primaryDataSource = value;
        updatedData.primaryDataSourceName = label;
        updatedData.primaryField = EMPTY_STRING;
        updatedData.primaryFieldName = EMPTY_STRING;
        delete updatedData.errorList.primaryDataSource;
        delete updatedData.errorList.primaryField;
        break;
      case DROPDOWN_TYPES.SECONDARY_SOURCE:
        updatedData.secondaryDataSource = value;
        updatedData.secondaryDataSourceName = label;
        updatedData.secondaryField = EMPTY_STRING;
        updatedData.secondaryFieldName = EMPTY_STRING;
        delete updatedData.errorList.secondaryDataSource;
        delete updatedData.errorList.secondaryField;
        break;
      case DROPDOWN_TYPES.PRIMARY_FIELD:
        updatedData.primaryField = value;
        updatedData.primaryFieldName = label;
        delete updatedData.errorList.primaryField;
        break;
      case DROPDOWN_TYPES.SECONDARY_FIELD:
        updatedData.secondaryField = value;
        updatedData.secondaryFieldName = label;
        delete updatedData.errorList.secondaryField;
        break;
      default:
        break;
    }
    setSearchText(EMPTY_STRING);

    dispatch(dataChange({ data: updatedData }));
  };
  /** This function is common for handling typeChange for data Sources */
  const onDropDownTypeChangeHandler = (dropDownType, value) => {
    const updatedData = { errorList: { ...errorList } };
    switch (dropDownType) {
      case DROPDOWN_TYPES.PRIMARY_SOURCE:
        updatedData.primarySourceType = value;
        updatedData.primaryDataSource = EMPTY_STRING;
        updatedData.primaryDataSourceName = EMPTY_STRING;
        updatedData.primaryField = EMPTY_STRING;
        updatedData.primaryFieldName = EMPTY_STRING;
        delete updatedData.errorList.primaryDataSource;
        delete updatedData.errorList.primaryField;
        getOptionList(EMPTY_STRING, value, DROPDOWN_TYPES.PRIMARY_SOURCE);
        break;
      case DROPDOWN_TYPES.SECONDARY_SOURCE:
        updatedData.secondaryDataSourceType = value;
        updatedData.secondaryDataSource = EMPTY_STRING;
        updatedData.secondaryField = EMPTY_STRING;
        updatedData.secondaryFieldName = EMPTY_STRING;
        updatedData.secondaryDataSourceName = EMPTY_STRING;
        delete updatedData.errorList.secondaryDataSource;
        delete updatedData.errorList.secondaryField;
        getOptionList(EMPTY_STRING, value, DROPDOWN_TYPES.PRIMARY_SOURCE);
        break;
      default:
        break;
    }
    setSearchText(EMPTY_STRING);
    dispatch(dataChange({ data: updatedData }));
  };
  return (
    <div
      className={cx(
        BS.W100,
        BS.JC_CENTER,
        BS.D_FLEX,
        gClasses.H90,
        gClasses.OverflowAuto,
      )}
    >
      <div className={cx(isEdit ? styles.ParentWidth : gClasses.W60)}>
        {!isEdit && (
          <Title
            isDataLoading={isLoading}
            className={cx(BS.D_FLEX, BS.JC_CENTER)}
            content={title}
            headingLevel={ETitleHeadingLevel.h3}
            size={ETitleSize.medium}
          />
        )}
        <Title
          content={MAIN_CONTENT.TITTLE_PRIMARY}
          size={ETextSize.XS}
          className={gClasses.MT18}
        />
        <div
          className={cx(
            BS.D_FLEX,
            BS.JC_BETWEEN,
            gClasses.MT8,
            BS.ALIGN_ITEM_CENTER,
          )}
        >
          <div className={gClasses.W40}>
            <SingleDropdown
              dropdownViewProps={{
                isLoading,
                labelName: PRIMARY_SOURCE.LABEL,
                placeholder: PRIMARY_SOURCE.PLACEHOLDER,
                selectedLabel: selectedSourceLabel,
              }}
              optionList={SOURCE_TYPE}
              onClick={(value) => {
                onDropDownTypeChangeHandler(
                  DROPDOWN_TYPES.PRIMARY_SOURCE,
                  value,
                );
              }}
            />
          </div>
          <div className={cx(gClasses.W60, gClasses.MT24, gClasses.PL16)}>
            <SingleDropdown
              dropdownViewProps={{
                placeholder: SELECT,
                selectedLabel: primaryDataSourceName,
                disabled: !primarySourceType,
                onBlur: () => {},
                onClick: () => {
                  getOptionList(
                    EMPTY_STRING,
                    primarySourceType,
                    DROPDOWN_TYPES.PRIMARY_SOURCE,
                  );
                },
                onKeyDown: () => {
                  getOptionList(
                    EMPTY_STRING,
                    primarySourceType,
                    DROPDOWN_TYPES.PRIMARY_SOURCE,
                  );
                },
              }}
              popperClassName={styles.ReportDDListPopper}
              optionList={cloneDeep(primaryDataSourceOptionList)}
              selectedValue={primaryDataSource}
              searchProps={{
                searchPlaceholder: SEARCH,
                searchValue: searchText,
                onChangeSearch: (event) => {
                  onSearchTextChangeHandler(
                    event,
                    primarySourceType,
                    DROPDOWN_TYPES.PRIMARY_SOURCE,
                  );
                },
              }}
              infiniteScrollProps={{
                dataLength: size,
                next: () => {},
                hasMore: false,
              }}
              onClick={(value, label) => {
                onDropDownChangeHandler(
                  DROPDOWN_TYPES.PRIMARY_SOURCE,
                  value,
                  label,
                );
              }}
              errorMessage={errorList?.primaryDataSource}
              onOutSideClick={() => {
                setSearchTextValue(EMPTY_STRING);
              }}
            />
          </div>
        </div>

        <Title
          content={OTHER_DATA_SOURCE}
          size={ETextSize.XS}
          className={cx(gClasses.MT18)}
        />
        {(isShowCommonField || !jsUtility.isEmpty(secondaryDataSource)) && (
          <OtherDataSource
            onDeleteClick={() => {
              const tempErrorObject = {};
              if (!jsUtility.isEmpty(errorList)) {
                if (errorList?.primaryDataSource) {
                  tempErrorObject.primaryDataSource =
                    errorList.primaryDataSource;
                }
              }
              dispatch(
                dataChange({
                  data: { isAddOneMore: false, errorList: tempErrorObject },
                }),
              );

              dispatch(clearAdditionalData());
              setIsShowCommonField(false);
            }}
            onSearchTextChangeHandler={onSearchTextChangeHandler}
            searchText={searchText}
            onDropDownClick={onDropDownChangeHandler}
            getOptionList={getOptionList}
            primaryField={primaryField}
            primaryDataSource={primaryDataSource}
            secondaryDataSource={secondaryDataSource}
            primarySourceType={primarySourceType}
            secondaryDataSourceType={secondaryDataSourceType}
            secondaryField={secondaryField}
            primaryFieldOptionList={primaryFieldOptionList}
            secondaryFieldOptionList={secondaryFieldOptionList}
            secondaryDataSourceOptionList={secondaryDataSourceOptionList}
            onDropDownTypeChangeHandler={onDropDownTypeChangeHandler}
            primaryFieldName={primaryFieldName}
            secondaryFieldName={secondaryFieldName}
            secondaryDataSourceName={secondaryDataSourceName}
            errorList={errorList}
            setSearchText={setSearchTextValue}
          />
        )}
        {!isShowCommonField && (
          <button
            onClick={() => {
              setIsShowCommonField(true);
              dispatch(dataChange({ data: { isAddOneMore: true } }));
            }}
            className={cx(
              BS.D_FLEX,
              BS.ALIGN_ITEM_CENTER,
              gClasses.FTwo13BlueV39,
              gClasses.CursorPointer,
              gClasses.MT8,
            )}
          >
            <PlusIconBlueNew className={gClasses.MR3} />
            {ADD_MORE_DATA_SOURCE}
          </button>
        )}
        <Title
          content={REPORT_VIEW}
          size={ETextSize.XS}
          className={cx(gClasses.MT24)}
        />
        <RadioGroup
          options={REPORTVIEW}
          className={cx(gClasses.MT20)}
          onChange={(event, id, value) => {
            dispatch(dataChange({ data: { reportCategory: value } }));
          }}
          selectedValue={reportCategory}
        />
        {!isEdit && (
          <div
            className={cx(
              gClasses.MT24,
              gClasses.DisplayFlex,
              gClasses.JCEnd,
              gClasses.AlignCenter,
            )}
          >
            <Button
              buttonText={CANCEL}
              noBorder
              className={cx(gClasses.MR24, gClasses.FontWeight500, styles.CancelButton)}
              onClickHandler={onCloseClick}
            />
            <Button
              buttonText={NEXT}
              size={EButtonSizeType.MD}
              type={EButtonType.PRIMARY}
              onClickHandler={() => {
                const validationData = getReportValidationData(state) || {};
                let errorList = {};
                if (
                  validationData.primaryDataSource ===
                    validationData?.secondaryDataSource &&
                  validationData.primaryDataSource !== EMPTY_STRING &&
                  validationData?.secondaryDataSource !== EMPTY_STRING
                ) {
                  errorList.secondaryDataSource =
                    ERRORS.INVALID_SECONDARY_SOURCE;
                } else {
                  errorList = validate(
                    validationData,
                    CREATE_REPORT_VALIDATION_SCHEMA(),
                  );
                }
                dispatch(dataChange({ data: { errorList } }));

                if (jsUtility.isEmpty(errorList)) {
                  const source_Data = constructSourceData(state);
                  const report_Data = constructReportData(state, source_Data);
                  let reportConfig = state?.reportConfig;
                  reportConfig = { ...reportConfig, source_Data, report_Data };
                  dispatch(dataChange({ data: { reportConfig } }));
                  const pathCreateReport = `/${REPORT}/${CREATE_REPORT}`;
                  routeNavigate(history, ROUTE_METHOD.PUSH, pathCreateReport);
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default BasicDetails;
