import React, { Component } from 'react';
import cx from 'classnames/bind';
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import PropTypes from 'prop-types';

import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import { VALIDATION_CONSTANT } from 'utils/constants/validation.constant';
import { withTranslation } from 'react-i18next';
import Button from '../button/Button';
import gClasses from '../../../scss/Typography.module.scss';
import styles from './ImageUpload.module.scss';
import { BS, INPUT_TYPES } from '../../../utils/UIConstants';
import { IMAGE_UPLOAD_STRINGS } from './ImageUpload.strings';
import { BUTTON_TYPE, IMAGE_EXTENSIONS, FORM_POPOVER_STATUS, IMAGE_UPLOAD_EXTENSION, SVG_FORMAT } from '../../../utils/Constants';
import {
  validate,
  showToastPopover,
  isSvgContentSuspicious,
} from '../../../utils/UtilityFunctions';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { accountLogoValidateSchema } from '../../../containers/admin_settings/account_settings/AccountSettings.validate.schema';
import jsUtils from '../../../utils/jsUtility';
import { getExtensionFromFileName } from '../../../utils/generatorUtils';
import { extractImageFileExtensionFromBase64 } from '../../../utils/imageHelperUtils';

const { IMAGE_TYPE } = IMAGE_UPLOAD_STRINGS;
class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUploadPicModalOpen: false,
      src: null,
      crop: this.centerAspectCrop(),
      profilePicDetails: {
        imageExtension: null,
        imageName: EMPTY_STRING,
      },
    };
  }

  render() {
    const { crop, src, isUploadPicModalOpen } = this.state;
    const { imageUploadRef, minWidth, id, testId, testIdButton } = this.props;

    return (
      <>
        {isUploadPicModalOpen && <ModalLayout
          id="image_upload_modal"
          isModalOpen={isUploadPicModalOpen}
          modalContainerClass={styles.ModalContent}
          onCloseClick={this.closeUploadPicModal}
          headerContent={IMAGE_UPLOAD_STRINGS.TITLE}
          mainContent={(
            <div className={cx(gClasses.CenterVH, styles.ImageContainer)}>
              <ReactCrop
                crop={crop}
                onChange={this.onCropChange}
                onComplete={this.onCropComplete}
                minWidth={minWidth}
                maxHeight={150}
                maxWidth={538}
              >
                <img
                  alt="Currently not available, try again later!"
                  src={src}
                  onLoad={this.onImageLoaded}
                />
              </ReactCrop>
            </div>
          )}
          footerContent={(
            <div className={cx(BS.W100, BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
              <Button
                buttonType={BUTTON_TYPE.SECONDARY}
                onClick={this.closeUploadPicModal}
                id={IMAGE_UPLOAD_STRINGS.CANCEL.ID}
              >
                {IMAGE_UPLOAD_STRINGS.CANCEL.LABEL}
              </Button>

              <Button
                buttonType={BUTTON_TYPE.PRIMARY}
                onClick={this.handleUpload}
                id={IMAGE_UPLOAD_STRINGS.CROP.ID}
                className={cx(styles.CropBtnClass)}
                testId={testIdButton}
              >
                {IMAGE_UPLOAD_STRINGS.CROP.LABEL}
              </Button>
            </div>
          )}
        /> }
        <input
          id={id}
          type={INPUT_TYPES.FILE}
          className={cx(BS.INVISIBLE, BS.P_ABSOLUTE)}
          onChange={this.loadPic}
          ref={imageUploadRef}
          accept={IMAGE_UPLOAD_EXTENSION}
          data-test={testId}
        />
      </>
    );
  }

  onImageLoaded = (image) => {
    const { aspect } = this.props;
    const { crop } = this.state;
    this.imageRef = image;
    this.setState({ crop: this.centerAspectCrop(image.target.width, image.target.height, aspect) }, () => {
      this.makeClientCrop(crop);
    });
  };

  onCropComplete = (crop) => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop) => {
    this.setState({ crop });
  };

  imageRef = React.createRef();

  centerAspectCrop = () => {
    let width = 100;
    let height = 100;

    if (this.imgRef && this.imgRef.current) {
      width = this.imgRef.current.width;
      height = this.imgRef.current.height;
    }

    const { aspect } = this.props;
    return centerCrop(
      makeAspectCrop(
        {
          unit: IMAGE_UPLOAD_STRINGS.UNIT,
          width: 90,
        },
        aspect,
        width,
        height,
      ),
      width,
      height,
    );
  };

  closeUploadPicModal = () => {
    this.setState({
      isUploadPicModalOpen: false,
    });
  };

  loadPic = async (e) => {
    const { maxFileSize, onFileSizeExceed, maxFileSizeInMB, t } = this.props;
    const event = e;
    event.preventDefault();
    console.log('loadEventFunc', event);
    const reader = new FileReader();
    const file = event.target.files[0];
    console.log(file);
    // joi validation for file size & type
    console.log('joi', typeof file.size);
    const data = {
      type: file.type,
      size: file.size,
    };
    const isSafeSvg = await isSvgContentSuspicious(file, window, t);
    if (file?.type?.includes(SVG_FORMAT) && !isSafeSvg) {
      return null;
    }
    console.log('joi', data, validate(data, accountLogoValidateSchema));
    event.target.value = EMPTY_STRING;
    if (file.size > maxFileSize) {
      return onFileSizeExceed(maxFileSizeInMB);
    }
    if (!jsUtils.includes(IMAGE_EXTENSIONS, getExtensionFromFileName(file.name)) || file.type === EMPTY_STRING) {
      showToastPopover(
        t(VALIDATION_CONSTANT.INVALID_FILE),
        t(VALIDATION_CONSTANT.ALLOWED_TYPES),
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
      return null;
    }

    reader.onloadend = () => {
      const readerResult = reader.result;
      console.log('readerResult', readerResult);
      const imageExtension = extractImageFileExtensionFromBase64(readerResult);
      const imageName = file.name;
      const profilePicDetails = {
        imageExtension,
        imageName,
      };
      console.log('fasdfas', readerResult);
      this.setState({
        src: [readerResult],
        isUploadPicModalOpen: true,
        profilePicDetails,
      });
    };
    if (file != null) {
      reader.readAsDataURL(file);
    }
    return null;
  };

  makeClientCrop = async (crop) => {
    const { profilePicDetails } = this.state;
    if (this.imageRef && crop.width && crop.height) {
      const croppedImage = await this.getCroppedImg(this.imageRef, crop, profilePicDetails.imageName);
      this.setState({ croppedImage });
    }
  };

  getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement(IMAGE_UPLOAD_STRINGS.ELEMENT_TYPE);
    const scaleX = image.target.naturalWidth / image.target.width;
    const scaleY = image.target.naturalHeight / image.target.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext(IMAGE_UPLOAD_STRINGS.CONTEXT);

    ctx.drawImage(
      image.target,
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
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        const imageObject = {
          image: blob,
          base64: this.fileUrl,
        };

        console.log('imageObject', imageObject);
        // for server upload version of image
        resolve(imageObject);
      }, IMAGE_TYPE);
    });
  };

  handleUpload = (event) => {
    const { onUploadClicked } = this.props;
    const { croppedImage } = this.state;
    event.preventDefault();
    if (onUploadClicked && event.target.id !== IMAGE_UPLOAD_STRINGS.CANCEL.ID) {
      console.log(croppedImage);
      onUploadClicked(croppedImage);
    }
    this.setState({ isUploadPicModalOpen: false });
  };
}
export default withTranslation()(ImageUpload);

ImageUpload.defaultProps = {
  minWidth: null,
  testId: EMPTY_STRING,
  testIdButton: EMPTY_STRING,
};

ImageUpload.propTypes = {
  onUploadClicked: PropTypes.func.isRequired,
  imageUploadRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.instanceOf(Element),
    }),
  ]).isRequired,
  maxFileSize: PropTypes.number.isRequired,
  onFileSizeExceed: PropTypes.func.isRequired,
  aspect: PropTypes.number.isRequired,
  minWidth: PropTypes.number,
  testId: PropTypes.string,
  testIdButton: PropTypes.string,
};
