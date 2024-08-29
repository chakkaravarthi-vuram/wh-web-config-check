/**
 * @author Asttle
 * @email asttlej@vuram.com
 * @create date 2020-01-29 18:13:46
 * @modify date 2020-01-29 18:13:46
 * @desc [description]
 */
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// import { Table } from 'reactstrap';
import { connect } from 'react-redux';
import { Table } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import { cloneDeep, isEmpty } from 'lodash';

import DeleteIconV2 from 'assets/icons/form_fields/DeleteIconV2';
import CorrectIconV2 from 'assets/icons/form_fields/CorrectIconV2';
import { useTranslation } from 'react-i18next';
import ThemeContext from '../../../../hoc/ThemeContext';
import Input, { INPUT_VARIANTS } from '../../../../components/form_components/input/Input';

import AddIcon from '../../../../assets/icons/AddIcon';

import {
  getWebpageEmbedStrings, ICON_STRINGS,
} from './WebpageEmbedSettings.strings';

import gClasses from '../../../../scss/Typography.module.scss';
import { ARIA_ROLES, BS } from '../../../../utils/UIConstants';
import styles from './WebpageEmbedSettings.module.scss';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { deleteWebpageEmbedWhitelistDataThunk, getWebpageEmbedWhitelistDataThunk, saveNewWebpageEmbedWhitelistDataThunk, webpageEmbedWhitelistDataChange } from '../../../../redux/actions/WebpageEmbedWhitelistSetting.Action';
import { embedUrlValidationSchema } from './WebpageEmbedSettings.validation.schema';
import { mergeObjects, validate } from '../../../../utils/UtilityFunctions';
import EmbedUrlTableContentLoader from '../../../../components/content_loaders/admin_settings_content_loaders/EmbedUrlTableContentLoader';

let cancelForAddEmbedUrl;
let cancelForDeleteEmbedUrl;
let cancelForGetEmbedUrl;

export const getCancelTokenDeleteEmbedUrl = (cancelToken) => {
  cancelForDeleteEmbedUrl = cancelToken;
};

export const getCancelTokenGetEmbedUrl = (cancelToken) => {
  cancelForGetEmbedUrl = cancelToken;
};

export const getCancelTokenAddEmbedUrl = (cancelToken) => {
  cancelForAddEmbedUrl = cancelToken;
};

