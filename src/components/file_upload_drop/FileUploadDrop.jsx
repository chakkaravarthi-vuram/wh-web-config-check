import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import gClasses from 'scss/Typography.module.scss';
import ReadOnlyText from 'components/form_components/read_only_text/ReadOnlyText';
import { FILE_DROP_DOWN_STRINGS, TASK_STRINGS } from 'containers/task/task/Task.strings';
import AttachmentsIcon from 'assets/icons/AttachmentsIcon';
import { withRouter } from 'react-router-dom';
import { language } from 'language/config';
import { connect } from 'react-redux';
import AttachFileIcon from 'assets/icons/AttachFileIcon';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { useTranslation } from 'react-i18next';
import styles from './FileUploadDrop.module.scss';
import jsUtils from '../../utils/jsUtility';
import { getFileAttachmentHeader } from './FileUploadDropUtils';

function FileUploadDrop(props) {
    const { files, removeTaskReferenceDocument, id, dropHandler, dragOverHandler, nonEditable, limitAttachments, fileNameClassName } = props;
    const [hideAttachments, setHideAttachments] = useState(files.length > 3);
    // const [attachments, setAttachMents] = useState(null);
    const onDragLeaveCheck = (ev) => {
      console.log('onDragLeaveCheck', ev);
    };
    // useEffect(() => {
    //   setAttachMents();
    // }, [files]);
    const [showIcon, setShowIcon] = useState(false);
    const [fileValue, setFileValue] = useState('');
    const [hoverFileIndex, setHoverFileIndex] = useState(-1);
    const inputRef = useRef();
    const ARIA_LABEL = {
      ATTACH: 'Attach',
    };
    const { t, i18n } = useTranslation();
    const changeEyeIconVisibility = (visible, index) => {
      setShowIcon(visible);
      setHoverFileIndex(index);
      };
    const attachments = (hideAttachments ? files.slice(0, 3) : files).map((file, index) => {
      console.log('getDroppedAttachmentsss component', file);
    return (
      <div
        className={cx(styles.UploadedDropZone)}
        draggable="true"
        id={id}
      >
        <div>
        <div className={gClasses.CenterVH}>
  {/* <UserImage
        src={!nonEditable ? !jsUtils.isNull(profile_pic) ? profile_pic : userDetails.profile_pic : userDetails.profile_pic}
        className={cx(styles.UserImage)}
        firstName={userDetails.first_name}
        lastName={userDetails.last_name}
        isDataLoading={isLoading}
    /> */}
        </div>
    <ReadOnlyText
    className={cx(gClasses.CenterVH, gClasses.MT5)}
    hideLabel
    id={file?.file?.url}
    value={file.file.name}
    hideMessage
    formFieldBottomMargin
    link={file.link}
    fileDetail={file.file}
    custom
    previewSize
    nonEditable={nonEditable}
    removeTaskReferenceDocument={() => removeTaskReferenceDocument(file.id)}
    file={file}
    fileNameClassName={fileNameClassName}
    fileUploadHeader={(fileDetail, openPreview, fileLinkUrl) => getFileAttachmentHeader(fileDetail, openPreview, fileLinkUrl, props, showIcon && (hoverFileIndex === index), changeEyeIconVisibility, index)}
    />
    {/* <>
    {!nonEditable ?
    (
    <div className={cx(BS.D_FLEX, BS.JC_CENTER)}>
    <DeleteIcon className={cx(styles.DeleteIcon)} onClick={() => removeTaskReferenceDocument(file.id)} />
    </div>
    ) : null
    }
    </> */}
        </div>
      </div>
    );
  });
    console.log('taskReferenceDocuments uploaded', attachments, files);
    return (
    <div className={cx(!nonEditable ? gClasses.MT30 : gClasses.MT15)}>
      {!nonEditable && (
        <div className={cx(gClasses.FieldName, styles.UploadLabel)}>
          {t(TASK_STRINGS.TASK_SUB_TITLES.ATTACHMENTS.LABEL)}
        </div>
      )}
      <div className={cx(BS.JC_START, BS.D_FLEX, BS.FLEX_WRAP_WRAP)}>
     {!jsUtils.isEmpty(attachments) ? attachments : null}
      {!jsUtils.isEmpty(attachments) && !nonEditable ?
      (
      <div
        className={cx(styles.DropZone)}
        id="drop_zone"
        onDrop={dropHandler}
        onDragOver={dragOverHandler}
        onDragLeave={onDragLeaveCheck}
        onMouseLeave={onDragLeaveCheck}
      >
        <div className={cx(gClasses.CenterVH, gClasses.CursorPointer, gClasses.ClickableElement)}>
        <label htmlFor="file-input">
          <AttachFileIcon role={ARIA_ROLES.IMG} ariaLabel="Attach file" className={cx(gClasses.ML34, gClasses.CursorPointer, gClasses.ClickableElement)} />
        {/* <img src="https://icons.iconarchive.com/icons/dtafalonso/android-lollipop/128/Downloads-icon.png"/> */}
        <div
          className={cx(gClasses.FTwo12BlackV13, gClasses.Italics, gClasses.FontWeight500, gClasses.WhiteSpaceNoWrap)}
          role="button"
          tabIndex={0}
          // onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && inputRef.current?.click()}
        >
         {t(FILE_DROP_DOWN_STRINGS.ATTACH_LABEL)}
        </div>
        </label>
        </div>
        <div>
      <input
        id="file-input"
        type="file"
        onChange={dropHandler}
        className={BS.INVISIBLE}
        multiple
        value={fileValue}
        onClick={() => setFileValue('')}
        ref={inputRef}
      />
        </div>
        {/* <div className={cx(gClasses.FTwo12BlackV13, gClasses.Italics, gClasses.FontWeight500)}>Attach your file</div> */}
      </div>
    ) : !nonEditable ?
    (
      <div
        role="presentation"
        className={cx(
          // gClasses.DashedBorder,
          BS.D_FLEX,
          gClasses.CenterVH,
          styles.AddAttachments,
          // gClasses.CenterV,
          (i18n.language === language.solvene) ? styles.AddAttachmentsLanguage : null,
          gClasses.MT5,
          gClasses.PL10,
        )}
        id="drop_zone"
        onDrop={dropHandler}
        onDragOver={dragOverHandler}
        onDragLeave={onDragLeaveCheck}
        onMouseLeave={onDragLeaveCheck}
      >
        <div className={cx(gClasses.CenterVH, gClasses.DisplayFlex)}>
          <AttachmentsIcon role={ARIA_ROLES.IMG} ariaLabel={ARIA_LABEL.ATTACH} />
          <label htmlFor="file-input" className={cx(gClasses.ML5, gClasses.FTwo13, gClasses.FontWeight400)}>
            {t(FILE_DROP_DOWN_STRINGS.DRAG_LABEL)}
            {' '}
            <span
              className={cx(styles.CreateForm, gClasses.CursorPointer)}
              role="button"
              tabIndex={0}
              // onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && inputRef.current?.click()}
            >
              {t(FILE_DROP_DOWN_STRINGS.BROWSE)}
            </span>
            <input
              id="file-input"
              type="file"
              onChange={dropHandler}
              className={cx(styles.CreateForm, gClasses.CursorPointer, BS.INVISIBLE)}
              multiple
              onClick={() => setFileValue('')}
              ref={inputRef}
            />
          </label>
        </div>
      </div>
    ) : null
      }
      { limitAttachments && hideAttachments ?
      (
        <div
          className={cx(styles.RemainingAttachments, gClasses.FTwo20GrayV53, gClasses.CenterVH, gClasses.CursorPointer, gClasses.ClickableElement)}
          draggable="true"
          onClick={() => setHideAttachments(false)}
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && setHideAttachments(false)}
          role="button"
          tabIndex={0}
        >
          {`+${files.length - 3} more`}
        </div>
      ) : null
      }
      </div>
    </div>
    );
}
// export default FileUploadDrop;
const mapStateToProps = (state) => {
  return {
    profile_pic: state.UserProfileReducer.profile_pic,
  };
};
export default withRouter(
  connect(mapStateToProps, null)(FileUploadDrop),
);
FileUploadDrop.defaultProps = {
    nonEditable: false,
    limitAttachments: false,
  };
  FileUploadDrop.propTypes = {
    nonEditable: PropTypes.bool,
    limitAttachments: PropTypes.bool,
  };
