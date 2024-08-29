import { Text, ETextSize } from '@workhall-pvt-lmt/wh-ui-library';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { useSelector, useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton from 'react-loading-skeleton';
import { useTranslation } from 'react-i18next';
import styles from './AddDataFromAnotherSource.module.scss';
import gClasses from '../../../scss/Typography.module.scss';
import { BS } from '../../../utils/UIConstants';
import Accordion from '../../../components/accordion/Accordion';
import AccordionWithState from '../../../components/accordion/accordion_with_state/AccordionWithState';
import RuleEditIcon from '../../../assets/icons/RuleEditIcon';
import FilePlusIcon from '../../../assets/icons/FilePlusIcon';
import ExternalSource from '../../form/external_source_data/ExternalSource';
import { RULE_TYPE } from '../../../utils/constants/rule/rule.constant';
import { MODULE_TYPES } from '../../../utils/Constants';
import { externalFieldsClear, getExternalSourceRulesThunk } from '../../../redux/actions/Visibility.Action';
import { INFINITE_SCROLL_DIV, MAX_DATA_COUNT_PER_PAGE } from './AddDataFromAnotherSource.constants';
import { deleteDataRule } from '../../form/external_source_data/useExternalSource.action';
import { POST_DATA_KEYS } from '../../form/external_source_data/ExternalSource.constants';
import Trash from '../../../assets/icons/application/Trash';
import DeleteConfirmModal from '../../../components/delete_confirm_modal/DeleteConfirmModal';
import { ADD_DATA_SOURCE_STRINGS } from './AddDataFromAnotherSource.strings';
import DependencyHandler from '../../../components/dependency_handler/DependencyHandler';
import { INITIAL_STATE, externalSourceDataChange, useExternalSource } from '../../form/external_source_data/useExternalSource';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function AddDataFromAnotherSource(props) {
  const { metaData, moduleType } = props;
  const { moduleId } = metaData;

  const [valueAccordion, setValueAccordion] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRuleDetails, setActiveRuleDetails] = useState({});
  const [deleteRuleUUID, setDeleteRuleUUID] = useState();

  const dispatch = useDispatch();

  const { state, dispatch: externalDispatch } = useExternalSource();

  const {
    dependencyData,
    dependencyName,
    showFieldDependencyDialog = {},
  } = state;

  console.log('showFieldDependencyDialog', dependencyData, dependencyName, showFieldDependencyDialog, externalDispatch);

  const { t } = useTranslation();

  const { ruleList = [], paginationDetail = { page: 1 } } = useSelector(
    (store) => store.VisibilityReducer.externalDataSourceReducer,
  );

  const getMetaData = () => {
    const data = {};

    if (moduleType === MODULE_TYPES.TASK) {
      data.task_metadata_id = moduleId;
    } else if (moduleType === MODULE_TYPES.FLOW) {
      data.flow_id = moduleId;
    } else if (moduleType === MODULE_TYPES.DATA_LIST) {
      data.data_list_id = moduleId;
    }
    return data;
  };

  const loadRuleList = (page) => {
    const params = {
      page: page,
      size: MAX_DATA_COUNT_PER_PAGE,
      rule_type: [RULE_TYPE.DATA_LIST_QUERY, RULE_TYPE.INTEGRATION_FORM],
      ...getMetaData(),
    };
    dispatch(getExternalSourceRulesThunk(params));
  };

  useEffect(() => {
    loadRuleList(1);
  }, []);

  const ruleData = []; // rule data

  // Query Response
  ruleList.forEach((rule) => {
    const ruleObject = {};
    ruleObject._id = rule._id;
    ruleObject.rule_name = rule.rule_name;
    ruleObject.rule_uuid = rule.rule_uuid;

    ruleObject.output_format = rule?.rule?.output_format;

    ruleData.push(ruleObject);
  });

  const onAddClickHandler = () => {
    setIsModalOpen(true);
  };

  const onCloseClick = () => {
    setIsModalOpen(false);
    setActiveRuleDetails({});
    setDeleteRuleUUID(null);
    loadRuleList(1);
    externalDispatch(
      externalSourceDataChange({
        ...INITIAL_STATE,
      }),
    );
    dispatch(externalFieldsClear());
  };

  const onEditRow = (id) => {
    setActiveRuleDetails({
      ruleId: id,
    });
    setIsModalOpen(true);
  };

  const onLoadMoreHandler = () => {
    if (paginationDetail?.page) loadRuleList(paginationDetail.page + 1);
  };

  const getDeleteRuleModal = () => {
    if (!deleteRuleUUID) return null;

    const onDeleteRule = () => {
      const postData = {
        [POST_DATA_KEYS.RULE_UUID]: deleteRuleUUID,
        ...getMetaData(),
      };

      deleteDataRule({ data: postData, dispatch: externalDispatch, callback: onCloseClick, t });
    };

    return (
      <DeleteConfirmModal
        title={ADD_DATA_SOURCE_STRINGS.DELETE.TITLE}
        subText1={ADD_DATA_SOURCE_STRINGS.DELETE.SUB_TITLE}
        isModalOpen
        onCancel={() => setDeleteRuleUUID(null)}
        onClose={() => setDeleteRuleUUID(null)}
        onDelete={onDeleteRule}
      />
    );
  };

  const dependencyConfigCloseHandler = () => {
    externalDispatch(
      externalSourceDataChange({
        dependencyData: {},
        dependencyType: EMPTY_STRING,
        dependencyName: EMPTY_STRING,
        showFieldDependencyDialog: {},
      }),
    );
    onCloseClick();
  };

  return (
    <>
      <Accordion
        headerContent="Add Data From Another Source"
        className={styles.AccordionContainerClass}
        headerClassName={cx(gClasses.P0, styles.Sticky)}
        headerContentClassName={cx(
          styles.AccordionHeader,
          gClasses.FontWeight500,
        )}
        iconClassName={styles.ChevronClass}
        iconContainerClassName={styles.ChevronContainerClass}
        childrenClassName={gClasses.P0}
        hideBorder
        onHeaderClick={() => setValueAccordion(!valueAccordion)}
        isChildrenVisible={valueAccordion}
      >
        <div className={styles.AccordionChildren}>
          {isModalOpen && (
            <ExternalSource
              moduleId={moduleId}
              moduleType={moduleType}
              metaData={metaData}
              ruleId={activeRuleDetails?.ruleId}
              onCloseClick={onCloseClick}
            />
          )}
          <div id={INFINITE_SCROLL_DIV} className={cx(styles.RuleList, gClasses.MB16)}>
            <InfiniteScroll
              dataLength={ruleList?.length}
              next={onLoadMoreHandler}
              hasMore={ruleList.length < paginationDetail?.total_count}
              className={cx(gClasses.ScrollBar, styles.InfiniteScrollHeight)}
              scrollThreshold={0.5}
              scrollableTarget={INFINITE_SCROLL_DIV}
              loader={<Skeleton height={30} width="100%" />}
            >
              {ruleData?.map((rule) => (
                <AccordionWithState
                  key={rule._id}
                  className={cx(styles.CardContainerClass, gClasses.MT16)}
                  headerClassName={cx(styles.CardClass)}
                  headerContentClassName={gClasses.W100}
                  headerContent={
                    <div
                      className={cx(
                        gClasses.CenterV,
                        BS.JC_BETWEEN,
                        gClasses.W95,
                        gClasses.ML4,
                      )}
                    >
                      <Text
                        size={ETextSize.MD}
                        content={rule.rule_name}
                        className={cx(styles.RuleName)}
                        title={rule.rule_name}
                      />
                      <div className={gClasses.CenterV}>
                        <div
                          className={cx(
                            gClasses.ML10,
                            gClasses.CenterVH,
                            gClasses.MR4,
                          )}
                        >
                          <RuleEditIcon
                            onClick={() => onEditRow(rule._id)}
                            className={cx(
                              styles.RuleEditIcon,
                              gClasses.CursorPointer,
                              gClasses.MR8,
                            )}
                          />
                          <Trash
                            onClick={() => setDeleteRuleUUID(rule.rule_uuid)}
                            className={cx(gClasses.CursorPointer)}
                          />
                        </div>
                      </div>
                    </div>
                  }
                >
                  <div
                    className={cx(gClasses.P8, gClasses.PT0, styles.OutputFormat)}
                  >
                    {rule?.output_format?.map((eachRow) => (
                      <Text
                        key={eachRow?.key}
                        size={ETextSize.MD}
                        content={eachRow?.name}
                        className={cx(
                          gClasses.CenterV,
                          styles.FieldNameContainer,
                          gClasses.MT4,
                        )}
                      />
                    ))}
                  </div>
                </AccordionWithState>
              ))}
            </InfiniteScroll>
          </div>
          <div
            className={cx(
              BS.D_FLEX,
              BS.JC_BETWEEN,
              gClasses.MB16,
              styles.AddOrImportButtonClass,
            )}
          >
            <button
              onClick={() => onAddClickHandler()}
              className={gClasses.CenterVH}
            >
              <FilePlusIcon />
              <span className={cx(gClasses.FTwo13, gClasses.FontWeight400)}>
                Add
              </span>
            </button>
          </div>
        </div>
      </Accordion>
      {
        showFieldDependencyDialog?.isVisible && (
          <DependencyHandler
            onCancelDeleteClick={dependencyConfigCloseHandler}
            dependencyHeaderTitle={dependencyName}
            dependencyData={dependencyData}
          />
        )
      }
      {getDeleteRuleModal()}
    </>
  );
}

AddDataFromAnotherSource.defaultProps = {
  metaData: PropTypes.objectOf({
    moduleId: null,
  }),
  moduleType: MODULE_TYPES.FLOW,
};

AddDataFromAnotherSource.propTypes = {
  metaData: PropTypes.objectOf({
    moduleId: PropTypes.string,
  }),
  moduleType: PropTypes.oneOf(Object.values(MODULE_TYPES)),
};

export default AddDataFromAnotherSource;
