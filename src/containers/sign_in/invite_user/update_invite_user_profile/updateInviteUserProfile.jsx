import React, { useState, useEffect, useContext } from 'react';
import { Row, Col } from 'reactstrap';
import cx from 'classnames/bind';

import { withRouter } from 'react-router';
import axios from 'axios';
import { ACCOUNT_INFO_STRINGS } from 'containers/landing_page/account_info/AccountInfoModal.string';
import Tooltip from 'components/tooltip/Tooltip';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { isEmpty, cleanObject } from '../../../../utils/jsUtility';
import Button, { BUTTON_TYPE } from '../../../../components/form_components/button/Button';
import Input, { INPUT_VARIANTS } from '../../../../components/form_components/input/Input';
import Alert from '../../../../components/form_components/alert/Alert';

import { updateInviteUserProfileApi } from '../../../../axios/apiService/signIn.apiService';

import updateInviteUserProfileSchema from './updateInviteUserProfile.validation.schema';

import gClasses from '../../../../scss/Typography.module.scss';
import styles from './updateInviteUserProfile.module.scss';

import { appendFormDataArrayOrObject, getFileSizeInBytes, onFileSizeExceed, showToastPopover, validate } from '../../../../utils/UtilityFunctions';
import { BS, INPUT_TYPES } from '../../../../utils/UIConstants';
import {
  FIRST_NAME, LAST_NAME, MOBILE_NUMBER, NICK_NAME, SET_PROFILE, SUB_TITLE, TITLE,
  IMAGE_CROP,
} from './updateInviteUserProfile.strings';
import UserImage from '../../../../components/user_image/UserImage';
import ImageUpload from '../../../../components/form_components/image_upload/ImageUpload';
import MobileNumber from '../../../../components/form_components/mobile_number/MobileNumber';
import { DOCUMENT_TYPES, EMPTY_STRING, ENTITY } from '../../../../utils/strings/CommonStrings';
import { getUploadSignedUrlApi } from '../../../../axios/apiService/userProfile.apiService';
import { getFieldsForDMS, getFileUrl } from '../../../../utils/attachmentUtils';
import { FORM_POPOVER_STATUS, PRODUCTION } from '../../../../utils/Constants';
import { generateUuid, getExtensionFromFileName } from '../../../../utils/generatorUtils';
import { setPointerEvent, updatePostLoader } from '../../../../utils/loaderUtils';
import { getAccountConfigurationDetailsApiService } from '../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import ThemeContext from '../../../../hoc/ThemeContext';