function WebpageEmbedSettings(props) {
  const { buttonColor } = useContext(ThemeContext);
  const {
    webpage_embed_whitelist,
    is_data_loading,
    getWebpageEmbedWhitelistData,
    dispatch,
  } = props;
  const { t } = useTranslation();

  useEffect(() => {
    if (cancelForAddEmbedUrl) getCancelTokenAddEmbedUrl();
    if (cancelForGetEmbedUrl) getCancelTokenGetEmbedUrl();
    if (cancelForDeleteEmbedUrl) getCancelTokenDeleteEmbedUrl();
    getWebpageEmbedWhitelistData();
  }, []);

  console.log('whitelistedDomain 2', webpage_embed_whitelist);
  const [addNewDomainClicked, addNewDomain] = useState(false);
  const [newDomainName, setNewDomainName] = useState();
  const [performRerender, isRerendered] = useState(false);
  const WEBPAGE_EMBED_CONFIG_STRINGS = getWebpageEmbedStrings(t);
  const onChangeHandler = (event) => {
    setNewDomainName(event.target.value);
  };

  const onAddNewDomain = () => {
    console.log('onAddNewDomain clicked');
    addNewDomain(true);
  };
  const onDeleteUrlClick = (id) => {
    dispatch(deleteWebpageEmbedWhitelistDataThunk({ _id: id })).then(() => {
      getWebpageEmbedWhitelistData();
    });
  };

  const deleteCurrentUrl = () => {
    setNewDomainName(EMPTY_STRING);
    addNewDomain(false);
    dispatch(webpageEmbedWhitelistDataChange({
      error_list: {},
      server_error: {},
    }));
  };

  const onSaveNewUrlClick = () => {
    const data = { embed_url_origin: newDomainName };
    const errorListData = {
      error_list: validate(data, embedUrlValidationSchema(t)),
    };
    dispatch(webpageEmbedWhitelistDataChange(errorListData)).then(() => {
      if (isEmpty(errorListData.error_list)) {
        dispatch(saveNewWebpageEmbedWhitelistDataThunk(data)).then(() => {
          getWebpageEmbedWhitelistData();
          addNewDomain(false);
          setNewDomainName(EMPTY_STRING);
        });
      }
    }).catch(() => {
      performRerender(true);
      connect.log('isRerendered', isRerendered);
    });
  };

  const getTableData = () => {
    const whitelistComponent = webpage_embed_whitelist?.map((whitelistedDomain, index) => {
      const domainName = (
        <div className={cx(styles.HeaderParamColumn, gClasses.Ellipsis)}>
          {whitelistedDomain.embed_url_origin}
        </div>
      );
      const saveLocalIcon = (
        <CorrectIconV2
          id={WEBPAGE_EMBED_CONFIG_STRINGS.ACTIVE_DELETE_ICON_ID}
          className={cx(gClasses.CursorPointer, styles.DeleteIcon, BS.HIDDEN)}
          // onClick={onSaveNewUrlClick}
          title={t(ICON_STRINGS.DELETE_ICON)}
        />
      );
      const DeleteIcon = (
        <div className={cx(styles.DeleteIconContainer, BS.D_FLEX, BS.JC_CENTER, BS.ALIGN_ITEM_CENTER)}>
          <DeleteIconV2
            onClick={() => onDeleteUrlClick(whitelistedDomain._id)}
            title={t(ICON_STRINGS.DELETE_ICON)}
            className={cx(gClasses.CursorPointer, styles.DeleteIcon)}
          />
        </div>
      );

      return {
        id: index,
        component: [domainName, saveLocalIcon, DeleteIcon],
      };
    });
    if (addNewDomainClicked) {
      const { error_list, server_error } = cloneDeep(props);
      const errors = mergeObjects(error_list, server_error);
      const newUrlInput =
        (<Input
          inputVariant={INPUT_VARIANTS.TYPE_5}
          value={newDomainName}
          placeholder={WEBPAGE_EMBED_CONFIG_STRINGS.NEW_EMBED_URL_INPUT.PLACEHOLDER}
          id={WEBPAGE_EMBED_CONFIG_STRINGS.NEW_EMBED_URL_INPUT.ID}
          onChangeHandler={onChangeHandler}
          errorMessage={errors[WEBPAGE_EMBED_CONFIG_STRINGS.NEW_EMBED_URL_INPUT.ID]}
          hideMessage={!errors[WEBPAGE_EMBED_CONFIG_STRINGS.NEW_EMBED_URL_INPUT.ID]}
          className={styles.FormFieldInput}
          autoFocus
          hideLabel
        />);

      const saveLocalIcon = (
        <CorrectIconV2
          id={WEBPAGE_EMBED_CONFIG_STRINGS.ACTIVE_DELETE_ICON_ID}
          className={cx(gClasses.CursorPointer, styles.DeleteIcon)}
          onClick={onSaveNewUrlClick}
          title={t(ICON_STRINGS.DELETE_ICON)}
        />
      );

      const DeleteIcon =
        (<DeleteIconV2
          id={WEBPAGE_EMBED_CONFIG_STRINGS.ACTIVE_DELETE_ICON_ID}
          className={cx(gClasses.CursorPointer, styles.DeleteIcon)}
          onClick={deleteCurrentUrl}
          title={t(ICON_STRINGS.DELETE_ICON)}
        />);
      const addNewUrlComponent = {
        id: 'new',
        component: [newUrlInput, saveLocalIcon,
          DeleteIcon],
      };
      whitelistComponent.push(addNewUrlComponent);
    }
    return whitelistComponent;
  };
  const tableData = getTableData();
  const show_add_occasion = (
    <div className={cx(BS.D_FLEX, BS.JC_CENTER, styles.AddNewOccasionClass)}>
      <button
        id={t(ICON_STRINGS.ADD_ICON)}
        className={cx(
          gClasses.CenterV,
          gClasses.CursorPointer,
          gClasses.ClickableElement,
        )}
        onClick={onAddNewDomain}
      >
        <AddIcon
          title={t(ICON_STRINGS.ADD_ICON)}
          className={cx(gClasses.MR5)}
          style={{ fill: buttonColor }}
          role={ARIA_ROLES.IMG}
        />
        <div className={cx(gClasses.FTwo13, gClasses.FontWeight500)} style={{ color: buttonColor }}>
          {WEBPAGE_EMBED_CONFIG_STRINGS.ADD_NEW}
        </div>
      </button>
    </div>
  );
  let noDataFoundComponent = null;
  if (!is_data_loading && !addNewDomainClicked && webpage_embed_whitelist.length === 0) {
    noDataFoundComponent = (
      <div className={cx(gClasses.FOne13BlackV5, gClasses.Italics, gClasses.OverflowXAuto, styles.NoDataFound)}>
        {WEBPAGE_EMBED_CONFIG_STRINGS.NO_DATA_FOUND}
      </div>
    );
  }
  return (
    is_data_loading ? (
      <EmbedUrlTableContentLoader count={3} />
    ) : (
      <div className={cx(BS.TABLE_RESPONSIVE, gClasses.ScrollBar)}>

        <Table
          header={WEBPAGE_EMBED_CONFIG_STRINGS.HEADERS}
          data={tableData}
          className={cx(styles.HeaderParamTable, gClasses.MT16)}

        />
        {noDataFoundComponent}
        {show_add_occasion}
      </div>
    )
  );
}

WebpageEmbedSettings.defaultProps = {
  webpage_embed_whitelist: [],
  error_list: {},
  server_error: {},
  common_server_error: EMPTY_STRING,
  is_data_loading: false,
};

WebpageEmbedSettings.propTypes = {
  error_list: PropTypes.objectOf(PropTypes.any),
  server_error: PropTypes.objectOf(PropTypes.any),
  common_server_error: PropTypes.string,
  webpage_embed_whitelist: PropTypes.arrayOf(PropTypes.any),
  is_data_loading: PropTypes.bool,
};

const mapStateToProps = (state) => {
  const {
    webpage_embed_whitelist,
    error_list,
    server_error,
    is_data_loading,
  } = state.WebpageEmbedWhitelistSettingReducer;
  return {
    webpage_embed_whitelist,
    error_list,
    server_error,
    is_data_loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getWebpageEmbedWhitelistData: (value) => {
      dispatch(getWebpageEmbedWhitelistDataThunk(value));
    },
    webpageEmbedWhitelistDataChangeAction: (value) => {
      dispatch(webpageEmbedWhitelistDataChange(value));
    },
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WebpageEmbedSettings);
