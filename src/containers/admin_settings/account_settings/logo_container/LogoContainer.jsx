import React from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';

import Skeleton from 'react-loading-skeleton';
import Image from '../../../../components/form_components/image/Image';
import Label from '../../../../components/form_components/label/Label';
import CustomLink from '../../../../components/form_components/link/Link';

import { BS } from '../../../../utils/UIConstants';
import { ACCOUNT_SETTINGS_FORM } from '../AccountSettings.strings';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import AddLogoIcon from '../../../../assets/icons/AddLogoIcon';
import HelperMessage, { HELPER_MESSAGE_TYPE } from '../../../../components/form_components/helper_message/HelperMessage';
import jsUtils from '../../../../utils/jsUtility';

import gClasses from '../../../../scss/Typography.module.scss';
import styles from '../AccountSettings.module.scss';

function LogoContainer(props) {
  let image = null;
  let availableImageClass = null;
  const { imgSrc, isDataLoading, onInputFileClick, hideLabel, className, note, linkLabel, errorMessage, labelStyles, addLogoIconStyle, imageLoadHandler } = props;
  let link_label = ACCOUNT_SETTINGS_FORM.CHANGE_LOGO;
  if (!imgSrc && !isDataLoading) {
    link_label = ACCOUNT_SETTINGS_FORM.ACCOUNT_LOGO.LINK_LABEL;
  } else {
    availableImageClass = styles.AvailableImage;
    image = <Image src={imgSrc} className={styles.Image} imageLoadHandler={imageLoadHandler} />;
  }

  const errorMessageView = !jsUtils.isEmpty(errorMessage) && (
    <HelperMessage
      message={errorMessage}
      type={HELPER_MESSAGE_TYPE.ERROR}
      // id={messageId}
      className={cx(gClasses.ErrorMarginV1)}
    />
  );
  return (
    <>
      {!hideLabel && <Label content={ACCOUNT_SETTINGS_FORM.ACCOUNT_LOGO.LABEL} isDataLoading={isDataLoading} labelStyles={labelStyles} />}
      {isDataLoading ? (
        <Skeleton height={100} width={300} />
      ) : (
        <div className={cx(styles.ImageContainer, gClasses.CenterVH, BS.P_RELATIVE, availableImageClass, className)}>
          {image}
          <div className={cx(styles.LinkContainer, BS.P_ABSOLUTE, gClasses.CenterVH)}>
            <CustomLink className={cx(styles.Link, gClasses.FOne12, addLogoIconStyle)} onClick={onInputFileClick}>
              <AddLogoIcon className={gClasses.MR10} />
              {linkLabel || link_label}
            </CustomLink>
          </div>
        </div>
      )}
      {isDataLoading ? (
        <div className={cx(gClasses.Height16, gClasses.Width200)}>
          <Skeleton />
        </div>
      ) : (
        <div className={cx(gClasses.FOne12GrayV9, styles.Notes)}>{note || ACCOUNT_SETTINGS_FORM.NOTE}</div>
      )}
      {errorMessageView}
    </>
  );
}

LogoContainer.propTypes = {
  imgSrc: PropTypes.string,
  isDataLoading: PropTypes.bool,
  imageLoadHandler: PropTypes.func.isRequired,
  onInputFileClick: PropTypes.func.isRequired,
  hideLabel: PropTypes.bool,
  className: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

LogoContainer.defaultProps = {
  isDataLoading: false,
  imgSrc: EMPTY_STRING,
  hideLabel: false,
  className: EMPTY_STRING,
};

export default LogoContainer;