function UpdateInviteUserProfile(props) {
  const { t } = useTranslation();
  const { username, userId, signInState } = props;
  const imageUploadRef = React.createRef();
  const [errors, setErrors] = useState({});
  const [profilePic, setProfilePic] = useState({});
  const [documentDetails, setDocumentDetails] = useState({});
  const [userProfileData, setUserProfileData] = useState({});
  const [profileData, setProfileData] = useState({
    [FIRST_NAME.ID]: '',
    [LAST_NAME.ID]: '',
    [MOBILE_NUMBER.ID]: '',
    [NICK_NAME.ID]: '',
    country_code: '+91',
    country: 'IN',
  });

  const { colorScheme } = useContext(ThemeContext);

  useEffect(() => {
    getAccountConfigurationDetailsApiService().then((response) => {
      setUserProfileData(response);
    });
  }, []);
  const getValidationData = () => {
    return {
      [FIRST_NAME.ID]: profileData[FIRST_NAME.ID],
      [LAST_NAME.ID]: profileData[LAST_NAME.ID],
      [MOBILE_NUMBER.ID]: profileData[MOBILE_NUMBER.ID],
    };
  };
  const uploadDocumentToDMS = (fileArray, profilePicDetail) => {
    let resData;
    fileArray.forEach((data) => {
      const postData = getFieldsForDMS(data.upload_signed_url.fields, profilePicDetail?.profile_pic?.image);
      setPointerEvent(true);
      axios.post(data.upload_signed_url.url, appendFormDataArrayOrObject(postData))
      .then((response) => { resData = response; })
      .catch(() => setPointerEvent(false));
    });
    setPointerEvent(false);
    return resData;
  };

  const getPostData = (data, document_details = {}) => {
    const postData = {};
    if (!isEmpty(document_details)) {
      postData.document_details = {};
      postData.document_details.uploaded_doc_metadata = [];
      postData.document_details.entity = document_details.entity;
      postData.document_details.entity_id = document_details.entity_id;
      postData.document_details.ref_uuid = document_details.ref_uuid;
      if (document_details.file_metadata) {
        document_details.file_metadata.forEach((file_info) => {
          postData.document_details.uploaded_doc_metadata.push({
            upload_signed_url: getFileUrl(file_info?.upload_signed_url),
            type: DOCUMENT_TYPES.PROFILE_PIC,
            document_id: file_info._id,
          });
          postData.profile_pic = file_info._id;
        });
      }
    }
    postData.first_name = data[FIRST_NAME.ID];
    postData.last_name = data[LAST_NAME.ID];
    if (!isEmpty(data[MOBILE_NUMBER.ID])) {
      postData.mobile_number_country = data.country;
      postData.mobile_number = data[MOBILE_NUMBER.ID];
      postData.mobile_number_country_code = data.country_code;
    }
    return postData;
  };

  const getUploadSignedUrl = (doc_details, file_ref_uuid, entity, profilePicDetail) => {
    const file_data = {
      type: DOCUMENT_TYPES.PROFILE_PIC,
      file_type: getExtensionFromFileName(doc_details.image.name),
      file_name: doc_details.image.name.split('.')[0],
      file_size: doc_details.image.size,
      file_ref_id: file_ref_uuid,
    };
    const file_metadata = [];
    file_metadata.push(file_data);
    const data = {
      file_metadata,
    };
    data.entity = entity;
    data.entity_id = userId;
    setPointerEvent(true);
    getUploadSignedUrlApi(data).then((response) => {
      setDocumentDetails({ document_details: response });
      setPointerEvent(false);
      updatePostLoader(false);
      uploadDocumentToDMS(response.file_metadata, profilePicDetail);
    }, () => {
      showToastPopover(
        'Something went wrong',
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
      setPointerEvent(false);
      updatePostLoader(false);
    });
  };

  const onSetProfileClick = (event) => {
    event.preventDefault();
    const error = validate(getValidationData(), updateInviteUserProfileSchema(t));
    if (!isEmpty(error)) { return setErrors(error); }
    const postData = cleanObject(getPostData(profileData, documentDetails?.document_details));

    updateInviteUserProfileApi(postData).then(() => {
      if (process.env.NODE_ENV === PRODUCTION) {
        window.location = `${window.location.protocol}//${window.location.hostname}/`;
      } else {
        window.location = `http://${window.location.host}`;
      }
    }).catch(() => {
      showToastPopover(
        'Something went wrong',
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    });
    return null;
  };

  const onChangeHandler = (value, id) => {
    if (profileData[id] !== value) setProfileData({ ...profileData, [id]: value });
  };

  const setCountryCode = (value) => {
    setProfileData({ ...profileData, country: value.countryCode.toUpperCase(), country_code: value.countryCodeId });
  };

  const onImageChange = (imageObject) => {
    const file_ref_uuid = generateUuid();
    const profilePicDetail = {
      profile_pic: imageObject,
      file_ref_uuid,
      enable_button: true,
    };
    setProfilePic(profilePicDetail);
    getUploadSignedUrl(imageObject, file_ref_uuid, ENTITY.USERS, profilePicDetail);
  };
  const onUserIconClick = (event) => {
    event.preventDefault();
    if (imageUploadRef) imageUploadRef.current.click();
  };
  return (
    <>
      <div className={cx(gClasses.FTwo24GrayV3, BS.TEXT_CENTER, gClasses.FontWeight600)}>
      {TITLE}
      </div>
      <div
        className={cx(
          gClasses.FOne13GrayV2,
          gClasses.MT20,
          gClasses.WordBreakBreakWord,
          BS.TEXT_CENTER,
        )}
      >
        {SUB_TITLE}
      </div>
      <form className={gClasses.MT30}>
        <div className={cx(gClasses.MB10, BS.D_FLEX_JUSTIFY_CENTER)}>
        <Tooltip id="invite_user_pic_button" content={t(ACCOUNT_INFO_STRINGS.FILE_ACCEPTED_TYPE)} isCustomToolTip customInnerClasss={gClasses.TextTransformCap} />
          <button id="invite_user_pic_button" className={gClasses.ClickableElement} onClick={onUserIconClick}>
            <UserImage
              src={profilePic?.profile_pic?.base64}
              isDataLoading={false}
              overLayText="Add"
              className={cx(styles.UserImage, gClasses.CursorPointer)}
            />
          </button>
          <ImageUpload
            id="profile_pic_upload"
            imageUploadRef={imageUploadRef}
            onUploadClicked={onImageChange}
            aspect={IMAGE_CROP.ASPECT}
            minWidth={IMAGE_CROP.MIN_WIDTH}
            maxFileSize={getFileSizeInBytes(userProfileData.maximum_file_size)}
            maxFileSizeInMB={userProfileData.maximum_file_size}
            onFileSizeExceed={onFileSizeExceed}
          />
        </div>
        <div className={cx(gClasses.CenterH, gClasses.MB30, gClasses.FOne13)}>
          {username}
        </div>
        <Row>
          <Col xl={6} lg={6} md={6} sm={12}>
            <Input
              id={FIRST_NAME.ID}
              label={FIRST_NAME.LABEL}
              placeholder={FIRST_NAME.PLACE_HOLDER}
              value={profileData[FIRST_NAME.ID]}
              isRequired
              errorMessage={errors[FIRST_NAME.ID]}
              onChangeHandler={(event) => onChangeHandler(event.target.value, FIRST_NAME.ID)}
              inputVariant={INPUT_VARIANTS.TYPE_3}
              type={INPUT_TYPES.TEXT}
              autoFocus
            />
          </Col>
          <Col xl={6} lg={6} md={6} sm={12}>
            <Input
              id={LAST_NAME.ID}
              label={LAST_NAME.LABEL}
              placeholder={LAST_NAME.PLACE_HOLDER}
              value={profileData[LAST_NAME.ID]}
              isRequired
              errorMessage={errors[LAST_NAME.ID]}
              onChangeHandler={(event) => onChangeHandler(event.target.value, LAST_NAME.ID)}
              inputVariant={INPUT_VARIANTS.TYPE_3}
              type={INPUT_TYPES.TEXT}
            />
          </Col>
        </Row>
        <Row>
          <Col xl={6} lg={6} md={6} sm={12}>
            <MobileNumber
              label={MOBILE_NUMBER.LABEL}
              id={MOBILE_NUMBER.ID}
              placeholder={MOBILE_NUMBER.PLACE_HOLDER}
              onCountryCodeChange={(event) => setCountryCode(event.target)}
              onChangeHandler={(event) => onChangeHandler(event.target.value, MOBILE_NUMBER.ID)}
              countryCodeId={profileData.country_code}
              mobile_number={profileData[MOBILE_NUMBER.ID]}
              isDataLoading={false}
              errorMessage={errors[MOBILE_NUMBER.ID]}
            />
          </Col>
        </Row>
        <Alert content={errors.common_server_error} className={cx(gClasses.MT5, gClasses.MB15)} />
        <Row className={BS.JC_CENTER}>
          <div>
            <Button
              id={SET_PROFILE.ID}
              buttonType={BUTTON_TYPE.PRIMARY}
              onClick={onSetProfileClick}
              className={gClasses.MT5}
              style={{
                backgroundColor: signInState?.isCustomTheme && colorScheme?.activeColor,
              }}
            >
              {SET_PROFILE.LABEL}
            </Button>
          </div>
        </Row>
      </form>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    signInState: state.SignInReducer,
  };
};

export default withRouter(
  connect(mapStateToProps, null)(UpdateInviteUserProfile),
);
