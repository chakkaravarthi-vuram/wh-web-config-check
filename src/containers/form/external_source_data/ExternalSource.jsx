import {
  Button,
  EButtonSizeType,
  EButtonType,
  ETextSize,
  Modal,
  ModalSize,
  ModalStyleType,
  SingleDropdown,
  Text,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import React, { useEffect } from 'react';
import gClasses from 'scss/Typography.module.scss';
import { isEmpty, cloneDeep, pick } from 'utils/jsUtility';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './ExternalSource.module.scss';
import {
  CANCEL,
  DATA_SOURCE,
  DATA_SOURCE_TYPES,
  HEADER_SUB_TEXT,
  HEADER_TEXT,
  PLACEHOLDERS,
  SAVE,
} from './ExternalSource.strings';
import {
  DATA_SOURCE_OPTIONS_LIST,
  FIELD_IDS,
  MODAL_ATTRIBUTES,
  OUTPUT_FORMAT_CONSTANTS,
} from './ExternalSource.constants';
import IntegrationData from './integration/IntegrationData';
import CloseIcon from '../../../assets/icons/task/CloseIcon';
import DatalistData from './datalist/DatalistData';
import {
  externalSourceDataChange,
  useExternalSource,
  INITIAL_STATE,
} from './useExternalSource';
import {
  constructDataListPostData,
  constructDataListValidationData,
  constructIntegrationPostData,
  constructIntegrationValidationData,
  getMetaData,
  getPostMetaData,
} from './ExternalSource.utils';
import { validate } from '../../../utils/UtilityFunctions';
import {
  commonValidationSchema,
  getDataListValidationSchema,
  getIntegrationValidationSchema,
  getOutputFormatValidationSchema,
} from './ExternalSource.validation.schema';
import {
  getRuleDetailsById,
  saveDataListRule,
  saveIntegrationRule,
} from './useExternalSource.action';
import { constructJoiObject } from '../../../utils/ValidationConstants';
import { getExternalFieldsOnSuccess } from '../../../redux/actions/Visibility.Action';
import { validateFilter } from '../../../components/condition_builder_with_field_mapping/ConditionBuilderWithFieldMapping.utils';

export default function ExternalSource(props) {
  const {
    ruleId,
    onCloseClick,
    moduleType,
    moduleId,
    metaData,
    onSave,
  } = props;

  const reduxDispatcher = useDispatch();
  const { state, dispatch } = useExternalSource();
  console.log('statex', state, moduleType);

  const { t } = useTranslation();

  const { selectedExternalSource, errorList, isRuleDetailsLoading } =
    state;

  const dispatchGetFields = (data) => {
    dispatch(externalSourceDataChange({
      fieldList: data?.rFields,
    }));
    reduxDispatcher(getExternalFieldsOnSuccess({}, { pagination_data: data?.lFields }));
  };

  useEffect(() => {
    if (!isEmpty(ruleId)) {
      getRuleDetailsById({ ruleId, extraParams: getPostMetaData(moduleType, metaData, moduleId), dispatch, t, dispatchGetFields, isFromFlow: !!state?.flowId });
      dispatch(
        externalSourceDataChange({
          ruleId,
          ...getMetaData(moduleType, metaData, moduleId),
        }),
      );
    } else {
      dispatch(
        externalSourceDataChange({
          isRuleDetailsLoading: false,
          ...getMetaData(moduleType, metaData, moduleId),
        }),
      );
    }
  }, []);

  const handleDropdownClick = (selectedValue) => {
    if (selectedExternalSource === selectedValue) return;

    dispatch(
      externalSourceDataChange({
        ...INITIAL_STATE,
        ...getMetaData(moduleType, metaData, moduleId),
        errorList: {},
        isRuleDetailsLoading: false,
        selectedExternalSource: selectedValue,
      }),
    );
  };

  const constructValidationConfig = (selectedExternalSource) => {
    let validationData = {};
    let validationSchema = null;
    let outputFormatKeys = [];
    if (selectedExternalSource === DATA_SOURCE_TYPES.DATA_LIST) {
      validationData = constructDataListValidationData(state);
      validationSchema = getDataListValidationSchema(t);
      outputFormatKeys = OUTPUT_FORMAT_CONSTANTS.DATA_LIST.HEADERS(t);
    } else if (selectedExternalSource === DATA_SOURCE_TYPES.INTEGRATION) {
      validationData = constructIntegrationValidationData(state);
      validationSchema = getIntegrationValidationSchema(t);
      outputFormatKeys = OUTPUT_FORMAT_CONSTANTS.INTEGRATION.HEADERS;
    } else {
      validationData = pick(state, [
        FIELD_IDS.EXTERNAL_SOURCE,
        FIELD_IDS.SOURCE_NAME,
      ]);
      validationSchema = constructJoiObject(commonValidationSchema(t));
    }

    return {
      validationData,
      validationSchema,
      outputFormatKeys,
    };
  };

  const onSaveExternalSource = () => {
    const { ruleData, postRuleData,
           isRuleHasValidation, isPostRuleHasValidation,
      } = validateFilter(state?.filter, state.flowId);

    const { validationData, validationSchema, outputFormatKeys } = constructValidationConfig(selectedExternalSource);

    const currentErrorList = validate(validationData, validationSchema);
    let outputFormatErrorList = {};

    if (selectedExternalSource) {
       outputFormatErrorList = validate(
        state?.[FIELD_IDS.OUTPUT_FORMAT],
        getOutputFormatValidationSchema(t, outputFormatKeys, selectedExternalSource),
      );
    }

    if (isEmpty(currentErrorList) && isEmpty(outputFormatErrorList) &&
        !isRuleHasValidation && !isPostRuleHasValidation) {
        if (selectedExternalSource === DATA_SOURCE_TYPES.INTEGRATION) {
          const postData = constructIntegrationPostData(state);
          saveIntegrationRule({ data: postData, dispatch, callback: onCloseClick, t }).then((res) => onSave?.(res));
        } else if (selectedExternalSource === DATA_SOURCE_TYPES.DATA_LIST) {
          const postData = constructDataListPostData(state);
          saveDataListRule({ data: postData, dispatch, callback: onCloseClick, state, t }).then((res) => onSave?.(res));
        }
    } else {
      const hasValidation = isRuleHasValidation || isPostRuleHasValidation;
      const filterData = {
        ...state?.filter,
        rule: ruleData,
        postRule: postRuleData,
      };
      const errorList = {
        ...currentErrorList,
        ...outputFormatErrorList,
        ...((isRuleHasValidation) ? { isRuleHasValidation: true } : {}),
        ...((isPostRuleHasValidation) ? { isPostRuleHasValidation: true } : {}),
      };

      dispatch(
        externalSourceDataChange({
          errorList: errorList,
          outputFormatErrorList: outputFormatErrorList,
          ...((hasValidation) ? { filter: filterData } : {}),
        }),
      );
    }

    console.log(
      'currentErrorList',
      validationData,
      currentErrorList,
      outputFormatErrorList,
    );
  };

  const header = (
    <div>
      <Text
        className={cx(gClasses.FontWeight500, gClasses.FTwoBlackV23)}
        size={ETextSize.XL}
        content={t(HEADER_TEXT)}
      />
      <button
        className={cx(gClasses.PositionAbsolute, styles.CloseIcon)}
        onClick={onCloseClick}
      >
        <CloseIcon />
      </button>
    </div>
  );

  const getCurrentTab = () => {
    if (selectedExternalSource === DATA_SOURCE_TYPES.INTEGRATION) {
      return <IntegrationData />;
    } else if (selectedExternalSource === DATA_SOURCE_TYPES.DATA_LIST) {
      return <DatalistData />;
    } else return null;
  };

  const main = (
    <div className={styles.MainContentPadding}>
      <Text
        className={cx(gClasses.MB12, gClasses.FontWeight500, gClasses.FTwo16GrayV3)}
        content={t(HEADER_SUB_TEXT)}
      />
      <div className={styles.ChooseSource}>
        <SingleDropdown
          dropdownViewProps={{
            labelName: t(DATA_SOURCE),
            isLoading: isRuleDetailsLoading,
            disabled: !isEmpty(ruleId),
          }}
          onClick={(selectedValue) => handleDropdownClick(selectedValue)}
          selectedValue={selectedExternalSource}
          optionList={cloneDeep(DATA_SOURCE_OPTIONS_LIST)}
          placeholder={PLACEHOLDERS.DATA_SOURCE}
          className={gClasses.MB12}
          errorMessage={errorList?.selectedExternalSource}
          required
        />
      </div>
      {getCurrentTab()}
    </div>
  );

  const footer = (
    <div className={styles.footer}>
      <div className={styles.SpacedContainer}>
        <div className={cx(gClasses.W100, gClasses.DisplayFlex, gClasses.JusEnd)}>
          <Button
            className={gClasses.MR15}
            onClickHandler={onCloseClick}
            buttonText={t(CANCEL)}
            type={EButtonType.OUTLINE_SECONDARY}
            size={EButtonSizeType.LG}
            noBorder
          />
          <Button
            className={gClasses.MR15}
            onClickHandler={onSaveExternalSource}
            buttonText={t(SAVE)}
            type={EButtonType.PRIMARY}
            size={EButtonSizeType.LG}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={cx(
        styles.Container,
        gClasses.PositionRelative,
        gClasses.CenterH,
        gClasses.FlexDirectionColumn,
        gClasses.MB16,
      )}
    >
      <Modal
        id={MODAL_ATTRIBUTES.ID}
        modalStyle={ModalStyleType.modal}
        customModalClass={styles.ExternalDataModal}
        modalSize={ModalSize.lg}
        isModalOpen
        headerContent={header}
        headerContentClassName={styles.Header}
        mainContent={main}
        footerContent={footer}
      />
    </div>
  );
}

ExternalSource.propTypes = {
  ruleId: PropTypes.string,
  onCloseClick: PropTypes.func,
  moduleType: PropTypes.string,
  moduleId: PropTypes.string,
  metaData: PropTypes.object,
  onSave: PropTypes.func,
};
