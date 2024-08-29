import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import cx from 'classnames';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import Skeleton from 'react-loading-skeleton';
import styles from 'components/form_components/info_field/InfoField.module.scss';
import gClasses from 'scss/Typography.module.scss';
import jsUtils, { isEmpty, cloneDeep } from 'utils/jsUtility';
import Label from 'components/form_components/label/Label';
import HelperMessage, {
  HELPER_MESSAGE_TYPE,
} from 'components/form_components/helper_message/HelperMessage';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import Tag from 'components/form_components/tag/Tag';
import { BS } from 'utils/UIConstants';
// import { KEY_CODES } from 'utils/Constants';
import {
  SEND_EMAIL_STRINGS,
  IGNORE_MAIL_FIELD_IMPORT_TYPES,
} from './SendEmail.strings';
import TextEditor from '../../../../../components/text_editor/TextEditor';
import { EDITOR_CONFIGS } from '../../../../../components/text_editor/TextEditor.utils';
import { updateFlowStateChange } from '../../../../../redux/reducer/EditFlowReducer';
import { getAllFieldsList } from '../../../../../redux/actions/EditFlow.Action';
import { getAllFieldsMenu } from '../document_generation/DocumentGeneration.utils';

export function TagComponent(props) {
  const { blockProps } = props;
  const { tagName } = blockProps;
  return (
    <div style={{ display: 'inline-block' }}>
      <Tag>{tagName}</Tag>
    </div>
  );
}

class ImportFieldEditor extends Component {
  constructor(props) {
    super(props);
    this.editorContentRef = React.createRef();
    this.state = {
      editorState: !isEmpty(props.description)
        ? props.description
        : EMPTY_STRING,
      isImportFieldDropdownVisibile: false,
      onDescirptionfocused: false,
      isEditorLoading: true,
    };
  }

  componentDidMount() {
    const { onGetAllFieldsList } = this.props;
    const { flowData } = jsUtils.cloneDeep(this.props);
    const { flow_id } = flowData;

    const paginationData = {
      page: 1,
      size: 200,
      sort_by: 1,
      flow_id,
      ignore_field_types: IGNORE_MAIL_FIELD_IMPORT_TYPES,
      include_property_picker: 1,
    };
    onGetAllFieldsList(paginationData, null, false);
  }

  render() {
    const {
      labelClass,
      fieldoptionList,
      dropDownSectionLength,
      className,
      t,
    } = this.props;
    const { editorState, isImportFieldDropdownVisibile, isEditorLoading } =
      this.state;

    const { noToolbar, label, errorMessage, basicToolbar, isInstruction } =
      this.props;

    let tool_bar = EMPTY_STRING;
    let editorHeight = 0;
    if (basicToolbar) {
      tool_bar = EDITOR_CONFIGS.BASIC_TOOLBAR;
      editorHeight = 200;
    } else if (noToolbar) {
      tool_bar = EMPTY_STRING;
      editorHeight = 100;
    } else {
      editorHeight = 300;
      tool_bar = EDITOR_CONFIGS.BODY_TOOLBAR1;
    }

    const editorLoader = (
      <div>
        <Skeleton width="100%" height={50} />
        <Skeleton width="100%" height={editorHeight - 50} />
      </div>
    );

    return (
      <>
        <div className={cx(styles.InputTextStyle)}>
          <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
            <Label
              content={label}
              isRequired={!isInstruction}
              className={labelClass}
              labelStyles={labelClass}
              hideLabelClass
            />
          </div>
          <div className={!isEmpty(errorMessage) && styles.EditorError}>
            {isEditorLoading && editorLoader}
            <TextEditor
              className={className}
              tinymceScriptSrc="/tinymce/tinymce.min.js"
              initialValue={editorState}
              onInit={(_evt, editor) => {
                if (this.editorContentRef) {
                  this.editorContentRef.current = editor;
                }
                this.setState({
                  isEditorLoading: false,
                });
              }}
              init={{
                height: editorHeight,
                paste_preprocess: (_, args) => {
                  if (args && args.content && args.content.includes('<img')) {
                    args.content = EMPTY_STRING;
                  }
                },
                plugins: EDITOR_CONFIGS.plugins,
                toolbar1: tool_bar,
                toolbar2: EDITOR_CONFIGS.INSERT_FIELD_TOOLBAR,
                paste_as_text: true,
                setup: (editor) => {
                  editor.ui.registry.addMenuButton('insertFieldMenu', {
                    text: 'Insert Fields',
                    search: {
                      placeholder: 'Search field',
                    },
                    fetch: (callback) => {
                      const items = getAllFieldsMenu(
                        [], // System field and field list to be given from API
                        editor,
                      );
                      callback(items);
                    },
                  });
                },
              }}
              onEditorChange={this.onEditorStateChange}
            />
          </div>
          {!isEmpty(errorMessage) && (
            <HelperMessage
              message={errorMessage}
              type={HELPER_MESSAGE_TYPE.ERROR}
              className={gClasses.ErrorMarginV1}
            />
          )}
        </div>
        {isImportFieldDropdownVisibile ? (
          <Dropdown
            id={SEND_EMAIL_STRINGS.EMAIL_BODY_ID}
            label={t(SEND_EMAIL_STRINGS.CHOOSE_FIELD)}
            customListClasses={[styles.DropDownTitle, styles.DropDownTitle]}
            customClassIndices={[0, dropDownSectionLength]}
            optionList={fieldoptionList}
            onChange={(event) => {
              this.appendFieldToMailBodyText(event);
            }}
          />
        ) : null}
      </>
    );
  }

