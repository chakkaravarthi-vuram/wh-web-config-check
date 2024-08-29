import React, { Component } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import cx from 'classnames/bind';
import { Row, Col } from 'reactstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import { ADD_MEMBERS_STRINGS } from 'containers/admin_settings/user_management/add_or_invite_members/add_member/AddMember.strings';
import { DATA_LIST_DASHBOARD } from 'urls/RouteConstants';
import { ACCOUNT_INFO_STRINGS } from 'containers/landing_page/account_info/AccountInfoModal.string';
import Tooltip from 'components/tooltip/Tooltip';
import { withTranslation } from 'react-i18next';
import { Button, EButtonType } from '@workhall-pvt-lmt/wh-ui-library';
import ThemeContext from '../../../hoc/ThemeContext';

import ReadOnlyText from '../../../components/form_components/read_only_text/ReadOnlyText';
import MobileNumber from '../../../components/form_components/mobile_number/MobileNumber';
import UserImage from '../../../components/user_image/UserImage';
import ImageUpload from '../../../components/form_components/image_upload/ImageUpload';
import FormTitle from '../../../components/form_components/form_title/FormTitle';

import {
  U_P_STRINGS,
  IMAGE_CROP,
  MOBILE_NUMBER_ID,
  PROFILE_PIC_ID,
} from './UserProfile.strings';
import styles from './UserProfile.module.scss';
import gClasses from '../../../scss/Typography.module.scss';
import { BS } from '../../../utils/UIConstants';
import {
  validate,
  mergeObjects,
  compareObjects,
  setPointerEvent,
  updatePostLoader,
  appendFormDataArrayOrObject,
  getLogoSize,
  onFileSizeExceed,
  keydownOrKeypessEnterHandle,
  isBasicUserMode,
  getRouteLink,
  showToastPopover,
} from '../../../utils/UtilityFunctions';
import {
  generatePostServerErrorMessage,
  generateGetServerErrorMessage,
} from '../../../server_validations/ServerValidation';
import {
  EMPTY_STRING,
  NA,
  ENTITY,
  DOCUMENT_TYPES,
  SPACE,
} from '../../../utils/strings/CommonStrings';
import {
  userProfileDetailsValidateSchema,
  userProfileDetailsMobileNumberRequiredValidateSchema,
  getStateToUpdateFromResponse,
  getProfileDetailsCompareData,
  getUpdatedUserProfileDetailsData,
  getUpdatedUserProfileDetailsDataWithDocuments,
} from './UserProfile.validation.schema';
import { FORM_POPOVER_STATUS, ROLES } from '../../../utils/Constants';
import jsUtils from '../../../utils/jsUtility';
import {
  updateAdminProfilePicAction,
  updateMemberProfilePicAction,
  updateFlowCreatorProfilePicAction,
} from '../../../redux/actions/Actions';
import { getFieldsForDMS } from '../../../utils/attachmentUtils';
import {
  getUserByIdApi,
  getUploadSignedUrlApi,
  updateUserProfileApi,
  cancelUserProfile,
} from '../../../axios/apiService/userProfile.apiService';
import {
  userProfileSetStateThunk,
  userProfileStartedThunk,
} from '../../../redux/actions/UserProfile.Action';
import { store } from '../../../Store';
import {
  getExtensionFromFileName,
  getFullName,
} from '../../../utils/generatorUtils';
import { TAB_ROUTE } from '../../application/app_components/dashboard/flow/Flow.strings';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusOnErrorRefresher: false,
      localProfilePic: jsUtils.get(props, ['state', 'profile_pic'], null),
    };
  }

  componentDidMount() {
    this.onPreLoad();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    cancelUserProfile();
    dispatch(
      userProfileSetStateThunk({
        enable_button: false,
        error_list: [],
        server_error: [],
        common_server_error: EMPTY_STRING,
      }),
    );
  }

  render() {
    const { state, t } = this.props;
    const { history } = this.props;
    const isNormalMode = isBasicUserMode(history);
    const { colorScheme, colorSchemeDefault } = this.context;
    const { focusOnErrorRefresher, localProfilePic } = this.state;
    const {
      // profile_pic,
      isProfileDetailsLoading,
      common_server_error,
      server_error,
      error_list,
      profileDetails,
      mobile_number,
      mobile_number_country_code,
      enable_button,
      datalist_info,
    } = state;
    // let errorHandler = null;
    let content = null;
    let fullName = NA;
    let email = NA;
    let role = NA;
    let reporting_manager = NA;
    let businessUnit = NA;
    let profilePic = localProfilePic;
    let overLayText = U_P_STRINGS.ADD_IMAGE;
    if (localProfilePic) {
      if (localProfilePic.base64) {
        profilePic = localProfilePic.base64;
        overLayText = U_P_STRINGS.CHANGE_IMAGE;
      } else {
        profilePic = localProfilePic;
        overLayText = U_P_STRINGS.CHANGE_IMAGE;
      }
    }

    const errors = mergeObjects(error_list, server_error);

    if (jsUtils.isEmpty(common_server_error)) {
      if (!isProfileDetailsLoading) {
        fullName = getFullName(
          profileDetails.first_name,
          profileDetails.last_name,
        );
        email = profileDetails.email;
        role = profileDetails.role ? profileDetails.role : NA;
        businessUnit = profileDetails.business_unit
          ? profileDetails.business_unit
          : NA;
        // location = profileDetails.location ? profileDetails.location : NA;
        reporting_manager = profileDetails.reporting_manager
          ? profileDetails.reporting_manager.username
          : NA;
      }
      let navigateTo;
      if (!jsUtils.isNull(datalist_info)) {
        if (isNormalMode) {
          navigateTo = getRouteLink(`${DATA_LIST_DASHBOARD}/${datalist_info.data_list_uuid}/${TAB_ROUTE.ALL_REQUEST}/${datalist_info.entry_id}`, history);
        } else {
          navigateTo = getRouteLink(`${DATA_LIST_DASHBOARD}/${datalist_info.data_list_uuid}/${datalist_info.entry_id}`, history);
        }
      }
      content = (
        <div className={styles.MainContainer}>
          <div className={cx(gClasses.CenterV, styles.ImageContainer)}>
            <button
              id="user_pic_button"
              className={gClasses.ClickableElement}
              onClick={this.onUserIconClick}
            >
              <UserImage
                id={PROFILE_PIC_ID}
                firstName={
                  profileDetails.first_name
                    ? profileDetails.first_name
                    : EMPTY_STRING
                }
                lastName={
                  profileDetails.last_name
                    ? profileDetails.last_name
                    : EMPTY_STRING
                }
                className={cx(styles.UserImage, gClasses.CursorPointer)}
                src={profilePic}
                overLayText={t(overLayText)}
                overLayAriaLabel="Add image"
                isDataLoading={isProfileDetailsLoading}
                ariaHidden="true"
              />
            </button>
            <Tooltip
              id="user_pic_button"
              content={t(ACCOUNT_INFO_STRINGS.FILE_ACCEPTED_TYPE)}
              isCustomToolTip
              customInnerClasss={gClasses.TextTransformCap}
            />
            <ImageUpload
              id="profile_pic_upload"
              imageUploadRef={this.imageUploadRef}
              onUploadClicked={this.onImageChange}
              aspect={IMAGE_CROP.ASPECT}
              minWidth={IMAGE_CROP.MIN_WIDTH}
              maxFileSize={getLogoSize()}
              maxFileSizeInMB={getLogoSize(true)}
              onFileSizeExceed={onFileSizeExceed}
            />
            <div className={cx(styles.NameClass)}>
              {!isProfileDetailsLoading && fullName}
            </div>
          </div>
          <FormTitle
            className={cx(gClasses.MT20, styles.SubHeadingClass)}
            isDataLoading={isProfileDetailsLoading}
            noBottomMargin
            noTopPadding
          >
            {t(U_P_STRINGS.BASIC_DETAILS)}
          </FormTitle>
          <Row className={gClasses.MT10}>
            <Col sm={6}>
              <ReadOnlyText
                id="Email"
                label={t(U_P_STRINGS.EMAIL)}
                value={email}
                isLoading={isProfileDetailsLoading}
                formFieldBottomMargin
              />
            </Col>
            <Col sm={6}>
              <ReadOnlyText
                ContentClass={styles.ContentClass}
                label={t(U_P_STRINGS.REPORTING_MANAGER)}
                value={reporting_manager}
                isLoading={isProfileDetailsLoading}
                formFieldBottomMargin
                id="ReportingManager"
              />
            </Col>
          </Row>
          <Row className={gClasses.MT5}>
            <Col sm={6}>
              <MobileNumber
                onCountryCodeChange={this.setCountryCode}
                onChangeHandler={this.onChangeHandler}
                countryCodeId={mobile_number_country_code}
                mobile_number={mobile_number}
                errorMessage={errors[MOBILE_NUMBER_ID]}
                label={t(U_P_STRINGS.CONTACT.LABEL)}
                placeholder={t(U_P_STRINGS.CONTACT.PLACEHOLDER)}
                id={MOBILE_NUMBER_ID}
                // onKeyDownHandler={this.onEnterKeyPressed}
                onKeyDownHandler={(e) =>
                  keydownOrKeypessEnterHandle(e) && this.onSaveClicked(e)
                }
                isDataLoading={isProfileDetailsLoading}
                labelClass={cx(styles.FieldLabel, gClasses.FTwo12GrayV53)}
                focusOnError
                focusOnErrorRefresher={focusOnErrorRefresher}
                helperAriaHidden={errors[MOBILE_NUMBER_ID] && true}
              />
            </Col>
          </Row>
          <FormTitle
            className={styles.SubHeadingClass}
            isDataLoading={isProfileDetailsLoading}
            noBottomMargin
            noTopPadding
          >
            {t(U_P_STRINGS.ORGANISATION_DETAILS)}
          </FormTitle>
          <Row className={gClasses.MT10}>
            <Col sm={6}>
              <ReadOnlyText
                id="Role"
                ContentClass={styles.ContentClass}
                label={t(U_P_STRINGS.ROLE)}
                value={role}
                isLoading={isProfileDetailsLoading}
                formFieldBottomMargin
              />
            </Col>
            <Col sm={6}>
              <ReadOnlyText
                id="BusinessUnit"
                ContentClass={styles.ContentClass}
                label={t(U_P_STRINGS.BUSINESS_UNIT)}
                value={businessUnit}
                isLoading={isProfileDetailsLoading}
                formFieldBottomMargin
              />
            </Col>
          </Row>

          {!jsUtils.isNull(datalist_info) ? (
            <div
              className={cx(
                BS.JC_START,
                gClasses.FOne13GrayV2,
                gClasses.MT15,
                styles.EditContentClass,
              )}
            >
              <div>
                <span aria-hidden="true">
                  {t(ADD_MEMBERS_STRINGS.EDIT_VIEW_FIELDS)}
                </span>
                {' '}
                <Link
                  to={navigateTo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cx(gClasses.FontWeight500, gClasses.BlueV39)}
                  aria-label={`${ADD_MEMBERS_STRINGS.EDIT_VIEW_FIELDS}${SPACE}${ADD_MEMBERS_STRINGS.CLICK_HERE}`}
                  style={{ color: isNormalMode ? colorScheme?.activeColor : colorSchemeDefault?.activeColor }}
                >
                  {t(ADD_MEMBERS_STRINGS.CLICK_HERE)}
                </Link>
              </div>
            </div>
          ) : null}
          {enable_button ? (
            <Row className={cx(gClasses.MT20, BS.JC_CENTER)}>
              <Button
                id="user_profile_clear"
                type={EButtonType.SECONDARY}
                onClick={this.onCancelClicked}
                className={styles.PrimaryButtonClass}
                width100
                colorSchema={isNormalMode ? colorScheme : colorSchemeDefault}
                buttonText={t(U_P_STRINGS.DISCARD)}
              />

              <Button
                id="user_profile_save"
                type={EButtonType.PRIMARY}
                onClick={this.onSaveClicked}
                className={styles.SecondaryButtonClass}
                width100
                colorSchema={isNormalMode ? colorScheme : colorSchemeDefault}
                buttonText={t(U_P_STRINGS.SAVE)}
              />
            </Row>
          ) : null}
        </div>
      );
    }

    return content;
  }

  onPreLoad = () => {
    const { adminProfile, flowCreatorProfile, memberProfile, role } =
      this.props;
    switch (role) {
      case ROLES.MEMBER:
        this.getUserProfileData(memberProfile.id);
        break;
      case ROLES.ADMIN:
        this.getUserProfileData(adminProfile.id);
        break;
      case ROLES.FLOW_CREATOR:
        this.getUserProfileData(flowCreatorProfile.id);
        break;
      default:
        break;
    }
  };

  onCancelClicked = (event) => {
    event.preventDefault();
    const { state, t } = this.props;
    const { profileDetails } = state;
    const state_data = getStateToUpdateFromResponse(profileDetails);

    this.setState((prev_data) => {
      return {
        ...prev_data,
        localProfilePic: state?.profile_pic,
      };
    });

    store
      .dispatch(
        userProfileSetStateThunk({
          ...state_data,
          error_list: [],
          server_error: [],
          common_server_error: EMPTY_STRING,
        }),
      )
      .then(() => {
        const { state, dispatch } = this.props;
        const { error_list } = state;
        if (!jsUtils.isEmpty(error_list)) {
          dispatch(
            userProfileSetStateThunk({
              error_list: validate(
                this.getUserProfileDetailsValidateData(),
                this.userProfileValidateSchema(t),
              ),
            }),
          );
        }
        this.compareValuesAndEnableButton();
      });
  };

  // onEnterKeyPressed = (event) => {
  //   if (event.keyCode === KEY_CODES.ENTER) {
  //     event.preventDefault();
  //     const { state, dispatch } = this.props;
  //     const { error_list } = state;
  //     if (!jsUtils.isEmpty(error_list)) {
  //       dispatch(
  //         userProfileSetStateThunk({
  //           error_list: validate(this.getUserProfileDetailsValidateData(), this.userProfileValidateSchema),
  //         }),
  //       );
  //     }
  //   }
  // };

  onChangeHandler = (event) => {
    store
      .dispatch(
        userProfileSetStateThunk({
          [event.target.id]: event.target.value,
        }),
      )
      .then(() => {
        const { state, dispatch, t } = this.props;
        const { error_list } = state;
        if (!jsUtils.isEmpty(error_list)) {
          dispatch(
            userProfileSetStateThunk({
              error_list: validate(
                this.getUserProfileDetailsValidateData(),
                this.userProfileValidateSchema(t),
              ),
            }),
          );
        }
        this.compareValuesAndEnableButton();
      });
  };

  onUserIconClick = () => {
    if (this.imageUploadRef) this.imageUploadRef.current.click();
  };

  onImageChange = (imageObject) => {
    const { dispatch } = this.props;
    this.setState((prev_data) => {
      return {
        ...prev_data,
        localProfilePic: imageObject,
      };
    });

    dispatch(
      userProfileSetStateThunk({
        // profile_pic: imageObject,
        file_ref_uuid: uuidv4(),
        enable_button: true,
      }),
    );
  };

  onSaveClicked = (event) => {
    event.preventDefault();
    this.validateAndUpdateDetails(this.focusRefresher);
  };

  focusRefresher = (errors) => {
    const { focusOnErrorRefresher } = this.state;
    if (errors[MOBILE_NUMBER_ID]) {
      this.setState({ focusOnErrorRefresher: !focusOnErrorRefresher });
    }
  };

  userProfileValidateSchema = userProfileDetailsValidateSchema;

  imageUploadRef = React.createRef();

  setCountryCode = (event) => {
    const { state } = this.props;
    const { mobile_number_country, mobile_number_country_code } = state;
    store
      .dispatch(
        userProfileSetStateThunk({
          mobile_number_country_code: event.target.value,
          mobile_number_country: event.target.countryCode.toUpperCase(),
        }),
      )
      .then(() => {
        console.log(
          'compareValuesAndEnableButton',
          this.props,
          event,
          mobile_number_country_code,
          mobile_number_country,
        );
        // setProfileData({ ...profileData, 'mobile_number_country': value.countryCode.toUpperCase(), 'mobile_number_country_code': value.countryCodeId })
        this.compareValuesAndEnableButton();
      });
  };

  compareValuesAndEnableButton = () => {
    const { state, dispatch } = cloneDeep(this.props);
    const { profileDetails } = state;
    const is_equal = compareObjects(
      getProfileDetailsCompareData(cloneDeep(state)),
      getProfileDetailsCompareData(cloneDeep(profileDetails)),
    );
    dispatch(
      userProfileSetStateThunk({
        enable_button: !is_equal,
      }),
    );
  };

  getUploadSignedUrl = (doc_details, entity) => {
    const { state, userProfileStarted } = this.props;
    const { profileDetails, file_ref_uuid } = state;

    userProfileStarted();
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
    if (profileDetails && profileDetails._id) {
      data.entity_id = profileDetails._id;
    }
    setPointerEvent(true);

    getUploadSignedUrlApi(data).then(
      (response) => {
        const { dispatch } = this.props;
        setPointerEvent(false);
        updatePostLoader(false);
        dispatch(
          userProfileSetStateThunk({
            document_details: response,
          }),
        );
        this.uploadDocumentToDMS(response.file_metadata);
      },
      () => {
        setPointerEvent(false);
        updatePostLoader(false);
        showToastPopover(
          'Profile Picture upload failed',
          'Please try after sometimes',
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      },
    );
  };

  validateAndUpdateDetails = (focusRefresher) => {
    const { t } = this.props;
    const validatedErrorList = validate(
      this.getUserProfileDetailsValidateData(),
      this.userProfileValidateSchema(t),
    );
    focusRefresher && focusRefresher(validatedErrorList);
    store
      .dispatch(
        userProfileSetStateThunk({
          error_list: validate(
            this.getUserProfileDetailsValidateData(),
            this.userProfileValidateSchema(t),
          ),
        }),
      )
      .then(() => {
        const { state } = this.props;
        const { error_list } = state;
        const { localProfilePic } = this.state;
        if (jsUtils.isEmpty(error_list)) {
          const { profileDetails } = state;
          if (localProfilePic && localProfilePic.image) {
            this.getUploadSignedUrl(localProfilePic, ENTITY.USERS);
          } else {
            const postData = getUpdatedUserProfileDetailsData(
              getProfileDetailsCompareData({
                ...profileDetails,
              }),
              getProfileDetailsCompareData({
                ...state,
              }),
            );
            this.updateProfileDetailsAPI(postData);
          }
        } else {
          console.log('userProfileSetStateThunktt else');
        }
      });
  };

  getUpdatedData = (data) => {
    const { state } = this.props;
    const { profileDetails } = state;
    Object.keys(data).forEach((id) => {
      if (id === PROFILE_PIC_ID) {
        profileDetails[id] = data.document_url_details[0].signedurl;
      } else profileDetails[id] = data[id];
    });
    return profileDetails;
  };

  updateProfileDetailsAPI = (post_data, doc_uploaded) => {
    setPointerEvent(true);
    updatePostLoader(true);
    updateUserProfileApi(post_data)
      .then((response) => {
        const { state, dispatch, t } = this.props;

        if (doc_uploaded) {
          this.updateProfilePicInRedux(response.result.data);
          const { document_details } = state;
          const { localProfilePic } = this.state;
          if (!jsUtils.isEmpty(document_details)) {
            let profilePicSrc = null;
            if (localProfilePic && localProfilePic.base64) {
              profilePicSrc = localProfilePic;
            }
            dispatch(
              userProfileSetStateThunk({
                profile_pic_id: document_details.file_metadata[0]._id,
                profile_pic:
                  profilePicSrc ||
                  response.result.data.document_url_details[0].signedurl,
              }),
            );
          }
        }
        const profileDetails = this.getUpdatedData(response.result.data);
        dispatch(
          userProfileSetStateThunk({
            enable_button: false,
            profileDetails,
            error_list: [],
            server_error: [],
            common_server_error: EMPTY_STRING,
          }),
        );
        updatePostLoader(false);
        setPointerEvent(false);
        showToastPopover(
          U_P_STRINGS.SUCCESSFUL_UPDATE(t).title,
          U_P_STRINGS.SUCCESSFUL_UPDATE(t).subTitle,
          FORM_POPOVER_STATUS.SUCCESS,
          true,
        );
        setTimeout(() => this.onPreLoad(), 1000);
      })
      .catch((error) => {
        const { t } = this.props;
        showToastPopover(
          U_P_STRINGS.UPDATE_FAILURE(t).title,
          EMPTY_STRING,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
        this.updateError(error);
        updatePostLoader(false);
        setPointerEvent(false);
      });
  };

  uploadDocumentToDMS = (fileArray) => {
    const { state } = this.props;
    const { localProfilePic } = this.state;
    const { profileDetails } = state;
    fileArray.map((data) => {
      const state_data = cloneDeep(store.getState().UserProfileReducer);
      const postData = getFieldsForDMS(
        data.upload_signed_url.fields,
        localProfilePic.image,
      );
      setPointerEvent(true);
      axios
        .post(data.upload_signed_url.url, appendFormDataArrayOrObject(postData))
        .then(() => {
          const post_data = getUpdatedUserProfileDetailsDataWithDocuments(
            getProfileDetailsCompareData({
              ...profileDetails,
            }),
            state_data,
          );
          this.updateProfileDetailsAPI(post_data, true);
        });
      return data;
    });
  };

  updateError = (error) => {
    const { state, dispatch, t } = this.props;
    const { server_error, error_list } = state;
    const errors = generatePostServerErrorMessage(
      error,
      server_error,
      U_P_STRINGS.USER_PROFILE_LABELS(t),
    );
    this.focusRefresher({ ...error_list, ...errors.state_error });
    dispatch(
      userProfileSetStateThunk({
        server_error: errors.state_error ? errors.state_error : [],
        common_server_error: errors.common_server_error
          ? errors.common_server_error
          : EMPTY_STRING,
        isProfileDetailsLoading: false,
      }),
    );
  };

  updateProfilePicInRedux = (res) => {
    const {
      role,
      updateAdminProfilePic,
      updateMemberProfilePic,
      updateFlowCreatorProfilePic,
    } = this.props;
    const signedurl =
      res.document_url_details && res.document_url_details[0].signedurl;
    switch (role) {
      case ROLES.MEMBER:
        updateMemberProfilePic(signedurl);
        break;
      case ROLES.ADMIN:
        updateAdminProfilePic(signedurl);
        break;
      case ROLES.FLOW_CREATOR:
        updateFlowCreatorProfilePic(signedurl);
        break;
      default:
        break;
    }
  };

  getUserProfileDetailsValidateData = () => {
    const { state } = this.props;
    const { mobile_number } = state;
    const data = {
      [MOBILE_NUMBER_ID]: mobile_number,
    };
    return data;
  };

  getUserProfileData = (userId) => {
    console.log('getUserProfileData data', userId);
    const { dispatch } = this.props;
    const { localProfilePic } = this.state;
    dispatch(userProfileSetStateThunk({ isProfileDetailsLoading: true }));
    getUserByIdApi(userId)
      .then((response) => {
        const state = getStateToUpdateFromResponse(response);
        let profilePicSrc = null;
        if (localProfilePic && localProfilePic.base64) {
          profilePicSrc = localProfilePic;
        }
        state.profile_pic = profilePicSrc || state.profile_pic;

        this.setState((previousState) => {
          return { ...previousState, localProfilePic: state.profile_pic };
        });
        store
          .dispatch(
            userProfileSetStateThunk({
              ...state,
              profile_pic_id: !jsUtils.isEmpty(response.document_url_details)
                ? response.document_url_details[0]._id
                : null,
              isProfileDetailsLoading: false,
              datalist_info: response.datalist_info
                ? response.datalist_info
                : null,
            }),
          )
          .then(() => {
            const { state } = this.props;
            const { profileDetails } = state;
            if (profileDetails.mobile_number) {
              this.userProfileValidateSchema =
                userProfileDetailsMobileNumberRequiredValidateSchema;
            }
          });
      })
      .catch((error) => {
        const errors = generateGetServerErrorMessage(error);
        dispatch(
          userProfileSetStateThunk({
            common_server_error: errors.common_server_error,
            isProfileDetailsLoading: false,
          }),
        );
      });
  };
}

const mapStateToProps = (state) => {
  return {
    adminProfile: state.AdminProfileReducer.adminProfile,
    flowCreatorProfile:
      state.DeveloperProfileReducer.flowCreatorProfile,
    memberProfile: state.MemberProfileReducer.memberProfile,
    role: state.RoleReducer.role,
    state: state.UserProfileReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateAdminProfilePic: (value) => {
      dispatch(updateAdminProfilePicAction(value));
    },
    updateMemberProfilePic: (value) => {
      dispatch(updateMemberProfilePicAction(value));
    },
    updateFlowCreatorProfilePic: (value) => {
      dispatch(updateFlowCreatorProfilePicAction(value));
    },
    userProfileStarted: (value) => {
      dispatch(userProfileStartedThunk(value));
    },
    dispatch,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(UserProfile)),
);
UserProfile.contextType = ThemeContext;
UserProfile.defaultProps = {
  adminProfile: {},
  flowCreatorProfile: {},
  memberProfile: {},
};
UserProfile.propTypes = {
  adminProfile: PropTypes.objectOf(),
  flowCreatorProfile: PropTypes.objectOf(),
  memberProfile: PropTypes.objectOf(),
  role: PropTypes.number.isRequired,
  updateAdminProfilePic: PropTypes.func.isRequired,
  updateMemberProfilePic: PropTypes.func.isRequired,
  updateFlowCreatorProfilePic: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};
