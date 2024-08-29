import { Text, ETextSize, toastPopOver, EToastType } from '@workhall-pvt-lmt/wh-ui-library';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styles from './FieldValue.module.scss';
import gClasses from '../../../scss/Typography.module.scss';
import { BS } from '../../../utils/UIConstants';
import FieldValueRuleConfig from './field_value_rule_config/FieldValueRuleConfig';
import ImportRule from '../import_rule/ImportRule';
import { getDefaultValueRulesThunk } from '../../../redux/actions/Visibility.Action';
import { RULE_TYPE } from '../../../utils/constants/rule/rule.constant';
import { FORM_POPOVER_STATUS, MODULE_TYPES } from '../../../utils/Constants';
import { FIELD_DEFAULT_VALUE_STRINGS } from './FieldValueRule.strings';
import { showToastPopover } from '../../../utils/UtilityFunctions';
import Accordion from '../../../components/accordion/Accordion';
import AccordionWithState from '../../../components/accordion/accordion_with_state/AccordionWithState';
// import RuleEditIcon from '../../../assets/icons/RuleEditIcon';
// import FilePlusIcon from '../../../assets/icons/FilePlusIcon';
// import FileImportIcon from '../../../assets/icons/FileImportIcon';
import { getModuleIdByModuleType } from '../../form/Form.utils';
import Trash from '../../../assets/icons/application/Trash';
import { deleteDefaultValueRuleApi } from '../../../axios/apiService/rule.apiService';
import DeleteConfirmModal from '../../../components/delete_confirm_modal/DeleteConfirmModal';
import { FIELD_VISIBILITY_STRINGS } from '../field_visibility/FieldVisibilityRule.strings';
import { fieldDefaultValueUpdateRuleList } from '../../../redux/reducer/VisibilityReducer';
import { DEFAULT_VALUE_CONFIG_STRINGS } from '../../../components/form_builder/field_config/basic_config/DefaultValueRule.strings';
import { get, isEmpty } from '../../../utils/jsUtility';
import DependencyHandler from '../../../components/dependency_handler/DependencyHandler';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { MAX_DATA_COUNT_PER_PAGE } from '../add_data_from_another_source/AddDataFromAnotherSource.constants';