  onEditorStateChange = (editorHtml) => {
    if (
      this.editorContentRef &&
      this.editorContentRef.current &&
      this.editorContentRef.current.dom
    ) {
      const { onDescirptionfocused } = this.state;
      !onDescirptionfocused && this.setState({ onDescirptionfocused: true });
      const { onChangeHandler, id } = this.props;
      const rawHtml = this.editorContentRef.current.getContent({
        format: 'raw',
      });
      const removeHtmlRegex = /(<([^>]+)>)/gi;
      const removeNewLineRegex = /(\n)/gi;
      const parsedContent = rawHtml
        .replace(removeHtmlRegex, '')
        .replace(removeNewLineRegex, '');
      const rawEditorContent = this.editorContentRef.current.getContent({
        format: 'text',
      });

      if (parsedContent.length && !isEmpty(rawEditorContent)) {
        onChangeHandler({
          target: {
            id: id,
            value: rawHtml.replace(/\r?<\/p>\n<p>/g, '<br>'),
          },
        });
      }
      if (parsedContent.length === 0) {
        onChangeHandler({
          target: {
            id: id,
            value: EMPTY_STRING,
          },
        });
      }
      return rawHtml.replace(/\r?<\/p>\n<p>/g, '<br>');
    }
    if (editorHtml) {
      return editorHtml.replace(/\r?<\/p>\n<p>/g, '<br>');
    }
    return null;
  };

  // onKeyOpenImportFieldDropdown = (event) => {
  //   if (
  //     (event.keyCode && event.keyCode === KEY_CODES.ENTER) ||
  //     (event.which && event.which === KEY_CODES.ENTER)
  //   ) {
  //     event.preventDefault();
  //     this.openImportFieldDropdown();
  //   }
  // };

  // openImportFieldDropdown = () => {
  //   const { isImportFieldDropdownVisibile } = this.state;
  //   this.setState({
  //     isImportFieldDropdownVisibile: !isImportFieldDropdownVisibile,
  //   });
  // };

  appendFieldToMailBodyText = async (event) => {
    if (
      event.target.value === 'SYSTEM FIELDS' ||
      event.target.value === 'FORM FIELDS'
    ) {
      event.preventdefault();
    }
    if (
      this.editorContentRef &&
      this.editorContentRef.current &&
      this.editorContentRef.current.dom
    ) {
      const { stepData, onFlowStateChange, flowData } = this.props;
      const activeStepDetails = cloneDeep(stepData);
      const { allFields = [] } = flowData;
      const { mailBodyFieldsList } = activeStepDetails;
      const { isImportFieldDropdownVisibile } = this.state;
      if (jsUtils.nullCheck(event, 'target.value')) {
        const {
          target: { value, type },
        } = event;

        if (type !== 'system') {
          const fieldDetails = jsUtils.find(allFields, { value });

          if (mailBodyFieldsList) {
            activeStepDetails.mailBodyFieldsList.push(fieldDetails);
          } else {
            activeStepDetails.mailBodyFieldsList = [];
            activeStepDetails.mailBodyFieldsList.push(fieldDetails);
          }
          this.editorContentRef.current.insertContent(
            `&nbsp;[${fieldDetails.label}]&nbsp;`,
          );
        } else {
          if (mailBodyFieldsList) {
            activeStepDetails.mailBodyFieldsList.push({ type: 'system', label: value });
          } else {
            activeStepDetails.mailBodyFieldsList = [];
            activeStepDetails.mailBodyFieldsList.push({ type: 'system', label: value });
          }
          this.editorContentRef.current.insertContent(`&nbsp;[${value}]&nbsp;`);
        }
        activeStepDetails.active_email_action.email_body =
          this.editorContentRef.current.getContent();
        this.setState({
          isImportFieldDropdownVisibile: !isImportFieldDropdownVisibile,
        });
        if (jsUtils.has(activeStepDetails, ['email_action_error_list', event.target.id], false)) {
          delete activeStepDetails.email_action_error_list[event.target.id];
        }
        onFlowStateChange({ activeStepDetails });
      }
    }
  };
}

const mapStateToProps = (state) => {
  return {
    flowData: state.EditFlowReducer.flowData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFlowStateChange: (flowData) => {
      dispatch(updateFlowStateChange(flowData));
    },
    onGetAllFieldsList: (...params) => {
      dispatch(getAllFieldsList(...params));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ImportFieldEditor));
ImportFieldEditor.defaultProps = {
  readOnly: false,
  toolbarHidden: false,
  placeholder: 'INFORMATION',
  basicToolbar: false,
  customEditorHeight: null,
};

ImportFieldEditor.propTypes = {
  readOnly: PropTypes.bool,
  toolbarHidden: PropTypes.bool,
  placeholder: PropTypes.string,
  basicToolbar: PropTypes.bool,
  customEditorHeight: PropTypes.string,
};
