import React from 'react';
import { connect } from 'react-redux';
import { withRouter, useParams } from 'react-router-dom';
import { getDmsLinkForPreviewAndDownload } from 'utils/attachmentUtils';
import { initiateFlowApi } from '../../../../redux/actions/FloatingActionMenuStartSection.Action';
import styles from './ImageAppComponent.module.scss';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { APP_DMS } from '../../../../urls/RouteConstants';

function Links(props) {
  const { componentDetails = {}, history } = props;
  const { component_info } = componentDetails && componentDetails;
  const { app_name } = useParams();

  const initialLink = getDmsLinkForPreviewAndDownload(history);

  const srcLink = app_name
    ? `${initialLink}/dms/display/?id=${component_info.image_id}`
    : `${initialLink}/dms/display/?id=${component_info.image_id}&${APP_DMS.PARAMS.IMG.IS_EDIT_TRUE}`;

  return (
    <div className={styles.ImageContainer}>
      <img src={srcLink} alt={EMPTY_STRING} />
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    initiateFlow: (data, history, redirectedFrom, urlData, pathname) => {
      dispatch(
        initiateFlowApi(data, history, redirectedFrom, urlData, pathname),
      );
    },
  };
};

export default withRouter(connect(null, mapDispatchToProps)(Links));
