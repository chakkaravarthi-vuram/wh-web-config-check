import React from 'react';
import { connect, useSelector } from 'react-redux';
import cx from 'classnames/bind';
import { integrationDataChange } from 'redux/reducer/IntegrationReducer';
import {
  ETextSize,
  Text,
  UserPicker,
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import { cloneDeep } from 'utils/jsUtility';
import { useHistory } from 'react-router-dom';
import { getPopperContent } from '../../../../../../utils/UtilityFunctions';
import {
  WH_API_CONSTANTS,
  WORKHALL_AUTH_TYPE,
} from '../../../../Integration.constants';
import styles from '../EditWorkhallIntegration.module.scss';
import { CREATE_INTEGRATION, WORKHALL_API_STRINGS } from '../../../../Integration.strings';
import ReadOnlyField from '../../../../../../components/readonly_field/ReadOnlyField';
import { getAPIConfigBaseUrl, getTypeValue } from '../../../../Integration.utils';

function ViewCredentials(props) {
  const {
    url_path,
    authentication_type,
    authentication_name,
    workhall_api_type,
    workhall_api_method,
    flow_name,
    data_list_name,
    selected_authentication_list,
  } = cloneDeep(props);
  const isFlowApi = workhall_api_type === WH_API_CONSTANTS.STARTING_A_FLOW;
  const isOAuthType = (authentication_type === WORKHALL_AUTH_TYPE.OAUTH);
  const history = useHistory();
  const showCreateTask = useSelector((state) => state.RoleReducer.is_show_app_tasks);

  return (
    <div>
      <Text
        content={WORKHALL_API_STRINGS.DATA_SOURCES_AND_ENDPOINT}
        size={ETextSize.XL}
        className={cx(gClasses.MB16, styles.SectionTitle)}
      />
      <ReadOnlyField
        title={CREATE_INTEGRATION.API_TYPE.READ_ONLY_LABEL}
        subTitle={getTypeValue(workhall_api_type)}
      />
      <ReadOnlyField
        title={isFlowApi ? WORKHALL_API_STRINGS.CHOOSE_FLOW.READ_ONLY_LABEL : WORKHALL_API_STRINGS.CHOOSE_DATA_LIST.READ_ONLY_LABEL}
        subTitle={flow_name || data_list_name}
      />
      <ReadOnlyField
        title={WORKHALL_API_STRINGS.API_URL.LABEL}
        subTitle={`${workhall_api_method} | ${getAPIConfigBaseUrl(isFlowApi)}${url_path}`}
      />
      <Text
        content={WORKHALL_API_STRINGS.CREDENTIALS}
        size={ETextSize.XL}
        className={cx(gClasses.MB16, styles.SectionTitle)}
      />
      <ReadOnlyField
        title={WORKHALL_API_STRINGS.AUTHENTICATION_TYPE.LABEL}
        subTitle={
          isOAuthType ?
            WORKHALL_API_STRINGS.AUTHENTICATION_TYPE.OPTION_LIST[1].label :
            WORKHALL_API_STRINGS.AUTHENTICATION_TYPE.OPTION_LIST[0].label
        }
      />
      {
        isOAuthType ?
        (
            <ReadOnlyField
              title={WORKHALL_API_STRINGS.CHOOSE_CREDENTIAL.READ_ONLY_LABEL}
              subTitle={(authentication_name || []).join(', ')}
            />
        ) : (
          <UserPicker
            selectedValue={selected_authentication_list}
            labelText={WORKHALL_API_STRINGS.CHOOSE_CREDENTIAL.USERS_READ_ONLY_LABEL}
            disabled
            getPopperContent={(id, type, onShow, onHide) => getPopperContent(id, type, onShow, onHide, history, showCreateTask)}
          />
        )
      }
    </div>
  );
}

const mapStateToProps = ({ IntegrationReducer }) => {
  return {
    url_path: IntegrationReducer.url_path,
    authentication_type: IntegrationReducer.authentication_type,
    authentication_name: IntegrationReducer.authentication_name,
    workhall_api_type: IntegrationReducer.workhall_api_type,
    workhall_api_method: IntegrationReducer.workhall_api_method,
    flow_name: IntegrationReducer.flow_name,
    data_list_name: IntegrationReducer.data_list_name,
    selected_authentication_list: IntegrationReducer.selected_authentication_list,
  };
};

const mapDispatchToProps = {
  integrationDataChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewCredentials);
