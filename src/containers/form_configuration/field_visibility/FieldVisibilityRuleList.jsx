import { ETextSize, EToastType, Text, toastPopOver } from '@workhall-pvt-lmt/wh-ui-library';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styles from './FieldVisibility.module.scss';
import gClasses from '../../../scss/Typography.module.scss';
import { BS } from '../../../utils/UIConstants';
import FieldVisibilityRuleConfig from './field_visibility_rule_config/FieldVisibilityRuleConfig';
import ImportRule from '../import_rule/ImportRule';
import { getVisibilityRulesThunk } from '../../../redux/actions/Visibility.Action';
import { RULE_TYPE } from '../../../utils/constants/rule/rule.constant';
import { FORM_POPOVER_STATUS, MODULE_TYPES } from '../../../utils/Constants';
import { FIELD_DEFAULT_VALUE_STRINGS } from '../field_value/FieldValueRule.strings';
import { showToastPopover } from '../../../utils/UtilityFunctions';
import Accordion from '../../../components/accordion/Accordion';
import AccordionWithState from '../../../components/accordion/accordion_with_state/AccordionWithState';
import RuleEditIcon from '../../../assets/icons/RuleEditIcon';
import FilePlusIcon from '../../../assets/icons/FilePlusIcon';
import { EMPTY_STRING, UNDERSCORE } from '../../../utils/strings/CommonStrings';
import Trash from '../../../assets/icons/application/Trash';
import { getModuleIdByModuleType } from '../../form/Form.utils';
import { deleteConditionalRuleApi } from '../../../axios/apiService/rule.apiService';
import DeleteConfirmModal from '../../../components/delete_confirm_modal/DeleteConfirmModal';
import { FIELD_VISIBILITY_STRINGS } from './FieldVisibilityRule.strings';
import { fieldVisibilityUpdateRuleList } from '../../../redux/reducer/VisibilityReducer';
import { MAX_DATA_COUNT_PER_PAGE } from '../add_data_from_another_source/AddDataFromAnotherSource.constants';
import DependencyHandler from '../../../components/dependency_handler/DependencyHandler';
import { isEmpty } from '../../../utils/jsUtility';

