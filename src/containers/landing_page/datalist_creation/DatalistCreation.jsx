import React, { useContext, useRef, useState } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { useHistory } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { createDatalistChange } from '../../../redux/reducer/CreateDataListReducer';
import { LANDING_PAGE_TOPICS } from '../main_header/common_header/CommonHeader.strings';
import SearchPrefixIcon from '../../../assets/icons/app_builder_icons/SearchPrefixIcon';
import { APP_HOME_STRINGS } from '../../application/application.strings';
import SearchArrowIcon from '../../../assets/icons/app_builder_icons/SearchArrow';
import ThemeContext from '../../../hoc/ThemeContext';
import { BS } from '../../../utils/UIConstants';
import styles from '../../application/home/AppHome.module.scss';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { createTaskSetState } from '../../../redux/reducer/CreateTaskReducer';
import { postCreateDatalistFromPrompt } from '../../../axios/apiService/createDatalistFromPrompt.apiService';
import { getShortCode } from '../../../utils/UtilityFunctions';

function DatalistCreation(props) {
    const { t } = useTranslation();

    const [searchText, setSearchText] = useState(EMPTY_STRING);
    const [focused, setFocused] = useState(false);
    const { colorScheme } = useContext(ThemeContext);
    const wrapperRef = useRef(null);
    const history = useHistory();
    const { setTaskState } = props;

    const onChangeHandler = (event) => {
        console.log('onChangeHandler called');
        setSearchText(event.target.value);
    };

    const openDatalistCreation = () => {
        console.log('on click datalist');
        history.push({
            // pathname: ROUTE.CREATE_EDIT_TASK,
            search: '?create=datalist',
            state: {
                originalLocation: LANDING_PAGE_TOPICS.HOME,
                createModalOpen: true,
                mlAction: true,
                //   type: 'Right',
            },
        });
    };

    const createDatalist = async () => {
        console.log('dc creation create datalist claled');
        const { onDataListDataChange } = props;
        const data = { prompt: searchText };
        setTaskState({ isMlTaskLoading: true });
        const response = await postCreateDatalistFromPrompt(data);
        setTaskState({ isMlTaskLoading: false });
        console.log('Data list prompt response', response);
        response.data_list_short_code = getShortCode(response?.data_list_name);
        onDataListDataChange(response);
        console.log('dc creation after create datalist claled', response);
        openDatalistCreation();
    };

    return (

        <div className={cx(styles.SearchContainer, gClasses.CenterV, focused && styles.BorderSolid)} style={{ borderColor: focused ? colorScheme?.activeColor : 'transparent' }} ref={wrapperRef}>
            <SearchPrefixIcon className={gClasses.MR8} fillColor={`${colorScheme?.activeColor}40`} />
            <input
                maxlength={500}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                // onKeyDown={(e) => createDatalist(e)}
                value={searchText}
                onChange={onChangeHandler}
                className={cx(
                    styles.SearchInput,
                    gClasses.FontSize,
                    BS.W100,
                    gClasses.OutlineNoneOnFocus,
                )}
                type="text"
                placeholder={t(APP_HOME_STRINGS.SEARCH_PLACEHOLDER)}
                required
                autoComplete="off"
            />
            <button onClick={createDatalist} className={cx(styles.SearchButton, gClasses.ML10, isEmpty(searchText) ? gClasses.CursorNotAllowed : gClasses.CursorPointer)} style={{ background: (focused || !isEmpty(searchText)) ? `${colorScheme?.activeColor}40` : 'transparent' }} disabled={isEmpty(searchText)}>
                <SearchArrowIcon fillColor={(focused || !isEmpty(searchText)) && colorScheme?.activeColor} />
            </button>
        </div>

        // <Input
        //     className={cx(gClasses.Flex1, gClasses.PR5)}
        //     innerClass={cx(gClasses.FTwo12GrayV3, gClasses.FontWeight500)}
        //     placeholder="Write something..."
        //     onChange={onChangeHandler}
        //     value={prompt}
        //     hideBorder
        //     autoFocus
        //     hideLabel
        //     hideMessage
        //     rows={1}
        // />
        // <Button
        //     buttonText="Create datalist"
        //     type={EButtonType.PRIMARY}
        //     onClick={createDatalist}
        // />

    );
}

const mapStateToProps = (state) => {
    return {
        dataListState: state.CreateDataListReducer,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onDataListDataChange: (dataListData) => dispatch(createDatalistChange(dataListData)),
        setTaskState: (value) => dispatch(createTaskSetState(value)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DatalistCreation);
