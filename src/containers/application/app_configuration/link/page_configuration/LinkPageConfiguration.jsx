import React, { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import {
  ButtonContentVaraint,
  SegmentedControl,
  SingleDropdown,
  TextInput,
  Variant,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'clsx';
import { useTranslation } from 'react-i18next';
import MappingTable from 'containers/integration/mapping_table/MappingTable';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { DndProvider } from 'react-dnd';
import styles from './LinkPageConfiguration.module.scss';
import { BS } from '../../../../../utils/UIConstants';
import gClasses from '../../../../../scss/Typography.module.scss';
import { cloneDeep, isEmpty, isUndefined } from '../../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { LINK_CONFIGURATION_STRINGS, SEARCH_DATALIST, SEARCH_FLOW } from './LinkPageConfiguration.strings';
import { applicationComponentDataChange, applicationDataChange, applicationStateChange } from '../../../../../redux/reducer/ApplicationReducer';
import { getAppsAllDataListsThunk, getAppsAllFlowsThunk, getComponentDetailsByApiThunk, savePageApiThunk } from '../../../../../redux/actions/Appplication.Action';
import FormFieldDragDropWrapper from '../../../../../components/form_builder/dnd/drag_drop_wrapper/FormFieldDragDropWrapper';
import { FORM_BUILDER_DND_ITEMS } from '../../../../../components/form_builder/FormBuilder.strings';
import { isMobileScreen, validate } from '../../../../../utils/UtilityFunctions';
import DragIcon from '../../../../../assets/icons/form_fields/DragIcon';
import { APP_COMP_STRINGS } from '../../../app_builder/AppBuilder.strings';
import { saveCompValidationSchema } from '../../../application.validation.schema';
import { getComponentInfoErrorMessage } from '../../AppConfigurtion.utils';
import DeleteIcon from '../../../../../assets/icons/apps/DeleteIcon';

const getValidationData = (data, t) => validate(data, saveCompValidationSchema(t));

function LinkPageConfiguration(props) {
  const { activeComponent = {}, isLoading, getAppsAllDataListsApi, allDataListsData, allFlowsData,
  applicationStateChange } = props;
  const { error_list_config } = useSelector((store) => store.ApplicationReducer);
  const dispatch = useDispatch();
  const [DLSearchText, setDLSearchText] = useState(EMPTY_STRING);
  const [flowSearchText, setFlowSearchText] = useState(EMPTY_STRING);
  const focusedIndex = useRef(null);
  const backend = isMobileScreen() ? TouchBackend : HTML5Backend;
  const backendOptions = isMobileScreen() ? { enableMouseEvents: true } : {};
  const { t } = useTranslation();
  const { errorList = {} } = cloneDeep(activeComponent);
  const getOptionList = (currentPage = 0) => {
    const params = {
      page: currentPage + 1,
      size: 15,
    };
    dispatch(getAppsAllFlowsThunk(params));
  };

  useEffect(() => {
    getAppsAllDataListsApi({
      page: 1,
      size: 15,
      include_system_data_list: 1,
    });
    getOptionList(0);
  }, []);

  // useEffect(() => {
  //   if (document?.activeElement?.id && !Number.isNaN(document?.activeElement?.id?.[0])) {
  //     focusedIndex.current = Number(document?.activeElement?.id?.[0]);
  //   }
  //   console.log('asdfafasfa243ertfg', document.activeElement, focusedIndex);
  // }, [document.activeElement]);

  const onChangeLabel = (event) => {
    const labelValue = event?.target?.value;
    const clonedComponentData = cloneDeep(activeComponent);
    clonedComponentData.label = labelValue;
    let errorData = {};
    if (!isEmpty(error_list_config)) {
      const errorlist = getValidationData({
      label: labelValue || EMPTY_STRING,
      type: APP_COMP_STRINGS.LINK,
      component_info: clonedComponentData.component_info });
      errorData = { error_list_config: errorlist };
    }
    applicationStateChange({ activeComponent: clonedComponentData, ...errorData });
  };

  const onChangeShortcutStyle = (event) => {
    const clonedComponentData = cloneDeep(activeComponent);
    const shortcutStyle = LINK_CONFIGURATION_STRINGS(t).SHORTCUT_STYLE.OPTION_LIST.find((option) =>
      option.label === event?.target?.outerText);
    if (shortcutStyle) {
      clonedComponentData.component_info.shortcut_style = shortcutStyle?.value;
      if (clonedComponentData?.errorList?.[`${LINK_CONFIGURATION_STRINGS(t).COMPONENT_INFO_ID},${LINK_CONFIGURATION_STRINGS(t).SHORTCUT_STYLE.ID}`]) {
        delete clonedComponentData?.errorList?.[`${LINK_CONFIGURATION_STRINGS(t).COMPONENT_INFO_ID},${LINK_CONFIGURATION_STRINGS(t).SHORTCUT_STYLE.ID}`];
      }
      applicationStateChange({ activeComponent: clonedComponentData });
    }
  };

  const onChangeAlignment = (event) => {
    const clonedComponentData = cloneDeep(activeComponent);
    const alignment = LINK_CONFIGURATION_STRINGS(t).ALIGNMENT.OPTION_LIST.find((option) =>
    option.label === event?.target?.outerText);
    if (alignment) {
      clonedComponentData.alignment = alignment?.value;
      if (clonedComponentData?.errorList?.[LINK_CONFIGURATION_STRINGS(t).ALIGNMENT.ID]) {
        delete clonedComponentData?.errorList?.[LINK_CONFIGURATION_STRINGS(t).ALIGNMENT.ID];
      }
      applicationStateChange({ activeComponent: clonedComponentData });
    }
  };

  const onDragLink = (e, index) => {
    const clonedComponentData = cloneDeep(activeComponent);
    if (cloneDeep(e?.target?.id)[0]) {
      const dragIndex = Number(cloneDeep(e?.target?.id)[0]);
      const dropIndex = cloneDeep(index);
      if (dropIndex >= clonedComponentData?.component_info?.links?.length) {
        let k = dropIndex - clonedComponentData.component_info.links.length + 1;
        while (k--) {
          clonedComponentData?.component_info?.links?.push(undefined);
        }
    }
    clonedComponentData?.component_info?.links?.splice(
      dropIndex,
      0,
      clonedComponentData?.component_info?.links?.splice(dragIndex, 1)[0],
      );
    }
  };

  const deleteLink = (index) => {
    const prefixErrorKey = `component_info,links,${index},`;
    const clonedComponentData = cloneDeep(activeComponent);
    const clonedErrorList = cloneDeep(error_list_config);
    Object.keys?.(clonedErrorList || {})?.forEach((errorId) => {
      if (errorId.includes(prefixErrorKey)) delete clonedErrorList[errorId];
    });
    if (clonedComponentData?.component_info?.links?.length > 1) clonedComponentData?.component_info?.links?.splice(index, 1);
    applicationStateChange({ error_list_config: clonedErrorList, activeComponent: cloneDeep(clonedComponentData) });
  };

  const onSearchDL = (event) => {
    const searchText = event?.target?.value || EMPTY_STRING;
    const params = {
      page: 1,
      size: 15,
      include_system_data_list: 1,
    };
    setDLSearchText(searchText);
    if (searchText) {
      params.search = searchText;
    }
    getAppsAllDataListsApi(params);
  };

  const onSearchFlow = (event) => {
    const searchText = event?.target?.value || EMPTY_STRING;
    const params = {
      page: 1,
      size: 15,
    };
    setFlowSearchText(searchText);
    if (searchText) {
      params.search = searchText;
    }
    dispatch(getAppsAllFlowsThunk(params));
  };

  const loadMoreFlow = () => {
    console.log('asdfasfasasfdasf');
    const params = {
      page: allFlowsData.page + 1,
      size: 15,
    };
    if (flowSearchText) {
      params.search = flowSearchText;
    }
    dispatch(getAppsAllFlowsThunk(params));
  };

  const loadMoreDL = () => {
    const params = {
      page: allDataListsData?.page,
      size: 15,
      include_system_data_list: 1,
    };
    if (DLSearchText) {
      params.search = DLSearchText;
    }
    getAppsAllDataListsApi(params);
  };

  const dropLink = (item, monitor, data) => {
    const clonedComponentData = cloneDeep(activeComponent);
    if (monitor.didDrop()) return;

    const sourceIndex = Number(item.id);
    const destination = Number(data.path);
    if (clonedComponentData?.component_info?.links?.[sourceIndex] &&
      clonedComponentData?.component_info?.links?.[destination]) {
        const clonedSourceData = cloneDeep(clonedComponentData?.component_info?.links?.[sourceIndex]);
        clonedComponentData?.component_info?.links?.splice(sourceIndex, 1);
        clonedComponentData?.component_info?.links?.splice(destination, 0, clonedSourceData);
        let errorData = {};
        if (!isEmpty(error_list_config)) {
          const errorlist = getValidationData({
          label: activeComponent?.label || EMPTY_STRING,
          type: APP_COMP_STRINGS.LINK,
          component_info: clonedComponentData.component_info });
          errorData = { error_list_config: errorlist };
        }
        applicationStateChange({ activeComponent: cloneDeep(clonedComponentData), ...errorData });
      }
  };

  const getUrlComponent = (currentRowData, index) => {
    switch (currentRowData?.type) {
      case LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_TYPES.OPTION_LIST[0].value:
        return (
          <TextInput
          onFocusHandler={() => {
            const clonedComponentData = cloneDeep(activeComponent);
            clonedComponentData.component_info.links[index].name = currentRowData?.name;
            applicationStateChange({ activeComponent: clonedComponentData });
          }}
          onBlurHandler={() => {
            const clonedComponentData = cloneDeep(activeComponent);
            clonedComponentData.component_info.links[index].name = currentRowData?.name;
            applicationStateChange({ activeComponent: clonedComponentData });
          }}
            id={`${index},${LINK_CONFIGURATION_STRINGS(t).LINKS.LINK.URL}`}
            isLoading={isLoading}
            value={currentRowData?.url}
            onChange={(event) => {
              const clonedComponentData = cloneDeep(activeComponent);
              if (!isUndefined(event?.target?.value) && clonedComponentData?.component_info?.links?.[index]) {
                clonedComponentData.component_info.links[index].url = event.target.value;
                let errorData = {};
                if (!isEmpty(error_list_config)) {
                  const errorlist = getValidationData({ label: activeComponent?.label || EMPTY_STRING, type: APP_COMP_STRINGS.LINK, component_info: clonedComponentData.component_info });
                  errorData = { error_list_config: errorlist };
                }
                applicationStateChange({ activeComponent: clonedComponentData, ...errorData });
              }
            }}
            required
            className={cx(styles.LinkWidth, styles.Width29)}
            placeholder={LINK_CONFIGURATION_STRINGS(t).LINKS.LINK.ADHOC_LINK.PLACEHOLDER}
            errorMessage={getComponentInfoErrorMessage(error_list_config, `links,${index},url`)}
          />
        );
      case LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_TYPES.OPTION_LIST[2].value:
        return (
          <div className={cx(styles.LinkWidth, styles.Width29)}>
            <SingleDropdown
              className={styles.ChooseDropdonw}
              popperClassName={styles.PopperClass}
              id={`${index},${LINK_CONFIGURATION_STRINGS(t).LINKS.LINK.SOURCE_UUID},datalist`}
              isLoading={isLoading}
              isLoadingOptions={allDataListsData?.isLoading}
              onOutSideClick={() => setDLSearchText(EMPTY_STRING)}
              optionList={cloneDeep(allDataListsData?.allDataLists) || []}
              onClick={(value, label) => {
                const clonedComponentData = cloneDeep(activeComponent);
                setDLSearchText(EMPTY_STRING);
                if (value && clonedComponentData?.component_info?.links?.[index]) {
                  clonedComponentData.component_info.links[index].source_uuid = value;
                  clonedComponentData.component_info.links[index].source_name = label;
                  if (!isEmpty(error_list_config)) {
                    const errorlist = getValidationData({ label: activeComponent?.label || EMPTY_STRING, type: APP_COMP_STRINGS.LINK, component_info: clonedComponentData.component_info });
                    applicationStateChange({ error_list_config: errorlist });
                  }
                  applicationStateChange({ activeComponent: clonedComponentData });
                }
              }}
              infiniteScrollProps={{
                dataLength: allDataListsData?.allDataLists?.length,
                next: loadMoreDL,
                hasMore: allDataListsData?.hasMore,
                scrollableId: 'data_list_infinite_scroll',
                scrollThreshold: 0.8,
              }}
              searchProps={{
                searchPlaceholder: t(SEARCH_DATALIST),
                searchValue: DLSearchText,
                onChangeSearch: onSearchDL,
              }}
              placeholder={LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_TYPES.OPTION_LIST[2].PLACHEHOLDER}
              selectedValue={currentRowData?.source_uuid}
              dropdownViewProps={{
                selectedLabel: cloneDeep(currentRowData)?.source_name,
              }}
              errorMessage={getComponentInfoErrorMessage(error_list_config, `links,${index},source_uuid`)}
              noDataFoundMessage={LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_TYPES.OPTION_LIST[2].EMPTY_MESSAGE}
            />
          </div>
        );
      default: return (
        <div className={cx(styles.LinkWidth, styles.Width29)}>
          <SingleDropdown
            className={styles.ChooseDropdonw}
            popperClassName={styles.PopperClass}
            id={`${index},${LINK_CONFIGURATION_STRINGS(t).LINKS.LINK.SOURCE_UUID},flow`}
            isLoading={isLoading}
            onOutSideClick={() => setFlowSearchText(EMPTY_STRING)}
            isLoadingOptions={allFlowsData?.isLoading}
            optionList={cloneDeep(allFlowsData?.allFlows) || []}
            onClick={(value, label) => {
              const clonedComponentData = cloneDeep(activeComponent);
              setFlowSearchText(EMPTY_STRING);
              if (value && clonedComponentData?.component_info?.links?.[index]) {
                clonedComponentData.component_info.links[index].source_uuid = value;
                clonedComponentData.component_info.links[index].source_name = label;
                if (!isEmpty(error_list_config)) {
                  const errorlist = getValidationData({ label: activeComponent?.label || EMPTY_STRING, type: APP_COMP_STRINGS.LINK, component_info: clonedComponentData.component_info });
                  applicationStateChange({ error_list_config: errorlist });
                }
                applicationStateChange({ activeComponent: clonedComponentData });
              }
            }}
            searchProps={{
              searchPlaceholder: t(SEARCH_FLOW),
              searchValue: flowSearchText,
              onChangeSearch: onSearchFlow,
            }}
            infiniteScrollProps={{
              dataLength: allFlowsData?.allFlows?.length || 15,
              next: loadMoreFlow,
              hasMore: allFlowsData?.hasMore,
              scrollableId: 'flow_list_infinite_scroll',
              scrollThreshold: 0.8,
            }}
            dropdownViewProps={{
              selectedLabel: cloneDeep(currentRowData)?.source_name,
            }}
            placeholder={LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_TYPES.OPTION_LIST[1].PLACHEHOLDER}
            selectedValue={currentRowData?.source_uuid}
            errorMessage={getComponentInfoErrorMessage(error_list_config, `links,${index},source_uuid`)}
            noDataFoundMessage={LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_TYPES.OPTION_LIST[1].EMPTY_MESSAGE}
          />
        </div>
      );
    }
  };

  const checkIfSourceDeleted = (currentRowData, index) => {
    if (isEmpty(currentRowData?.source_name)) {
      const clonedComponentData = cloneDeep(activeComponent);
      if (clonedComponentData.component_info.links[index].source_uuid) {
        clonedComponentData.component_info.links[index].source_uuid = EMPTY_STRING;
        clonedComponentData.component_info.links[index].source_name = EMPTY_STRING;
        applicationStateChange({ activeComponent: cloneDeep(clonedComponentData) });
      }
    }
  };

  const initialMappingRow = (index) => {
    const currentRowData = cloneDeep(activeComponent)?.component_info?.links?.[index];
    checkIfSourceDeleted(currentRowData, index);
    const prefixErrorKey = `${LINK_CONFIGURATION_STRINGS(t).COMPONENT_INFO_ID},${LINK_CONFIGURATION_STRINGS(t).LINKS.ID},${index},`;
    console.log('initialMappingRowCalled', focusedIndex, focusedIndex?.current === index);
    const linkRow = (
      <div
        id={`${LINK_CONFIGURATION_STRINGS(t).LINKS.ID},${index}`}
        className={cx(BS.W100, BS.D_FLEX, styles.GridGap)}
        draggable="true"
        onDragOver={(e) => onDragLink(e, index)}
      >
        <div className={cx(styles.DragIcon, gClasses.MR8, gClasses.MT4, styles.Width1)}>
          <DragIcon />
        </div>
        <div className={cx(styles.LinkTypeWidth, styles.Width29)}>
            <SingleDropdown
                popperClassName={styles.LinkPopperClass}
                id={`${index},${LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_TYPES.ID}`}
                isLoading={isLoading}
                optionList={LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_TYPES.OPTION_LIST}
                onClick={(value) => {
                  const clonedComponentData = cloneDeep(activeComponent);
                  setDLSearchText(EMPTY_STRING);
                  setFlowSearchText(EMPTY_STRING);
                  if (value && clonedComponentData?.component_info?.links?.[index]) {
                    clonedComponentData.component_info.links[index].type = value;
                    clonedComponentData.component_info.links[index].name = EMPTY_STRING;
                    clonedComponentData.component_info.links[index].url = EMPTY_STRING;
                    clonedComponentData.component_info.links[index].source_uuid = EMPTY_STRING;
                    delete clonedComponentData?.component_info?.links?.[index]?.source_name;
                    if (clonedComponentData?.errorList?.[prefixErrorKey + LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_TYPES.ID]) {
                      delete clonedComponentData?.errorList?.[prefixErrorKey + LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_TYPES.ID];
                    }
                    applicationStateChange({ activeComponent: clonedComponentData });
                  }
                }}
                placeholder={LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_TYPES.PLACEHOLDER}
                selectedValue={currentRowData?.type}
                // className={gClasses.ZIndex10}
                errorList={errorList?.[prefixErrorKey + LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_TYPES.ID]}
            />
        </div>
        <TextInput
            id={`${index},${LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_NAME.ID}`}
            onFocusHandler={() => {
              const clonedComponentData = cloneDeep(activeComponent);
              clonedComponentData.component_info.links[index].name = currentRowData?.name;
              applicationStateChange({ activeComponent: clonedComponentData });
            }}
            onBlurHandler={() => {
              const clonedComponentData = cloneDeep(activeComponent);
              clonedComponentData.component_info.links[index].name = currentRowData?.name;
              applicationStateChange({ activeComponent: clonedComponentData });
            }}
            isLoading={isLoading}
            value={currentRowData?.name}
            onChange={(event) => {
              const clonedComponentData = cloneDeep(activeComponent);
              if (!isUndefined(event?.target?.value) && clonedComponentData?.component_info?.links?.[index]) {
                clonedComponentData.component_info.links[index].name = event.target.value;
                let errorData = {};
                if (!isEmpty(error_list_config)) {
                  const errorlist = getValidationData({ label: activeComponent?.label || EMPTY_STRING, type: APP_COMP_STRINGS.LINK, component_info: clonedComponentData.component_info });
                  errorData = { error_list_config: errorlist };
                }
                applicationStateChange({ activeComponent: clonedComponentData, ...errorData });
              }
            }}
            required
            className={cx(styles.LinkWidth, styles.Width29)}
            placeholder={
              (activeComponent?.component_info?.shortcut_style === LINK_CONFIGURATION_STRINGS(t).SHORTCUT_STYLE.OPTION_LIST[1].value
              || activeComponent?.component_info?.shortcut_style === LINK_CONFIGURATION_STRINGS(t).SHORTCUT_STYLE.OPTION_LIST[2].value)
              ? LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_NAME.BUTTON_PLACEHOLDER :
              LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_NAME.LINK_PLACEHOLDER}
            errorMessage={getComponentInfoErrorMessage(error_list_config, `links,${index},name`)}
        />
        {getUrlComponent(currentRowData, index)}
        {activeComponent?.component_info?.links?.length > 1 &&
          <div className={cx(styles.DeleteIconContainer, styles.Width20, gClasses.CenterV)}>
            <DeleteIcon className={styles.DeleteIcon} onClick={() => deleteLink(index)} />
          </div>
        }
      </div>
    );
    console.log('adsfasfasfasf', focusedIndex, index);
    return ((Number(document?.activeElement?.id[0] === index))) ? linkRow : (
      <FormFieldDragDropWrapper
        id={`${index}`}
        key={`${index}`}
        data={{ path: `${index}`, type: FORM_BUILDER_DND_ITEMS.FIELD_LIST }}
        disableDrag={((activeComponent?.component_info?.links || [])?.length < 2)}
        disableDrop={((activeComponent?.component_info?.links || [])?.length < 2)}
        onDrop={dropLink}
        draggingClassName={styles.DragClass}
      >
        {linkRow}
      </FormFieldDragDropWrapper>
    );
  };

  const initialRowKeyValue = {
    type: LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_TYPES.OPTION_LIST[0].value,
    name: EMPTY_STRING,
    url: EMPTY_STRING,
    source_uuid: EMPTY_STRING,
  };

  const handeLinkChange = (activeData) => {
    const clonedComponentData = cloneDeep(activeComponent);
    clonedComponentData.component_info.links = cloneDeep(activeData);
    applicationStateChange({ activeComponent: clonedComponentData });
  };

  console.log('LINK_CONFIGURATION_STRINGS(t).SHORTCUT_STYLE.ID', LINK_CONFIGURATION_STRINGS(t).SHORTCUT_STYLE.OPTION_LIST, activeComponent?.component_info?.shortcut_style);

  const mainComponent = (
    <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN, BS.W100)}>
        <TextInput
          className={gClasses.MB16}
            labelText={LINK_CONFIGURATION_STRINGS(t).LABEL}
            id={LINK_CONFIGURATION_STRINGS(t).LABEL_ID}
            isLoading={isLoading}
            value={activeComponent?.label}
            onChange={onChangeLabel}
            errorMessage={error_list_config?.label || null}
            placeholder={LINK_CONFIGURATION_STRINGS(t).PLACEHOLDER}
        />
      <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, gClasses.MB16)}>
        <SegmentedControl
            id={LINK_CONFIGURATION_STRINGS(t).SHORTCUT_STYLE.ID}
            options={LINK_CONFIGURATION_STRINGS(t).SHORTCUT_STYLE.OPTION_LIST}
            labelText={LINK_CONFIGURATION_STRINGS(t).SHORTCUT_STYLE.LABEL}
            required
            buttonContentVariant={ButtonContentVaraint.both}
            variant={Variant.border}
            selectedValue={activeComponent?.component_info?.shortcut_style}
            onClick={onChangeShortcutStyle}
            errorMessage={errorList[`${LINK_CONFIGURATION_STRINGS(t).COMPONENT_INFO_ID},${LINK_CONFIGURATION_STRINGS(t).SHORTCUT_STYLE.ID}`]}
        />
        <SegmentedControl
            options={LINK_CONFIGURATION_STRINGS(t).ALIGNMENT.OPTION_LIST}
            labelText={LINK_CONFIGURATION_STRINGS(t).ALIGNMENT.LABEL}
            required
            buttonContentVariant={ButtonContentVaraint.both}
            variant={Variant.border}
            selectedValue={activeComponent?.alignment}
            onClick={onChangeAlignment}
            errorMessage={errorList[LINK_CONFIGURATION_STRINGS(t).ALIGNMENT.ID]}
        />
      </div>
      <DndProvider backend={backend} options={backendOptions}>
      <MappingTable
        addTempRowId
        tblHeaders={LINK_CONFIGURATION_STRINGS(t).LINKS.HEADERS}
        outerClass={cx(gClasses.MB20)}
        tableRowClass={cx(styles.LinkRow, gClasses.MB4)}
        headerRowClass={cx(BS.JC_BETWEEN, gClasses.MB5)}
        mappingList={activeComponent?.component_info?.links || []}
        handleMappingChange={handeLinkChange}
        mappingKey={LINK_CONFIGURATION_STRINGS(t).LINKS.MAPPING_KEY}
        initialRow={initialMappingRow}
        initialRowKeyValue={initialRowKeyValue}
        // error_list={{}}
        headerClassName={styles.Header}
        addRowClass={styles.AddMore}
        headerStyles={[cx(styles.LinkHeader, gClasses.LabelStyle)]}
        noAddRow={(activeComponent?.component_info?.links || []).length >= 100}
      />
      </DndProvider>
    </div>
  );

  return mainComponent;
}

const mapStateToProps = (state) => {
  return {
    activeAppData: state.ApplicationReducer.activeAppData,
    usersAndTeamsData: state.ApplicationReducer.usersAndTeamsData,
    activeComponent: state.ApplicationReducer?.activeComponent || {},
    allDataListsData: state.ApplicationReducer.allDataListsData,
    allFlowsData: state.ApplicationReducer.allFlowsData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    applicationDataChange: (props) => {
      dispatch(applicationDataChange(props));
    },
    applicationStateChange: (props) => {
      dispatch(applicationStateChange(props));
    },
    applicationComponentDataChange: (props) => {
      dispatch(applicationComponentDataChange(props));
    },
    savePageApi: (params, componentSaveParams, translateFn) => {
      dispatch(savePageApiThunk(params, componentSaveParams, translateFn));
    },
    getComponentDetailsByIdApi: (params) => {
      dispatch(getComponentDetailsByApiThunk(params));
    },
    getAppsAllDataListsApi: (params) => {
      dispatch(getAppsAllDataListsThunk(params));
    },
  };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(LinkPageConfiguration);
