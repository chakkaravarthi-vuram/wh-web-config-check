import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import InfiniteScroll from 'react-infinite-scroll-component';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import Input from 'components/form_components/input/Input';
import SearchIcon from 'assets/icons/SearchIconV3';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { INITIAL_PAGE } from 'utils/constants/form.constant';
import {
  FORMULA_BUILDER_TAB_VALUE,
  FORMULA_BUILDER,
  FORMULA_TAB_TITLE,
} from '../../FormulaBuilder.strings';
import { isEmpty } from '../../../../utils/jsUtility';
import styles from './formulaEditorTabs.module.scss';
import TabData from './tab_data/TabData';
import UpArrowIcon from '../../../../assets/icons/UpArrowIcon';
import { ARIA_ROLES, BS } from '../../../../utils/UIConstants';

function FormulaEditorTab(props) {
  const {
    modalId,
    currentFormulaTab,
    lstFields,
    lstFunctions,
    onClickTabContent,
    onLoadMoreFields,
  } = props;
  const { t } = useTranslation();
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState(EMPTY_STRING);
  const [allFunctions, setAllFunctions] = useState(lstFunctions);
  const [sectionsVisible, setSectionsVisible] = useState({ fields: true, functions: true });
  const { pagination_details, pagination_data = [] } = lstFields;
  useEffect(() => {
    if (!isEmpty(pagination_details)) {
        setHasMore(pagination_details.total_count > pagination_data.length);
      }
   }, [pagination_data?.length]);

  const stringifiedFunctions = JSON.stringify(lstFunctions);
  useEffect(() => {
    setAllFunctions(lstFunctions);
  }, [stringifiedFunctions]);

  const onSearch = (searchText = EMPTY_STRING) => {
      onLoadMoreFields(INITIAL_PAGE, true, searchText);
      if (searchText) {
        const filteredFunction = lstFunctions.filter((fn) => (
        (fn.name).toString() &&
        (fn.name).toString().toLowerCase().includes(searchText.toLowerCase())));
        setAllFunctions(filteredFunction);
      } else setAllFunctions(lstFunctions);
  };

  const onSearchHandler = (event) => {
     const { value } = event.target;
     setSearchText(value);
     onSearch(value);
  };

  const onLoadMoreFormFields = () => {
    const current_page = pagination_details.page;
    onLoadMoreFields(current_page + 1);
  };

  const getTabData = () => {
    const allFields = pagination_data || [];
    const isAllFieldsEmpty = allFields?.length === 0;
    const isAllFunctionsEmpty = allFunctions.length === 0;
    const groupedFunctions = {};
    const groupFields = {};
    const height = 161;

    allFunctions.forEach((fn) => {
      const key = fn.type || 'Any Type';
      groupedFunctions[key] = [...(groupedFunctions[key] || []), fn];
    });

    allFields.forEach((field) => {
      const key = 'Data Fields'.toLowerCase();
      groupFields[key] = [...(groupFields[key] || []), field];
    });

    const noDataFound = (type) => (
      <div
        className={cx(
          BS.H100,
          BS.W100,
          BS.D_FLEX,
          BS.ALIGN_ITEM_CENTER,
          BS.JC_CENTER,
          gClasses.FOne12GrayV14,
          gClasses.FontWeight500,
        )}
      >
        {`No ${type.toLowerCase()} available.`}
      </div>
    );

    const sectionHeaderClasses = cx(
      BS.D_FLEX,
      BS.JC_BETWEEN,
      BS.ALIGN_ITEM_CENTER,
      gClasses.PR16,
      gClasses.PL16,
      gClasses.MB8,
      gClasses.MT8,
    );

    return (
      <>
        <div className={cx(styles.SectionBottomBorder)}>
          <div className={sectionHeaderClasses}>
            <h3 className={styles.SectionTitle}>
              {FORMULA_BUILDER(t).TABS[1].tabName}
            </h3>
            <button
              className={cx(gClasses.ClickableElement, gClasses.CursorPointer, {
                [gClasses.Rotate180]: !sectionsVisible.functions,
              })}
              onClick={() =>
                setSectionsVisible((p) => {
                  return { ...p, functions: !p.functions };
                })
              }
            >
              <UpArrowIcon />
            </button>
          </div>
          {sectionsVisible.functions && (
            <div
              className={cx(styles.TabValueContainer)}
              style={{
                height: `${sectionsVisible.fields ? height : height * 2}px`,
              }}
            >
              {isAllFunctionsEmpty
                ? noDataFound(FORMULA_BUILDER(t).TABS[1].tabName)
                : Object.keys(groupedFunctions).map((key) => (
                    <div className={styles.TabGroup} key={key}>
                      <h4 className={styles.GroupTitle}>{key}</h4>
                      <div className={styles.GroupContent}>
                        {groupedFunctions[key].map((fn) => (
                          <TabData
                            modalId={modalId}
                            key={fn.name}
                            type={FORMULA_TAB_TITLE.FUNCTION}
                            details={fn}
                            onClick={onClickTabContent}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
            </div>
          )}
        </div>

        <div>
          <div className={sectionHeaderClasses}>
            <h3 className={styles.SectionTitle}>
              {FORMULA_BUILDER(t).TABS[0].tabName}
            </h3>
            <button
              className={cx(gClasses.ClickableElement, gClasses.CursorPointer, {
                [gClasses.Rotate180]: !sectionsVisible.fields,
              })}
              onClick={() =>
                setSectionsVisible((p) => {
                  return { ...p, fields: !p.fields };
                })
              }
            >
              <UpArrowIcon />
            </button>
          </div>
          {sectionsVisible.fields && (
            <InfiniteScroll
              dataLength={pagination_data.length}
              scrollThreshold={0.4}
              hasMore={hasMore}
              height={sectionsVisible.functions ? height : height * 2}
              next={onLoadMoreFormFields}
              className={cx(styles.TabValueContainer)}
            >
              {isAllFieldsEmpty
                ? noDataFound(FORMULA_BUILDER(t).TABS[0].tabName)
                : Object.keys(groupFields).map((key) => (
                    <div className={styles.TabGroup} key={key}>
                      <h4 className={styles.GroupTitle}>{key}</h4>
                      <div className={styles.GroupContent}>
                        {groupFields[key].map((field) => (
                          <TabData
                            key={field.field_uuid}
                            type={FORMULA_TAB_TITLE.FIELDS}
                            details={field}
                            onClick={onClickTabContent}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
            </InfiniteScroll>
          )}
        </div>
      </>
    );
  };

  const ariaLabel = searchText ?
                  ((currentFormulaTab === FORMULA_BUILDER_TAB_VALUE.FORM_FIELDS ?
                  !isEmpty(pagination_data) : !isEmpty(allFunctions)) ? 'values found' : 'values not found')
                  : null;

    return (
      <div className={styles.EditorTabs}>
          <div className={styles.SearchArea}>
            <SearchIcon className={styles.SearchIcon} role={ARIA_ROLES.IMG} ariaHidden ariaLabel="Search" />
            <Input
              placeholder={FORMULA_BUILDER(t).ALL_PLACEHOLDER.SEARCH_FIELDS_FUNCTIONS}
              hideBorder
              hideLabel
              hideMessage
              className={styles.Input}
              value={searchText}
              onChangeHandler={onSearchHandler}
              ariaLabel={ariaLabel}
            />
          </div>
        {getTabData()}
      </div>
    );
}

export default FormulaEditorTab;
