import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import gClasses from 'scss/Typography.module.scss';
import Warning from '../warning/Warning';
import NotesAndRemaindersData from './NotesAndRemaindersData';
import {
  getInstanceNotesListApiThunk,
  getInstanceRemainderListApiThunk,
} from '../../../../redux/actions/IndividualEntry.Action';
import {
  INDIVIDUAL_ENTRY_MODE,
  INDIVIDUAL_ENTRY_TYPE,
} from '../IndividualEntry.strings';
import { notesAndRemainderLoadAndClear } from '../../../../redux/reducer/IndividualEntryReducer';

function NotesAndReminders(props) {
  const {
    mode,
    type,
    metaData,
    metaData: { instanceId, moduleUuid },
  } = props;
  const dispatch = useDispatch();
  const { notes, remainder } = useSelector(
    (state) => state.IndividualEntryReducer.notesAndRemainders,
  );

  useEffect(() => {
    dispatch(notesAndRemainderLoadAndClear(true));
    if (
      [
        INDIVIDUAL_ENTRY_MODE.INSTANCE_MODE,
        INDIVIDUAL_ENTRY_MODE.REPORT_INSTANCE_MODE,
      ].includes(mode)
    ) {
      const params = {
        page: 1,
      };
      if (type === INDIVIDUAL_ENTRY_TYPE.DATA_LIST) {
        params.data_list_entry_id = instanceId;
        params.data_list_uuid = moduleUuid;
      } else if (type === INDIVIDUAL_ENTRY_TYPE.FLOW) {
        params.instance_id = instanceId;
        params.action_history_type = 'note';
      }
      if (type === INDIVIDUAL_ENTRY_TYPE.DATA_LIST) {
        dispatch(getInstanceRemainderListApiThunk(params));
      }
      delete params.data_list_uuid;
      dispatch(getInstanceNotesListApiThunk(params));
    }
    return () => {
      dispatch(notesAndRemainderLoadAndClear(false));
    };
  }, []);

  return (
    <div className={gClasses.P24}>
      {mode === INDIVIDUAL_ENTRY_MODE.DEVELOP_MODE && <Warning />}
      <NotesAndRemaindersData
        isNotes
        listData={notes?.notesList || []}
        notesListDocumentDetails={notes?.notesListDocumentDetails || []}
        dispatch={dispatch}
        className={gClasses.MB32}
        mode={mode}
        type={type}
        metaData={metaData}
      />
      {type === INDIVIDUAL_ENTRY_TYPE.DATA_LIST && (
        <NotesAndRemaindersData
          isRemainders
          listData={remainder?.remaindersList || []}
          dispatch={dispatch}
          mode={mode}
          type={type}
          metaData={metaData}
        />
      )}
    </div>
  );
}

NotesAndReminders.propTypes = {
  mode: PropTypes.string,
  type: PropTypes.string,
  metaData: PropTypes.object,
};

export default NotesAndReminders;