function FieldValueRuleList(props) {
  const { metaData, moduleType } = props;
  const {
    formUUID,
    formId,
    moduleId,
  } = metaData;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState('');
  const [valueAccordion, setValueAccordion] = useState(true);
  const [deleteRuleUUID, setDeleteRuleUUID] = useState();
  const [dependencyData, setDependencyData] = useState({});
  const dispatch = useDispatch();
  const { ruleList = [], paginationDetail } = useSelector((store) => store.VisibilityReducer.fieldDefaultValueReducer);
  const { t } = useTranslation();
  const { LISTING } = FIELD_DEFAULT_VALUE_STRINGS(t);
  const { DELETE } = FIELD_VISIBILITY_STRINGS(t);

   const loadRuleList = (page) => {
        const moduleObj = getModuleIdByModuleType(metaData, moduleType);
        delete moduleObj.step_id;
        const params = {
            ...moduleObj,
            page: page,
            size: MAX_DATA_COUNT_PER_PAGE,
            rule_type: [RULE_TYPE.DEFAULT_VALUE],
        };
        if (metaData?.formUUID) {
            params.form_uuid = metaData?.formUUID;
        }
        dispatch(getDefaultValueRulesThunk(params));
   };

  useEffect(() => {
    loadRuleList(1);
  }, []);

  // Query Response
//   const onAddClickHandler = () => { setIsModalOpen(true); };
//   const onEditRule = (uuid) => {
//     setIsModalOpen(true);
//     setSelectedRule(uuid);
//   };

  const onDeleteClick = (uuid) => {
    setDeleteRuleUUID(uuid);
  };

  const getDeleteRuleModal = () => {
    if (!deleteRuleUUID) return null;

    const onDeleteRule = () => {
        const moduleObj = getModuleIdByModuleType(metaData, moduleType);
        delete moduleObj.step_id;
        const data = {
            ...moduleObj,
            rule_uuid: deleteRuleUUID,
        };
        deleteDefaultValueRuleApi(data).then(() => {
            const filteredRules = ruleList.filter((r) => r.rule_uuid !== deleteRuleUUID);
            showToastPopover('Default Rule Deleted Successfully', EMPTY_STRING, FORM_POPOVER_STATUS.DELETE, true);
            dispatch(fieldDefaultValueUpdateRuleList({
                pagination_data: filteredRules,
                pagination_detail: paginationDetail,
            }));
            setDeleteRuleUUID(null);
        }).catch((e) => {
            console.error('xyz error', e);
            const response = e?.response?.data?.errors;
            setDependencyData({});
            const error_type = get(response, [0, 'type'], EMPTY_STRING);
            if (error_type === 'rule_dependency') {
                setDependencyData(response);
            } else {
                toastPopOver({
                    title: t('server_error_code_string.somthing_went_wrong'),
                    toastType: EToastType.error,
                });
            }
        });
    };

    return (
      <DeleteConfirmModal
        title={DELETE.DELETE_MODAL_TITLE}
        subText1={DELETE.DELETE_MODAL_SUB_TITLE_FIRST}
        isModalOpen
        onCancel={() => setDeleteRuleUUID(null)}
        onClose={() => setDeleteRuleUUID(null)}
        onDelete={() => onDeleteRule()}
      />
    );
  };

//   const onImportClickHandler = () => { setIsImportModalOpen(true); };

  const getImportModal = () => {
      if (!isImportModalOpen) return null;
      return (<ImportRule
            ruleType={RULE_TYPE.DEFAULT_VALUE}
            flowId={moduleId}
            formUUID={formUUID}
            formId={formId}
            onClose={() => setIsImportModalOpen(false)}
            onImport={() => {
                showToastPopover(
                    LISTING.SUCCESS_POPOVER.title,
                    EMPTY_STRING,
                    FORM_POPOVER_STATUS.SUCCESS,
                    true,
                  );
                setIsImportModalOpen(false);
                loadRuleList(1);
            }}
      />);
  };

  const getAddOrEditModal = () => {
      if (!isModalOpen) return null;
      return (<FieldValueRuleConfig
        isFormConfiguration
        metaData={{
            moduleId,
            formUUID,
            ruleId: selectedRule,
        }}
        moduleType={moduleType}
        onClose={() => {
            setIsModalOpen(false);
            setSelectedRule(null);
        }}
        ruleType={RULE_TYPE.DEFAULT_VALUE}
      />);
  };

  const getDeleteDependencyModal = () => (
    !isEmpty(dependencyData) &&
      <DependencyHandler
        onCancelDeleteClick={() => { setDependencyData({}); setDeleteRuleUUID(null); }}
        dependencyHeaderTitle="Rule"
        dependencyData={dependencyData[0]?.message}
      />
  );

  return (
    <>
        {getImportModal()}
        {getAddOrEditModal()}
        <Accordion
            headerContent="Calculated/Manipulated Field"
            className={styles.AccordionContainerClass}
            headerClassName={cx(gClasses.P0, styles.Sticky)}
            headerContentClassName={cx(styles.AccordionHeader, gClasses.FontWeight500)}
            iconClassName={styles.ChevronClass}
            iconContainerClassName={styles.ChevronContainerClass}
            childrenClassName={gClasses.P0}
            hideBorder
            onHeaderClick={() => setValueAccordion(!valueAccordion)}
            isChildrenVisible={valueAccordion}
        >
            <div className={cx(styles.AccordionChildren, gClasses.MB16)}>
                {ruleList.map((rule) => (
                    <AccordionWithState
                        key={rule._id}
                        className={cx(styles.CardContainerClass, gClasses.MT16)}
                        headerClassName={cx(styles.CardClass, BS.D_BLOCK)}
                        headerContentClassName={gClasses.W100}
                        headerContent={(
                            <div className={cx(gClasses.CenterV, BS.JC_BETWEEN, gClasses.W100)}>
                                <Text
                                    size={ETextSize.MD}
                                    content={rule.rule_name}
                                    className={cx(styles.RuleName, gClasses.Ellipsis)}
                                    title={rule.rule_name}
                                />
                                <div className={cx(gClasses.ML10, gClasses.CenterVH, gClasses.gap12)}>
                                    {/* <RuleEditIcon onClick={() => onEditRule(rule.rule_uuid)} className={cx(styles.RuleEditIcon, gClasses.CursorPointer)} /> */}
                                    <Trash onClick={() => onDeleteClick(rule.rule_uuid)} className={cx(gClasses.CursorPointer)} />
                                </div>
                            </div>
                        )}
                        hideIcon
                    >
                        <div className={cx(gClasses.P8, gClasses.PT0)}>
                            {rule.field_names.map((field_name) => (
                                <Text
                                    key={field_name}
                                    size={ETextSize.MD}
                                    content={field_name.label}
                                    className={cx(gClasses.CenterV, styles.FieldNameContainer, gClasses.MT4)}
                                />
                            ))}
                        </div>
                    </AccordionWithState>
                ))}
                {/* <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, gClasses.MT16, gClasses.MB16, styles.AddOrImportButtonClass)}>
                    <button onClick={() => onAddClickHandler()} className={gClasses.CenterVH}>
                        <FilePlusIcon />
                        <span className={cx(gClasses.FTwo13, gClasses.FontWeight400)}>Add</span>
                    </button>
                    <button onClick={() => onImportClickHandler()} className={gClasses.CenterVH}>
                        <FileImportIcon />
                        <span className={cx(gClasses.FTwo13, gClasses.FontWeight400)}>Import</span>
                    </button>
                </div> */}
                {isEmpty(ruleList) && <Text content={t(DEFAULT_VALUE_CONFIG_STRINGS.NO_RULES)} /> }
            </div>
        </Accordion>
        {getDeleteRuleModal()}
        {getDeleteDependencyModal()}
    </>
  );
}

FieldValueRuleList.defaultProps = {
    metaData: PropTypes.objectOf({
        formUUID: 'cf5f7bbc-7413-4c0f-ae2d-643ec4142f6a',
        formId: '629098f086c53d0018e4e7a4',
        moduleId: null,
    }),
    moduleType: MODULE_TYPES.FLOW,
};

FieldValueRuleList.propTypes = {
    metaData: PropTypes.objectOf({
        formUUID: PropTypes.string,
        formId: PropTypes.string,
        moduleId: PropTypes.string,
    }),
    moduleType: PropTypes.oneOf(Object.values(MODULE_TYPES)),
};

export default FieldValueRuleList;
