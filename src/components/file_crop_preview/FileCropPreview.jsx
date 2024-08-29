import React, { useEffect, useState, useRef } from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { DEFAULT_FILE_UPLOAD_SIZE_IN_BYTES, FORM_POPOVER_STATUS, IMAGE_EXTENSIONS } from 'utils/Constants';
import { getFileSize, keydownOrKeypessEnterHandle, showToastPopover } from 'utils/UtilityFunctions';
import { getExtensionFromFileName } from 'utils/generatorUtils';
import HELPER_MESSAGE_TYPE from 'components/form_components/helper_message/HelperMessage.strings';
import HelperMessage from 'components/form_components/helper_message/HelperMessage';
import DeleteIconV2 from 'assets/icons/form_fields/DeleteIconV2';
import { getAccountConfigurationDetailsApiService } from 'axios/apiService/accountConfigurationDetailsAdmin.apiService';
import { useTranslation } from 'react-i18next';
import { VALIDATION_CONSTANT } from 'utils/constants/validation.constant';
import styles from './FileCropPreview.module.scss';
import { ARIA_ROLES, BS, INPUT_TYPES } from '../../utils/UIConstants';
import jsUtils from '../../utils/jsUtility';
import { isSvgContentSuspicious } from '../../utils/UtilityFunctions';
import { SVG_FORMAT } from '../../utils/Constants';
// import { isValidMimeType } from '../../utils/generatorUtils';

