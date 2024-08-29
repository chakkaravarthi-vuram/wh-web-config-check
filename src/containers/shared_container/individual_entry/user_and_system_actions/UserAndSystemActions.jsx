import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { ETitleHeadingLevel, ETitleSize, Title } from '@workhall-pvt-lmt/wh-ui-library';
import { connect } from 'react-redux';
import ShortCuts from './Shortcuts/ShortCuts';
import styles from './UserAndSystemAction.module.scss';
import { INDIVIDUAL_ENTRY_MODE, INDIVIDUAL_ENTRY_TYPE } from '../IndividualEntry.strings';
import Warning from '../warning/Warning';
import { SHORTCUT_STRINGS } from './Shortcuts/ShortCut.strings';

function UserAndSystemActions(props) {
  const { mode, type, state, metaData } = props;
  const { t } = useTranslation();
  let parentParams = {};
  if (type === INDIVIDUAL_ENTRY_TYPE.DATA_LIST) {
    parentParams = {
      data_list_uuid: metaData?.moduleUuid,
      data_list_entry_id: metaData?.instanceId,
    };
  }
  if (type === INDIVIDUAL_ENTRY_TYPE.FLOW) {
    parentParams = {
      flow_uuid: metaData?.moduleUuid,
      instance_id: metaData?.instanceId,
    };
  }

  return (
    <div className={gClasses.P24}>
      {mode === INDIVIDUAL_ENTRY_MODE.DEVELOP_MODE && <Warning />}
      <div>
        <div className={cx(gClasses.MB16, styles.TitleClass)}>
          <Title
            content={SHORTCUT_STRINGS(t).TITLE}
            headingLevel={ETitleHeadingLevel.h4}
            size={ETitleSize.xs}
          />
        </div>
          <ShortCuts
            parentParams={parentParams}
            trigger_details={state?.trigger_shortcut_details}
            parentId={{ data_list_id: metaData?.moduleId }}
            isDatalist={type === INDIVIDUAL_ENTRY_TYPE.DATA_LIST}
            mode={mode}
          />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    state: state.IndividualEntryReducer,
  };
};

export default connect(mapStateToProps, null)(UserAndSystemActions);
