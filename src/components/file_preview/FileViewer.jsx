import React, { useRef, useState, useEffect } from 'react';
import Modal from 'components/form_components/modal/Modal';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { BS } from 'utils/UIConstants';
import ZoomOutIcon from 'assets/icons/file_preview/ZoomOut';
import ZoomInIcon from 'assets/icons/file_preview/ZoomIn';
import ZoomIcon from 'assets/icons/file_preview/ZoomIcon';
import FileBackIcon from 'assets/icons/fileBack';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { getExtensionFromFileName } from 'utils/generatorUtils';
import styles from './FileViewer.module.scss';
import DownloadIcon from '../../assets/icons/DownloadIcon';
import CustomRenderer from './CustomRender';
import {
  FILE_TYPES,
  isCustomFileType,
  isImageFileType,
  isVideoFileType,
} from './FileviewerUtils';
import './fileviewer.css';
import ReactPDF from './PdfRenderer';

function useClickOutsideDetector(ref, ref2, ref3, closeModal) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        ref2.current &&
        !ref2.current.contains(event.target) &&
        ref3.current &&
        !ref3.current.contains(event.target)
      ) {
        closeModal();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}

function FilePreview(props) {
  const { fileUrl, filetype, isOpen, fileName, onCloseFile, isLoading, fileDetail, fileDownload, withCredentials = true } = props;
  console.log('fileChange', fileUrl, filetype, isOpen, fileName, fileDetail);

  const ContentRef = useRef(null);
  const headerRef = useRef(null);
  const ZoomRef = useRef(null);
  useClickOutsideDetector(ContentRef, headerRef, ZoomRef, onCloseFile);
  // const filetype = 'pdf';
  // const fileUrl =
  //   'https://api-ecabinet.smart-office.vn/uploads/CV_Nguyen_Duc_Manh_dbf5d47ac7.pdf';
  let renderComponent = null;
  let headerComponet = null;
  let SubContainerClass = null;
  const [scaleValue, setScaleValue] = useState(1);

  const zoominhandler = () => {
    scaleValue < 1.3 && setScaleValue(scaleValue + 0.1);
  };
  const zoomouthandler = () => {
    scaleValue > 1 && setScaleValue(scaleValue - 0.1);
  };

  const getFileRender = () => {
    let fileRender;
    if (isLoading) {
      fileRender = <div>Loading...</div>;
    } else if (fileUrl == null) {
      fileRender = (
        <div className={styles.PreviewNotAvl}>Preview not available</div>
      );
    } else if (fileDetail.type === FILE_TYPES.PDF || getExtensionFromFileName(fileDetail.fileName) === FILE_TYPES.PDF) {
      fileRender = (
        <ReactPDF
          fileDetail={fileDetail}
          fileSrc={fileDetail.localFileURL || fileUrl}
          scaleValue={scaleValue}
          withCredentials={withCredentials}
        />
      );
    } else if (isCustomFileType(fileDetail.type) || isCustomFileType(getExtensionFromFileName(fileDetail.fileName))) {
      fileRender = <CustomRenderer fileDetail={fileDetail} fileSrc={fileUrl} />;
    } else {
      fileRender = (
        <div className={styles.PreviewNotAvl}>Preview not available</div>
      );
    }
    return fileRender;
  };

  const transformStyle =
    filetype === 'docx'
      ? { transform: `scaleX(${scaleValue})` }
      : { transform: (fileDetail.type === FILE_TYPES.PDF || getExtensionFromFileName(fileDetail.fileName) === FILE_TYPES.PDF) ? 'none' : `scale(${scaleValue})` };
  SubContainerClass = (fileDetail.type === FILE_TYPES.PDF || getExtensionFromFileName(fileDetail.fileName) === FILE_TYPES.PDF) ? BS.D_FLEX : styles.SubContainer;

  renderComponent = (
    <div className={styles.ContainerHeight}>
      <div
        className={cx(
          styles.MainContainer,
          BS.FLEX_WRAP_WRAP,
          gClasses.CenterVH,
          BS.FLEX_COLUMN,
          isCustomFileType(filetype) && styles.MainConatinerDimension,
          !isImageFileType(filetype) && styles.Image,
        )}
      >
        <div
          className={cx(!isImageFileType(filetype) && SubContainerClass)}
          style={transformStyle}
          ref={ContentRef}
        >
          {getFileRender()}
        </div>
        {/* cx((filetype === 'docx' || filetype === 'xlsx') ? gClasses.Sticky : BS.ABSOLUTE */}
        <div
          className={cx(
            filetype === 'docx' || filetype === 'xlsx' || filetype === 'pdf'
              ? gClasses.Sticky
              : BS.P_ABSOLUTE,
            styles.ZoomContainer,
            BS.D_FLEX,
          )}
          ref={ZoomRef}
        >
          {/* <div className={cx(gClasses.FontWeight500, styles.PageNumber)}>
                Page 1 / 8
                <div className={styles.ZoomDivider} />
              </div> */}
          {!isVideoFileType(filetype) && (
            <div className={cx(styles.ZoomMain, gClasses.CenterVH)}>
              <ZoomOutIcon
                ariaLabel="zoom out"
                tabIndex={0}
                onKeyPress={zoomouthandler}
                role="button"
                className={gClasses.CursorPointer}
                onClick={zoomouthandler}
              />
              <ZoomIcon />
              <ZoomInIcon
                ariaLabel="zoom in"
                onKeyPress={zoominhandler}
                tabIndex={0}
                role="button"
                className={gClasses.CursorPointer}
                onClick={zoominhandler}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
  // }
  headerComponet = (
    <div
      className={cx(
        gClasses.CenterV,
        styles.header,
        BS.JC_BETWEEN,
        gClasses.PT15,
        gClasses.Sticky,
        gClasses.PB15,
      )}
      ref={headerRef}
    >
      <div className={cx(gClasses.CenterV, gClasses.ML15)}>
        <div
          className={cx(styles.Icon, gClasses.CursorPointer)}
          style={{ paddingLeft: '7px' }}
          onClick={() => onCloseFile()}
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onCloseFile()}
          role="button"
          tabIndex={0}
        >
          <FileBackIcon className={styles.downloadIcon} title="go back" />
        </div>
        <div
          className={cx(
            gClasses.FTwo,
            styles.Title,
            gClasses.FontWeight500,
            gClasses.ML10,
          )}
        >
          <p>{fileName}</p>
        </div>
      </div>
      <div className={cx(gClasses.CenterV, gClasses.MR15)}>
        {/* {(filetype === 'pdf' || filetype === 'png') && (
          <div
            className={cx(styles.Icon, gClasses.CursorPointer)}
            style={{ paddingLeft: '7px' }}
          >
            <PrintIcon />
          </div>
        )} */}
        {/* <div className={cx(styles.Icon, gClasses.ML10, gClasses.CursorPointer)}> */}
        {
          fileDownload && (
            <div
              className={cx(styles.Icon, gClasses.ML10, gClasses.CursorPointer)}
              tabIndex={0}
              role="button"
              onClick={fileDownload}
              onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && fileDownload()}
              aria-label="Download file"
            >
              <DownloadIcon className={cx(styles.downloadIcon, gClasses.CursorPointer)} />
            </div>
          )
        }
        {/* </div> */}
      </div>
    </div>
  );
  return (
    isOpen && (
      <Modal
        id="image_upload_modal"
        contentClass={cx(styles.ModalContainer)}
        isModalOpen={isOpen}
        // onCloseClick={() => onCloseFile()}
        escCloseDisabled
      >
        {headerComponet}
        {renderComponent}
      </Modal>
    )
  );
}

export default FilePreview;