function FileCropPreviewComp(props) {
    const {
      id,
      imageSrc,
      addFile,
      maximum_file_size,
      instructionMessage,
      instructionClassName,
      errorMessage,
      hideMessage,
      onDeleteLogoClick,
      validateConditional,
      imgSrc,
      isAdminSettings,
      showOriginal = false,
      instructionMessageStyles,
      updatedImageContainer,
      label,
      ariaLabelHelperMessage,
      focusOnError,
      focusOnErrorRefresher,
      maxHeight,
    } = props;
    const [crop, setCrop] = useState();
    const [aspect] = useState(16 / 7);
    const [completedCrop, setCompletedCrop] = useState();
    const [originalImage, setOriginalImage] = useState();
    const [currentImage, setCurrentImage] = useState();
    const [allowedExtension, setAllowedExtension] = useState();
    const imgRef = useRef(null);
    const fileInput = useRef(null);
    const btnref = useRef(null);
    let allowedFileTypes = null;
    const { t } = useTranslation();

    function centerAspectCrop(mediaWidth, mediaHeight) {
      return centerCrop(
        makeAspectCrop(
          {
            unit: 'px',
            width: 144,
            height: 36,
          },
          4,
          mediaWidth,
          mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
      );
    }

    const getCroppedImg = (image, crop, fileName) => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height,
        );
        return new Promise((resolve) => {
            canvas.toBlob((b) => {
              if (!b) {
                return;
              }
              // for client side crop check
              const blob = b;
              blob.name = fileName;
              window.URL.revokeObjectURL(null);
              const fileUrl = window.URL.createObjectURL(blob);
              const imageObject = {
                file: blob,
                base64: fileUrl,
              };
              // for server upload version of image
              resolve(imageObject);
            }, 'image/png');
        });
    };

    const onImageLoad = async (e) => {
      if (aspect) {
        const { width, height } = e.currentTarget;
        const cropImage = centerAspectCrop(width, height);
        setCrop(cropImage);
        if (imgRef && cropImage.width && cropImage.height) {
          const croppedImage = await getCroppedImg(imgRef.current, cropImage, currentImage.fileName);
          croppedImage.fileName = currentImage.fileName;
          setCompletedCrop(croppedImage);
          const files = [];
          files[0] = croppedImage;
          const multipleFile = {
            files,
            index: 0,
          };
          addFile(multipleFile);
      }
      }
    };

    const makeClientCrop = async (crop) => {
        if (imgRef && crop.width && crop.height) {
          const croppedImage = await getCroppedImg(imgRef.current, crop, currentImage.fileName);
          croppedImage.fileName = currentImage.fileName;
          const files = [];
          files[0] = croppedImage;
          const multipleFile = {
            files,
            index: 0,
          };
          addFile(multipleFile);
          setCompletedCrop(croppedImage);
        }
    };

    const onClearCropClick = () => {
      // setCompletedCrop();
      // setCrop();
    };

    const onDeleteClick = () => {
      setCompletedCrop();
      setCrop();
      setOriginalImage();
      onDeleteLogoClick();
      if (validateConditional) validateConditional();
    };

    useEffect(() => {
         () => {
          onClearCropClick();
        };
    }, [imageSrc && imageSrc.name]);

    useEffect(() => {
      getAccountConfigurationDetailsApiService().then((response) => {
        setAllowedExtension(response);
      }).catch(() => {
        setAllowedExtension();
      });
    }, []);
    if (allowedExtension && allowedExtension.allowed_extensions) allowedFileTypes = isAdminSettings ? allowedExtension.allowed_extensions : IMAGE_EXTENSIONS;

    useEffect(() => {
      if (focusOnError) btnref.current.focus();
    }, [focusOnError, focusOnErrorRefresher]);

    async function onFileUploadChangeHandler(event) {
      event.preventDefault();
      const reader = new FileReader();
      const file = event.target.files[0];
      const isSuspisiousSvg = await isSvgContentSuspicious(file, window, t);
      if (file?.type?.includes(SVG_FORMAT) && !isSuspisiousSvg) {
        return;
      }
      if (file) {
        if (maximum_file_size) {
          if (file.size > maximum_file_size * DEFAULT_FILE_UPLOAD_SIZE_IN_BYTES) {
            showToastPopover(
              t(VALIDATION_CONSTANT.FILE_SIZE_EXCEED),
              `${t(VALIDATION_CONSTANT.LESS_FILE_SIZE)} ${maximum_file_size}MB`,
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
            return;
          }
        } else if (file.size > DEFAULT_FILE_UPLOAD_SIZE_IN_BYTES) {
          showToastPopover(
            t(VALIDATION_CONSTANT.FILE_SIZE_EXCEED),
            `${t(VALIDATION_CONSTANT.LESS_FILE_SIZE)} ${1}MB`,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          return;
        }
        if (!jsUtils.isEmpty(allowedFileTypes) && isAdminSettings) {
          if (!jsUtils.includes(allowedFileTypes, getExtensionFromFileName(file.name)) &&
              !jsUtils.includes(allowedFileTypes, getExtensionFromFileName(file.name).toLowerCase())) {
            showToastPopover(
              t(VALIDATION_CONSTANT.INVALID_FILE),
              t(VALIDATION_CONSTANT.FILE_MISMATCH),
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
            return;
          }
        } if (!jsUtils.includes(IMAGE_EXTENSIONS, getExtensionFromFileName(file.name)) &&
              !jsUtils.includes(IMAGE_EXTENSIONS, getExtensionFromFileName(file.name).toLowerCase())) {
          showToastPopover(
            t(VALIDATION_CONSTANT.INVALID_FILE),
            t(VALIDATION_CONSTANT.ALLOWED_TYPES),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          return;
        }
      }
      reader.onloadend = () => {
        const fileObject = {
          fileName: file.name,
          file,
        };
        const files = [];
        files[0] = fileObject;
        const multipleFile = {
          files,
          index: 0,
        };
        console.log('fileObject', multipleFile);
        addFile(multipleFile);
        setCurrentImage(fileObject);
        setOriginalImage(URL.createObjectURL(file));
      };
      if (file != null) {
        reader.readAsDataURL(file);
      }
    }

    const onUploadInputClick = () => {
      fileInput.current.click();
    };

    const fileSize = completedCrop && completedCrop.file && completedCrop.file.size && getFileSize(completedCrop.file.size);

    return (
      <div className={cx(BS.W100, (hideMessage || !errorMessage) && gClasses.MB12)}>
        <div className={cx(updatedImageContainer, styles.ImageContainer, gClasses.MT5, gClasses.MB10, gClasses.CenterVH, BS.P_RELATIVE, isAdminSettings && (!originalImage || showOriginal) && styles.ContainerHover)}>
        {isAdminSettings && (!originalImage || showOriginal) && (
        <img
          src={(imgSrc) || null}
          alt=""
          className={isAdminSettings && !originalImage && styles.AdminWidth}
        />
        )}
        {(!originalImage || showOriginal)
        && (
        <div
          className={cx(gClasses.FTwo13BlueV39, BS.TEXT_CENTER, BS.P_ABSOLUTE, gClasses.CursorPointer, styles.AdminAddText, gClasses.FontWeight500)}
          onClick={() => onUploadInputClick()}
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onUploadInputClick()}
          role="button"
          tabIndex={0}
          ref={btnref}
        >
          {label}
        </div>
      )}
        {!showOriginal && (
          <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => makeClientCrop(c)}
              minHeight={36}
              minWidth={144}
              maxHeight={maxHeight}
              className={cx(styles.ReactCrop)}
          >
                {originalImage && (
                  <img
                      ref={imgRef}
                      src={(originalImage) || null}
                      alt=""
                      onLoad={onImageLoad}
                  />
                )}
          </ReactCrop>
        )}
          <input
            id={id}
            type={INPUT_TYPES.FILE}
            className={cx(BS.INVISIBLE, BS.P_ABSOLUTE)}
            onChange={onFileUploadChangeHandler}
            ref={fileInput}
            accept={IMAGE_EXTENSIONS}
            onClick={(event) => {
              event.target.value = null;
            }}
          />
        </div>
        {!showOriginal && completedCrop && (
        <div className={cx(gClasses.CenterV, BS.JC_BETWEEN)}>
          <div
            className={cx(gClasses.PR15, gClasses.FTwo13GrayV3)}
          >
            {completedCrop && completedCrop.fileName}
          </div>
          <div className={gClasses.CenterV}>
            <div
              className={cx(
                gClasses.FTwo12GrayV5,
                gClasses.MR15,
                BS.TEXT_NO_WRAP,
              )}
            >
              {fileSize}
            </div>
            <div className={cx(styles.DeleteIconContainer, BS.D_FLEX, BS.JC_CENTER, BS.ALIGN_ITEM_CENTER)}>
              <DeleteIconV2
                title="Delete file"
                className={cx(gClasses.CursorPointer, styles.DeleteIcon)}
                onClick={() => onDeleteClick()}
                onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onDeleteClick()}
                tabIndex={0}
                role={ARIA_ROLES.BUTTON}
              />
            </div>
          </div>
        </div>
        )}
        <div className={cx(instructionMessageStyles, gClasses.FontStyleNormal, gClasses.MT5, !instructionClassName && gClasses.FontSize, !instructionClassName && gClasses.Fone12GrayV4, gClasses.WordWrap, instructionClassName)}>
          {instructionMessage}
        </div>
        {(hideMessage || !errorMessage) ? null : (
          <HelperMessage ariaLabelHelperMessage={ariaLabelHelperMessage} message={errorMessage} type={HELPER_MESSAGE_TYPE.ERROR} />
        )}
      </div>
    );
}
export default FileCropPreviewComp;