function FieldVisibilityRuleList(props) {
  const {
    metaData: { formUUID, formId, moduleId },
    metaData,
    moduleType,
  } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [visibilityAccordion, setVisibilityAccordion] = useState(true);
  const [deleteRuleUUID, setDeleteRuleUUID] = useState();

  const [dependencyData, setDependencyData] = useState({});

  const { ruleList = [], paginationDetail } = useSelector((store) => store.VisibilityReducer.fieldVisibilityReducer);
  const dispatch = useDispatch();
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
            rule_type: [RULE_TYPE.VISIBILITY],
        };
        dispatch(getVisibilityRulesThunk(params));
   };

  useEffect(() => {
    loadRuleList(1);
  }, []);

  const onEditRule = (uuid) => {
    setIsModalOpen(true);
    setSelectedRule(uuid);
  };

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
        deleteConditionalRuleApi(data).then(() => {
            const filteredRules = ruleList.filter((r) => r.rule_uuid !== deleteRuleUUID);
            showToastPopover('Visibility Rule Deleted Successfully', EMPTY_STRING, FORM_POPOVER_STATUS.DELETE, true);
            dispatch(fieldVisibilityUpdateRuleList({
                pagination_data: filteredRules,
                pagination_detail: paginationDetail,
            }));
            setDeleteRuleUUID(null);
        }).catch((e) => {
            console.error('xyz error', e);
            const response = e?.response?.data?.errors;
            setDependencyData({});
            const error_type = response?.[0]?.type || EMPTY_STRING;
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

  const onAddClickHandler = () => { setIsModalOpen(true); };
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
        {isImportModalOpen &&
        <ImportRule
            ruleType={RULE_TYPE.VISIBILITY}
            flowId={moduleId}
            formUUID={formUUID}
            formId={formId}
            onClose={() => setIsImportModalOpen(false)}
            onImport={() => {
                showToastPopover(LISTING.SUCCESS_POPOVER.title, EMPTY_STRING, FORM_POPOVER_STATUS.SUCCESS, true);
                setIsImportModalOpen(false);
                loadRuleList(1);
            }}
        />}
        {isModalOpen &&
        <FieldVisibilityRuleConfig
            metaData={metaData}
            isModalOpen={isModalOpen}
            moduleType={moduleType}
            ruleUUID={selectedRule}
            setIsModalOpen={setIsModalOpen}
            onClose={() => {
                setIsModalOpen(false);
                setSelectedRule(null);
            }}
            ruleType={RULE_TYPE.VISIBILITY}
            ruleNameGenerate={UNDERSCORE}
        />}
        <Accordion
            headerContent="Visibility"
            className={styles.AccordionContainerClass}
            headerClassName={cx(gClasses.P0, styles.Sticky)}
            headerContentClassName={cx(styles.AccordionHeader, gClasses.FontWeight500)}
            iconClassName={styles.ChevronClass}
            iconContainerClassName={styles.ChevronContainerClass}
            childrenClassName={gClasses.P0}
            hideBorder
            onHeaderClick={() => setVisibilityAccordion(!visibilityAccordion)}
            isChildrenVisible={visibilityAccordion}
        >
            <div className={styles.AccordionChildren}>
                {ruleList.map((rule) => (
                    <AccordionWithState
                        key={rule?._id}
                        className={cx(styles.CardContainerClass, gClasses.MT16)}
                        headerClassName={cx(styles.CardClass, gClasses.CenterV)}
                        headerContentClassName={BS.D_FLEX}
                        headerContent={(
                            <div className={cx(gClasses.CenterV, BS.JC_BETWEEN, styles.RuleHeader)}>
                                <Text
                                    size={ETextSize.MD}
                                    content={rule.rule_name}
                                    className={cx(styles.RuleName, gClasses.Ellipsis)}
                                    title={rule.rule_name}
                                />
                                <div className={gClasses.CenterV}>
                                    <Text
                                        size={ETextSize.XS}
                                        content={`Dependents : ${rule?.field_names?.length}`}
                                        className={cx(styles.FieldCount)}
                                    />
                                    <div className={cx(gClasses.ML10, gClasses.CenterVH, gClasses.gap12)}>
                                        <RuleEditIcon onClick={() => onEditRule(rule.rule_uuid)} className={cx(styles.RuleEditIcon, gClasses.CursorPointer)} />
                                        <Trash onClick={() => onDeleteClick(rule.rule_uuid)} className={cx(gClasses.CursorPointer)} />
                                    </div>
                                </div>
                            </div>
                        )}
                        iconClassName={cx(styles.ChevronClass)}
                        iconRotationBeforeClassName={gClasses.Rotate90}
                        iconRotationAfterClassName={gClasses.Rotate180}
                        iconContainerClassName={cx(gClasses.MR4, styles.EachRuleChevronClass, gClasses.CenterVH, rule?.field_names?.length === 0 && gClasses.DisplayNone)} // Displaying none for now... dependents will be added in future
                        childrenClassName={gClasses.P0}
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
                <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, gClasses.MT16, gClasses.MB16, styles.AddOrImportButtonClass)}>
                    <button onClick={() => onAddClickHandler()} className={gClasses.CenterVH}>
                        <FilePlusIcon />
                        <span className={cx(gClasses.FTwo13, gClasses.FontWeight400)}>Add</span>
                    </button>
                </div>
            </div>
        </Accordion>
        {getDeleteRuleModal()}
        {getDeleteDependencyModal()}
    </>
  );
}

FieldVisibilityRuleList.propTypes = {
    metaData: PropTypes.objectOf({
        formUUID: PropTypes.string,
        formId: PropTypes.string,
        moduleId: PropTypes.string,
    }),
    moduleType: PropTypes.oneOf(Object.values(MODULE_TYPES)),
};

export default FieldVisibilityRuleList;
