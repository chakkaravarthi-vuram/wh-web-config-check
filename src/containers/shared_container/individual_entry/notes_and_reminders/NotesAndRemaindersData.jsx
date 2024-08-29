import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import {
  Button,
  EButtonType,
  ETitleHeadingLevel,
  ETitleSize,
  Title,
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import { useHistory } from 'react-router-dom';
import NotesAndRemaindersCard from './notes_remainders_card/NotesAndRemaindersCard';
import ThemeContext from '../../../../hoc/ThemeContext';
import {
  getFileNameFromServer,
  isBasicUserMode,
} from '../../../../utils/UtilityFunctions';
import { nullCheck } from '../../../../utils/jsUtility';
import { getSignedUrlFromDocumentUrlDetails } from '../../../../utils/profileUtils';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import AddNotes from './add_notes/AddNotes';
import AddRemainders from './add_remainders/AddRemainders';
import { INDIVIDUAL_ENTRY_MODE } from '../IndividualEntry.strings';
import styles from './notes_remainders_card/NotesAndRemaindersCard.module.scss';
import {
  notesChanges,
  remaindersChanges,
} from '../../../../redux/reducer/IndividualEntryReducer';
import NOTES_AND_REMAINDERS_STRINGS from './NotesAndRemainders.strings';

function NotesAndRemaindersData(props) {
  const {
    isNotes = false,
    isRemainders = false,
    listData = [],
    notesListDocumentDetails,
    dispatch,
    className,
    mode,
    metaData,
    type,
  } = props;
  const history = useHistory();
  const { t } = useTranslation();
  const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
  const isNormalMode = isBasicUserMode(history);
  const colorSchema = isNormalMode ? colorScheme : colorSchemeDefault;
  const [isAddModelOpen, setIsAddModelOpen] = useState(false);
  const instMode = INDIVIDUAL_ENTRY_MODE.INSTANCE_MODE === mode;
  const STRINGS = NOTES_AND_REMAINDERS_STRINGS(t);
  let STRING = {};
  if (isNotes) {
    STRING = STRINGS.NOTES;
  } else if (isRemainders) {
    STRING = STRINGS.REMAINDERS;
  }

  const onAddModelOpen = () => {
    if (instMode) {
      setIsAddModelOpen(true);
    }
  };
  const onCloseClick = () => {
    setIsAddModelOpen(false);
    if (isNotes) {
      dispatch(
        notesChanges({
          addNewNote: {
            notes: EMPTY_STRING,
            attachments: null,
            notesId: EMPTY_STRING,
            notesErrorList: {},
          },
        }),
      );
    } else if (isRemainders) {
      dispatch(
        remaindersChanges({
          addNewRemainder: {
            remainder_message: EMPTY_STRING,
            scheduledDate: EMPTY_STRING,
            is_recursive: false,
            remainderUserList: [],
            remainderErrorList: {},
          },
        }),
      );
    }
  };

  const downloadFile = (link) => {
    window.open(`${link}&is_download=true`, '_blank');
  };
  const getListData = () => {
    const listDataComponent = [];
    listData.forEach((data) => {
      const documentListDiv = [];
      if (isNotes && data?.attachments) {
        const notesDocument =
          notesListDocumentDetails?.find(
            (eachDocument) => data?.attachments[0] === eachDocument.document_id,
          );
        if (notesDocument) {
          documentListDiv.push(
            <button
              key={notesChanges.document_id}
              className={cx(
                gClasses.FTwo13BlueV17,
                gClasses.Underline,
                gClasses.MR15,
                gClasses.Ellipsis,
                styles.Attachment,
                gClasses.FontWeight500,
                gClasses.CursorPointer,
              )}
              title={getFileNameFromServer(notesDocument.original_filename)}
              onClick={() => downloadFile(notesDocument.signedurl)}
            >
              {getFileNameFromServer(notesDocument.original_filename)}
            </button>,
          );
        }
      }
      let cardData = {};
      if (isNotes) {
        cardData = {
          firstName: data.performed_by.first_name,
          lastName: data.performed_by.last_name,
          date: data.performed_on.pref_datetime_display,
          category: data.category,
          description: data.comments,
          attachments: data.attachments,
        };
      } else if (isRemainders) {
        cardData = {
          firstName: data.last_updated_by.first_name,
          lastName: data.last_updated_by.last_name,
          date: data.last_updated_on.pref_datetime_display,
          status: data.status,
          remainder_message: data.schedule_data.reminder_message,
          scheduled_date_time: data.scheduled_date_time.pref_datetime_display,
        };
      }
      if (nullCheck(data, 'performed_by.profile_pic')) {
        cardData.profilePic = getSignedUrlFromDocumentUrlDetails(
          notesListDocumentDetails,
          data.performed_by.profile_pic,
        );
      }
      listDataComponent.push(
        <NotesAndRemaindersCard
          data={cardData}
          attachmentsElement={
            isNotes ? (
              <div className={cx(gClasses.DisplayFlex, gClasses.FlexFlowWrap)}>
                {documentListDiv}
              </div>
            ) : null
          }
          isNotes={isNotes}
          isRemainders={isRemainders}
        />,
      );
    });
    return listDataComponent;
  };

  return (
    <>
      <div className={className}>
        <div className={cx(gClasses.CenterVSpaceBetween, gClasses.MB16)}>
          <Title
            content={STRING?.TITLE || EMPTY_STRING}
            headingLevel={ETitleHeadingLevel.h4}
            size={ETitleSize.xs}
          />
          {INDIVIDUAL_ENTRY_MODE.REPORT_INSTANCE_MODE !== mode && (
            <Button
              type={EButtonType.PRIMARY}
              buttonText={STRING?.BUTTON || EMPTY_STRING}
              onClickHandler={onAddModelOpen}
              colorSchema={colorSchema}
            />
          )}
        </div>
        <div
          className={cx(
            gClasses.DisplayFlex,
            gClasses.FlexDirectionCol,
            gClasses.gap12,
          )}
        >
          {getListData()}
        </div>
      </div>
      {instMode && isAddModelOpen && isNotes && (
        <AddNotes
          isModalOpen={isAddModelOpen}
          onCloseClick={onCloseClick}
          metaData={metaData}
          type={type}
          dispatch={dispatch}
        />
      )}
      {instMode && isAddModelOpen && isRemainders && (
        <AddRemainders
          isModalOpen={isAddModelOpen}
          onCloseClick={onCloseClick}
          metaData={metaData}
          type={type}
          dispatch={dispatch}
        />
      )}
    </>
  );
}

NotesAndRemaindersData.propTypes = {
  isNotes: PropTypes.bool,
  isRemainders: PropTypes.bool,
  listData: PropTypes.array,
  notesListDocumentDetails: PropTypes.array,
  dispatch: PropTypes.func,
  className: PropTypes.string,
  mode: PropTypes.string,
  metaData: PropTypes.object,
  type: PropTypes.string,
};

export default NotesAndRemaindersData;
