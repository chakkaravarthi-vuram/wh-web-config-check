import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { ETitleHeadingLevel, ETitleSize, Title } from '@workhall-pvt-lmt/wh-ui-library';
import { connect } from 'react-redux';
import styles from './ExecutionSummary.module.scss';
import { INDIVIDUAL_ENTRY_MODE } from '../IndividualEntry.strings';
import Warning from '../warning/Warning';
import Summary from './Summary';

function UserAndSystemActions(props) {
  const { mode, metaData, otherDetails } = props;
  return (
    <div className={gClasses.P24}>
      {mode === INDIVIDUAL_ENTRY_MODE.DEVELOP_MODE && <Warning />}
      {[INDIVIDUAL_ENTRY_MODE.INSTANCE_MODE, INDIVIDUAL_ENTRY_MODE.REPORT_INSTANCE_MODE].includes(mode) && (
      <div>
        <div className={cx(gClasses.MB16, styles.TitleClass)}>
          <Title
            content="Execution Summary"
            headingLevel={ETitleHeadingLevel.h4}
            size={ETitleSize.xs}
            className={gClasses.MB15}
          />
          <Summary flowUuid={metaData?.moduleUuid} isAdminOwnerViewer={otherDetails?.isAdminViewerNormalMode} mode={mode} instanceId={metaData?.instanceId} is_owner_user={otherDetails?.canReassign} />
        </div>
      </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    state: state.IndividualEntryReducer,
  };
};

export default connect(mapStateToProps, null)(UserAndSystemActions);
