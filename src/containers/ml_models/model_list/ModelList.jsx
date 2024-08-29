import React, { useEffect } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  TableColumnWidthVariant,
  TableScrollType,
  TableWithInfiniteScroll,
  Text,
  ETextSize,
} from '@workhall-pvt-lmt/wh-ui-library';
import { isEmpty } from '../../../utils/jsUtility';
import gClasses from '../../../scss/Typography.module.scss';
import styles from '../MLModels.module.scss';
import { getModelListHeaders, getDataFieldValue } from '../MLModels.utils';
import { BS } from '../../../utils/UIConstants';
import { getModelListThunk } from '../../../redux/actions/MlModelList.Action';
import NoDataComponent from '../../no_data_component/NoDataComponent';
import ListLoadErrorIcon from '../../../assets/icons/user_settings/security/ListLoadErrorIcon';
import NoDataFoundIcon from '../../../assets/icons/integration/listing/NoDataFoundIcon';
import NoSearchFoundIcon from '../../../assets/icons/integration/listing/NoSearchFoundIcon';
import { ML_MODEL_STRINGS } from '../MLModels.strings';
import { MODEL_LIST_CONSTANTS } from '../MlModels.constants';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import MlListingIcon from '../../../assets/icons/landing_page/MlListingIcon';

function ModelList(props) {
  const {
    modelList,
    handleCardClick,
    getModelListThunkApi,
    listSearchText,
    isLoadingList,
    isErrorInLoading,
    hasMore,
  } = props;
  const { t } = useTranslation();
  const { SHOWING, MODELS } = ML_MODEL_STRINGS(t);

  const loadModelListData = () => {
    getModelListThunkApi();
  };

  useEffect(() => {
    loadModelListData();
  }, []);

  const cardClick = (modelCode) => {
    handleCardClick({
      model_id: modelList && (modelList.find((obj) => obj.model_code === modelCode)).model_id,
      model_code: modelCode,
    });
  };

  let containerData = null;

  if (isEmpty(modelList)) {
    if (!isLoadingList) {
      let noDataText = null;
      if (isErrorInLoading) {
        containerData = (
          <NoDataComponent
            noDataIcon={<ListLoadErrorIcon />}
            iconClass={styles.MT56}
            mainTitle={ML_MODEL_STRINGS(t).MODEL_LIST.CANT_DISPLAY_LIST}
            subTitle={ML_MODEL_STRINGS(t).MODEL_LIST.COULD_NOT_LOAD}
            className={BS.ALIGN_ITEMS_START}
          />
        );
      } else {
        noDataText = ML_MODEL_STRINGS(t).MODEL_LIST.NO_MODEL_FOUND;
        if (isEmpty(listSearchText)) {
          containerData = (
            <NoDataComponent
              noDataIcon={<NoDataFoundIcon className={gClasses.MT20} />}
              mainTitle={noDataText}
              className={BS.ALIGN_ITEMS_START}
            />
          );
        } else {
          containerData = (
            <NoDataComponent
              noDataIcon={<NoSearchFoundIcon />}
              iconClass={styles.MT56}
              mainTitle={
                ML_MODEL_STRINGS(t).EMPTY_LIST_STRINGS.NO_MATCHES_FOUND
              }
              subTitle={ML_MODEL_STRINGS(t).EMPTY_LIST_STRINGS.TRY_ANOTHER_TERM}
              className={BS.ALIGN_ITEMS_START}
            />
          );
        }
      }
    }
  } else {
    const getEachRow = (connector) => {
      let connectorDetails = null;
      let rowData = null;
      connectorDetails = (
        <div className={cx(gClasses.CenterV, styles.ConnectorNameContainer)}>
          {connector?.connector_logo ? (
            <img
              className={styles.ConnectorLogo}
              src={connector?.connector_logo}
              alt={EMPTY_STRING}
            />
          ) : (
            <div className={cx(gClasses.CenterVH, gClasses.MR8)}>
              <MlListingIcon className={gClasses.MinHW20} />
            </div>
          )}
          <div
            className={cx(
              BS.D_FLEX,
              BS.FLEX_COLUMN,
              BS.TEXT_LEFT,
              styles.ConnectorClassModelName,
            )}
            title={getDataFieldValue(
              connector,
              MODEL_LIST_CONSTANTS.TABLE.DATA_FIELD.MODEL_NAME,
            )}
          >
            <Text
              className={gClasses.Ellipsis}
              content={getDataFieldValue(
                connector,
                MODEL_LIST_CONSTANTS.TABLE.DATA_FIELD.MODEL_NAME,
              )}
              size={ETextSize.MD}
            />
          </div>
        </div>
      );
      const modelDesc = (
        <div
          className={cx(
            BS.D_FLEX,
            BS.FLEX_COLUMN,
            BS.TEXT_LEFT,
            styles.ConnectorClass,
          )}
          title={getDataFieldValue(
            connector,
            MODEL_LIST_CONSTANTS.TABLE.DATA_FIELD.MODEL_DEC,
          )}
        >
          <Text
            className={gClasses.Ellipsis}
            content={getDataFieldValue(
              connector,
              MODEL_LIST_CONSTANTS.TABLE.DATA_FIELD.MODEL_DEC,
            )}
            size={ETextSize.MD}
          />
        </div>
      );
      // commented models used in
      // const modelUsedIn = (
      //   <div className={styles.TextLeft}>
      //     <span className={styles.TextLeft}>
      //       {getDataFieldValue(
      //         connector,
      //         MODEL_LIST_CONSTANTS.TABLE.DATA_FIELD.MODEL_USED_IN,
      //       )}
      //     </span>
      //   </div>
      // );

      rowData = {
        id: connector?.model_code,
        component: [connectorDetails, modelDesc],
      };

      return rowData;
    };
    const tableBody = modelList.map((eachItem) => getEachRow(eachItem));
    containerData = (
      <div className={cx(styles.OuterTable)} id={MODEL_LIST_CONSTANTS.TABLE.ID}>
        <TableWithInfiniteScroll
          scrollableId={MODEL_LIST_CONSTANTS.TABLE.ID}
          className={cx(styles.OverFlowInherit)}
          tableClassName={styles.MlTable}
          header={getModelListHeaders(t)}
          data={tableBody}
          onRowClick={cardClick}
          isLoading={isLoadingList}
          loaderRowCount={4}
          hasMore={hasMore}
          isRowClickable
          scrollType={TableScrollType.BODY_SCROLL}
          widthVariant={TableColumnWidthVariant.CUSTOM}
        />
      </div>
    );
  }

  return (
    <div>
      <div className={cx(gClasses.CenterV, gClasses.JusSpaceBtw, gClasses.MX24, gClasses.PT16, gClasses.PB16)}>
      <Text
        content={`${SHOWING} ${modelList?.length} ${MODELS}`}
        className={cx(gClasses.FTwo12GrayV98, gClasses.FontWeight500)}
        isLoading={isLoadingList}
      />
      </div>
      {containerData}
    </div>
  );
}
const mapStateToProps = ({ MlModelListReducer }) => {
  return {
    isLoadingList: MlModelListReducer.isDataLoading,
    modelList: MlModelListReducer.modelList,
    listCount: MlModelListReducer.modelListCount,
    listSearchText: MlModelListReducer.listSearchText,
    mldata: MlModelListReducer,
  };
};

const mapDispatchToProps = {
  getModelListThunkApi: getModelListThunk,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModelList);
